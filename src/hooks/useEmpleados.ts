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
    
    // Si hay menos empleados guardados que en los ejemplos, cargar los ejemplos completos
    if (!empleadosGuardados || empleadosGuardados.length < empleadosEjemplo.length) {
      console.log('useEmpleados: Cargando empleados de ejemplo completos');
      setEmpleados(empleadosEjemplo);
      guardarEmpleadosEnStorage(empleadosEjemplo);
    } else {
      console.log('useEmpleados: Empleados cargados desde storage:', empleadosGuardados.length);
      setEmpleados(empleadosGuardados);
    }
    
    setIsLoaded(true);
  }, [isLoaded]);

  const eliminarTodosEmpleados = () => {
    console.log('useEmpleados: Eliminando todos los empleados permanentemente...');
    setEmpleados([]);
    guardarEmpleadosEnStorage([]);
    // Forzar que no se recarguen los datos de ejemplo
    localStorage.setItem('empleados-reset', 'true');
  };

  const resetearTodosEmpleados = () => {
    console.log('useEmpleados: Reseteando completamente todos los empleados...');
    setEmpleados([]);
    localStorage.removeItem('empleados');
    localStorage.setItem('empleados-reset', 'true');
    // Forzar actualización del estado
    setIsLoaded(false);
    setTimeout(() => setIsLoaded(true), 100);
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
