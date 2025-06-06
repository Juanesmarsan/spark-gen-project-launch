
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { EmpleadoForm } from "@/components/EmpleadoForm";
import { Empleado } from "@/types/empleado";

interface EmpleadosHeaderProps {
  mostrarFormulario: boolean;
  setMostrarFormulario: (mostrar: boolean) => void;
  onAgregarEmpleado: (empleadoData: Omit<Empleado, 'id' | 'adelantos' | 'epis' | 'herramientas' | 'documentos' | 'proyectos' | 'vehiculo' | 'gastosVariables' | 'historialSalarios' | 'activo'>) => void;
}

export const EmpleadosHeader = ({ 
  mostrarFormulario, 
  setMostrarFormulario, 
  onAgregarEmpleado 
}: EmpleadosHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold">Gestión de Empleados</h1>
        <p className="text-muted-foreground">Administra empleados y asignaciones</p>
      </div>
      <Dialog open={mostrarFormulario} onOpenChange={setMostrarFormulario}>
        <DialogTrigger asChild>
          <Button 
            onClick={() => setMostrarFormulario(true)}
            className="bg-omenar-green hover:bg-omenar-dark-green"
          >
            <Plus className="w-4 h-4 mr-2" />
            Añadir Empleado
          </Button>
        </DialogTrigger>
        <EmpleadoForm
          onSubmit={onAgregarEmpleado}
          onCancel={() => setMostrarFormulario(false)}
        />
      </Dialog>
    </div>
  );
};
