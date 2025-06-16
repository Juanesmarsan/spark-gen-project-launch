
import { useMemo } from 'react';
import { useEmpleados } from './useEmpleados';
import { useProyectos } from './useProyectos';
import { useGastosEmpleados } from './useGastosEmpleados';
import { generarCalendarioMesPuro } from '@/utils/calendarioUtils';

export const useDashboardMetrics = () => {
  const { empleados } = useEmpleados();
  const { proyectos } = useProyectos();
  const { gastosEmpleadosProyectos } = useGastosEmpleados();

  // Calcular horas trabajadas por proyecto (año actual)
  const horasPorProyecto = useMemo(() => {
    const añoActual = new Date().getFullYear();
    
    return proyectos.map(proyecto => {
      let totalHoras = 0;
      
      if (proyecto.tipo === 'administracion') {
        proyecto.trabajadoresAsignados.forEach(trabajador => {
          if (!trabajador.fechaEntrada) return;
          
          const fechaEntrada = trabajador.fechaEntrada;
          const fechaSalida = trabajador.fechaSalida || new Date();
          
          // Determinar rango de meses para el año actual
          const mesInicio = fechaEntrada.getFullYear() === añoActual ? fechaEntrada.getMonth() + 1 : 1;
          const mesFin = fechaSalida.getFullYear() === añoActual ? fechaSalida.getMonth() + 1 : 12;
          
          if (fechaEntrada.getFullYear() <= añoActual && fechaSalida.getFullYear() >= añoActual) {
            for (let mes = mesInicio; mes <= mesFin; mes++) {
              const calendario = generarCalendarioMesPuro(trabajador.id, mes, añoActual);
              
              calendario.dias.forEach(dia => {
                const fechaDia = new Date(añoActual, mes - 1, dia.fecha.getDate());
                const fechaInicioMes = mes === mesInicio && fechaEntrada.getFullYear() === añoActual ? fechaEntrada : new Date(añoActual, mes - 1, 1);
                const fechaFinMes = mes === mesFin && fechaSalida.getFullYear() === añoActual ? fechaSalida : new Date(añoActual, mes, 0);
                
                if (fechaDia >= fechaInicioMes && fechaDia <= fechaFinMes) {
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
      }
      
      return {
        nombre: proyecto.nombre,
        horas: totalHoras,
        ingresos: proyecto.tipo === 'administracion' 
          ? totalHoras * (proyecto.precioHora || 0)
          : proyecto.certificaciones?.reduce((sum, cert) => sum + cert.importe, 0) || 0,
        gastos: proyecto.gastosVariables?.reduce((sum, gasto) => sum + gasto.importe, 0) || 0
      };
    });
  }, [proyectos]);

  // Calcular rentabilidad por trabajador
  const rentabilidadTrabajadores = useMemo(() => {
    const añoActual = new Date().getFullYear();
    const mesActual = new Date().getMonth() + 1;

    return empleados.map(empleado => {
      // Calcular salario bruto incluyendo horas extras
      let horasExtrasTotal = 0;
      let horasFestivasTotal = 0;

      // Obtener horas extras del mes actual desde gastos de empleados
      const gastosDelMes = gastosEmpleadosProyectos.filter(
        gasto => gasto.empleadoId === empleado.id && 
                gasto.mes === mesActual && 
                gasto.anio === añoActual
      );

      gastosDelMes.forEach(gasto => {
        horasExtrasTotal += gasto.horasExtras || 0;
        horasFestivasTotal += gasto.horasFestivas || 0;
      });

      const importeHorasExtras = horasExtrasTotal * empleado.precioHoraExtra;
      const importeHorasFestivas = horasFestivasTotal * empleado.precioHoraFestiva;
      const salarioBrutoConExtras = empleado.salarioBruto + importeHorasExtras + importeHorasFestivas;

      // Calcular salario neto
      const salarioNeto = salarioBrutoConExtras - empleado.seguridadSocialTrabajador - empleado.embargo - empleado.retenciones;

      // Calcular adelantos del mes actual
      const adelantosDelMes = empleado.adelantos
        .filter(adelanto => {
          const fechaAdelanto = new Date(adelanto.fecha);
          return fechaAdelanto.getMonth() + 1 === mesActual && fechaAdelanto.getFullYear() === añoActual;
        })
        .reduce((sum, adelanto) => sum + adelanto.cantidad, 0);

      const salarioAPagar = salarioNeto - adelantosDelMes;

      // Calcular ingresos generados (proyectos donde participa)
      let ingresosGenerados = 0;
      proyectos.forEach(proyecto => {
        const participaEnProyecto = proyecto.trabajadoresAsignados.some(t => t.id === empleado.id);
        if (participaEnProyecto && proyecto.tipo === 'administracion' && proyecto.precioHora) {
          // Calcular horas trabajadas por este empleado en este proyecto
          let horasEmpleadoProyecto = 0;
          const trabajadorEnProyecto = proyecto.trabajadoresAsignados.find(t => t.id === empleado.id);
          
          if (trabajadorEnProyecto?.fechaEntrada) {
            const fechaEntrada = trabajadorEnProyecto.fechaEntrada;
            const fechaSalida = trabajadorEnProyecto.fechaSalida || new Date();
            
            const mesInicio = fechaEntrada.getFullYear() === añoActual ? fechaEntrada.getMonth() + 1 : 1;
            const mesFin = fechaSalida.getFullYear() === añoActual ? fechaSalida.getMonth() + 1 : 12;
            
            if (fechaEntrada.getFullYear() <= añoActual && fechaSalida.getFullYear() >= añoActual) {
              for (let mes = mesInicio; mes <= mesFin; mes++) {
                const calendario = generarCalendarioMesPuro(empleado.id, mes, añoActual);
                
                calendario.dias.forEach(dia => {
                  const fechaDia = new Date(añoActual, mes - 1, dia.fecha.getDate());
                  const fechaInicioMes = mes === mesInicio && fechaEntrada.getFullYear() === añoActual ? fechaEntrada : new Date(añoActual, mes - 1, 1);
                  const fechaFinMes = mes === mesFin && fechaSalida.getFullYear() === añoActual ? fechaSalida : new Date(añoActual, mes, 0);
                  
                  if (fechaDia >= fechaInicioMes && fechaDia <= fechaFinMes) {
                    if (dia.tipo === 'laborable' || dia.tipo === 'sabado') {
                      if (!dia.ausencia || !['vacaciones', 'baja_medica', 'baja_laboral', 'baja_personal'].includes(dia.ausencia.tipo)) {
                        horasEmpleadoProyecto += dia.horasReales || 0;
                      }
                    }
                  }
                });
              }
            }
          }
          
          ingresosGenerados += horasEmpleadoProyecto * proyecto.precioHora;
        }
      });

      // Costo total del empleado para la empresa
      const costoTotalEmpleado = salarioBrutoConExtras + empleado.seguridadSocialEmpresa;

      return {
        id: empleado.id,
        nombre: `${empleado.nombre} ${empleado.apellidos}`,
        salarioBruto: empleado.salarioBruto,
        importeHorasExtras,
        importeHorasFestivas,
        salarioBrutoConExtras,
        salarioNeto,
        adelantosDelMes,
        salarioAPagar,
        ingresosGenerados,
        costoTotalEmpleado,
        rentabilidad: ingresosGenerados - costoTotalEmpleado,
        porcentajeRentabilidad: ingresosGenerados > 0 ? ((ingresosGenerados - costoTotalEmpleado) / ingresosGenerados * 100) : 0
      };
    });
  }, [empleados, proyectos, gastosEmpleadosProyectos]);

  return {
    horasPorProyecto,
    rentabilidadTrabajadores
  };
};
