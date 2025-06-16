
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Empleado, GastoVariableEmpleado } from "@/types/empleado";

interface GastosVariablesTableProps {
  empleado: Empleado;
  onEditar?: (gasto: GastoVariableEmpleado) => void;
  onEliminar?: (gastoId: number) => void;
}

export const GastosVariablesTable = ({ empleado, onEditar, onEliminar }: GastosVariablesTableProps) => {
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
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Concepto</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead className="text-right">Importe</TableHead>
            <TableHead className="text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {empleado.gastosVariables?.length > 0 ? (
            empleado.gastosVariables.map((gasto) => (
              <TableRow key={gasto.id}>
                <TableCell className="font-medium">
                  {getConceptoLabel(gasto.concepto)}
                </TableCell>
                <TableCell>{gasto.descripcion || '-'}</TableCell>
                <TableCell>{format(gasto.fecha, "dd/MM/yyyy", { locale: es })}</TableCell>
                <TableCell className="text-right">€{gasto.importe.toFixed(2)}</TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center space-x-2">
                    {onEditar && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditar(gasto)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    {onEliminar && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Eliminar gasto?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. Se eliminará permanentemente el gasto de {getConceptoLabel(gasto.concepto)} por €{gasto.importe.toFixed(2)}.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onEliminar(gasto.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                No hay gastos variables registrados
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
