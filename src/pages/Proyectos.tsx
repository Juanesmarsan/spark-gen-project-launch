
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { ProyectoForm } from "@/components/ProyectoForm";
import { ProyectosList } from "@/components/ProyectosList";
import { ProyectoDetails } from "@/components/ProyectoDetails";
import { Proyecto, ProyectoFormData } from "@/types/proyecto";
import { useToast } from "@/hooks/use-toast";
import { useEmpleados } from "@/hooks/useEmpleados";
import { useProyectos } from "@/hooks/useProyectos";

export const Proyectos = () => {
  const [selectedProyecto, setSelectedProyecto] = useState<Proyecto | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { toast } = useToast();
  const { empleados } = useEmpleados();
  const { proyectos, agregarProyecto, updateProyecto, eliminarProyecto, agregarGastoProyecto, eliminarGastoProyecto, agregarCertificacion } = useProyectos();

  const handleAgregarProyecto = (data: ProyectoFormData) => {
    const nuevoProyecto = agregarProyecto(data, empleados);
    setShowForm(false);
    toast({
      title: "Proyecto añadido",
      description: "El proyecto se ha añadido correctamente.",
    });
  };

  const handleUpdateProyecto = (proyectoActualizado: Proyecto) => {
    updateProyecto(proyectoActualizado);
    setSelectedProyecto(proyectoActualizado);
    toast({
      title: "Proyecto actualizado",
      description: "El proyecto se ha actualizado correctamente.",
    });
  };

  const handleEliminarProyecto = (id: number) => {
    eliminarProyecto(id);
    setSelectedProyecto(null);
    toast({
      title: "Proyecto eliminado",
      description: "El proyecto se ha eliminado correctamente.",
    });
  };

  const handleAgregarGastoProyecto = (proyectoId: number, gasto: any) => {
    agregarGastoProyecto(proyectoId, gasto);
    
    // Actualizar proyecto seleccionado si es el mismo
    if (selectedProyecto && selectedProyecto.id === proyectoId) {
      const proyectoActualizado = proyectos.find(p => p.id === proyectoId);
      if (proyectoActualizado) {
        setSelectedProyecto(proyectoActualizado);
      }
    }

    toast({
      title: "Gasto añadido",
      description: "El gasto se ha añadido al proyecto correctamente.",
    });
  };

  const handleEliminarGastoProyecto = (proyectoId: number, gastoId: number) => {
    eliminarGastoProyecto(proyectoId, gastoId);
    
    // Actualizar proyecto seleccionado si es el mismo
    if (selectedProyecto && selectedProyecto.id === proyectoId) {
      const proyectoActualizado = proyectos.find(p => p.id === proyectoId);
      if (proyectoActualizado) {
        setSelectedProyecto(proyectoActualizado);
      }
    }

    toast({
      title: "Gasto eliminado",
      description: "El gasto se ha eliminado del proyecto correctamente.",
    });
  };

  const handleAgregarCertificacion = (proyectoId: number, certificacion: any) => {
    agregarCertificacion(proyectoId, certificacion);
    
    // Actualizar proyecto seleccionado si es el mismo
    if (selectedProyecto && selectedProyecto.id === proyectoId) {
      const proyectoActualizado = proyectos.find(p => p.id === proyectoId);
      if (proyectoActualizado) {
        setSelectedProyecto(proyectoActualizado);
      }
    }

    toast({
      title: "Certificación añadida",
      description: "La certificación se ha añadido al proyecto correctamente.",
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Proyectos</h1>
          <p className="text-muted-foreground">Administra los proyectos de la empresa</p>
        </div>
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-omenar-green hover:bg-omenar-dark-green"
            >
              <Plus className="w-4 h-4 mr-2" />
              Añadir Proyecto
            </Button>
          </DialogTrigger>
          <ProyectoForm
            onSubmit={handleAgregarProyecto}
            onCancel={() => setShowForm(false)}
            empleados={empleados}
          />
        </Dialog>
      </div>

      <div className="grid gap-6">
        <ProyectosList
          proyectos={proyectos}
          onSelectProyecto={setSelectedProyecto}
        />

        {selectedProyecto && (
          <ProyectoDetails
            proyecto={selectedProyecto}
            empleados={empleados}
            onUpdateProyecto={handleUpdateProyecto}
            onEliminarProyecto={handleEliminarProyecto}
            onAgregarGasto={handleAgregarGastoProyecto}
            onEliminarGasto={handleEliminarGastoProyecto}
            onAgregarCertificacion={handleAgregarCertificacion}
          />
        )}
      </div>
    </div>
  );
};

export default Proyectos;
