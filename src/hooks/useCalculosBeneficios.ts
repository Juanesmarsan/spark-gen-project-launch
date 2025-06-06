
import { useCallback } from 'react';
import { Proyecto } from '@/types/proyecto';
import { startOfMonth, endOfMonth, eachDayOfInterval, isWeekend, format } from 'date-fns';

// Lista de días festivos
const diasFestivos = [
  '2025-01-01', '2025-01-06', '2025-04-18', '2025-04-21', 
  '2025-05-01', '2025-08-15', '2025-10-12', '2025-11-01', 
  '2025-12-06', '2025-12-08', '2025-12-25'
];

const esFestivo = (fecha: Date): boolean => {
  const fechaStr = format(fecha, 'yyyy-MM-dd');
  return diasFestivos.includes(fechaStr);
};

const calcularHorasTrabajadorEnPeriodo = (inicioMes: Date, finMes: Date, fechaEntrada?: Date, fechaSalida?: Date): number => {
  // Determinar fecha de inicio para el cálculo
  let fechaInicio = inicioMes;
  if (fechaEntrada && fechaEntrada > inicioMes) {
    fechaInicio = fechaEntrada;
  }
  
  // Determinar fecha de fin para el cálculo
  let fechaFin = finMes;
  if (fechaSalida && fechaSalida < finMes) {
    fechaFin = fechaSalida;
  }
  
  if (fechaInicio > fechaFin) {
    return 0;
  }
  
  const diasTrabajo = eachDayOfInterval({ start: fechaInicio, end: fechaFin });
  
  let horasTotales = 0;
  diasTrabajo.forEach(dia => {
    if (!isWeekend(dia) && !esFestivo(dia)) {
      horasTotales += 8; // 8 horas por día laborable
    }
  });
  
  return horasTotales;
};

export const useCalculosBeneficios = () => {
  const calcularBeneficioBrutoAdministracion = useCallback((proyecto: Proyecto) => {
    if (proyecto.tipo !== 'administracion' || !proyecto.precioHora) {
      return 0;
    }

    let totalHoras = 0;
    const añoActual = new Date().getFullYear();

    // Para cada trabajador asignado al proyecto
    proyecto.trabajadoresAsignados.forEach(trabajador => {
      // Iterar sobre todos los meses del año
      for (let mes = 1; mes <= 12; mes++) {
        const inicioMes = startOfMonth(new Date(añoActual, mes - 1, 1));
        const finMes = endOfMonth(new Date(añoActual, mes - 1, 1));
        
        const horasDelMes = calcularHorasTrabajadorEnPeriodo(
          inicioMes,
          finMes,
          trabajador.fechaEntrada,
          trabajador.fechaSalida
        );
        
        totalHoras += horasDelMes;
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
    const inicioMes = startOfMonth(new Date(año, mes - 1, 1));
    const finMes = endOfMonth(new Date(año, mes - 1, 1));

    proyecto.trabajadoresAsignados.forEach(trabajador => {
      const horasDelMes = calcularHorasTrabajadorEnPeriodo(
        inicioMes,
        finMes,
        trabajador.fechaEntrada,
        trabajador.fechaSalida
      );
      totalHoras += horasDelMes;
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
