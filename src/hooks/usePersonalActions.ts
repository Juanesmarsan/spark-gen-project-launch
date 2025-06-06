
import { useCallback } from "react";
import { Empleado } from "@/types/empleado";
import { useToast } from "@/hooks/use-toast";
import { useEmpleados } from "@/hooks/useEmpleados";
import { useGastosPersonalGerencia } from "@/hooks/useGastosPersonalGerencia";
import { useEmpleadoActionsBase } from "@/hooks/common/useEmpleadoActionsBase";

export const usePersonalActions = () => {
  console.log('usePersonalActions: Inicializando hook');
  
  const { toast } = useToast();
  const { empleados: todosEmpleados, agregarEmpleado, agregarCambioSalario } = useEmpleados();
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

  return {
    empleados,
    ...baseActions,
    handleAgregarEmpleado,
    handleUpdateEmpleado: handleUpdateEmpleado,
    handleAgregarGastoVariable,
    agregarCambioSalario
  };
};
