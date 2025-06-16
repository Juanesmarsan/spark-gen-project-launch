
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { GastoEmpleadoProyecto } from "@/types/gastoEmpleado";
import { Empleado } from "@/types/empleado";

interface CostesTableProps {
  gastosImputados: GastoEmpleadoProyecto[];
  empleados: Empleado[];
  mes: number;
  anio: number;
  onEliminarCoste: (gastoId: number) => void;
}

export const CostesTable = ({
  gastosImputados,
  empleados,
  mes,
  anio,
  onEliminarCoste
}: CostesTableProps) => {
  const safeToFixed = (value: number | null | undefined, decimals: number = 2): string => {
    return (value ?? 0).toFixed(decimals);
  };

  return (
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
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {gastosImputados.length > 0 ? (
              gastosImputados.map((gasto) => {
                const empleado = empleados.find(e => e.id === gasto.empleadoId);
                const totalGastosVar = (gasto.gastos || []).reduce((sum, g) => sum + (g.importe || 0), 0);
                const totalEmpleado = (gasto.salarioBrutoProrrateo || 0) + (gasto.seguridadSocialEmpresaProrrateo || 0) + 
                                   (gasto.importeHorasExtras || 0) + (gasto.importeHorasFestivas || 0) + totalGastosVar;

                return (
                  <TableRow key={gasto.id}>
                    <TableCell className="font-medium">
                      {empleado ? `${empleado.nombre} ${empleado.apellidos}` : 'Empleado no encontrado'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {gasto.diasTrabajados || 0}/{gasto.diasLaboralesMes || 0} días
                      </Badge>
                    </TableCell>
                    <TableCell>€{safeToFixed(gasto.salarioBrutoProrrateo)}</TableCell>
                    <TableCell>€{safeToFixed(gasto.seguridadSocialEmpresaProrrateo)}</TableCell>
                    <TableCell>
                      {(gasto.horasExtras || 0) > 0 || (gasto.horasFestivas || 0) > 0 ? (
                        <div className="text-sm">
                          <div>Extras: {gasto.horasExtras || 0}h (€{safeToFixed(gasto.importeHorasExtras)})</div>
                          <div>Festivas: {gasto.horasFestivas || 0}h (€{safeToFixed(gasto.importeHorasFestivas)})</div>
                        </div>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>
                      {totalGastosVar > 0 ? (
                        <div className="text-sm">
                          €{safeToFixed(totalGastosVar)} ({(gasto.gastos || []).length} gastos)
                        </div>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell className="font-bold">€{safeToFixed(totalEmpleado)}</TableCell>
                    <TableCell>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Eliminar coste imputado?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción eliminará los costes imputados de {empleado?.nombre} {empleado?.apellidos} para {format(new Date(anio, mes - 1), 'MMMM yyyy', { locale: es })}. Esta acción no se puede deshacer.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onEliminarCoste(gasto.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                  No hay costes imputados para el mes seleccionado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
