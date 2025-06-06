
import { useCallback } from 'react';
import { Proyecto } from '@/types/proyecto';
import { useCalendario } from './useCalendario';

export const useCalculosBeneficios = () => {
  const calcularBeneficioBrutoAdministracion = useCallback((proyecto: Proyecto) => {
    if (proyecto.tipo !== 'administracion' || !proyecto.precioHora) {
      return 0;
    }

    let totalHoras = 0;

    // Para cada trabajador asignado al proyecto
    proyecto.trabajadoresAsignados.forEach(trabajador => {
      // Crear instancia del hook para cada empleado
      const { generarCalendarioMes } = useCalendario(trabajador.id);
      
      // Por ahora, calculamos para el año actual
      const añoActual = new Date().getFullYear();
      
      // Iterar sobre todos los meses del año
      for (let mes = 1; mes <= 12; mes++) {
        const calendario = generarCalendarioMes(mes, añoActual);
        
        calendario.dias.forEach(dia => {
          // Solo contar días trabajados (excluir vacaciones y bajas)
          if (dia.tipo === 'laborable' || dia.tipo === 'sabado') {
            // Verificar que no hay ausencias que excluyan las horas
            if (!dia.ausencia || !['vacaciones', 'baja_medica', 'baja_laboral', 'baja_personal'].includes(dia.ausencia.tipo)) {
              totalHoras += dia.horasReales || 0;
            }
          }
        });
      }
    });

    return totalHoras * proyecto.precioHora;
  }, []);

  const calcularBeneficioBrutoPresupuesto = useCallback((proyecto: Proyecto) => {
    if (proyecto.tipo !== 'presupuesto') {
      return 0;
    }

    // Para proyectos por presupuesto, el beneficio es la suma de certificaciones
    return proyecto.certificaciones?.reduce((total, cert) => total + cert.importe, 0) || 0;
  }, []);

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
    calcularMargenProyecto
  };
};
