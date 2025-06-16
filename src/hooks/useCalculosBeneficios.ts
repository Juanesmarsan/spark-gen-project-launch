
import { useCallback } from 'react';
import { Proyecto } from '@/types/proyecto';
import { useBeneficiosBrutos } from './beneficios/useBeneficiosBrutos';
import { useBeneficiosMensuales } from './beneficios/useBeneficiosMensuales';
import { useAnalisisMensual } from './beneficios/useAnalisisMensual';
import { useGastosEmpleados } from './useGastosEmpleados';

export const useCalculosBeneficios = () => {
  const { calcularBeneficioBrutoAdministracion, calcularBeneficioBrutoPresupuesto } = useBeneficiosBrutos();
  const { calcularBeneficioMensualAdministracion, calcularBeneficioMensualPresupuesto, calcularGastosMensuales } = useBeneficiosMensuales();
  const { calcularAnalisisMensual } = useAnalisisMensual();
  const { obtenerGastosPorProyectoMes } = useGastosEmpleados();

  const calcularGastosTotales = useCallback((proyecto: Proyecto) => {
    // Gastos variables del proyecto
    const gastosVariables = proyecto.gastosVariables?.reduce((total, gasto) => total + gasto.importe, 0) || 0;
    
    // Gastos salariales acumulados de todos los meses
    const añoActual = new Date().getFullYear();
    let gastosSalarialesTotal = 0;
    
    for (let mes = 1; mes <= 12; mes++) {
      const gastosEmpleados = obtenerGastosPorProyectoMes(proyecto.id, mes, añoActual);
      gastosSalarialesTotal += gastosEmpleados.reduce((total, gastoEmpleado) => {
        return total + 
          gastoEmpleado.salarioBrutoProrrateo + 
          gastoEmpleado.seguridadSocialEmpresaProrrateo + 
          gastoEmpleado.importeHorasExtras + 
          gastoEmpleado.importeHorasFestivas +
          gastoEmpleado.gastos.reduce((subTotal, gasto) => subTotal + gasto.importe, 0);
      }, 0);
    }
    
    return gastosVariables + gastosSalarialesTotal;
  }, [obtenerGastosPorProyectoMes]);

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
