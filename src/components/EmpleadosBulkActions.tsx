
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { UserX, Trash2, Users } from "lucide-react";
import { Empleado } from "@/types/empleado";

interface EmpleadosBulkActionsProps {
  empleados: Empleado[];
  selectedEmpleados: number[];
  onSelectEmpleado: (empleadoId: number, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  onBulkDisable: (empleadoIds: number[]) => void;
  onBulkDelete: (empleadoIds: number[]) => void;
  allowPermanentDelete?: boolean;
}

export const EmpleadosBulkActions = ({
  empleados,
  selectedEmpleados,
  onSelectEmpleado,
  onSelectAll,
  onBulkDisable,
  onBulkDelete,
  allowPermanentDelete = false
}: EmpleadosBulkActionsProps) => {
  const allSelected = empleados.length > 0 && selectedEmpleados.length === empleados.length;
  const someSelected = selectedEmpleados.length > 0;
  
  // Filtrar solo los empleados activos entre los seleccionados
  const selectedActiveEmpleadoIds = selectedEmpleados.filter(selectedId => {
    const empleado = empleados.find(emp => emp.id === selectedId);
    return empleado && empleado.activo;
  });

  const handleSelectAll = (checked: boolean) => {
    onSelectAll(checked);
  };

  const handleBulkDisable = () => {
    console.log('EmpleadosBulkActions: Deshabilitando empleados:', selectedActiveEmpleadoIds);
    onBulkDisable(selectedActiveEmpleadoIds);
  };

  const handleBulkDelete = () => {
    console.log('EmpleadosBulkActions: Eliminando empleados:', selectedEmpleados);
    onBulkDelete(selectedEmpleados);
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center space-x-2">
        <Checkbox
          checked={allSelected}
          onCheckedChange={handleSelectAll}
          className="h-5 w-5"
        />
        <label className="text-sm font-medium">
          Seleccionar todos ({selectedEmpleados.length}/{empleados.length})
        </label>
      </div>

      {someSelected && (
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-sm text-gray-600">
            {selectedEmpleados.length} empleado{selectedEmpleados.length !== 1 ? 's' : ''} seleccionado{selectedEmpleados.length !== 1 ? 's' : ''}
          </span>

          {selectedActiveEmpleadoIds.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <UserX className="w-4 h-4 mr-2" />
                  Inhabilitar ({selectedActiveEmpleadoIds.length})
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Inhabilitar Empleados</AlertDialogTitle>
                  <AlertDialogDescription>
                    ¿Estás seguro de que quieres inhabilitar {selectedActiveEmpleadoIds.length} empleado{selectedActiveEmpleadoIds.length !== 1 ? 's' : ''}? 
                    Los empleados serán marcados como inactivos pero se mantendrán todos sus datos.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleBulkDisable}>
                    Inhabilitar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          {allowPermanentDelete && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Eliminar ({selectedEmpleados.length})
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Eliminar Empleados Permanentemente</AlertDialogTitle>
                  <AlertDialogDescription>
                    ¿Estás seguro de que quieres eliminar permanentemente {selectedEmpleados.length} empleado{selectedEmpleados.length !== 1 ? 's' : ''}? 
                    Esta acción no se puede deshacer y se perderán todos los datos de los empleados seleccionados.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleBulkDelete}>
                    Eliminar Permanentemente
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      )}
    </div>
  );
};
