
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Users, Building, Euro, Calendar } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { GastosEmpleadosForm } from "@/components/gastosEmpleados/GastosEmpleadosForm";
import { useGastosEmpleados } from "@/hooks/useGastosEmpleados";
import { useEmpleados } from "@/hooks/useEmpleados";
import { useProyectos } from "@/hooks/useProyectos";

const GastosEmpleados = () => {
  const { 
    gastosEmpleadosProyectos, 
    calcularCosteTotalEmpleadoProyecto,
    obtenerGastosPorEmpleadoMes,
    obtenerGastosPorProyectoMes 
  } = useGastosEmpleados();
  const { empleados } = useEmpleados();
  const { proyectos } = useProyectos();
  
  const [showForm, setShowForm] = useState(false);
  const [filtroEmpleado, setFiltroEmpleado] = useState<string>("");
  const [filtroProyecto, setFiltroProyecto] = useState<string>("");
  const [filtroMes, setFiltroMes] = useState<string>("");

  const fechaActual = new Date();
  const mesActual = fechaActual.getMonth() + 1;
  const anioActual = fechaActual.getFullYear();

  // Filtrar gastos según los filtros aplicados
  const gastosFiltrados = gastosEmpleadosProyectos.filter(gasto => {
    const empleadoMatch = !filtroEmpleado || gasto.empleadoId.toString() === filtroEmpleado;
    const proyectoMatch = !filtroProyecto || gasto.proyectoId.toString() === filtroProyecto;
    const mesMatch = !filtroMes || `${gasto.mes}-${gasto.anio}` === filtroMes;
    
    return empleadoMatch && proyectoMatch && mesMatch;
  });

  // Calcular totales
  const totalGeneral = gastosFiltrados.reduce((total, gasto) => 
    total + calcularCosteTotalEmpleadoProyecto(gasto), 0
  );

  const totalGastosVariables = gastosFiltrados.reduce((total, gasto) => 
    total + gasto.gastos.reduce((sum, g) => sum + g.importe, 0), 0
  );

  const totalSalarios = gastosFiltrados.reduce((total, gasto) => 
    total + gasto.salarioBrutoProrrateo + gasto.seguridadSocialEmpresaProrrateo, 0
  );

  const totalHoras = gastosFiltrados.reduce((total, gasto) => 
    total + gasto.importeHorasExtras + gasto.importeHorasFestivas, 0
  );

  // Generar opciones de meses únicos
  const mesesUnicos = [...new Set(gastosEmpleadosProyectos.map(g => `${g.mes}-${g.anio}`))];

  const getEmpleadoNombre = (empleadoId: number) => {
    const empleado = empleados.find(e => e.id === empleadoId);
    return empleado ? `${empleado.nombre} ${empleado.apellidos}` : 'Empleado no encontrado';
  };

  const getProyectoNombre = (proyectoId: number) => {
    const proyecto = proyectos.find(p => p.id === proyectoId);
    return proyecto ? `${proyecto.nombre} - ${proyecto.ciudad}` : 'Proyecto no encontrado';
  };

  const getMesNombre = (mes: number, anio: number) => {
    const fecha = new Date(anio, mes - 1, 1);
    return format(fecha, "MMMM yyyy", { locale: es });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gastos de Empleados en Proyectos</h1>
          <p className="text-muted-foreground">
            Gestión de salarios prorrateados, horas extras y gastos variables por proyecto
          </p>
        </div>
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button className="bg-omenar-green hover:bg-omenar-dark-green">
              <Plus className="w-4 h-4 mr-2" />
              Registrar Gastos
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <GastosEmpleadosForm
              empleados={empleados}
              proyectos={proyectos}
              onClose={() => setShowForm(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Euro className="w-4 h-4" />
              Total General
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{totalGeneral.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Users className="w-4 h-4" />
              Salarios + SS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">€{totalSalarios.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4" />
              Horas Extra/Festivas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">€{totalHoras.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Building className="w-4 h-4" />
              Gastos Variables
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">€{totalGastosVariables.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Select value={filtroEmpleado} onValueChange={setFiltroEmpleado}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los empleados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los empleados</SelectItem>
                  {empleados.map((empleado) => (
                    <SelectItem key={empleado.id} value={empleado.id.toString()}>
                      {empleado.nombre} {empleado.apellidos}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={filtroProyecto} onValueChange={setFiltroProyecto}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los proyectos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los proyectos</SelectItem>
                  {proyectos.map((proyecto) => (
                    <SelectItem key={proyecto.id} value={proyecto.id.toString()}>
                      {proyecto.nombre} - {proyecto.ciudad}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={filtroMes} onValueChange={setFiltroMes}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los meses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los meses</SelectItem>
                  {mesesUnicos.map((mesAnio) => {
                    const [mes, anio] = mesAnio.split('-');
                    return (
                      <SelectItem key={mesAnio} value={mesAnio}>
                        {getMesNombre(parseInt(mes), parseInt(anio))}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <Button 
              variant="outline" 
              onClick={() => {
                setFiltroEmpleado("");
                setFiltroProyecto("");
                setFiltroMes("");
              }}
            >
              Limpiar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de gastos */}
      <Card>
        <CardHeader>
          <CardTitle>Registro de Gastos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empleado</TableHead>
                <TableHead>Proyecto</TableHead>
                <TableHead>Mes/Año</TableHead>
                <TableHead>Días</TableHead>
                <TableHead>Salario</TableHead>
                <TableHead>Horas Extra</TableHead>
                <TableHead>Gastos Variables</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {gastosFiltrados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="text-muted-foreground">
                      {gastosEmpleadosProyectos.length === 0 
                        ? "No hay gastos registrados. Haga clic en 'Registrar Gastos' para comenzar."
                        : "No hay gastos que coincidan con los filtros aplicados."}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                gastosFiltrados.map((gasto) => {
                  const costoSalario = gasto.salarioBrutoProrrateo + gasto.seguridadSocialEmpresaProrrateo;
                  const costoHoras = gasto.importeHorasExtras + gasto.importeHorasFestivas;
                  const costoGastos = gasto.gastos.reduce((sum, g) => sum + g.importe, 0);
                  const total = calcularCosteTotalEmpleadoProyecto(gasto);

                  return (
                    <TableRow key={gasto.id}>
                      <TableCell className="font-medium">
                        {getEmpleadoNombre(gasto.empleadoId)}
                      </TableCell>
                      <TableCell>{getProyectoNombre(gasto.proyectoId)}</TableCell>
                      <TableCell>{getMesNombre(gasto.mes, gasto.anio)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {gasto.diasTrabajados}/{gasto.diasLaboralesMes}
                        </Badge>
                      </TableCell>
                      <TableCell>€{costoSalario.toFixed(2)}</TableCell>
                      <TableCell>
                        {gasto.horasExtras > 0 || gasto.horasFestivas > 0 ? (
                          <div className="text-sm">
                            <div>Extra: {gasto.horasExtras}h</div>
                            <div>Fest: {gasto.horasFestivas}h</div>
                            <div className="font-medium">€{costoHoras.toFixed(2)}</div>
                          </div>
                        ) : (
                          '€0.00'
                        )}
                      </TableCell>
                      <TableCell>
                        {gasto.gastos.length > 0 ? (
                          <div className="text-sm">
                            <div>{gasto.gastos.length} gastos</div>
                            <div className="font-medium">€{costoGastos.toFixed(2)}</div>
                          </div>
                        ) : (
                          '€0.00'
                        )}
                      </TableCell>
                      <TableCell className="font-bold">€{total.toFixed(2)}</TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default GastosEmpleados;
