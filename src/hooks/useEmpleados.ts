
import { useState, useEffect } from 'react';
import { Empleado, GastoVariableEmpleado } from '@/types/empleado';

export const useEmpleados = () => {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Cargar empleados desde localStorage solo una vez
  useEffect(() => {
    if (isLoaded) return;
    
    console.log('useEmpleados: Cargando empleados desde localStorage...');
    
    try {
      const empleadosGuardados = localStorage.getItem('empleados');
      
      if (empleadosGuardados) {
        const empleadosParseados = JSON.parse(empleadosGuardados);
        const empleadosProcesados = empleadosParseados.map((emp: any) => ({
          ...emp,
          fechaIngreso: new Date(emp.fechaIngreso),
          departamento: emp.departamento || 'operario',
          categoria: emp.categoria || 'peon',
          precioHoraExtra: emp.precioHoraExtra || 20,
          precioHoraFestiva: emp.precioHoraFestiva || 25,
          gastosVariables: emp.gastosVariables?.map((gasto: any) => ({
            ...gasto,
            fecha: new Date(gasto.fecha)
          })) || [],
        }));
        
        console.log('useEmpleados: Empleados cargados:', empleadosProcesados.length);
        setEmpleados(empleadosProcesados);
      } else {
        // Datos de ejemplo si no hay empleados
        const empleadoEjemplo: Empleado = {
          id: 1,
          nombre: "Juan",
          apellidos: "García López",
          dni: "12345678A",
          telefono: "666123456",
          email: "juan.garcia@empresa.com",
          direccion: "Calle Principal 123, Madrid",
          fechaIngreso: new Date("2023-01-15"),
          salarioBruto: 2500,
          seguridadSocialTrabajador: 150,
          seguridadSocialEmpresa: 750,
          retenciones: 375,
          embargo: 0,
          departamento: 'operario',
          categoria: 'oficial_2',
          precioHoraExtra: 20,
          precioHoraFestiva: 25,
          adelantos: [],
          epis: [],
          herramientas: [],
          documentos: [],
          proyectos: [],
          gastosVariables: [],
        };
        console.log('useEmpleados: Creando empleado de ejemplo');
        setEmpleados([empleadoEjemplo]);
      }
      
      setIsLoaded(true);
    } catch (error) {
      console.error("Error al cargar empleados:", error);
      setIsLoaded(true);
    }
  }, [isLoaded]);

  // Función para guardar en localStorage
  const saveToLocalStorage = (newEmpleados: Empleado[]) => {
    try {
      localStorage.setItem('empleados', JSON.stringify(newEmpleados));
      console.log('useEmpleados: Empleados guardados en localStorage');
    } catch (error) {
      console.error("Error al guardar empleados:", error);
    }
  };

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
    saveToLocalStorage(nuevosEmpleados);
    
    return nuevoEmpleado;
  };

  const updateEmpleado = (empleadoActualizado: Empleado) => {
    console.log('useEmpleados: Actualizando empleado...');
    const nuevosEmpleados = empleados.map(emp => 
      emp.id === empleadoActualizado.id ? empleadoActualizado : emp
    );
    setEmpleados(nuevosEmpleados);
    saveToLocalStorage(nuevosEmpleados);
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
    saveToLocalStorage(nuevosEmpleados);
  };

  return {
    empleados,
    agregarEmpleado,
    updateEmpleado,
    agregarGastoVariable
  };
};
