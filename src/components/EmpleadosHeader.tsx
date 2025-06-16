
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Trash2 } from "lucide-react";
import { EmpleadoForm } from "./EmpleadoForm";
import { Empleado } from "@/types/empleado";

interface EmpleadosHeaderProps {
  mostrarFormulario: boolean;
  setMostrarFormulario: (mostrar: boolean) => void;
  onAgregarEmpleado: (empleado: Omit<Empleado, 'id' | 'adelantos' | 'epis' | 'herramientas' | 'documentos' | 'proyectos' | 'vehiculo' | 'gastosVariables' | 'historialSalarios' | 'activo'>) => void;
  onEliminarTodos?: () => void;
}

export const EmpleadosHeader = ({ 
  mostrarFormulario, 
  setMostrarFormulario, 
  onAgregarEmpleado,
  onEliminarTodos
}: EmpleadosHeaderProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Gestión de Empleados
          <div className="flex gap-2">
            {onEliminarTodos && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Eliminar Todos
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Eliminar Todos los Empleados</AlertDialogTitle>
                    <AlertDialogDescription>
                      ¿Estás seguro de que quieres eliminar TODOS los empleados de la base de datos? 
                      Esta acción no se puede deshacer y se perderán todos los datos.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={onEliminarTodos}>
                      Eliminar Todos
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            <Button onClick={() => setMostrarFormulario(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Empleado
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      
      <Dialog open={mostrarFormulario} onOpenChange={setMostrarFormulario}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nuevo Empleado</DialogTitle>
          </DialogHeader>
          <EmpleadoForm 
            onSubmit={onAgregarEmpleado}
            onCancel={() => setMostrarFormulario(false)}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
};
