
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { EmpleadoForm } from "@/components/EmpleadoForm";
import { EmpleadosList } from "@/components/EmpleadosList";
import { EmpleadoDetails } from "@/components/EmpleadoDetails";
import { Empleado } from "@/types/empleado";
import { useToast } from "@/hooks/use-toast";
import { useEmpleados } from "@/hooks/useEmpleados";
import { useInventarios } from "@/hooks/useInventarios";

const Empleados = () => {
  const { toast } = useToast();
  const { empleados, agregarEmpleado, updateEmpleado } = useEmpleados();
  const { inventarioEpis, inventarioHerramientas, inventarioVehiculos } = useInventarios();
  
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState<Empleado | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const handleAgregarEmpleado = (nuevoEmpleadoData: Omit<Empleado, 'id' | 'adelantos' | 'epis' | 'herramientas' | 'documentos' | 'proyectos' | 'vehiculo'>) => {
    const nuevoEmpleado = agregarEmpleado(nuevoEmpleadoData);
    setMostrarFormulario(false);
    
    toast({
      title: "Empleado añadido",
      description: "El empleado se ha añadido correctamente.",
    });
  };

  const handleUpdateEmpleado = (empleadoActualizado: Empleado) => {
    updateEmpleado(empleadoActualizado);
    setEmpleadoSeleccionado(empleadoActualizado);
  };

  const agregarAdelanto = (concepto: string, cantidad: number) => {
    if (!empleadoSeleccionado) return;

    const nuevoAdelantoObj = {
      id: Date.now(),
      concepto,
      cantidad,
      fecha: new Date()
    };

    const empleadoActualizado = {
      ...empleadoSeleccionado,
      adelantos: [...empleadoSeleccionado.adelantos, nuevoAdelantoObj]
    };

    handleUpdateEmpleado(empleadoActualizado);
  };

  const asignarEpi = (epiId: number, fecha: Date) => {
    if (!empleadoSeleccionado) return;

    const epi = inventarioEpis.find(e => e.id === epiId);
    if (epi) {
      const nuevoEpiAsignado = {
        id: Date.now(),
        nombre: epi.nombre,
        precio: epi.precio,
        fechaEntrega: fecha
      };

      const empleadoActualizado = {
        ...empleadoSeleccionado,
        epis: [...empleadoSeleccionado.epis, nuevoEpiAsignado]
      };

      handleUpdateEmpleado(empleadoActualizado);
    }
  };

  const asignarHerramienta = (herramientaId: number, fecha: Date) => {
    if (!empleadoSeleccionado) return;

    const herramienta = inventarioHerramientas.find(h => h.id === herramientaId);
    if (herramienta) {
      const nuevaHerramientaAsignada = {
        id: Date.now(),
        nombre: `${herramienta.tipo} ${herramienta.marca}`,
        precio: herramienta.coste,
        fechaEntrega: fecha
      };

      const empleadoActualizado = {
        ...empleadoSeleccionado,
        herramientas: [...empleadoSeleccionado.herramientas, nuevaHerramientaAsignada]
      };

      handleUpdateEmpleado(empleadoActualizado);
    }
  };

  const asignarVehiculo = (vehiculoId: number) => {
    if (!empleadoSeleccionado) return;

    const vehiculo = inventarioVehiculos.find(v => v.id === vehiculoId);
    if (vehiculo) {
      const empleadoActualizado = {
        ...empleadoSeleccionado,
        vehiculo: `${vehiculo.tipo} ${vehiculo.matricula}`
      };

      handleUpdateEmpleado(empleadoActualizado);
    }
  };

  return (
    <div className="p-6 space-y-6">
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
            onSubmit={handleAgregarEmpleado}
            onCancel={() => setMostrarFormulario(false)}
          />
        </Dialog>
      </div>

      <div className="grid gap-6">
        <EmpleadosList 
          empleados={empleados}
          onSelectEmpleado={setEmpleadoSeleccionado}
        />

        {empleadoSeleccionado && (
          <EmpleadoDetails
            empleado={empleadoSeleccionado}
            inventarioEpis={inventarioEpis}
            inventarioHerramientas={inventarioHerramientas}
            inventarioVehiculos={inventarioVehiculos}
            onUpdateEmpleado={handleUpdateEmpleado}
            onAgregarAdelanto={agregarAdelanto}
            onAsignarEpi={asignarEpi}
            onAsignarHerramienta={asignarHerramienta}
            onAsignarVehiculo={asignarVehiculo}
          />
        )}
      </div>
    </div>
  );
};

export default Empleados;
