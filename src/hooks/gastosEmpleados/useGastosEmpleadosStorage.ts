
import { useState, useEffect, useCallback } from 'react';
import { GastoEmpleadoProyecto } from '@/types/gastoEmpleado';

export const useGastosEmpleadosStorage = () => {
  const [gastosEmpleadosProyectos, setGastosEmpleadosProyectos] = useState<GastoEmpleadoProyecto[]>([]);

  // Cargar gastos desde localStorage
  useEffect(() => {
    console.log('useGastosEmpleadosStorage: Cargando gastos desde localStorage...');
    
    try {
      const gastosGuardados = localStorage.getItem('gastosEmpleadosProyectos');
      
      if (gastosGuardados) {
        const gastosParsedos = JSON.parse(gastosGuardados);
        const gastosProcesados = gastosParsedos.map((gasto: any) => ({
          ...gasto,
          fechaRegistro: new Date(gasto.fechaRegistro),
          gastos: gasto.gastos?.map((g: any) => ({
            ...g,
            fecha: new Date(g.fecha)
          })) || []
        }));
        
        setGastosEmpleadosProyectos(gastosProcesados);
      } else {
        console.log('useGastosEmpleadosStorage: No se encontraron gastos en localStorage');
        setGastosEmpleadosProyectos([]);
      }
    } catch (error) {
      console.error("Error al cargar gastos de empleados:", error);
      setGastosEmpleadosProyectos([]);
    }
  }, []);

  // Guardar en localStorage
  const guardarEnStorage = useCallback((gastosActualizados: GastoEmpleadoProyecto[]) => {
    try {
      const gastosParaGuardar = gastosActualizados.map(gasto => ({
        ...gasto,
        fechaRegistro: gasto.fechaRegistro.toISOString(),
        gastos: gasto.gastos.map(g => ({
          ...g,
          fecha: g.fecha.toISOString()
        }))
      }));
      
      localStorage.setItem('gastosEmpleadosProyectos', JSON.stringify(gastosParaGuardar));
      console.log('useGastosEmpleadosStorage: Gastos guardados correctamente');
    } catch (error) {
      console.error("Error al guardar gastos de empleados:", error);
    }
  }, []);

  return {
    gastosEmpleadosProyectos,
    setGastosEmpleadosProyectos,
    guardarEnStorage
  };
};
