
import { useState, useEffect, useCallback } from 'react';
import { Empleado, EmpleadoFormData, GastoVariableEmpleado, CambioSalario } from '@/types/empleado';

export const useEmpleados = () => {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);

  // Cargar empleados desde localStorage
  useEffect(() => {
    console.log('useEmpleados: Cargando empleados desde localStorage...');
    
    try {
      const empleadosGuardados = localStorage.getItem('empleados');
      
      if (empleadosGuardados) {
        const empleadosParseados = JSON.parse(empleadosGuardados);
        const empleadosProcesados = empleadosParseados.map((empleado: any) => ({
          ...empleado,
          fechaIngreso: new Date(empleado.fechaIngreso),
          fechaAlta: empleado.fechaAlta ? new Date(empleado.fechaAlta) : new Date(empleado.fechaIngreso || Date.now()),
          fechaBaja: empleado.fechaBaja ? new Date(empleado.fechaBaja) : undefined,
          adelantos: empleado.adelantos?.map((adelanto: any) => ({
            ...adelanto,
            fecha: new Date(adelanto.fecha)
          })) || [],
          gastosVariables: empleado.gastosVariables?.map((gasto: any) => ({
            ...gasto,
            fecha: new Date(gasto.fecha)
          })) || [],
          cambiosSalario: empleado.cambiosSalario?.map((cambio: any) => ({
            ...cambio,
            fechaCambio: new Date(cambio.fechaCambio)
          })) || [],
          episAsignados: empleado.episAsignados || [],
          herramientasAsignadas: empleado.herramientasAsignadas || [],
          vehiculosAsignados: empleado.vehiculosAsignados || [],
          epis: empleado.epis || empleado.episAsignados || [],
          herramientas: empleado.herramientas || empleado.herramientasAsignadas || [],
          documentos: empleado.documentos || [],
          proyectos: empleado.proyectos || [],
          historialSalarios: empleado.historialSalarios || []
        }));
        
        console.log('useEmpleados: Empleados cargados desde storage:', empleadosProcesados.length);
        setEmpleados(empleadosProcesados);
      } else {
        console.log('useEmpleados: No se encontraron empleados en localStorage');
        setEmpleados([]);
      }
    } catch (error) {
      console.error("Error al cargar empleados:", error);
      setEmpleados([]);
    }
  }, []);

  // Función para guardar en localStorage
  const saveToLocalStorage = useCallback((newEmpleados: Empleado[]) => {
    try {
      const empleadosParaGuardar = newEmpleados.map(empleado => ({
        ...empleado,
        fechaIngreso: empleado.fechaIngreso.toISOString(),
        fechaAlta: empleado.fechaAlta.toISOString(),
        fechaBaja: empleado.fechaBaja ? empleado.fechaBaja.toISOString() : undefined,
        adelantos: empleado.adelantos?.map(adelanto => ({
          ...adelanto,
          fecha: adelanto.fecha.toISOString()
        })) || [],
        gastosVariables: empleado.gastosVariables?.map(gasto => ({
          ...gasto,
          fecha: gasto.fecha.toISOString()
        })) || [],
        cambiosSalario: empleado.cambiosSalario?.map(cambio => ({
          ...cambio,
          fechaCambio: cambio.fechaCambio.toISOString()
        })) || [],
      }));
      
      localStorage.setItem('empleados', JSON.stringify(empleadosParaGuardar));
      console.log('useEmpleados: Empleados guardados correctamente en localStorage');
    } catch (error) {
      console.error("Error al guardar empleados:", error);
    }
  }, []);

  const agregarEmpleado = useCallback((data: EmpleadoFormData) => {
    console.log('useEmpleados: Agregando empleado...');
    const nuevoEmpleado: Empleado = {
      ...data,
      id: Date.now(),
      fechaAlta: new Date(),
      activo: true,
      adelantos: [],
      gastosVariables: [],
      cambiosSalario: [],
      episAsignados: [],
      herramientasAsignadas: [],
      vehiculosAsignados: [],
      epis: [],
      herramientas: [],
      documentos: [],
      proyectos: [],
      historialSalarios: []
    };

    const nuevosEmpleados = [...empleados, nuevoEmpleado];
    setEmpleados(nuevosEmpleados);
    saveToLocalStorage(nuevosEmpleados);
    
    return nuevoEmpleado;
  }, [empleados, saveToLocalStorage]);

  const updateEmpleado = useCallback((empleadoActualizado: Empleado) => {
    console.log('useEmpleados: Actualizando empleado...');
    const nuevosEmpleados = empleados.map(empleado =>
      empleado.id === empleadoActualizado.id ? empleadoActualizado : empleado
    );
    setEmpleados(nuevosEmpleados);
    saveToLocalStorage(nuevosEmpleados);
  }, [empleados, saveToLocalStorage]);

  const eliminarEmpleado = useCallback((id: number) => {
    console.log('useEmpleados: Eliminando empleado...');
    const nuevosEmpleados = empleados.filter(empleado => empleado.id !== id);
    setEmpleados(nuevosEmpleados);
    saveToLocalStorage(nuevosEmpleados);
  }, [empleados, saveToLocalStorage]);

  const eliminarTodosEmpleados = useCallback(() => {
    console.log('useEmpleados: Eliminando todos los empleados...');
    setEmpleados([]);
    saveToLocalStorage([]);
  }, [saveToLocalStorage]);

  const resetearTodosEmpleados = useCallback(() => {
    console.log('useEmpleados: Reseteando todos los empleados...');
    setEmpleados([]);
    saveToLocalStorage([]);
  }, [saveToLocalStorage]);

  const agregarAdelanto = useCallback((empleadoId: number, concepto: string, cantidad: number) => {
    console.log('useEmpleados: Agregando adelanto...');
    const nuevosEmpleados = empleados.map(empleado => {
      if (empleado.id === empleadoId) {
        return {
          ...empleado,
          adelantos: [...empleado.adelantos, {
            id: Date.now(),
            concepto,
            cantidad,
            fecha: new Date()
          }]
        };
      }
      return empleado;
    });
    setEmpleados(nuevosEmpleados);
    saveToLocalStorage(nuevosEmpleados);
  }, [empleados, saveToLocalStorage]);

  const agregarGastoVariable = useCallback((empleadoId: number, gasto: Omit<GastoVariableEmpleado, 'id'>) => {
    console.log('useEmpleados: Agregando gasto variable...', { empleadoId, gasto });
    
    const nuevoGasto: GastoVariableEmpleado = {
      ...gasto,
      id: Date.now()
    };

    const nuevosEmpleados = empleados.map(empleado => {
      if (empleado.id === empleadoId) {
        const gastosActualizados = [...(empleado.gastosVariables || []), nuevoGasto];
        console.log('useEmpleados: Gastos actualizados para empleado:', gastosActualizados);
        
        return {
          ...empleado,
          gastosVariables: gastosActualizados
        };
      }
      return empleado;
    });
    
    setEmpleados(nuevosEmpleados);
    saveToLocalStorage(nuevosEmpleados);
    console.log('useEmpleados: Gasto variable agregado correctamente');
  }, [empleados, saveToLocalStorage]);

  const agregarCambioSalario = useCallback((empleadoId: number, cambio: Omit<CambioSalario, 'id'>) => {
    console.log('useEmpleados: Agregando cambio de salario...');
    const nuevosEmpleados = empleados.map(empleado => {
      if (empleado.id === empleadoId) {
        const nuevoEmpleado = {
          ...empleado,
          // Actualizar salario actual
          salarioBruto: cambio.nuevoSalarioBruto,
          seguridadSocialTrabajador: cambio.nuevaSeguridadSocialTrabajador,
          seguridadSocialEmpresa: cambio.nuevaSeguridadSocialEmpresa,
          retenciones: cambio.nuevasRetenciones,
          embargo: cambio.nuevoEmbargo,
          precioHoraExtra: cambio.nuevoPrecioHoraExtra,
          precioHoraFestiva: cambio.nuevoPrecioHoraFestiva,
          // Agregar al historial
          cambiosSalario: [...empleado.cambiosSalario, {
            ...cambio,
            id: Date.now(),
            fechaCambio: new Date()
          }]
        };
        return nuevoEmpleado;
      }
      return empleado;
    });
    setEmpleados(nuevosEmpleados);
    saveToLocalStorage(nuevosEmpleados);
  }, [empleados, saveToLocalStorage]);

  const deshabilitarEmpleado = useCallback((id: number) => {
    console.log('useEmpleados: Deshabilitando empleado...');
    const nuevosEmpleados = empleados.map(empleado =>
      empleado.id === id ? { ...empleado, activo: false, fechaBaja: new Date() } : empleado
    );
    setEmpleados(nuevosEmpleados);
    saveToLocalStorage(nuevosEmpleados);
  }, [empleados, saveToLocalStorage]);

  const habilitarEmpleado = useCallback((id: number) => {
    console.log('useEmpleados: Habilitando empleado...');
    const nuevosEmpleados = empleados.map(empleado =>
      empleado.id === id ? { ...empleado, activo: true, fechaBaja: undefined } : empleado
    );
    setEmpleados(nuevosEmpleados);
    saveToLocalStorage(nuevosEmpleados);
  }, [empleados, saveToLocalStorage]);

  return {
    empleados,
    agregarEmpleado,
    updateEmpleado,
    eliminarEmpleado,
    agregarAdelanto,
    agregarGastoVariable,
    agregarCambioSalario,
    eliminarTodosEmpleados,
    resetearTodosEmpleados,
    deshabilitarEmpleado,
    habilitarEmpleado
  };
};
