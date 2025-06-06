
import { useCallback } from 'react';
import { Proyecto } from '@/types/proyecto';
import { generarCalendarioMesPuro } from '@/utils/calendarioUtils';

export const useBeneficiosBrutos = () => {
  const calcularBeneficioBrutoAdministracion = useCallback((proyecto: Proyecto) => {
    if (proyecto.tipo !== 'administracion' || !proyecto.precioHora) {
      return 0;
    }

    let totalHoras = 0;
    const añoActual = new Date().getFullYear();
    const fechaActual = new Date();

    // Para cada trabajador asignado al proyecto
    proyecto.trabajadoresAsignados.forEach(trabajador => {
      console.log(`Calculando para ${trabajador.nombre}:`);
      
      // Si no hay fecha de entrada, no contar horas
      if (!trabajador.fechaEntrada) {
        console.log(`${trabajador.nombre}: Sin fecha de entrada, no se cuentan horas`);
        return;
      }

      const fechaEntrada = trabajador.fechaEntrada;
      const fechaSalida = trabajador.fechaSalida || fechaActual;
      
      console.log(`${trabajador.nombre}: ${fechaEntrada.toLocaleDateString()} - ${fechaSalida.toLocaleDateString()}`);
      
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

  return {
    calcularBeneficioBrutoAdministracion,
    calcularBeneficioBrutoPresupuesto
  };
};
