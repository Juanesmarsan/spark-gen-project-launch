
import { useState, useCallback } from "react";
import { Empleado, GastoVariableEmpleado } from "@/types/empleado";
import { useToast } from "@/hooks/use-toast";
import { useEmpleados } from "@/hooks/useEmpleados";
import { useInventarios } from "@/hooks/useInventarios";

export const usePersonalActions = () => {
  console.log('usePersonalActions: Inicializando hook');
  
  const { toast } = useToast();
  const { empleados: todosEmpleados, agregarEmpleado, updateEmpleado, eliminarEmpleado, deshabilitarEmpleado, habilitarEmpleado, agregarCambioSalario, agregarGastoVariable } = useEmpleados();
  const { inventarioEpis, inventarioHerramientas, inventarioVehiculos } = useInventarios();
  
  // Filtrar solo el personal de gerencia (Esteban Márquez y Nuria Playan)
  const empleados = todosEmpleados.filter(emp => 
    emp.nombre === 'Esteban' && emp.apellidos === 'Márquez' ||
    emp.nombre === 'Nuria' && emp.apellidos === 'Playan'
  );
  
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState<Empleado | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const handleAgregarEmpleado = useCallback((nuevoEmpleadoData: Omit<Empleado, 'id' | 'adelantos' | 'epis' | 'herramientas' | 'documentos' | 'proyectos' | 'vehiculo' | 'gastosVariables' | 'historialSalarios' | 'activo'>) => {
    console.log('usePersonalActions: Agregando empleado');
    const nuevoEmpleado = agregarEmpleado(nuevoEmpleadoData);
    setMostrarFormulario(false);
    
    toast({
      title: "Personal añadido",
      description: "El personal se ha añadido correctamente.",
    });
  }, [agregarEmpleado, toast]);

  const handleEliminarEmpleado = useCallback((empleadoId: number) => {
    console.log('usePersonalActions: Eliminando empleado');
    eliminarEmpleado(empleadoId);
    
    if (empleadoSeleccionado?.id === empleadoId) {
      setEmpleadoSeleccionado(null);
    }
    
    toast({
      title: "Personal eliminado",
      description: "El personal ha sido eliminado permanentemente.",
      variant: "destructive"
    });
  }, [eliminarEmpleado, empleadoSeleccionado, toast]);

  const handleDeshabilitarEmpleado = useCallback((empleadoId: number) => {
    console.log('usePersonalActions: Deshabilitando empleado');
    deshabilitarEmpleado(empleadoId);
    
    if (empleadoSeleccionado?.id === empleadoId) {
      const empleadoActualizado = empleados.find(emp => emp.id === empleadoId);
      if (empleadoActualizado) {
        setEmpleadoSeleccionado({ ...empleadoActualizado, activo: false });
      }
    }
    
    toast({
      title: "Personal deshabilitado",
      description: "El personal ha sido marcado como inactivo.",
    });
  }, [deshabilitarEmpleado, empleadoSeleccionado, empleados, toast]);

  const handleHabilitarEmpleado = useCallback((empleadoId: number) => {
    console.log('usePersonalActions: Habilitando empleado');
    habilitarEmpleado(empleadoId);
    
    if (empleadoSeleccionado?.id === empleadoId) {
      const empleadoActualizado = empleados.find(emp => emp.id === empleadoId);
      if (empleadoActualizado) {
        setEmpleadoSeleccionado({ ...empleadoActualizado, activo: true });
      }
    }
    
    toast({
      title: "Personal habilitado",
      description: "El personal ha sido reactivado correctamente.",
    });
  }, [habilitarEmpleado, empleadoSeleccionado, empleados, toast]);

  const handleUpdateEmpleado = useCallback((empleadoActualizado: Empleado) => {
    console.log('usePersonalActions: Actualizando empleado');
    updateEmpleado(empleadoActualizado);
    setEmpleadoSeleccionado(empleadoActualizado);
  }, [updateEmpleado]);

  const agregarAdelanto = useCallback((concepto: string, cantidad: number) => {
    if (!empleadoSeleccionado) return;

    console.log('usePersonalActions: Agregando adelanto');
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

    console.log('usePersonalActions: Asignando EPI');
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

    console.log('usePersonalActions: Asignando herramienta');
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

    console.log('usePersonalActions: Asignando vehículo');
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

    console.log('usePersonalActions: Agregando gasto variable');
    agregarGastoVariable(empleadoSeleccionado.id, gasto);
    
    setTimeout(() => {
      const empleadoActualizado = empleados.find(emp => emp.id === empleadoSeleccionado.id);
      if (empleadoActualizado) {
        setEmpleadoSeleccionado(empleadoActualizado);
      }
    }, 100);

    toast({
      title: "Gasto añadido",
      description: "El gasto variable se ha registrado correctamente.",
    });
  }, [empleadoSeleccionado, agregarGastoVariable, empleados, toast]);

  return {
    empleados,
    empleadoSeleccionado,
    setEmpleadoSeleccionado,
    mostrarFormulario,
    setMostrarFormulario,
    inventarioEpis,
    inventarioHerramientas,
    inventarioVehiculos,
    handleAgregarEmpleado,
    handleEliminarEmpleado,
    handleDeshabilitarEmpleado,
    handleHabilitarEmpleado,
    handleUpdateEmpleado,
    agregarAdelanto,
    asignarEpi,
    asignarHerramienta,
    asignarVehiculo,
    handleAgregarGastoVariable,
    agregarCambioSalario
  };
};
