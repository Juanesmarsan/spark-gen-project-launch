
import { useCallback } from 'react';
import { Proyecto } from '@/types/proyecto';
import { useGastosFijos } from '../useGastosFijos';
import { useGastosPersonalGerencia } from '../useGastosPersonalGerencia';
import { useBeneficiosMensuales } from './useBeneficiosMensuales';

export const useAnalisisMensual = () => {
  const { calcularResumenSinPersonalGerencia } = useGastosFijos();
  const { empleadosGerencia } = useGastosPersonalGerencia();
  const { 
    calcularBeneficioMensualAdministracion, 
    calcularBeneficioMensualPresupuesto, 
    calcularGastosMensuales 
  } = useBeneficiosMensuales();

  const calcularAnalisisMensual = useCallback((proyectos: Proyecto[], año: number) => {
    const meses = Array.from({ length: 12 }, (_, i) => i + 1);
    
    return meses.map(mes => {
      const beneficiosBrutos = proyectos.map(proyecto => 
        proyecto.tipo === 'administracion' 
          ? calcularBeneficioMensualAdministracion(proyecto, mes, año)
          : calcularBeneficioMensualPresupuesto(proyecto, mes, año)
      );
      
      const gastosMensuales = proyectos.map(proyecto => 
        calcularGastosMensuales(proyecto, mes, año)
      );

      const beneficioBrutoTotal = beneficiosBrutos.reduce((sum, b) => sum + b, 0);
      const gastosTotal = gastosMensuales.reduce((sum, g) => sum + g, 0);
      
      // Agregar gastos fijos mensuales sin personal de gerencia para evitar duplicación
      const resumenGastosFijos = calcularResumenSinPersonalGerencia();
      const gastosFijosMensuales = resumenGastosFijos.totalBruto;
      
      // Agregar gastos de personal de gerencia del mes específico
      const gastosPersonalGerencia = empleadosGerencia.reduce((total, empleado) => {
        return total + (empleado.salarioBruto || 0) + (empleado.seguridadSocialEmpresa || 0) + (empleado.retenciones || 0);
      }, 0);
      
      const gastosTotalConFijos = gastosTotal + gastosFijosMensuales + gastosPersonalGerencia;
      const beneficioNeto = beneficioBrutoTotal - gastosTotalConFijos;

      return {
        mes,
        nombreMes: new Date(año, mes - 1).toLocaleDateString('es-ES', { month: 'long' }),
        beneficioBruto: beneficioBrutoTotal,
        gastos: gastosTotalConFijos,
        beneficioNeto,
        margen: beneficioBrutoTotal > 0 ? (beneficioNeto / beneficioBrutoTotal) * 100 : 0
      };
    });
  }, [calcularBeneficioMensualAdministracion, calcularBeneficioMensualPresupuesto, calcularGastosMensuales, calcularResumenSinPersonalGerencia, empleadosGerencia]);

  return {
    calcularAnalisisMensual
  };
};
