
import { useState, useEffect } from 'react';
import { Empleado, Epi, Herramienta, Vehiculo } from '@/types/empleado';

export const useEmpleados = () => {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);

  // Cargar empleados desde localStorage al iniciar
  useEffect(() => {
    console.log("Cargando empleados desde localStorage...");
    const empleadosGuardados = localStorage.getItem('empleados');
    if (empleadosGuardados) {
      const empleadosParseados = JSON.parse(empleadosGuardados);
      console.log("Empleados cargados:", empleadosParseados);
      setEmpleados(empleadosParseados.map((emp: any) => ({
        ...emp,
        fechaIngreso: new Date(emp.fechaIngreso)
      })));
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
        adelantos: [],
        epis: [],
        herramientas: [],
        documentos: [],
        proyectos: [],
      };
      setEmpleados([empleadoEjemplo]);
    }
  }, []);

  // Guardar empleados en localStorage cuando cambien
  useEffect(() => {
    if (empleados.length > 0) {
      console.log("Guardando empleados en localStorage:", empleados);
      localStorage.setItem('empleados', JSON.stringify(empleados));
    }
  }, [empleados]);

  const agregarEmpleado = (nuevoEmpleadoData: Omit<Empleado, 'id' | 'adelantos' | 'epis' | 'herramientas' | 'documentos' | 'proyectos' | 'vehiculo'>) => {
    console.log("Agregando nuevo empleado:", nuevoEmpleadoData);
    
    const nuevoEmpleado: Empleado = {
      ...nuevoEmpleadoData,
      id: Date.now(),
      adelantos: [],
      epis: [],
      herramientas: [],
      documentos: [],
      proyectos: [],
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

  return {
    empleados,
    agregarEmpleado,
    updateEmpleado
  };
};
