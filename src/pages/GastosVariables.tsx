
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useVehiculosGastos } from "@/hooks/useVehiculosGastos";
import { useEmpleados } from "@/hooks/useEmpleados";
import { GastoVariable } from "@/types/gastoVariable";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const GastosVariables = () => {
  const { gastosVehiculos, getTotalGastosPorMes } = useVehiculosGastos();
  const { empleados } = useEmpleados();
  const [gastosOtros, setGastosOtros] = useState<GastoVariable[]>([]);
  
  const fechaActual = new Date();
  const añoActual = fechaActual.getFullYear();
  const mesActual = fechaActual.getMonth();

  // Convertir gastos de vehículos a gastos variables
  const gastosVehiculosDelMes = gastosVehiculos
    .filter(gasto => {
      const fechaGasto = new Date(gasto.fecha);
      return fechaGasto.getFullYear() === añoActual && fechaGasto.getMonth() === mesActual;
    })
    .map(gasto => ({
      id: gasto.id,
      concepto: gasto.concepto,
      importe: gasto.importe,
      fecha: gasto.fecha,
      categoria: 'vehiculo' as const,
      descripcion: gasto.descripcion,
      factura: gasto.factura,
      vehiculoId: gasto.vehiculoId,
      tipoGastoVehiculo: gasto.tipo
    }));

  // Convertir gastos de empleados a gastos variables
  const gastosEmpleadosDelMes = empleados.flatMap(empleado => 
    (empleado.gastosVariables || [])
      .filter(gasto => {
        const fechaGasto = new Date(gasto.fecha);
        return fechaGasto.getFullYear() === añoActual && fechaGasto.getMonth() === mesActual;
      })
      .map(gasto => ({
        id: `emp-${empleado.id}-${gasto.id}`,
        concepto: `${empleado.nombre} ${empleado.apellidos} - ${gasto.concepto}`,
        importe: gasto.importe,
        fecha: gasto.fecha,
        categoria: 'empleado' as const,
        descripcion: gasto.descripcion,
        empleadoId: empleado.id,
        tipoGastoEmpleado: gasto.concepto
      }))
  );

  const totalGastosVehiculos = getTotalGastosPorMes(añoActual, mesActual);
  const totalGastosEmpleados = gastosEmpleadosDelMes.reduce((total, gasto) => total + gasto.importe, 0);
  const totalGastosOtros = gastosOtros
    .filter(gasto => {
      const fechaGasto = new Date(gasto.fecha);
      return fechaGasto.getFullYear() === añoActual && fechaGasto.getMonth() === mesActual;
    })
    .reduce((total, gasto) => total + gasto.importe, 0);

  const totalGeneral = totalGastosVehiculos + totalGastosEmpleados + totalGastosOtros;

  const getConceptoLabel = (concepto: string) => {
    const labels = {
      dieta: 'Dieta',
      alojamiento: 'Alojamiento',
      transporte: 'Transporte',
      otro: 'Otro'
    };
    return labels[concepto as keyof typeof labels] || concepto;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gastos Variables</h1>
        <Button>Registrar Gasto</Button>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total del Mes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{totalGeneral.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Gastos Vehículos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">€{totalGastosVehiculos.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Gastos Empleados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">€{totalGastosEmpleados.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Otros Gastos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">€{totalGastosOtros.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Periodo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">
              {fechaActual.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="todos" className="w-full">
        <TabsList>
          <TabsTrigger value="todos">Todos los Gastos</TabsTrigger>
          <TabsTrigger value="vehiculos">Gastos Vehículos</TabsTrigger>
          <TabsTrigger value="empleados">Gastos Empleados</TabsTrigger>
          <TabsTrigger value="otros">Otros Gastos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="todos">
          <Card>
            <CardHeader>
              <CardTitle>Gastos Variables del Mes</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Concepto</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Importe</TableHead>
                    <TableHead>Descripción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...gastosVehiculosDelMes, ...gastosEmpleadosDelMes, ...gastosOtros.filter(g => {
                    const fechaGasto = new Date(g.fecha);
                    return fechaGasto.getFullYear() === añoActual && fechaGasto.getMonth() === mesActual;
                  })].map((gasto) => (
                    <TableRow key={`${gasto.categoria}-${gasto.id}`}>
                      <TableCell className="font-medium">{gasto.concepto}</TableCell>
                      <TableCell>
                        <Badge variant={
                          gasto.categoria === 'vehiculo' ? 'default' : 
                          gasto.categoria === 'empleado' ? 'secondary' : 'outline'
                        }>
                          {gasto.categoria === 'vehiculo' ? 'Vehículo' : 
                           gasto.categoria === 'empleado' ? 'Empleado' : 'Otros'}
                        </Badge>
                      </TableCell>
                      <TableCell>{format(gasto.fecha, "dd/MM/yyyy", { locale: es })}</TableCell>
                      <TableCell>€{gasto.importe.toFixed(2)}</TableCell>
                      <TableCell>{gasto.descripcion || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vehiculos">
          <Card>
            <CardHeader>
              <CardTitle>Gastos de Vehículos</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Concepto</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Importe</TableHead>
                    <TableHead>Descripción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gastosVehiculosDelMes.map((gasto) => (
                    <TableRow key={gasto.id}>
                      <TableCell className="font-medium">{gasto.concepto}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {gasto.tipoGastoVehiculo?.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>{format(gasto.fecha, "dd/MM/yyyy", { locale: es })}</TableCell>
                      <TableCell>€{gasto.importe.toFixed(2)}</TableCell>
                      <TableCell>{gasto.descripcion || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="empleados">
          <Card>
            <CardHeader>
              <CardTitle>Gastos de Empleados</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Empleado</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Importe</TableHead>
                    <TableHead>Descripción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gastosEmpleadosDelMes.map((gasto) => (
                    <TableRow key={gasto.id}>
                      <TableCell className="font-medium">{gasto.concepto}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {getConceptoLabel(gasto.tipoGastoEmpleado || '')}
                        </Badge>
                      </TableCell>
                      <TableCell>{format(gasto.fecha, "dd/MM/yyyy", { locale: es })}</TableCell>
                      <TableCell>€{gasto.importe.toFixed(2)}</TableCell>
                      <TableCell>{gasto.descripcion || '-'}</TableCell>
                    </TableRow>
                  ))}
                  {gastosEmpleadosDelMes.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        No hay gastos de empleados registrados este mes
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="otros">
          <Card>
            <CardHeader>
              <CardTitle>Otros Gastos Variables</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                Funcionalidad para otros gastos variables - En desarrollo
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GastosVariables;
