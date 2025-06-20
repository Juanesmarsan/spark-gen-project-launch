import { useState, useEffect, useCallback } from 'react';
import { Proyecto, ProyectoFormData } from '@/types/proyecto';

export const useProyectos = () => {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);

  // Cargar proyectos desde localStorage
  useEffect(() => {
    console.log('useProyectos: Cargando proyectos desde localStorage...');
    
    try {
      const proyectosGuardados = localStorage.getItem('proyectos');
      
      if (proyectosGuardados) {
        const proyectosParseados = JSON.parse(proyectosGuardados);
        console.log('useProyectos: Datos crudos encontrados:', proyectosParseados);
        console.log('useProyectos: Número de proyectos encontrados:', proyectosParseados.length);
        
        const proyectosProcesados = proyectosParseados.map((proyecto: any) => ({
          ...proyecto,
          fechaCreacion: new Date(proyecto.fechaCreacion),
          trabajadoresAsignados: proyecto.trabajadoresAsignados?.map((trabajador: any) => ({
            ...trabajador,
            fechaEntrada: trabajador.fechaEntrada && trabajador.fechaEntrada !== 'undefined' && trabajador.fechaEntrada !== null 
              ? new Date(trabajador.fechaEntrada) 
              : undefined,
            fechaSalida: trabajador.fechaSalida && trabajador.fechaSalida !== 'undefined' && trabajador.fechaSalida !== null 
              ? new Date(trabajador.fechaSalida) 
              : undefined,
          })) || [],
          gastosVariables: proyecto.gastosVariables?.map((gasto: any) => ({
            ...gasto,
            fecha: new Date(gasto.fecha)
          })) || [],
          certificaciones: proyecto.certificaciones?.map((cert: any) => ({
            ...cert,
            fechaRegistro: new Date(cert.fechaRegistro)
          })) || [],
        }));
        
        console.log('useProyectos: Proyectos procesados correctamente:', proyectosProcesados.length);
        setProyectos(proyectosProcesados);
      } else {
        console.log('useProyectos: No se encontraron proyectos en localStorage');
        setProyectos([]);
      }
    } catch (error) {
      console.error("Error al cargar proyectos:", error);
      setProyectos([]);
    }
  }, []); // Se ejecuta en cada montaje del componente

  // Función para guardar en localStorage
  const saveToLocalStorage = useCallback((newProyectos: Proyecto[]) => {
    try {
      // Procesar los datos antes de guardar para evitar problemas con las fechas
      const proyectosParaGuardar = newProyectos.map(proyecto => ({
        ...proyecto,
        fechaCreacion: proyecto.fechaCreacion.toISOString(),
        trabajadoresAsignados: proyecto.trabajadoresAsignados.map(trabajador => ({
          ...trabajador,
          fechaEntrada: trabajador.fechaEntrada ? trabajador.fechaEntrada.toISOString() : undefined,
          fechaSalida: trabajador.fechaSalida ? trabajador.fechaSalida.toISOString() : undefined,
        })),
        gastosVariables: proyecto.gastosVariables?.map(gasto => ({
          ...gasto,
          fecha: gasto.fecha.toISOString()
        })) || [],
        certificaciones: proyecto.certificaciones?.map(cert => ({
          ...cert,
          fechaRegistro: cert.fechaRegistro.toISOString()
        })) || [],
      }));
      
      localStorage.setItem('proyectos', JSON.stringify(proyectosParaGuardar));
      console.log('useProyectos: Proyectos guardados correctamente en localStorage');
    } catch (error) {
      console.error("Error al guardar proyectos:", error);
    }
  }, []);

  const agregarProyecto = useCallback((data: ProyectoFormData, empleados: any[]) => {
    console.log('useProyectos: Agregando proyecto...');
    const nuevoProyecto: Proyecto = {
      ...data,
      id: Date.now(),
      fechaCreacion: new Date(),
      trabajadoresAsignados: data.trabajadoresAsignados.map(empleadoId => {
        const empleado = empleados.find(e => e.id === empleadoId);
        const fechasTrabajador = data.trabajadoresConFechas?.find(t => t.id === empleadoId);
        
        return empleado ? {
          id: empleado.id,
          nombre: empleado.nombre,
          apellidos: empleado.apellidos,
          precioHora: data.tipo === 'administracion' ? data.precioHora : undefined,
          fechaEntrada: fechasTrabajador?.fechaEntrada,
          fechaSalida: fechasTrabajador?.fechaSalida
        } : { 
          id: empleadoId, 
          nombre: '', 
          apellidos: '',
          fechaEntrada: fechasTrabajador?.fechaEntrada,
          fechaSalida: fechasTrabajador?.fechaSalida
        };
      }),
      gastosVariables: [],
      certificaciones: []
    };

    const nuevosProyectos = [...proyectos, nuevoProyecto];
    setProyectos(nuevosProyectos);
    saveToLocalStorage(nuevosProyectos);
    
    return nuevoProyecto;
  }, [proyectos, saveToLocalStorage]);

  const updateProyecto = useCallback((proyectoActualizado: Proyecto) => {
    console.log('useProyectos: Actualizando proyecto...');
    const nuevosProyectos = proyectos.map(proyecto =>
      proyecto.id === proyectoActualizado.id ? proyectoActualizado : proyecto
    );
    setProyectos(nuevosProyectos);
    saveToLocalStorage(nuevosProyectos);
  }, [proyectos, saveToLocalStorage]);

  const eliminarProyecto = useCallback((id: number) => {
    console.log('useProyectos: Eliminando proyecto...');
    const nuevosProyectos = proyectos.filter(proyecto => proyecto.id !== id);
    setProyectos(nuevosProyectos);
    saveToLocalStorage(nuevosProyectos);
  }, [proyectos, saveToLocalStorage]);

  const agregarGastoProyecto = useCallback((proyectoId: number, gasto: any) => {
    console.log('useProyectos: Agregando gasto a proyecto...');
    const nuevosProyectos = proyectos.map(proyecto => {
      if (proyecto.id === proyectoId) {
        return {
          ...proyecto,
          gastosVariables: [...(proyecto.gastosVariables || []), { ...gasto, id: Date.now() }]
        };
      }
      return proyecto;
    });
    setProyectos(nuevosProyectos);
    saveToLocalStorage(nuevosProyectos);
  }, [proyectos, saveToLocalStorage]);

  const eliminarGastoProyecto = useCallback((proyectoId: number, gastoId: number) => {
    console.log('useProyectos: Eliminando gasto de proyecto...');
    const nuevosProyectos = proyectos.map(proyecto => {
      if (proyecto.id === proyectoId) {
        return {
          ...proyecto,
          gastosVariables: proyecto.gastosVariables?.filter(gasto => gasto.id !== gastoId) || []
        };
      }
      return proyecto;
    });
    setProyectos(nuevosProyectos);
    saveToLocalStorage(nuevosProyectos);
  }, [proyectos, saveToLocalStorage]);

  const agregarCertificacion = useCallback((proyectoId: number, certificacion: any) => {
    console.log('useProyectos: Agregando certificación a proyecto...');
    const nuevosProyectos = proyectos.map(proyecto => {
      if (proyecto.id === proyectoId) {
        return {
          ...proyecto,
          certificaciones: [...(proyecto.certificaciones || []), { 
            ...certificacion, 
            id: Date.now(),
            fechaRegistro: new Date()
          }]
        };
      }
      return proyecto;
    });
    setProyectos(nuevosProyectos);
    saveToLocalStorage(nuevosProyectos);
  }, [proyectos, saveToLocalStorage]);

  return {
    proyectos,
    agregarProyecto,
    updateProyecto,
    eliminarProyecto,
    agregarGastoProyecto,
    eliminarGastoProyecto,
    agregarCertificacion
  };
};
