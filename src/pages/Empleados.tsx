import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { EmpleadoForm } from "@/components/EmpleadoForm";
import { EmpleadosList } from "@/components/EmpleadosList";
import { EmpleadoDetails } from "@/components/EmpleadoDetails";
import { Empleado, GastoVariableEmpleado } from "@/types/empleado";
import { useToast } from "@/hooks/use-toast";
import { useEmpleados } from "@/hooks/useEmpleados";
import { useInventarios } from "@/hooks/useInventarios";

const Empleados = () => {
  console.log('Empleados: Renderizando componente');
  
  const { toast } = useToast();
  const { empleados, agregarEmpleado, updateEmpleado, eliminarEmpleado, deshabilitarEmpleado, habilitarEmpleado, agregarCambioSalario, agregarGastoVariable } = useEmpleados();
  const { inventarioEpis, inventarioHerramientas, inventarioVehiculos } = useInventarios();
  
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState<Empleado | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const handleAgregarEmpleado = useCallback((nuevoEmpleadoData: Omit<Empleado, 'id' | 'adelantos' | 'epis' | 'herramientas' | 'documentos' | 'proyectos' | 'vehiculo' | 'gastosVariables' | 'historialSalarios' | 'activo'>) => {
    console.log('Empleados: Agregando empleado');
    const nuevoEmpleado = agregarEmpleado(nuevoEmpleadoData);
    setMostrarFormulario(false);
    
    toast({
      title: "Empleado añadido",
      description: "El empleado se ha añadido correctamente.",
    });
  }, [agregarEmpleado, toast]);

  const handleEliminarEmpleado = useCallback((empleadoId: number) => {
    console.log('Empleados: Eliminando empleado');
    eliminarEmpleado(empleadoId);
    
    if (empleadoSeleccionado?.id === empleadoId) {
      setEmpleadoSeleccionado(null);
    }
    
    toast({
      title: "Empleado eliminado",
      description: "El empleado ha sido eliminado permanentemente.",
      variant: "destructive"
    });
  }, [eliminarEmpleado, empleadoSeleccionado, toast]);

  const handleDeshabilitarEmpleado = useCallback((empleadoId: number) => {
    console.log('Empleados: Deshabilitando empleado');
    deshabilitarEmpleado(empleadoId);
    
    // Actualizar empleado seleccionado si es el que se está deshabilitando
    if (empleadoSeleccionado?.id === empleadoId) {
      const empleadoActualizado = empleados.find(emp => emp.id === empleadoId);
      if (empleadoActualizado) {
        setEmpleadoSeleccionado({ ...empleadoActualizado, activo: false });
      }
    }
    
    toast({
      title: "Empleado deshabilitado",
      description: "El empleado ha sido marcado como inactivo.",
    });
  }, [deshabilitarEmpleado, empleadoSeleccionado, empleados, toast]);

  const handleHabilitarEmpleado = useCallback((empleadoId: number) => {
    console.log('Empleados: Habilitando empleado');
    habilitarEmpleado(empleadoId);
    
    // Actualizar empleado seleccionado si es el que se está habilitando
    if (empleadoSeleccionado?.id === empleadoId) {
      const empleadoActualizado = empleados.find(emp => emp.id === empleadoId);
      if (empleadoActualizado) {
        setEmpleadoSeleccionado({ ...empleadoActualizado, activo: true });
      }
    }
    
    toast({
      title: "Empleado habilitado",
      description: "El empleado ha sido reactivado correctamente.",
    });
  }, [habilitarEmpleado, empleadoSeleccionado, empleados, toast]);

  const handleUpdateEmpleado = useCallback((empleadoActualizado: Empleado) => {
    console.log('Empleados: Actualizando empleado');
    updateEmpleado(empleadoActualizado);
    setEmpleadoSeleccionado(empleadoActualizado);
  }, [updateEmpleado]);

  const agregarAdelanto = useCallback((concepto: string, cantidad: number) => {
    if (!empleadoSeleccionado) return;

    console.log('Empleados: Agregando adelanto');
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
  }, [empleadoSeleccionado, handleUpdateEmpleado]);

  const asignarEpi = useCallback((epiId: number, fecha: Date) => {
    if (!empleadoSeleccionado) return;

    console.log('Empleados: Asignando EPI');
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
  }, [empleadoSeleccionado, inventarioEpis, handleUpdateEmpleado]);

  const asignarHerramienta = useCallback((herramientaId: number, fecha: Date) => {
    if (!empleadoSeleccionado) return;

    console.log('Empleados: Asignando herramienta');
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
  }, [empleadoSeleccionado, inventarioHerramientas, handleUpdateEmpleado]);

  const asignarVehiculo = useCallback((vehiculoId: number) => {
    if (!empleadoSeleccionado) return;

    console.log('Empleados: Asignando vehículo');
    const vehiculo = inventarioVehiculos.find(v => v.id === vehiculoId);
    if (vehiculo) {
      const empleadoActualizado = {
        ...empleadoSeleccionado,
        vehiculo: `${vehiculo.tipo} ${vehiculo.matricula}`
      };

      handleUpdateEmpleado(empleadoActualizado);
    }
  }, [empleadoSeleccionado, inventarioVehiculos, handleUpdateEmpleado]);

  const handleAgregarGastoVariable = useCallback((gasto: Omit<GastoVariableEmpleado, 'id'>) => {
    if (!empleadoSeleccionado) return;

    console.log('Empleados: Agregando gasto variable');
    agregarGastoVariable(empleadoSeleccionado.id, gasto);
    
    // Encontrar el empleado actualizado
    const empleadoActualizado = empleados.find(emp => emp.id === empleadoSeleccionado.id);
    if (empleadoActualizado) {
      setEmpleadoSeleccionado(empleadoActualizado);
    }

    toast({
      title: "Gasto añadido",
      description: "El gasto variable se ha registrado correctamente.",
    });
  }, [empleadoSeleccionado, agregarGastoVariable, empleados, toast]);

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
          onEliminarEmpleado={handleEliminarEmpleado}
          onDeshabilitarEmpleado={handleDeshabilitarEmpleado}
          onHabilitarEmpleado={handleHabilitarEmpleado}
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
            onAgregarGastoVariable={handleAgregarGastoVariable}
            onAgregarCambioSalario={agregarCambioSalario}
          />
        )}
      </div>
    </div>
  );
};

export default Empleados;
