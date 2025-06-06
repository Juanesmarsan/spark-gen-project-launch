
import { useState, useEffect } from 'react';

export interface GastoVariable {
  id: number;
  descripcion: string;
  importe: number;
  fecha: Date;
  categoria: string;
  empleadoId?: number;
  proyectoId?: number;
}

export const useGastosVariables = () => {
  const [gastosVariables, setGastosVariables] = useState<GastoVariable[]>([]);

  useEffect(() => {
    console.log('useGastosVariables: Cargando gastos variables desde localStorage...');
    
    try {
      const gastosGuardados = localStorage.getItem('gastosVariables');
      
      if (gastosGuardados) {
        const gastosParseados = JSON.parse(gastosGuardados);
        console.log('useGastosVariables: Datos encontrados:', gastosParseados.length);
        
        const gastosProcesados = gastosParseados.map((gasto: any) => ({
          ...gasto,
          fecha: new Date(gasto.fecha)
        }));
        
        setGastosVariables(gastosProcesados);
      } else {
        console.log('useGastosVariables: No se encontraron gastos en localStorage');
        setGastosVariables([]);
      }
    } catch (error) {
      console.error("Error al cargar gastos variables:", error);
      setGastosVariables([]);
    }
  }, []);

  return {
    gastosVariables
  };
};
