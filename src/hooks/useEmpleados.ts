import { useState, useEffect } from 'react';
import { Empleado, GastoVariableEmpleado, HistorialSalario } from '@/types/empleado';
import { empleadosEjemplo } from '@/data/empleadosEjemplo';
import { cargarEmpleadosDesdeStorage, guardarEmpleadosEnStorage } from '@/utils/empleadosStorage';

export const useEmpleados = () => {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Cargar empleados desde localStorage solo una vez
  useEffect(() => {
    if (isLoaded) return;
    
    console.log('useEmpleados: Cargando empleados desde localStorage...');
    
    const empleadosGuardados = cargarEmpleadosDesdeStorage();
    
    // Solo cargar empleados de ejemplo si no hay datos guardados Y no se ha hecho reset
    const wasReset = localStorage.getItem('empleados-reset');
    
    if (empleadosGuardados === null && wasReset !== 'true') {
      console.log('useEmpleados: Primera carga, cargando empleados de ejemplo');
      setEmpleados(empleadosEjemplo);
      guardarEmpleadosEnStorage(empleadosEjemplo);
    } else if (empleadosGuardados !== null) {
      console.log('useEmpleados: Empleados cargados desde storage:', empleadosGuardados.length);
      setEmpleados(empleadosGuardados);
    } else {
      console.log('useEmpleados: Sistema reseteado, array vacío');
      setEmpleados([]);
    }
    
    setIsLoaded(true);
  }, [isLoaded]);

  const eliminarTodosEmpleados = () => {
    console.log('useEmpleados: Eliminando todos los empleados permanentemente...');
    setEmpleados([]);
    guardarEmpleadosEnStorage([]);
  };

  const resetearTodosEmpleados = () => {
    console.log('useEmpleados: Reseteando completamente todos los empleados...');
    setEmpleados([]);
    localStorage.removeItem('empleados');
    localStorage.setItem('empleados-reset', 'true');
  };

  const agregarEmpleado = (nuevoEmpleadoData: Omit<Empleado, 'id' | 'adelantos' | 'epis' | 'herramientas' | 'documentos' | 'proyectos' | 'vehiculo' | 'gastosVariables' | 'historialSalarios' | 'activo'>) => {
    console.log('useEmpleados: Agregando empleado...');
    
    const fechaActual = new Date();
    const mes = fechaActual.getMonth() + 1;
    const anio = fechaActual.getFullYear();
    
    const historialInicial: HistorialSalario = {
      id: Date.now(),
      mes,
      anio,
      salarioBruto: nuevoEmpleadoData.salarioBruto,
      seguridadSocialTrabajador: nuevoEmpleadoData.seguridadSocialTrabajador,
      seguridadSocialEmpresa: nuevoEmpleadoData.seguridadSocialEmpresa,
      retenciones: nuevoEmpleadoData.retenciones,
      embargo: nuevoEmpleadoData.embargo,
      fechaCambio: fechaActual
    };
    
    const nuevoEmpleado: Empleado = {
      ...nuevoEmpleadoData,
      id: Date.now(),
      departamento: nuevoEmpleadoData.departamento || 'operario',
      categoria: nuevoEmpleadoData.categoria || 'peon',
      precioHoraExtra: nuevoEmpleadoData.precioHoraExtra || 20,
      precioHoraFestiva: nuevoEmpleadoData.precioHoraFestiva || 25,
      adelantos: [],
      epis: [],
      herramientas: [],
      documentos: [],
      proyectos: [],
      gastosVariables: [],
      historialSalarios: [historialInicial],
      activo: true,
    };
    
    // Al agregar un empleado, quitar la marca de reset
    localStorage.removeItem('empleados-reset');
    
    const nuevosEmpleados = [...empleados, nuevoEmpleado];
    setEmpleados(nuevosEmpleados);
    guardarEmpleadosEnStorage(nuevosEmpleados);
    
    return nuevoEmpleado;
  };

  const updateEmpleado = (empleadoActualizado: Empleado) => {
    console.log('useEmpleados: Actualizando empleado...');
    const nuevosEmpleados = empleados.map(emp => 
      emp.id === empleadoActualizado.id ? empleadoActualizado : emp
    );
    setEmpleados(nuevosEmpleados);
    guardarEmpleadosEnStorage(nuevosEmpleados);
  };

  const eliminarEmpleado = (empleadoId: number) => {
    console.log('useEmpleados: Eliminando empleado...');
    const nuevosEmpleados = empleados.filter(emp => emp.id !== empleadoId);
    setEmpleados(nuevosEmpleados);
    guardarEmpleadosEnStorage(nuevosEmpleados);
  };

  const deshabilitarEmpleado = (empleadoId: number) => {
    console.log('useEmpleados: Deshabilitando empleado...');
    const nuevosEmpleados = empleados.map(emp => 
      emp.id === empleadoId ? { ...emp, activo: false } : emp
    );
    setEmpleados(nuevosEmpleados);
    guardarEmpleadosEnStorage(nuevosEmpleados);
  };

  const habilitarEmpleado = (empleadoId: number) => {
    console.log('useEmpleados: Habilitando empleado...');
    const nuevosEmpleados = empleados.map(emp => 
      emp.id === empleadoId ? { ...emp, activo: true } : emp
    );
    setEmpleados(nuevosEmpleados);
    guardarEmpleadosEnStorage(nuevosEmpleados);
  };

  const agregarCambioSalario = (empleadoId: number, nuevosSalarios: Omit<HistorialSalario, 'id' | 'fechaCambio'>) => {
    console.log('useEmpleados: Agregando cambio de salario...');
    const nuevosEmpleados = empleados.map(emp => {
      if (emp.id === empleadoId) {
        const nuevoCambio: HistorialSalario = {
          ...nuevosSalarios,
          id: Date.now(),
          fechaCambio: new Date()
        };
        
        return {
          ...emp,
          // Actualizar los datos principales del empleado con los nuevos valores
          salarioBruto: nuevosSalarios.salarioBruto,
          seguridadSocialTrabajador: nuevosSalarios.seguridadSocialTrabajador,
          seguridadSocialEmpresa: nuevosSalarios.seguridadSocialEmpresa,
          retenciones: nuevosSalarios.retenciones,
          embargo: nuevosSalarios.embargo,
          historialSalarios: [...(emp.historialSalarios || []), nuevoCambio]
        };
      }
      return emp;
    });
    setEmpleados(nuevosEmpleados);
    guardarEmpleadosEnStorage(nuevosEmpleados);
  };

  const agregarGastoVariable = (empleadoId: number, gasto: Omit<GastoVariableEmpleado, 'id'>) => {
    console.log('useEmpleados: Agregando gasto variable...');
    const nuevosEmpleados = empleados.map(emp => {
      if (emp.id === empleadoId) {
        const nuevoGasto: GastoVariableEmpleado = {
          ...gasto,
          id: Date.now()
        };
        return {
          ...emp,
          gastosVariables: [...(emp.gastosVariables || []), nuevoGasto]
        };
      }
      return emp;
    });
    setEmpleados(nuevosEmpleados);
    guardarEmpleadosEnStorage(nuevosEmpleados);
  };

  return {
    empleados,
    agregarEmpleado,
    updateEmpleado,
    eliminarEmpleado,
    eliminarTodosEmpleados,
    deshabilitarEmpleado,
    habilitarEmpleado,
    agregarCambioSalario,
    agregarGastoVariable,
    resetearTodosEmpleados
  };
};
