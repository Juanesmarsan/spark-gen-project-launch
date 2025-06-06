
import { useCallback } from "react";
import { Empleado } from "@/types/empleado";
import { useToast } from "@/hooks/use-toast";
import { useEmpleados } from "@/hooks/useEmpleados";
import { useEmpleadoActionsBase } from "@/hooks/common/useEmpleadoActionsBase";

export const useEmpleadosActions = () => {
  console.log('useEmpleadosActions: Inicializando hook');
  
  const { toast } = useToast();
  const { empleados: todosEmpleados, agregarEmpleado, agregarCambioSalario } = useEmpleados();
  
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

  return {
    empleados,
    ...baseActions,
    handleAgregarEmpleado,
    agregarCambioSalario
  };
};
