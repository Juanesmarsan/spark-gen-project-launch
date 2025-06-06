
import { useState, useCallback } from "react";
import { Empleado, GastoVariableEmpleado } from "@/types/empleado";
import { useToast } from "@/hooks/use-toast";
import { useEmpleados } from "@/hooks/useEmpleados";
import { useInventarios } from "@/hooks/useInventarios";

export const useEmpleadoActionsBase = (empleadosFiltrados: Empleado[]) => {
  const { toast } = useToast();
  const { updateEmpleado, eliminarEmpleado, deshabilitarEmpleado, habilitarEmpleado, agregarGastoVariable } = useEmpleados();
  const { inventarioEpis, inventarioHerramientas, inventarioVehiculos } = useInventarios();
  
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState<Empleado | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const handleEliminarEmpleado = useCallback((empleadoId: number) => {
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
    deshabilitarEmpleado(empleadoId);
    
    if (empleadoSeleccionado?.id === empleadoId) {
      const empleadoActualizado = empleadosFiltrados.find(emp => emp.id === empleadoId);
      if (empleadoActualizado) {
        setEmpleadoSeleccionado({ ...empleadoActualizado, activo: false });
      }
    }
    
    toast({
      title: "Empleado deshabilitado",
      description: "El empleado ha sido marcado como inactivo.",
    });
  }, [deshabilitarEmpleado, empleadoSeleccionado, empleadosFiltrados, toast]);

  const handleHabilitarEmpleado = useCallback((empleadoId: number) => {
    habilitarEmpleado(empleadoId);
    
    if (empleadoSeleccionado?.id === empleadoId) {
      const empleadoActualizado = empleadosFiltrados.find(emp => emp.id === empleadoId);
      if (empleadoActualizado) {
        setEmpleadoSeleccionado({ ...empleadoActualizado, activo: true });
      }
    }
    
    toast({
      title: "Empleado habilitado",
      description: "El empleado ha sido reactivado correctamente.",
    });
  }, [habilitarEmpleado, empleadoSeleccionado, empleadosFiltrados, toast]);

  const handleUpdateEmpleado = useCallback((empleadoActualizado: Empleado) => {
    updateEmpleado(empleadoActualizado);
    setEmpleadoSeleccionado(empleadoActualizado);
  }, [updateEmpleado]);

  const agregarAdelanto = useCallback((concepto: string, cantidad: number) => {
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
  }, [empleadoSeleccionado, handleUpdateEmpleado]);

  const asignarEpi = useCallback((epiId: number, fecha: Date) => {
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
  }, [empleadoSeleccionado, inventarioEpis, handleUpdateEmpleado]);

  const asignarHerramienta = useCallback((herramientaId: number, fecha: Date) => {
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
  }, [empleadoSeleccionado, inventarioHerramientas, handleUpdateEmpleado]);

  const asignarVehiculo = useCallback((vehiculoId: number) => {
    if (!empleadoSeleccionado) return;

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

    agregarGastoVariable(empleadoSeleccionado.id, gasto);
    
    setTimeout(() => {
      const empleadoActualizado = empleadosFiltrados.find(emp => emp.id === empleadoSeleccionado.id);
      if (empleadoActualizado) {
        setEmpleadoSeleccionado(empleadoActualizado);
      }
    }, 100);

    toast({
      title: "Gasto añadido",
      description: "El gasto variable se ha registrado correctamente.",
    });
  }, [empleadoSeleccionado, agregarGastoVariable, empleadosFiltrados, toast]);

  return {
    empleadoSeleccionado,
    setEmpleadoSeleccionado,
    mostrarFormulario,
    setMostrarFormulario,
    inventarioEpis,
    inventarioHerramientas,
    inventarioVehiculos,
    handleEliminarEmpleado,
    handleDeshabilitarEmpleado,
    handleHabilitarEmpleado,
    handleUpdateEmpleado,
    agregarAdelanto,
    asignarEpi,
    asignarHerramienta,
    asignarVehiculo,
    handleAgregarGastoVariable
  };
};
