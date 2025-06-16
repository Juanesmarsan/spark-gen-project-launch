import { useCallback } from "react";
import { Empleado } from "@/types/empleado";
import { useToast } from "@/hooks/use-toast";
import { useEmpleados } from "@/hooks/useEmpleados";
import { useEmpleadoActionsBase } from "@/hooks/common/useEmpleadoActionsBase";

export const useEmpleadosActions = () => {
  console.log('useEmpleadosActions: Inicializando hook');
  
  const { toast } = useToast();
  const { empleados: todosEmpleados, agregarEmpleado, eliminarEmpleado, eliminarTodosEmpleados, resetearTodosEmpleados, deshabilitarEmpleado, agregarCambioSalario } = useEmpleados();
  
  // Filtrar empleados excluyendo a Esteban Márquez y Nuria Playan (ahora están en Personal de Gerencia)
  const empleados = todosEmpleados.filter(emp => 
    !(emp.nombre === 'Esteban' && emp.apellidos === 'Márquez') &&
    !(emp.nombre === 'Nuria' && emp.apellidos === 'Playan')
  );
  
  const baseActions = useEmpleadoActionsBase(empleados);

  const handleAgregarEmpleado = useCallback((nuevoEmpleadoData: Omit<Empleado, 'id' | 'adelantos' | 'epis' | 'herramientas' | 'documentos' | 'proyectos' | 'vehiculo' | 'gastosVariables' | 'historialSalarios' | 'activo'>) => {
    console.log('useEmpleadosActions: Agregando empleado');
    const nuevoEmpleado = agregarEmpleado(nuevoEmpleadoData);
    baseActions.setMostrarFormulario(false);
    
    toast({
      title: "Empleado añadido",
      description: "El empleado se ha añadido correctamente.",
    });
  }, [agregarEmpleado, toast, baseActions]);

  const handleEliminarEmpleado = useCallback((empleadoId: number) => {
    console.log('useEmpleadosActions: Eliminando empleado con ID:', empleadoId);
    eliminarEmpleado(empleadoId);
    
    if (baseActions.empleadoSeleccionado?.id === empleadoId) {
      baseActions.setEmpleadoSeleccionado(null);
    }
    
    toast({
      title: "Empleado eliminado",
      description: "El empleado ha sido eliminado permanentemente.",
      variant: "destructive"
    });
  }, [eliminarEmpleado, baseActions, toast]);

  const handleEliminarTodosEmpleados = useCallback(() => {
    console.log('useEmpleadosActions: Reseteando todos los empleados completamente');
    resetearTodosEmpleados();
    baseActions.setEmpleadoSeleccionado(null);
    
    toast({
      title: "Todos los empleados eliminados",
      description: "Se han eliminado todos los empleados permanentemente de la base de datos.",
      variant: "destructive"
    });
  }, [resetearTodosEmpleados, baseActions, toast]);

  const handleBulkEliminar = useCallback((empleadoIds: number[]) => {
    console.log('useEmpleadosActions: Eliminación masiva de empleados:', empleadoIds);
    empleadoIds.forEach(id => eliminarEmpleado(id));
    
    if (baseActions.empleadoSeleccionado && empleadoIds.includes(baseActions.empleadoSeleccionado.id)) {
      baseActions.setEmpleadoSeleccionado(null);
    }
    
    toast({
      title: "Empleados eliminados",
      description: `Se han eliminado ${empleadoIds.length} empleado${empleadoIds.length !== 1 ? 's' : ''} permanentemente.`,
      variant: "destructive"
    });
  }, [eliminarEmpleado, baseActions, toast]);

  const handleBulkDeshabilitar = useCallback((empleadoIds: number[]) => {
    console.log('useEmpleadosActions: Inhabilitación masiva de empleados:', empleadoIds);
    empleadoIds.forEach(id => deshabilitarEmpleado(id));
    
    if (baseActions.empleadoSeleccionado && empleadoIds.includes(baseActions.empleadoSeleccionado.id)) {
      const empleadoActualizado = empleados.find(emp => emp.id === baseActions.empleadoSeleccionado.id);
      if (empleadoActualizado) {
        baseActions.setEmpleadoSeleccionado({ ...empleadoActualizado, activo: false });
      }
    }
    
    toast({
      title: "Empleados inhabilitados",
      description: `Se han inhabilitado ${empleadoIds.length} empleado${empleadoIds.length !== 1 ? 's' : ''}.`,
    });
  }, [deshabilitarEmpleado, baseActions, empleados, toast]);

  const handleAgregarCambioSalario = useCallback((empleadoId: number, nuevosSalarios: any) => {
    console.log('useEmpleadosActions: Agregando cambio de salario');
    agregarCambioSalario(empleadoId, nuevosSalarios);
    
    // Actualizar el empleado seleccionado con los nuevos datos
    setTimeout(() => {
      baseActions.actualizarEmpleadoSeleccionado(empleadoId);
    }, 100);
    
    toast({
      title: "Salario actualizado",
      description: "El cambio de salario se ha registrado correctamente.",
    });
  }, [agregarCambioSalario, baseActions, toast]);

  return {
    empleados,
    ...baseActions,
    handleAgregarEmpleado,
    handleEliminarEmpleado,
    handleEliminarTodosEmpleados,
    handleBulkEliminar,
    handleBulkDeshabilitar,
    agregarCambioSalario: handleAgregarCambioSalario
  };
};
