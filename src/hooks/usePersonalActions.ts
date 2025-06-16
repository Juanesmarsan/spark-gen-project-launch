import { useCallback } from "react";
import { Empleado } from "@/types/empleado";
import { useToast } from "@/hooks/use-toast";
import { useEmpleados } from "@/hooks/useEmpleados";
import { useGastosPersonalGerencia } from "@/hooks/useGastosPersonalGerencia";
import { useEmpleadoActionsBase } from "@/hooks/common/useEmpleadoActionsBase";

export const usePersonalActions = () => {
  console.log('usePersonalActions: Inicializando hook');
  
  const { toast } = useToast();
  const { empleados: todosEmpleados, agregarEmpleado, eliminarEmpleado, eliminarTodosEmpleados, resetearTodosEmpleados, deshabilitarEmpleado, agregarCambioSalario } = useEmpleados();
  const { sincronizarGastoVariableConGastosFijos, sincronizarSalariosGerenciaConGastosFijos } = useGastosPersonalGerencia();
  
  // Filtrar solo el personal de gerencia
  const empleados = todosEmpleados.filter(emp => {
    const esGerencia = emp.departamento === 'gerencia' || emp.categoria === 'gerencia';
    const esEsteban = emp.nombre.toLowerCase().includes('esteban');
    const esNuria = emp.nombre.toLowerCase().includes('nuria') || emp.apellidos.toLowerCase().includes('nuria');
    
    console.log(`Revisando empleado: ${emp.nombre} ${emp.apellidos} - Departamento: ${emp.departamento}, Categoría: ${emp.categoria}`);
    console.log(`Es gerencia: ${esGerencia}, Es Esteban: ${esEsteban}, Es Nuria: ${esNuria}`);
    
    return esGerencia || esEsteban || esNuria;
  });
  
  console.log('usePersonalActions: Personal de gerencia encontrado:', empleados.length);

  const baseActions = useEmpleadoActionsBase(empleados);

  const handleEliminarTodosEmpleados = useCallback(() => {
    console.log('usePersonalActions: Reseteando todo el personal completamente');
    resetearTodosEmpleados();
    baseActions.setEmpleadoSeleccionado(null);
    
    toast({
      title: "Todo el personal eliminado",
      description: "Se ha eliminado todo el personal permanentemente de la base de datos.",
      variant: "destructive"
    });
  }, [resetearTodosEmpleados, baseActions, toast]);

  const handleAgregarEmpleado = useCallback((nuevoEmpleadoData: Omit<Empleado, 'id' | 'adelantos' | 'epis' | 'herramientas' | 'documentos' | 'proyectos' | 'vehiculo' | 'gastosVariables' | 'historialSalarios' | 'activo'>) => {
    console.log('usePersonalActions: Agregando empleado');
    const nuevoEmpleado = agregarEmpleado(nuevoEmpleadoData);
    baseActions.setMostrarFormulario(false);
    
    // Sincronizar salarios de gerencia con gastos fijos
    setTimeout(() => {
      sincronizarSalariosGerenciaConGastosFijos();
    }, 100);
    
    toast({
      title: "Personal añadido",
      description: "El personal se ha añadido correctamente.",
    });
  }, [agregarEmpleado, toast, sincronizarSalariosGerenciaConGastosFijos, baseActions]);

  const handleEliminarEmpleado = useCallback((empleadoId: number) => {
    console.log('usePersonalActions: Eliminando empleado con ID:', empleadoId);
    eliminarEmpleado(empleadoId);
    
    if (baseActions.empleadoSeleccionado?.id === empleadoId) {
      baseActions.setEmpleadoSeleccionado(null);
    }
    
    toast({
      title: "Personal eliminado",
      description: "El personal ha sido eliminado permanentemente.",
      variant: "destructive"
    });
  }, [eliminarEmpleado, baseActions, toast]);

  const handleBulkEliminar = useCallback((empleadoIds: number[]) => {
    console.log('usePersonalActions: Eliminación masiva de personal:', empleadoIds);
    empleadoIds.forEach(id => eliminarEmpleado(id));
    
    if (baseActions.empleadoSeleccionado && empleadoIds.includes(baseActions.empleadoSeleccionado.id)) {
      baseActions.setEmpleadoSeleccionado(null);
    }
    
    toast({
      title: "Personal eliminado",
      description: `Se han eliminado ${empleadoIds.length} empleado${empleadoIds.length !== 1 ? 's' : ''} permanentemente.`,
      variant: "destructive"
    });
  }, [eliminarEmpleado, baseActions, toast]);

  const handleBulkDeshabilitar = useCallback((empleadoIds: number[]) => {
    console.log('usePersonalActions: Inhabilitación masiva de personal:', empleadoIds);
    empleadoIds.forEach(id => deshabilitarEmpleado(id));
    
    if (baseActions.empleadoSeleccionado && empleadoIds.includes(baseActions.empleadoSeleccionado.id)) {
      const empleadoActualizado = empleados.find(emp => emp.id === baseActions.empleadoSeleccionado.id);
      if (empleadoActualizado) {
        baseActions.setEmpleadoSeleccionado({ ...empleadoActualizado, activo: false });
      }
    }
    
    toast({
      title: "Personal inhabilitado",
      description: `Se han inhabilitado ${empleadoIds.length} empleado${empleadoIds.length !== 1 ? 's' : ''}.`,
    });
  }, [deshabilitarEmpleado, baseActions, empleados, toast]);

  const handleUpdateEmpleado = useCallback((empleadoActualizado: Empleado) => {
    console.log('usePersonalActions: Actualizando empleado');
    baseActions.handleUpdateEmpleado(empleadoActualizado);
    
    // Sincronizar cambios de salario con gastos fijos
    setTimeout(() => {
      sincronizarSalariosGerenciaConGastosFijos();
    }, 100);
  }, [baseActions, sincronizarSalariosGerenciaConGastosFijos]);

  const handleAgregarGastoVariable = useCallback((gasto: any) => {
    if (!baseActions.empleadoSeleccionado) return;

    console.log('usePersonalActions: Agregando gasto variable');
    baseActions.handleAgregarGastoVariable(gasto);
    
    // Sincronizar gasto variable con gastos fijos
    const gastoConId = { ...gasto, id: Date.now() };
    sincronizarGastoVariableConGastosFijos(baseActions.empleadoSeleccionado.id, gastoConId);
  }, [baseActions, sincronizarGastoVariableConGastosFijos]);

  const handleAgregarCambioSalario = useCallback((empleadoId: number, nuevosSalarios: any) => {
    console.log('usePersonalActions: Agregando cambio de salario');
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
    handleUpdateEmpleado: handleUpdateEmpleado,
    handleAgregarGastoVariable,
    agregarCambioSalario: handleAgregarCambioSalario
  };
};
