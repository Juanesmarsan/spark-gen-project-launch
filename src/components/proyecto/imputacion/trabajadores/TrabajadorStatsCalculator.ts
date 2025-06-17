
import { Trabajador } from "@/types/proyecto";
import { Empleado } from "@/types/empleado";
import { generarCalendarioMesPuro } from "@/utils/calendarioUtils";

export interface EstadisticasTrabajador {
  horasLaborales: number;
  horasExtras: number;
  horasFestivas: number;
  diasVacaciones: number;
  diasBajas: number;
  diasAusencias: number;
  gastosVariables: number;
}

export const calcularEstadisticasTrabajador = (
  trabajador: Trabajador,
  empleado: Empleado,
  mes: number,
  anio: number
): EstadisticasTrabajador => {
  if (!trabajador || !empleado) {
    return {
      horasLaborales: 0,
      horasExtras: 0,
      horasFestivas: 0,
      diasVacaciones: 0,
      diasBajas: 0,
      diasAusencias: 0,
      gastosVariables: 0
    };
  }

  // Verificar si el trabajador estuvo activo durante el mes
  const primerDiaMes = new Date(anio, mes - 1, 1);
  const ultimoDiaMes = new Date(anio, mes, 0);
  
  const fechaEntrada = trabajador.fechaEntrada || primerDiaMes;
  const fechaSalida = trabajador.fechaSalida || ultimoDiaMes;

  if (fechaEntrada > ultimoDiaMes || fechaSalida < primerDiaMes) {
    return {
      horasLaborales: 0,
      horasExtras: 0,
      horasFestivas: 0,
      diasVacaciones: 0,
      diasBajas: 0,
      diasAusencias: 0,
      gastosVariables: 0
    };
  }

  const calendario = generarCalendarioMesPuro(trabajador.id, mes, anio);
  
  let horasLaborales = 0;
  let horasExtras = 0;
  let horasFestivas = 0;
  let diasVacaciones = 0;
  let diasBajas = 0;
  let diasAusencias = 0;

  // Calcular fechas efectivas
  const fechaInicioEfectiva = fechaEntrada > primerDiaMes ? fechaEntrada : primerDiaMes;
  const fechaFinEfectiva = fechaSalida < ultimoDiaMes ? fechaSalida : ultimoDiaMes;

  calendario.dias.forEach(dia => {
    const fechaDia = new Date(anio, mes - 1, dia.fecha.getDate());
    
    // Solo procesar días dentro del período efectivo del trabajador
    if (fechaDia >= fechaInicioEfectiva && fechaDia <= fechaFinEfectiva) {
      if (dia.ausencia) {
        switch (dia.ausencia.tipo) {
          case 'vacaciones':
            diasVacaciones++;
            break;
          case 'baja_medica':
          case 'baja_laboral':
            diasBajas++;
            break;
          default:
            diasAusencias++;
        }
      } else {
        // Solo contar horas si no hay ausencia
        if (dia.tipo === 'laborable' || dia.tipo === 'sabado') {
          horasLaborales += dia.horasReales || 0;
          horasExtras += dia.horasExtras || 0;
          horasFestivas += dia.horasFestivas || 0;
        }
      }
    }
  });

  // Calcular gastos variables del empleado para el mes
  const gastosVariables = (empleado.gastosVariables || [])
    .filter(gasto => {
      const fechaGasto = new Date(gasto.fecha);
      return fechaGasto.getMonth() + 1 === mes && fechaGasto.getFullYear() === anio;
    })
    .reduce((total, gasto) => total + (gasto.importe || 0), 0);

  return {
    horasLaborales: Math.round(horasLaborales * 100) / 100,
    horasExtras: Math.round(horasExtras * 100) / 100,
    horasFestivas: Math.round(horasFestivas * 100) / 100,
    diasVacaciones,
    diasBajas,
    diasAusencias,
    gastosVariables: Math.round(gastosVariables * 100) / 100
  };
};
