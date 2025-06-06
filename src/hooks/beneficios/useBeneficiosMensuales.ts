
import { useCallback } from 'react';
import { Proyecto } from '@/types/proyecto';
import { generarCalendarioMesPuro } from '@/utils/calendarioUtils';

export const useBeneficiosMensuales = () => {
  const calcularBeneficioMensualAdministracion = useCallback((proyecto: Proyecto, mes: number, año: number) => {
    if (proyecto.tipo !== 'administracion' || !proyecto.precioHora) {
      return 0;
    }

    let totalHoras = 0;
    const primerDiaMes = new Date(año, mes - 1, 1);
    const ultimoDiaMes = new Date(año, mes, 0);

    proyecto.trabajadoresAsignados.forEach(trabajador => {
      // Solo procesar si tiene fecha de entrada
      if (!trabajador.fechaEntrada) {
        return;
      }

      // Fechas de trabajo del empleado
      const fechaEntrada = trabajador.fechaEntrada;
      const fechaSalida = trabajador.fechaSalida || new Date();

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

  return {
    calcularBeneficioMensualAdministracion,
    calcularBeneficioMensualPresupuesto,
    calcularGastosMensuales
  };
};
