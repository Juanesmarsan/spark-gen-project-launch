
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
        // Empleados de ejemplo basados en la imagen
        const empleadosEjemplo: Empleado[] = [
          {
            id: 1,
            nombre: "Jorge",
            apellidos: "",
            dni: "",
            telefono: "",
            email: "",
            direccion: "",
            fechaIngreso: new Date("2023-01-15"),
            salarioBruto: 0,
            seguridadSocialTrabajador: 0,
            seguridadSocialEmpresa: 0,
            retenciones: 0,
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
          },
          {
            id: 2,
            nombre: "Kevin",
            apellidos: "",
            dni: "",
            telefono: "",
            email: "",
            direccion: "",
            fechaIngreso: new Date("2023-01-15"),
            salarioBruto: 0,
            seguridadSocialTrabajador: 0,
            seguridadSocialEmpresa: 0,
            retenciones: 0,
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
          },
          {
            id: 3,
            nombre: "Anthony",
            apellidos: "Bladimir",
            dni: "",
            telefono: "",
            email: "",
            direccion: "",
            fechaIngreso: new Date("2023-01-15"),
            salarioBruto: 0,
            seguridadSocialTrabajador: 0,
            seguridadSocialEmpresa: 0,
            retenciones: 0,
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
          },
          {
            id: 4,
            nombre: "Eduardo",
            apellidos: "",
            dni: "",
            telefono: "",
            email: "",
            direccion: "",
            fechaIngreso: new Date("2023-01-15"),
            salarioBruto: 0,
            seguridadSocialTrabajador: 0,
            seguridadSocialEmpresa: 0,
            retenciones: 0,
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
          },
          {
            id: 5,
            nombre: "Javi",
            apellidos: "Calvo",
            dni: "",
            telefono: "",
            email: "",
            direccion: "",
            fechaIngreso: new Date("2023-01-15"),
            salarioBruto: 0,
            seguridadSocialTrabajador: 0,
            seguridadSocialEmpresa: 0,
            retenciones: 0,
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
          },
          {
            id: 6,
            nombre: "Cristian",
            apellidos: "",
            dni: "",
            telefono: "",
            email: "",
            direccion: "",
            fechaIngreso: new Date("2023-01-15"),
            salarioBruto: 0,
            seguridadSocialTrabajador: 0,
            seguridadSocialEmpresa: 0,
            retenciones: 0,
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
          },
          {
            id: 7,
            nombre: "Arvey",
            apellidos: "",
            dni: "",
            telefono: "",
            email: "",
            direccion: "",
            fechaIngreso: new Date("2023-01-15"),
            salarioBruto: 0,
            seguridadSocialTrabajador: 0,
            seguridadSocialEmpresa: 0,
            retenciones: 0,
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
          },
          {
            id: 8,
            nombre: "Pedro",
            apellidos: "B",
            dni: "",
            telefono: "",
            email: "",
            direccion: "",
            fechaIngreso: new Date("2023-01-15"),
            salarioBruto: 0,
            seguridadSocialTrabajador: 0,
            seguridadSocialEmpresa: 0,
            retenciones: 0,
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
          },
          {
            id: 9,
            nombre: "Jesús",
            apellidos: "",
            dni: "",
            telefono: "",
            email: "",
            direccion: "",
            fechaIngreso: new Date("2023-01-15"),
            salarioBruto: 0,
            seguridadSocialTrabajador: 0,
            seguridadSocialEmpresa: 0,
            retenciones: 0,
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
          },
          {
            id: 10,
            nombre: "Vicente",
            apellidos: "De Dios",
            dni: "",
            telefono: "",
            email: "",
            direccion: "",
            fechaIngreso: new Date("2023-01-15"),
            salarioBruto: 0,
            seguridadSocialTrabajador: 0,
            seguridadSocialEmpresa: 0,
            retenciones: 0,
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
          },
          {
            id: 11,
            nombre: "Alberto",
            apellidos: "",
            dni: "",
            telefono: "",
            email: "",
            direccion: "",
            fechaIngreso: new Date("2023-01-15"),
            salarioBruto: 0,
            seguridadSocialTrabajador: 0,
            seguridadSocialEmpresa: 0,
            retenciones: 0,
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
          },
          {
            id: 12,
            nombre: "Italo",
            apellidos: "",
            dni: "",
            telefono: "",
            email: "",
            direccion: "",
            fechaIngreso: new Date("2023-01-15"),
            salarioBruto: 0,
            seguridadSocialTrabajador: 0,
            seguridadSocialEmpresa: 0,
            retenciones: 0,
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
          },
          {
            id: 13,
            nombre: "Moha",
            apellidos: "",
            dni: "",
            telefono: "",
            email: "",
            direccion: "",
            fechaIngreso: new Date("2023-01-15"),
            salarioBruto: 0,
            seguridadSocialTrabajador: 0,
            seguridadSocialEmpresa: 0,
            retenciones: 0,
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
          }
        ];
        
        console.log('useEmpleados: Creando empleados de ejemplo');
        setEmpleados(empleadosEjemplo);
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
