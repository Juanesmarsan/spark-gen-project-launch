

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
      // Si no hay fecha de entrada, usar inicio de año como valor por defecto
      const fechaEntrada = trabajador.fechaEntrada || new Date(añoActual, 0, 1);
      const fechaSalida = trabajador.fechaSalida || new Date(añoActual, 11, 31);
      
      console.log(`Calculando para ${trabajador.nombre}: ${fechaEntrada.toLocaleDateString()} - ${fechaSalida.toLocaleDateString()}`);
      
      // Determinar el rango de meses a procesar
      const mesInicio = fechaEntrada.getMonth() + 1;
      const añoInicio = fechaEntrada.getFullYear();
      const mesFin = fechaSalida.getMonth() + 1;
      const añoFin = fechaSalida.getFullYear();

      // Solo calcular si hay intersección con el año actual
      if (añoFin >= añoActual && añoInicio <= añoActual) {
        const mesInicioReal = añoInicio === añoActual ? mesInicio : 1;
        const mesFinReal = añoFin === añoActual ? mesFin : 12;

        // Iterar sobre cada mes del período activo
        for (let mes = mesInicioReal; mes <= mesFinReal; mes++) {
          const calendario = generarCalendarioMesPuro(trabajador.id, mes, añoActual);
          
          // Determinar fechas límite para este mes específico
          const primerDiaMes = new Date(añoActual, mes - 1, 1);
          const ultimoDiaMes = new Date(añoActual, mes, 0);
          
          // Fecha efectiva de inicio para este mes
          const fechaInicioMes = mes === mesInicio && añoInicio === añoActual 
            ? fechaEntrada 
            : primerDiaMes;
            
          // Fecha efectiva de fin para este mes
          const fechaFinMes = mes === mesFin && añoFin === añoActual 
            ? fechaSalida 
            : ultimoDiaMes;
          
          console.log(`Mes ${mes}: desde ${fechaInicioMes.toLocaleDateString()} hasta ${fechaFinMes.toLocaleDateString()}`);
          
          calendario.dias.forEach(dia => {
            const fechaDia = new Date(añoActual, mes - 1, dia.fecha.getDate());
            
            // Solo contar días dentro del período efectivo del trabajador para este mes
            if (fechaDia >= fechaInicioMes && fechaDia <= fechaFinMes) {
              // Solo contar días laborables y sábados sin ausencias que impidan trabajar
              if (dia.tipo === 'laborable' || dia.tipo === 'sabado') {
                if (!dia.ausencia || !['vacaciones', 'baja_medica', 'baja_laboral', 'baja_personal'].includes(dia.ausencia.tipo)) {
                  totalHoras += dia.horasReales || 0;
                  console.log(`Día ${fechaDia.toLocaleDateString()}: +${dia.horasReales || 0} horas`);
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
    const primerDiaMes = new Date(año, mes - 1, 1);
    const ultimoDiaMes = new Date(año, mes, 0);

    proyecto.trabajadoresAsignados.forEach(trabajador => {
      // Fechas de trabajo del empleado
      const fechaEntrada = trabajador.fechaEntrada || new Date(año, 0, 1);
      const fechaSalida = trabajador.fechaSalida || new Date(año, 11, 31);

      // Verificar si el trabajador estaba activo durante ese mes
      if (fechaEntrada <= ultimoDiaMes && fechaSalida >= primerDiaMes) {
        // Determinar las fechas efectivas para este mes
        const fechaInicioEfectiva = fechaEntrada > primerDiaMes ? fechaEntrada : primerDiaMes;
        const fechaFinEfectiva = fechaSalida < ultimoDiaMes ? fechaSalida : ultimoDiaMes;
        
        console.log(`${trabajador.nombre} en ${mes}/${año}: desde ${fechaInicioEfectiva.toLocaleDateString()} hasta ${fechaFinEfectiva.toLocaleDateString()}`);
        
        const calendario = generarCalendarioMesPuro(trabajador.id, mes, año);
        
        calendario.dias.forEach(dia => {
          const fechaDia = new Date(año, mes - 1, dia.fecha.getDate());
          
          // Solo contar días dentro del período efectivo del trabajador
          if (fechaDia >= fechaInicioEfectiva && fechaDia <= fechaFinEfectiva) {
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

