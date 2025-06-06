
import { useCallback } from 'react';
import { Proyecto } from '@/types/proyecto';
import { useBeneficiosBrutos } from './beneficios/useBeneficiosBrutos';
import { useBeneficiosMensuales } from './beneficios/useBeneficiosMensuales';
import { useAnalisisMensual } from './beneficios/useAnalisisMensual';

export const useCalculosBeneficios = () => {
  const { calcularBeneficioBrutoAdministracion, calcularBeneficioBrutoPresupuesto } = useBeneficiosBrutos();
  const { calcularBeneficioMensualAdministracion, calcularBeneficioMensualPresupuesto, calcularGastosMensuales } = useBeneficiosMensuales();
  const { calcularAnalisisMensual } = useAnalisisMensual();

  const calcularGastosTotales = useCallback((proyecto: Proyecto) => {
    return proyecto.gastosVariables?.reduce((total, gasto) => total + gasto.importe, 0) || 0;
  }, []);

  const calcularBeneficioNeto = useCallback((proyecto: Proyecto) => {
    const beneficioBruto = proyecto.tipo === 'administracion' 
      ? calcularBeneficioBrutoAdministracion(proyecto)
      : calcularBeneficioBrutoPresupuesto(proyecto);
    
    const gastosTotales = calcularGastosTotales(proyecto);
    
    return beneficioBruto - gastosTotales;
  }, [calcularBeneficioBrutoAdministracion, calcularBeneficioBrutoPresupuesto, calcularGastosTotales]);

  const calcularMargenProyecto = useCallback((proyecto: Proyecto) => {
    const beneficioBruto = proyecto.tipo === 'administracion' 
      ? calcularBeneficioBrutoAdministracion(proyecto)
      : calcularBeneficioBrutoPresupuesto(proyecto);
    
    const beneficioNeto = calcularBeneficioNeto(proyecto);
    
    if (beneficioBruto === 0) return 0;
    
    return (beneficioNeto / beneficioBruto) * 100;
  }, [calcularBeneficioBrutoAdministracion, calcularBeneficioBrutoPresupuesto, calcularBeneficioNeto]);

  return {
    calcularBeneficioBrutoAdministracion,
    calcularBeneficioBrutoPresupuesto,
    calcularGastosTotales,
    calcularBeneficioNeto,
    calcularMargenProyecto,
    calcularAnalisisMensual,
    calcularBeneficioMensualAdministracion,
    calcularBeneficioMensualPresupuesto,
    calcularGastosMensuales
  };
};
