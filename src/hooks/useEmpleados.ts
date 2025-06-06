
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
    
    if (empleadosGuardados && empleadosGuardados.length > 0) {
      console.log('useEmpleados: Empleados cargados:', empleadosGuardados.length);
      
      // Filtrar Juan Garcia Lopez
      const empleadosFiltrados = empleadosGuardados.filter(emp => 
        !(emp.nombre === 'Juan' && emp.apellidos === 'García López')
      );
      
      // Verificar si Mohammed ya está en la lista
      const mohammedExists = empleadosFiltrados.some(emp => 
        emp.nombre === 'Mohammed' && emp.apellidos === 'Soumat Mehrroun'
      );
      
      if (!mohammedExists) {
        // Agregar Mohammed a los empleados existentes
        const mohammed = empleadosEjemplo.find(emp => 
          emp.nombre === 'Mohammed' && emp.apellidos === 'Soumat Mehrroun'
        );
        if (mohammed) {
          const empleadosActualizados = [...empleadosFiltrados, mohammed];
          setEmpleados(empleadosActualizados);
          guardarEmpleadosEnStorage(empleadosActualizados);
        } else {
          setEmpleados(empleadosFiltrados);
          guardarEmpleadosEnStorage(empleadosFiltrados);
        }
      } else {
        setEmpleados(empleadosFiltrados);
        if (empleadosFiltrados.length !== empleadosGuardados.length) {
          guardarEmpleadosEnStorage(empleadosFiltrados);
        }
      }
    } else {
      console.log('useEmpleados: Creando empleados de ejemplo');
      // Filtrar Juan Garcia Lopez de los ejemplos también
      const ejemplosFiltrados = empleadosEjemplo.filter(emp => 
        !(emp.nombre === 'Juan' && emp.apellidos === 'García López')
      );
      setEmpleados(ejemplosFiltrados);
      guardarEmpleadosEnStorage(ejemplosFiltrados);
    }
    
    setIsLoaded(true);
  }, [isLoaded]);

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
    deshabilitarEmpleado,
    habilitarEmpleado,
    agregarCambioSalario,
    agregarGastoVariable
  };
};
