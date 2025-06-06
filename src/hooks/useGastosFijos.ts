import { useState, useEffect } from 'react';
import { GastoFijo, ResumenGastosFijos } from '@/types/gastosFijos';
import { useEmpleados } from './useEmpleados';

export const useGastosFijos = () => {
  const [gastosFijos, setGastosFijos] = useState<GastoFijo[]>([]);
  const { empleados } = useEmpleados();

  // Cargar gastos fijos desde localStorage
  useEffect(() => {
    console.log("Cargando gastos fijos desde localStorage...");
    const gastosGuardados = localStorage.getItem('gastosFijos');
    if (gastosGuardados) {
      const gastosParseados = JSON.parse(gastosGuardados);
      setGastosFijos(gastosParseados);
      console.log("Gastos fijos cargados:", gastosParseados);
    } else {
      // Datos de ejemplo basados en la imagen
      const gastosEjemplo: GastoFijo[] = [
        { id: 1, concepto: "Salario y SS Jorge", totalBruto: 2200.00, baseImponible: 2200.00, tieneIva: false },
        { id: 2, concepto: "Dietas Gerencia", totalBruto: 800.00, baseImponible: 800.00, tieneIva: false },
        { id: 3, concepto: "Salarios Gerencia", totalBruto: 4600.00, baseImponible: 4600.00, tieneIva: false },
        { id: 4, concepto: "CoWorking", totalBruto: 30.00, baseImponible: 30.00, tieneIva: false },
        { id: 5, concepto: "Peugeot Rifter", totalBruto: 269.00, baseImponible: 212.51, tieneIva: true, iva: 56.49 },
        { id: 6, concepto: "retencion Esteban", totalBruto: 658.56, baseImponible: 658.56, tieneIva: false },
        { id: 7, concepto: "retencion Nuria", totalBruto: 448.76, baseImponible: 448.76, tieneIva: false },
        { id: 8, concepto: "SS Nuria", totalBruto: 973.42, baseImponible: 973.42, tieneIva: false },
        { id: 9, concepto: "Hilti", totalBruto: 250.00, baseImponible: 197.50, tieneIva: true, iva: 52.50 },
        { id: 10, concepto: "Autónomo", totalBruto: 387.00, baseImponible: 387.00, tieneIva: false },
        { id: 11, concepto: "Seguros privados", totalBruto: 200.00, baseImponible: 200.00, tieneIva: false },
        { id: 12, concepto: "Tarjetas Crédito", totalBruto: 6000.00, baseImponible: 4740.00, tieneIva: true, iva: 1260.00 },
        { id: 13, concepto: "Nalanda", totalBruto: 210.00, baseImponible: 210.00, tieneIva: true },
        { id: 14, concepto: "Telefono/Internet", totalBruto: 350.00, baseImponible: 289.25, tieneIva: true, iva: 60.75 },
        { id: 15, concepto: "Asesoria Laboral", totalBruto: 400.00, baseImponible: 377.60, tieneIva: true, iva: 22.40 },
        { id: 16, concepto: "Seguros Vida", totalBruto: 164.00, baseImponible: 164.00, tieneIva: false },
        { id: 17, concepto: "Hipoteca de locales", totalBruto: 497.00, baseImponible: 497.00, tieneIva: false },
        { id: 18, concepto: "Alquiler Puzol", totalBruto: 700.00, baseImponible: 700.00, tieneIva: false },
        { id: 19, concepto: "Asesoria financiera", totalBruto: 605.00, baseImponible: 500.00, tieneIva: true, iva: 105.00 },
        { id: 20, concepto: "Seguro Autónmo", totalBruto: 62.50, baseImponible: 62.50, tieneIva: false },
        { id: 21, concepto: "alquiler coche", totalBruto: 657.00, baseImponible: 542.90, tieneIva: true, iva: 114.10 },
        { id: 22, concepto: "seguro cajamar vida", totalBruto: 29.00, baseImponible: 29.00, tieneIva: false }
      ];
      setGastosFijos(gastosEjemplo);
    }
  }, []);

  // Guardar gastos fijos en localStorage cuando cambien
  useEffect(() => {
    if (gastosFijos.length > 0) {
      console.log("Guardando gastos fijos en localStorage:", gastosFijos);
      localStorage.setItem('gastosFijos', JSON.stringify(gastosFijos));
    }
  }, [gastosFijos]);

  const agregarGasto = (gasto: Omit<GastoFijo, 'id'>) => {
    const nuevoGasto: GastoFijo = {
      ...gasto,
      id: Date.now()
    };
    setGastosFijos(prev => [...prev, nuevoGasto]);
  };

  const actualizarGasto = (gastoActualizado: GastoFijo) => {
    setGastosFijos(prev => prev.map(gasto => 
      gasto.id === gastoActualizado.id ? gastoActualizado : gasto
    ));
  };

  const eliminarGasto = (id: number) => {
    setGastosFijos(prev => prev.filter(gasto => gasto.id !== id));
  };

  const calcularResumen = (): ResumenGastosFijos => {
    const totalBruto = gastosFijos.reduce((sum, gasto) => sum + gasto.totalBruto, 0);
    const totalBaseImponible = gastosFijos.reduce((sum, gasto) => sum + gasto.baseImponible, 0);
    
    // Contar operarios (empleados con departamento 'operario')
    const numeroOperarios = empleados.filter(emp => emp.departamento === 'operario').length;
    const coeficienteEmpresa = numeroOperarios > 0 ? totalBruto / numeroOperarios : 0;
    
    // Calcular coeficiente diario (asumiendo 30 días por mes)
    const coeficienteEmpresaDiario = coeficienteEmpresa / 30;

    return {
      totalBruto,
      totalBaseImponible,
      coeficienteEmpresa,
      coeficienteEmpresaDiario,
      numeroOperarios
    };
  };

  return {
    gastosFijos,
    agregarGasto,
    actualizarGasto,
    eliminarGasto,
    calcularResumen
  };
};
