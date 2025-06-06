
import { useState, useEffect, useCallback } from 'react';
import { Proyecto, ProyectoFormData } from '@/types/proyecto';

export const useProyectos = () => {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Cargar proyectos desde localStorage
  useEffect(() => {
    if (isLoaded) return;
    
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
            fechaEntrada: trabajador.fechaEntrada && trabajador.fechaEntrada !== 'undefined' ? new Date(trabajador.fechaEntrada) : undefined,
            fechaSalida: trabajador.fechaSalida && trabajador.fechaSalida !== 'undefined' ? new Date(trabajador.fechaSalida) : undefined,
          })) || [],
          gastosVariables: proyecto.gastosVariables?.map((gasto: any) => ({
            ...gasto,
            fecha: new Date(gasto.fecha)
          })) || [],
        }));
        
        console.log('useProyectos: Proyectos procesados:', proyectosProcesados);
        proyectosProcesados.forEach((p: any, index: number) => {
          console.log(`Proyecto ${index + 1}: ${p.nombre} - ID: ${p.id} - Ciudad: ${p.ciudad}`);
        });
        
        setProyectos(proyectosProcesados);
      } else {
        console.log('useProyectos: No se encontraron proyectos en localStorage');
      }
      
      setIsLoaded(true);
    } catch (error) {
      console.error("Error al cargar proyectos:", error);
      setIsLoaded(true);
    }
  }, [isLoaded]);

  // Función para guardar en localStorage
  const saveToLocalStorage = useCallback((newProyectos: Proyecto[]) => {
    try {
      localStorage.setItem('proyectos', JSON.stringify(newProyectos));
      console.log('useProyectos: Proyectos guardados en localStorage');
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
    agregarCertificacion
  };
};
