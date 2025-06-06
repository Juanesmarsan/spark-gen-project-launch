
import { useState, useEffect } from 'react';
import { Empleado, GastoVariableEmpleado } from '@/types/empleado';
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
      // Verificar si Mohammed ya está en la lista
      const mohammedExists = empleadosGuardados.some(emp => 
        emp.nombre === 'Mohammed' && emp.apellidos === 'Soumat Mehrroun'
      );
      
      if (!mohammedExists) {
        // Agregar Mohammed a los empleados existentes
        const mohammed = empleadosEjemplo.find(emp => 
          emp.nombre === 'Mohammed' && emp.apellidos === 'Soumat Mehrroun'
        );
        if (mohammed) {
          const empleadosActualizados = [...empleadosGuardados, mohammed];
          setEmpleados(empleadosActualizados);
          guardarEmpleadosEnStorage(empleadosActualizados);
        } else {
          setEmpleados(empleadosGuardados);
        }
      } else {
        setEmpleados(empleadosGuardados);
      }
    } else {
      console.log('useEmpleados: Creando empleados de ejemplo');
      setEmpleados(empleadosEjemplo);
      guardarEmpleadosEnStorage(empleadosEjemplo);
    }
    
    setIsLoaded(true);
  }, [isLoaded]);

  const agregarEmpleado = (nuevoEmpleadoData: Omit<Empleado, 'id' | 'adelantos' | 'epis' | 'herramientas' | 'documentos' | 'proyectos' | 'vehiculo' | 'gastosVariables'>) => {
    console.log('useEmpleados: Agregando empleado...');
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
    agregarGastoVariable
  };
};
