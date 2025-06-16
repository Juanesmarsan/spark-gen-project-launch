
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calculator, Users, Euro, Calendar } from "lucide-react";
import { Proyecto } from "@/types/proyecto";
import { Empleado } from "@/types/empleado";
import { useImputacionCostesSalariales } from "@/hooks/useImputacionCostesSalariales";
import { useGastosEmpleados } from "@/hooks/useGastosEmpleados";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface ImputacionCostesTabProps {
  proyecto: Proyecto;
  empleados: Empleado[];
}

export const ImputacionCostesTab = ({ proyecto, empleados }: ImputacionCostesTabProps) => {
  const [mesSeleccionado, setMesSeleccionado] = useState<string>('2025-06');
  const [procesando, setProcesando] = useState(false);

  const { imputarCostesSalarialesEmpleado } = useImputacionCostesSalariales();
  const { obtenerGastosPorProyectoMes } = useGastosEmpleados();
  const { toast } = useToast();

  const mesesDisponibles = [
    { value: '2025-01', label: 'Enero 2025' },
    { value: '2025-02', label: 'Febrero 2025' },
    { value: '2025-03', label: 'Marzo 2025' },
    { value: '2025-04', label: 'Abril 2025' },
    { value: '2025-05', label: 'Mayo 2025' },
    { value: '2025-06', label: 'Junio 2025' },
    { value: '2025-07', label: 'Julio 2025' },
    { value: '2025-08', label: 'Agosto 2025' },
    { value: '2025-09', label: 'Septiembre 2025' },
    { value: '2025-10', label: 'Octubre 2025' },
    { value: '2025-11', label: 'Noviembre 2025' },
    { value: '2025-12', label: 'Diciembre 2025' },
  ];

  const [anio, mes] = mesSeleccionado.split('-').map(Number);

  // Obtener gastos ya imputados para el mes seleccionado
  const gastosImputados = obtenerGastosPorProyectoMes(proyecto.id, mes, anio);

  // Calcular totales
  const totalCostesSalariales = gastosImputados.reduce((total, gasto) => 
    total + gasto.salarioBrutoProrrateo + gasto.seguridadSocialEmpresaProrrateo + 
    gasto.importeHorasExtras + gasto.importeHorasFestivas, 0
  );

  const totalGastosVariables = gastosImputados.reduce((total, gasto) => 
    total + gasto.gastos.reduce((subTotal, gastoVar) => subTotal + gastoVar.importe, 0), 0
  );

  const totalGeneral = totalCostesSalariales + totalGastosVariables;

  const handleImputarCostes = async () => {
    setProcesando(true);
    
    try {
      let imputacionesRealizadas = 0;

      // Imputar costes de cada trabajador asignado al proyecto
      for (const trabajador of proyecto.trabajadoresAsignados) {
        const empleado = empleados.find(e => e.id === trabajador.id);
        if (empleado && empleado.activo) {
          const imputaciones = imputarCostesSalarialesEmpleado(empleado, mes, anio);
          const imputacionProyecto = imputaciones.find(imp => imp.proyectoId === proyecto.id);
          
          if (imputacionProyecto && imputacionProyecto.diasTrabajados > 0) {
            imputacionesRealizadas++;
          }
        }
      }

      toast({
        title: "Costes imputados correctamente",
        description: `Se han imputado los costes de ${imputacionesRealizadas} trabajadores para ${format(new Date(anio, mes - 1), 'MMMM yyyy', { locale: es })}`,
      });

    } catch (error) {
      console.error('Error al imputar costes:', error);
      toast({
        title: "Error",
        description: "Hubo un error al imputar los costes salariales.",
        variant: "destructive"
      });
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Imputación de Costes
          </h3>
          <p className="text-sm text-muted-foreground">
            Gestiona la imputación automática de costes salariales y gastos variables al proyecto
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Select value={mesSeleccionado} onValueChange={setMesSeleccionado}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Seleccionar mes" />
            </SelectTrigger>
            <SelectContent>
              {mesesDisponibles.map((mes) => (
                <SelectItem key={mes.value} value={mes.value}>
                  {mes.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button 
            onClick={handleImputarCostes}
            disabled={procesando}
            className="bg-green-600 hover:bg-green-700"
          >
            <Calculator className="w-4 h-4 mr-2" />
            {procesando ? 'Procesando...' : 'Imputar Costes'}
          </Button>
        </div>
      </div>

      {/* Resumen de costes */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="w-4 h-4" />
              Costes Salariales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              €{totalCostesSalariales.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Salarios + SS + Extras
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Euro className="w-4 h-4" />
              Gastos Variables
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              €{totalGastosVariables.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Dietas, transporte, etc.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              Coste Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              €{totalGeneral.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total del mes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Período
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">
              {format(new Date(anio, mes - 1), 'MMMM yyyy', { locale: es })}
            </div>
            <p className="text-xs text-muted-foreground">
              {gastosImputados.length} registros
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de costes imputados */}
      <Card>
        <CardHeader>
          <CardTitle>Detalle de Costes Imputados - {format(new Date(anio, mes - 1), 'MMMM yyyy', { locale: es })}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empleado</TableHead>
                <TableHead>Días Trabajados</TableHead>
                <TableHead>Salario Prorrateo</TableHead>
                <TableHead>SS Empresa</TableHead>
                <TableHead>Horas Extras</TableHead>
                <TableHead>Gastos Variables</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {gastosImputados.length > 0 ? (
                gastosImputados.map((gasto) => {
                  const empleado = empleados.find(e => e.id === gasto.empleadoId);
                  const totalGastosVar = gasto.gastos.reduce((sum, g) => sum + g.importe, 0);
                  const totalEmpleado = gasto.salarioBrutoProrrateo + gasto.seguridadSocialEmpresaProrrateo + 
                                     gasto.importeHorasExtras + gasto.importeHorasFestivas + totalGastosVar;

                  return (
                    <TableRow key={gasto.id}>
                      <TableCell className="font-medium">
                        {empleado ? `${empleado.nombre} ${empleado.apellidos}` : 'Empleado no encontrado'}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {gasto.diasTrabajados}/{gasto.diasLaboralesMes} días
                        </Badge>
                      </TableCell>
                      <TableCell>€{gasto.salarioBrutoProrrateo.toFixed(2)}</TableCell>
                      <TableCell>€{gasto.seguridadSocialEmpresaProrrateo.toFixed(2)}</TableCell>
                      <TableCell>
                        {gasto.horasExtras > 0 || gasto.horasFestivas > 0 ? (
                          <div className="text-sm">
                            <div>Extras: {gasto.horasExtras}h (€{gasto.importeHorasExtras.toFixed(2)})</div>
                            <div>Festivas: {gasto.horasFestivas}h (€{gasto.importeHorasFestivas.toFixed(2)})</div>
                          </div>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell>
                        {totalGastosVar > 0 ? (
                          <div className="text-sm">
                            €{totalGastosVar.toFixed(2)} ({gasto.gastos.length} gastos)
                          </div>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell className="font-bold">€{totalEmpleado.toFixed(2)}</TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    No hay costes imputados para el mes seleccionado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
