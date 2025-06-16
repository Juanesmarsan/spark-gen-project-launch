
import { useCallback } from 'react';
import { GastoVariableEmpleado } from '@/types/empleado';
import { useProyectos } from './useProyectos';

export const useImputacionGastosProyectos = () => {
  const { proyectos, agregarGastoProyecto } = useProyectos();

  const imputarGastoAProyecto = useCallback((empleadoId: number, gastoEmpleado: GastoVariableEmpleado) => {
    console.log('useImputacionGastosProyectos: Buscando proyectos activos para empleado:', empleadoId);
    
    // Buscar proyectos donde el empleado esté asignado y el proyecto esté activo
    const proyectosDelEmpleado = proyectos.filter(proyecto => {
      const empleadoAsignado = proyecto.trabajadoresAsignados.some(trabajador => trabajador.id === empleadoId);
      const proyectoActivo = proyecto.estado === 'activo';
      
      // Verificar si las fechas coinciden (empleado trabajando en el proyecto en esa fecha)
      const fechaGasto = new Date(gastoEmpleado.fecha);
      const trabajadorAsignado = proyecto.trabajadoresAsignados.find(t => t.id === empleadoId);
      
      if (!trabajadorAsignado) return false;
      
      // Si tiene fecha de entrada, verificar que el gasto sea posterior
      const despuesFechaEntrada = !trabajadorAsignado.fechaEntrada || fechaGasto >= trabajadorAsignado.fechaEntrada;
      
      // Si tiene fecha de salida, verificar que el gasto sea anterior
      const antesFechaSalida = !trabajadorAsignado.fechaSalida || fechaGasto <= trabajadorAsignado.fechaSalida;
      
      return empleadoAsignado && proyectoActivo && despuesFechaEntrada && antesFechaSalida;
    });

    console.log('useImputacionGastosProyectos: Proyectos encontrados:', proyectosDelEmpleado.length);

    // Si hay exactamente un proyecto, imputar automáticamente
    if (proyectosDelEmpleado.length === 1) {
      const proyecto = proyectosDelEmpleado[0];
      console.log('useImputacionGastosProyectos: Imputando gasto automáticamente al proyecto:', proyecto.nombre);
      
      // Convertir el gasto de empleado a gasto de proyecto
      const gastoProyecto = {
        concepto: `${gastoEmpleado.concepto} - Empleado`,
        categoria: 'otro' as const,
        descripcion: gastoEmpleado.descripcion || `Gasto de ${gastoEmpleado.concepto}`,
        importe: gastoEmpleado.importe,
        fecha: gastoEmpleado.fecha,
        factura: `EMP-${empleadoId}-${gastoEmpleado.id}`
      };

      agregarGastoProyecto(proyecto.id, gastoProyecto);
      
      return {
        imputado: true,
        proyecto: proyecto.nombre
      };
    }

    // Si hay múltiples proyectos, devolver la lista para que el usuario elija
    if (proyectosDelEmpleado.length > 1) {
      console.log('useImputacionGastosProyectos: Múltiples proyectos encontrados, requiere selección manual');
      return {
        imputado: false,
        proyectosDisponibles: proyectosDelEmpleado.map(p => ({ id: p.id, nombre: p.nombre }))
      };
    }

    // Si no hay proyectos, el gasto permanece como gasto general del empleado
    console.log('useImputacionGastosProyectos: No se encontraron proyectos activos para imputar');
    return {
      imputado: false,
      proyectosDisponibles: []
    };
  }, [proyectos, agregarGastoProyecto]);

  const imputarGastoManual = useCallback((proyectoId: number, empleadoId: number, gastoEmpleado: GastoVariableEmpleado) => {
    console.log('useImputacionGastosProyectos: Imputación manual al proyecto:', proyectoId);
    
    const gastoProyecto = {
      concepto: `${gastoEmpleado.concepto} - Empleado`,
      categoria: 'otro' as const,
      descripcion: gastoEmpleado.descripcion || `Gasto de ${gastoEmpleado.concepto}`,
      importe: gastoEmpleado.importe,
      fecha: gastoEmpleado.fecha,
      factura: `EMP-${empleadoId}-${gastoEmpleado.id}`
    };

    agregarGastoProyecto(proyectoId, gastoProyecto);
  }, [agregarGastoProyecto]);

  return {
    imputarGastoAProyecto,
    imputarGastoManual
  };
};
