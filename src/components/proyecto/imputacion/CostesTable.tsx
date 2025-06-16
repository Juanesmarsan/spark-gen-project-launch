
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { GastoEmpleadoProyecto } from "@/types/gastoEmpleado";
import { Empleado } from "@/types/empleado";
import { useState } from "react";

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
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  const safeToFixed = (value: number | null | undefined, decimals: number = 2): string => {
    return (value ?? 0).toFixed(decimals);
  };

  const toggleRowExpansion = (gastoId: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(gastoId)) {
      newExpanded.delete(gastoId);
    } else {
      newExpanded.add(gastoId);
    }
    setExpandedRows(newExpanded);
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
              <TableHead width="30"></TableHead>
              <TableHead>Empleado</TableHead>
              <TableHead>Días Trabajados</TableHead>
              <TableHead>Salario Prorrateo</TableHead>
              <TableHead>SS Empresa</TableHead>
              <TableHead>Horas Extras/Festivas</TableHead>
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
                const totalHorasExtras = (gasto.importeHorasExtras || 0) + (gasto.importeHorasFestivas || 0);
                const totalEmpleado = (gasto.salarioBrutoProrrateo || 0) + (gasto.seguridadSocialEmpresaProrrateo || 0) + 
                                   totalHorasExtras + totalGastosVar;
                const isExpanded = expandedRows.has(gasto.id);

                return (
                  <>
                    <TableRow key={gasto.id}>
                      <TableCell>
                        {(gasto.gastos && gasto.gastos.length > 0) || totalHorasExtras > 0 ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleRowExpansion(gasto.id)}
                            className="p-0 h-6 w-6"
                          >
                            {isExpanded ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )}
                          </Button>
                        ) : null}
                      </TableCell>
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
                        {totalHorasExtras > 0 ? (
                          <Badge variant="outline" className="bg-orange-50 text-orange-700">
                            €{safeToFixed(totalHorasExtras)}
                          </Badge>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell>
                        {totalGastosVar > 0 ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            €{safeToFixed(totalGastosVar)}
                          </Badge>
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
                    
                    {isExpanded && (
                      <TableRow>
                        <TableCell colSpan={9} className="p-0">
                          <div className="px-6 py-4 bg-gray-50">
                            <div className="space-y-4">
                              {/* Detalle de horas extras y festivas */}
                              {totalHorasExtras > 0 && (
                                <div>
                                  <h4 className="font-medium text-sm mb-2">Horas Extras y Festivas:</h4>
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    {(gasto.horasExtras || 0) > 0 && (
                                      <div className="flex justify-between">
                                        <span>Horas Extras: {gasto.horasExtras}h</span>
                                        <span className="font-medium">€{safeToFixed(gasto.importeHorasExtras)}</span>
                                      </div>
                                    )}
                                    {(gasto.horasFestivas || 0) > 0 && (
                                      <div className="flex justify-between">
                                        <span>Horas Festivas: {gasto.horasFestivas}h</span>
                                        <span className="font-medium">€{safeToFixed(gasto.importeHorasFestivas)}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                              
                              {/* Detalle de gastos variables */}
                              {gasto.gastos && gasto.gastos.length > 0 && (
                                <div>
                                  <h4 className="font-medium text-sm mb-2">Gastos Variables:</h4>
                                  <div className="space-y-2">
                                    {gasto.gastos.map((gastoVar, index) => (
                                      <div key={index} className="flex justify-between items-center text-sm p-2 bg-white rounded border">
                                        <div>
                                          <span className="font-medium">{gastoVar.concepto}</span>
                                          <span className="text-gray-500 ml-2">({gastoVar.tipo})</span>
                                          {gastoVar.descripcion && (
                                            <div className="text-xs text-gray-400">{gastoVar.descripcion}</div>
                                          )}
                                        </div>
                                        <div className="text-right">
                                          <div className="font-medium">€{safeToFixed(gastoVar.importe)}</div>
                                          <div className="text-xs text-gray-500">
                                            {format(new Date(gastoVar.fecha), 'dd/MM/yyyy')}
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
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
