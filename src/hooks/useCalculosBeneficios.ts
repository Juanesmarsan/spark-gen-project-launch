
import { useCallback } from 'react';
import { Proyecto } from '@/types/proyecto';
import { generarCalendarioMesPuro } from '@/utils/calendarioUtils';

export const useCalculosBeneficios = () => {
  const calcularBeneficioBrutoAdministracion = useCallback((proyecto: Proyecto) => {
    if (proyecto.tipo !== 'administracion' || !proyecto.precioHora) {
      return 0;
    }

    let totalHoras = 0;
    const añoActual = new Date().getFullYear();

    // Para cada trabajador asignado al proyecto
    proyecto.trabajadoresAsignados.forEach(trabajador => {
      // Determinar el rango de meses a considerar para este trabajador
      const fechaEntrada = trabajador.fechaEntrada || new Date(añoActual, 0, 1); // Si no hay fecha de entrada, usar inicio de año
      const fechaSalida = trabajador.fechaSalida || new Date(añoActual, 11, 31); // Si no hay fecha de salida, usar fin de año
      
      const mesInicio = Math.max(1, fechaEntrada.getMonth() + 1);
      const mesFin = Math.min(12, fechaSalida.getMonth() + 1);
      const añoInicio = fechaEntrada.getFullYear();
      const añoFin = fechaSalida.getFullYear();

      // Solo calcular si el trabajador estuvo activo en el año actual
      if (añoFin >= añoActual && añoInicio <= añoActual) {
        const mesInicioReal = añoInicio === añoActual ? mesInicio : 1;
        const mesFinReal = añoFin === añoActual ? mesFin : 12;

        // Iterar sobre los meses en que el trabajador estuvo activo
        for (let mes = mesInicioReal; mes <= mesFinReal; mes++) {
          const calendario = generarCalendarioMesPuro(trabajador.id, mes, añoActual);
          
          calendario.dias.forEach(dia => {
            const fechaDia = new Date(añoActual, mes - 1, dia.fecha.getDate());
            
            // Solo contar días dentro del período de trabajo del empleado
            if (fechaDia >= fechaEntrada && fechaDia <= fechaSalida) {
              // Solo contar días laborables y sábados sin ausencias que impidan trabajar
              if (dia.tipo === 'laborable' || dia.tipo === 'sabado') {
                if (!dia.ausencia || !['vacaciones', 'baja_medica', 'baja_laboral', 'baja_personal'].includes(dia.ausencia.tipo)) {
                  totalHoras += dia.horasReales || 0;
                }
              }
            }
          });
        }
      }
    });

    console.log(`Total horas calculadas para ${proyecto.nombre}: ${totalHoras}`);
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
      // Verificar si el trabajador estaba activo en ese mes
      const fechaEntrada = trabajador.fechaEntrada || new Date(año, 0, 1);
      const fechaSalida = trabajador.fechaSalida || new Date(año, 11, 31);
      const inicioMes = new Date(año, mes - 1, 1);
      const finMes = new Date(año, mes, 0);

      // Solo calcular si el trabajador estuvo activo durante ese mes
      if (fechaEntrada <= finMes && fechaSalida >= inicioMes) {
        const calendario = generarCalendarioMesPuro(trabajador.id, mes, año);
        
        calendario.dias.forEach(dia => {
          const fechaDia = new Date(año, mes - 1, dia.fecha.getDate());
          
          // Solo contar días dentro del período de trabajo del empleado
          if (fechaDia >= fechaEntrada && fechaDia <= fechaSalida) {
            if (dia.tipo === 'laborable' || dia.tipo === 'sabado') {
              if (!dia.ausencia || !['vacaciones', 'baja_medica', 'baja_laboral', 'baja_personal'].includes(dia.ausencia.tipo)) {
                totalHoras += dia.horasReales || 0;
              }
            }
          }
        });
      }
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
