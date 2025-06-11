
import { useState, useEffect } from 'react';
import { VehiculoCompleto, GastoVehiculo } from '@/types/vehiculo';

const isValidDate = (dateString: any): boolean => {
  if (!dateString) return false;
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
};

const safeParseDate = (dateString: any): Date => {
  if (isValidDate(dateString)) {
    return new Date(dateString);
  }
  console.warn('Invalid date found, using current date as fallback:', dateString);
  return new Date();
};

export const useVehiculosGastos = () => {
  const [vehiculos, setVehiculos] = useState<VehiculoCompleto[]>([]);
  const [gastosVehiculos, setGastosVehiculos] = useState<GastoVehiculo[]>([]);

  // Cargar datos desde localStorage
  useEffect(() => {
    const vehiculosGuardados = localStorage.getItem('vehiculos');
    const gastosGuardados = localStorage.getItem('gastosVehiculos');
    
    if (vehiculosGuardados) {
      try {
        const vehiculosParseados = JSON.parse(vehiculosGuardados).map((v: any) => ({
          ...v,
          caducidadITV: safeParseDate(v.caducidadITV),
          caducidadSeguro: safeParseDate(v.caducidadSeguro),
          gastos: []
        }));
        setVehiculos(vehiculosParseados);
      } catch (error) {
        console.error('Error parsing vehicles from localStorage:', error);
        // Usar datos por defecto si hay error
        const vehiculosDefault: VehiculoCompleto[] = [
          {
            id: 1,
            matricula: "1234-ABC",
            tipo: "Furgoneta",
            marca: "Ford",
            modelo: "Transit",
            caducidadITV: new Date("2024-08-15"),
            caducidadSeguro: new Date("2024-12-31"),
            kilometros: 125000,
            asignado: false,
            gastos: []
          },
          {
            id: 2,
            matricula: "5678-DEF",
            tipo: "Camión",
            marca: "Mercedes",
            modelo: "Sprinter",
            caducidadITV: new Date("2024-11-20"),
            caducidadSeguro: new Date("2025-03-15"),
            kilometros: 89000,
            asignado: false,
            gastos: []
          }
        ];
        setVehiculos(vehiculosDefault);
      }
    } else {
      // Datos por defecto
      const vehiculosDefault: VehiculoCompleto[] = [
        {
          id: 1,
          matricula: "1234-ABC",
          tipo: "Furgoneta",
          marca: "Ford",
          modelo: "Transit",
          caducidadITV: new Date("2024-08-15"),
          caducidadSeguro: new Date("2024-12-31"),
          kilometros: 125000,
          asignado: false,
          gastos: []
        },
        {
          id: 2,
          matricula: "5678-DEF",
          tipo: "Camión",
          marca: "Mercedes",
          modelo: "Sprinter",
          caducidadITV: new Date("2024-11-20"),
          caducidadSeguro: new Date("2025-03-15"),
          kilometros: 89000,
          asignado: false,
          gastos: []
        }
      ];
      setVehiculos(vehiculosDefault);
    }

    if (gastosGuardados) {
      try {
        const gastosParseados = JSON.parse(gastosGuardados).map((g: any) => ({
          ...g,
          fecha: safeParseDate(g.fecha)
        }));
        setGastosVehiculos(gastosParseados);
      } catch (error) {
        console.error('Error parsing vehicle expenses from localStorage:', error);
        setGastosVehiculos([]);
      }
    }
  }, []);

  // Guardar en localStorage cuando cambien los datos
  useEffect(() => {
    if (vehiculos.length > 0) {
      localStorage.setItem('vehiculos', JSON.stringify(vehiculos));
    }
  }, [vehiculos]);

  useEffect(() => {
    localStorage.setItem('gastosVehiculos', JSON.stringify(gastosVehiculos));
  }, [gastosVehiculos]);

  const agregarVehiculo = (vehiculoData: Omit<VehiculoCompleto, 'id' | 'gastos'>) => {
    const nuevo: VehiculoCompleto = {
      ...vehiculoData,
      id: Date.now(),
      gastos: []
    };
    setVehiculos(prev => [...prev, nuevo]);
  };

  const editarVehiculo = (id: number, vehiculoData: Omit<VehiculoCompleto, 'id' | 'gastos'>) => {
    setVehiculos(prev => prev.map(v => 
      v.id === id ? { ...v, ...vehiculoData } : v
    ));
  };

  const eliminarVehiculo = (id: number) => {
    setVehiculos(prev => prev.filter(v => v.id !== id));
    setGastosVehiculos(prev => prev.filter(g => g.vehiculoId !== id));
  };

  const agregarGasto = (gastoData: Omit<GastoVehiculo, 'id'>) => {
    const nuevoGasto: GastoVehiculo = {
      ...gastoData,
      id: Date.now()
    };
    setGastosVehiculos(prev => [...prev, nuevoGasto]);
  };

  const editarGasto = (id: number, gastoData: Omit<GastoVehiculo, 'id'>) => {
    setGastosVehiculos(prev => prev.map(g =>
      g.id === id ? { ...g, ...gastoData } : g
    ));
  };

  const eliminarGasto = (id: number) => {
    setGastosVehiculos(prev => prev.filter(g => g.id !== id));
  };

  // Función para obtener gastos computables para gastos variables del mes
  const getGastosComputablesPorMes = (año: number, mes: number) => {
    return gastosVehiculos.filter(gasto => {
      const fechaGasto = new Date(gasto.fecha);
      return fechaGasto.getFullYear() === año && fechaGasto.getMonth() === mes;
    });
  };

  const getTotalGastosPorMes = (año: number, mes: number): number => {
    try {
      const gastosDelMes = getGastosComputablesPorMes(año, mes);
      return gastosDelMes.reduce((total, gasto) => total + (gasto.importe || 0), 0);
    } catch (error) {
      console.error('Error calculating monthly vehicle expenses:', error);
      return 0;
    }
  };

  return {
    vehiculos,
    gastosVehiculos,
    agregarVehiculo,
    editarVehiculo,
    eliminarVehiculo,
    agregarGasto,
    editarGasto,
    eliminarGasto,
    getGastosComputablesPorMes,
    getTotalGastosPorMes
  };
};
