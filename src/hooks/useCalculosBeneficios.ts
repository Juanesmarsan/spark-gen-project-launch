
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

  // Nuevas funciones para análisis mensual
  const calcularBeneficioMensualAdministracion = useCallback((proyecto: Proyecto, mes: number, año: number) => {
    if (proyecto.tipo !== 'administracion' || !proyecto.precioHora) {
      return 0;
    }

    let totalHoras = 0;

    proyecto.trabajadoresAsignados.forEach(trabajador => {
      const { generarCalendarioMes } = useCalendario(trabajador.id);
      const calendario = generarCalendarioMes(mes, año);
      
      calendario.dias.forEach(dia => {
        if (dia.tipo === 'laborable' || dia.tipo === 'sabado') {
          if (!dia.ausencia || !['vacaciones', 'baja_medica', 'baja_laboral', 'baja_personal'].includes(dia.ausencia.tipo)) {
            totalHoras += dia.horasReales || 0;
          }
        }
      });
    });

    return totalHoras * proyecto.precioHora;
  }, []);

  const calcularBeneficioMensualPresupuesto = useCallback((proyecto: Proyecto, mes: number, año: number) => {
    if (proyecto.tipo !== 'presupuesto') {
      return 0;
    }

    return proyecto.certificaciones?.find(cert => cert.mes === mes && cert.anio === año)?.importe || 0;
  }, []);

  const calcularGastosMensuales = useCallback((proyecto: Proyecto, mes: number, año: number) => {
    return proyecto.gastosVariables?.filter(gasto => {
      const fechaGasto = new Date(gasto.fecha);
      return fechaGasto.getMonth() + 1 === mes && fechaGasto.getFullYear() === año;
    }).reduce((total, gasto) => total + gasto.importe, 0) || 0;
  }, []);

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
      const beneficioNeto = beneficioBrutoTotal - gastosTotal;

      return {
        mes,
        nombreMes: new Date(año, mes - 1).toLocaleDateString('es-ES', { month: 'long' }),
        beneficioBruto: beneficioBrutoTotal,
        gastos: gastosTotal,
        beneficioNeto,
        margen: beneficioBrutoTotal > 0 ? (beneficioNeto / beneficioBrutoTotal) * 100 : 0
      };
    });
  }, [calcularBeneficioMensualAdministracion, calcularBeneficioMensualPresupuesto, calcularGastosMensuales]);

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
