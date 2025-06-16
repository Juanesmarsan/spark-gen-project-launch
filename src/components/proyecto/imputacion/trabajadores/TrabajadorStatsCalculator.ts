
import { Trabajador } from "@/types/proyecto";
import { Empleado } from "@/types/empleado";
import { generarCalendarioMesPuro } from "@/utils/calendarioUtils";

export interface TrabajadorStats {
  horasLaborales: number;
  horasExtras: number;
  horasFestivas: number;
  diasVacaciones: number;
  diasBaja: number;
  diasAusencia: number;
  gastosVariables: number;
}

export const calcularEstadisticasTrabajador = (
  trabajador: Trabajador,
  empleado: Empleado,
  mes: number,
  anio: number
): TrabajadorStats => {
  // Verificar si trabajaba en el proyecto durante el mes
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
      diasBaja: 0,
      diasAusencia: 0,
      gastosVariables: 0
    };
  }

  const calendario = generarCalendarioMesPuro(empleado.id, mes, anio);
  
  let horasLaborales = 0;
  let horasExtras = 0;
  let horasFestivas = 0;
  let diasVacaciones = 0;
  let diasBaja = 0;
  let diasAusencia = 0;

  const fechaInicioEfectiva = fechaEntrada > primerDiaMes ? fechaEntrada : primerDiaMes;
  const fechaFinEfectiva = fechaSalida < ultimoDiaMes ? fechaSalida : ultimoDiaMes;

  calendario.dias.forEach(dia => {
    const fechaDia = new Date(anio, mes - 1, dia.fecha.getDate());
    
    if (fechaDia >= fechaInicioEfectiva && fechaDia <= fechaFinEfectiva) {
      if (dia.ausencia) {
        switch (dia.ausencia.tipo) {
          case 'vacaciones':
            diasVacaciones++;
            break;
          case 'baja_medica':
          case 'baja_laboral':
          case 'baja_personal':
            diasBaja++;
            break;
          case 'ausencia':
            diasAusencia++;
            break;
        }
      } else {
        if (dia.tipo === 'laborable' || dia.tipo === 'sabado') {
          horasLaborales += dia.horasReales || 0;
          
          // Calcular horas extras (más de 8 horas en día laboral)
          if (dia.horasReales > 8) {
            horasExtras += dia.horasReales - 8;
          }
        } else if (dia.tipo === 'festivo' && dia.horasReales > 0) {
          horasFestivas += dia.horasReales;
        }
      }
    }
  });

  // Calcular gastos variables del empleado
  const gastosVariables = empleado.gastosVariables?.filter(gasto => {
    const fechaGasto = new Date(gasto.fecha);
    return fechaGasto.getMonth() + 1 === mes && fechaGasto.getFullYear() === anio;
  }).reduce((total, gasto) => total + gasto.importe, 0) || 0;

  return {
    horasLaborales,
    horasExtras,
    horasFestivas,
    diasVacaciones,
    diasBaja,
    diasAusencia,
    gastosVariables
  };
};
