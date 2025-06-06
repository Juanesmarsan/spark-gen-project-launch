import { useState, useEffect } from 'react';
import { Empleado, GastoVariableEmpleado } from '@/types/empleado';

export const useEmpleados = () => {
  console.log("Inicializando hook useEmpleados");
  
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  console.log("Estado inicial - empleados:", empleados.length, "isLoaded:", isLoaded);

  // Cargar empleados desde localStorage al iniciar - solo una vez
  useEffect(() => {
    console.log("useEffect cargar empleados - isLoaded:", isLoaded);
    
    if (!isLoaded) {
      try {
        console.log("Cargando empleados desde localStorage...");
        const empleadosGuardados = localStorage.getItem('empleados');
        
        if (empleadosGuardados) {
          const empleadosParseados = JSON.parse(empleadosGuardados);
          console.log("Empleados cargados desde localStorage:", empleadosParseados);
          
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
          
          console.log("Empleados procesados:", empleadosProcesados);
          setEmpleados(empleadosProcesados);
        } else {
          console.log("No hay empleados guardados, creando empleado de ejemplo");
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
          setEmpleados([empleadoEjemplo]);
        }
        
        setIsLoaded(true);
        console.log("Carga de empleados completada");
      } catch (error) {
        console.error("Error al cargar empleados:", error);
        setIsLoaded(true); // Evitar bucle infinito
      }
    }
  }, [isLoaded]);

  // Guardar empleados en localStorage cuando cambien - solo si ya están cargados
  useEffect(() => {
    console.log("useEffect guardar empleados - isLoaded:", isLoaded, "empleados.length:", empleados.length);
    
    if (isLoaded && empleados.length > 0) {
      try {
        console.log("Guardando empleados en localStorage:", empleados);
        localStorage.setItem('empleados', JSON.stringify(empleados));
        console.log("Empleados guardados correctamente");
      } catch (error) {
        console.error("Error al guardar empleados:", error);
      }
    }
  }, [empleados, isLoaded]);

  const agregarEmpleado = (nuevoEmpleadoData: Omit<Empleado, 'id' | 'adelantos' | 'epis' | 'herramientas' | 'documentos' | 'proyectos' | 'vehiculo' | 'gastosVariables'>) => {
    console.log("Agregando nuevo empleado:", nuevoEmpleadoData);
    
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
    
    console.log("Empleado creado:", nuevoEmpleado);
    setEmpleados(prev => [...prev, nuevoEmpleado]);
    
    return nuevoEmpleado;
  };

  const updateEmpleado = (empleadoActualizado: Empleado) => {
    console.log("Actualizando empleado:", empleadoActualizado);
    setEmpleados(prev => prev.map(emp => 
      emp.id === empleadoActualizado.id ? empleadoActualizado : emp
    ));
  };

  const agregarGastoVariable = (empleadoId: number, gasto: Omit<GastoVariableEmpleado, 'id'>) => {
    console.log("Agregando gasto variable:", gasto);
    setEmpleados(prev => prev.map(emp => {
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
    }));
  };

  console.log("Hook useEmpleados completado - retornando:", { empleados: empleados.length });

  return {
    empleados,
    agregarEmpleado,
    updateEmpleado,
    agregarGastoVariable
  };
};
