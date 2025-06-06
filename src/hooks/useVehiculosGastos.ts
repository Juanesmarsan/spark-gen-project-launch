
import { useState, useEffect } from 'react';
import { VehiculoCompleto, GastoVehiculo } from '@/types/vehiculo';

export const useVehiculosGastos = () => {
  const [vehiculos, setVehiculos] = useState<VehiculoCompleto[]>([]);
  const [gastosVehiculos, setGastosVehiculos] = useState<GastoVehiculo[]>([]);

  // Cargar datos desde localStorage
  useEffect(() => {
    const vehiculosGuardados = localStorage.getItem('vehiculos');
    const gastosGuardados = localStorage.getItem('gastosVehiculos');
    
    if (vehiculosGuardados) {
      const vehiculosParseados = JSON.parse(vehiculosGuardados).map((v: any) => ({
        ...v,
        caducidadITV: new Date(v.caducidadITV),
        caducidadSeguro: new Date(v.caducidadSeguro),
        gastos: []
      }));
      setVehiculos(vehiculosParseados);
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
      const gastosParseados = JSON.parse(gastosGuardados).map((g: any) => ({
        ...g,
        fecha: new Date(g.fecha)
      }));
      setGastosVehiculos(gastosParseados);
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

  const getTotalGastosPorMes = (año: number, mes: number) => {
    const gastosDelMes = getGastosComputablesPorMes(año, mes);
    return gastosDelMes.reduce((total, gasto) => total + gasto.importe, 0);
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
