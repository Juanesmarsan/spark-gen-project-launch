
import { useCallback } from 'react';
import { Empleado } from '@/types/empleado';
import { useProyectos } from './useProyectos';
import { useGastosEmpleados } from './useGastosEmpleados';

interface ImputacionSalarial {
  empleadoId: number;
  proyectoId: number;
  mes: number;
  anio: number;
  diasTrabajados: number;
  diasLaboralesMes: number;
  salarioBrutoProrrateo: number;
  seguridadSocialEmpresaProrrateo: number;
  horasExtras: number;
  horasFestivas: number;
  importeHorasExtras: number;
  importeHorasFestivas: number;
}

export const useImputacionCostesSalariales = () => {
  const { proyectos } = useProyectos();
  const { calcularCosteEmpleado, registrarGastoEmpleadoProyecto } = useGastosEmpleados();

  // Calcular días laborales trabajados por un empleado en un proyecto en un mes específico
  const calcularDiasTrabajadosEnProyecto = useCallback((
    empleadoId: number,
    proyectoId: number,
    mes: number,
    anio: number
  ): number => {
    const proyecto = proyectos.find(p => p.id === proyectoId);
    if (!proyecto) return 0;

    const trabajador = proyecto.trabajadoresAsignados.find(t => t.id === empleadoId);
    if (!trabajador) return 0;

    // Fechas límite del mes
    const primerDiaMes = new Date(anio, mes - 1, 1);
    const ultimoDiaMes = new Date(anio, mes, 0);

    // Fechas de trabajo del empleado en el proyecto
    const fechaEntrada = trabajador.fechaEntrada || primerDiaMes;
    const fechaSalida = trabajador.fechaSalida || ultimoDiaMes;

    // Verificar si el trabajador estuvo activo durante el mes
    if (fechaEntrada > ultimoDiaMes || fechaSalida < primerDiaMes) {
      return 0;
    }

    // Calcular fechas efectivas de trabajo en el mes
    const fechaInicioEfectiva = fechaEntrada > primerDiaMes ? fechaEntrada : primerDiaMes;
    const fechaFinEfectiva = fechaSalida < ultimoDiaMes ? fechaSalida : ultimoDiaMes;

    // Contar días laborales entre las fechas efectivas
    let diasLaborales = 0;
    const fechaActual = new Date(fechaInicioEfectiva);

    while (fechaActual <= fechaFinEfectiva) {
      const diaSemana = fechaActual.getDay();
      if (diaSemana !== 0 && diaSemana !== 6) { // No es domingo ni sábado
        diasLaborales++;
      }
      fechaActual.setDate(fechaActual.getDate() + 1);
    }

    return diasLaborales;
  }, [proyectos]);

  // Imputar automáticamente los costes salariales de un empleado a todos sus proyectos
  const imputarCostesSalarialesEmpleado = useCallback((
    empleado: Empleado,
    mes: number,
    anio: number,
    horasExtras: number = 0,
    horasFestivas: number = 0
  ): ImputacionSalarial[] => {
    console.log(`Imputando costes salariales de ${empleado.nombre} para ${mes}/${anio}`);

    const costeEmpleado = calcularCosteEmpleado(empleado.id, mes, anio);
    if (!costeEmpleado) {
      console.error('No se pudo calcular el coste del empleado');
      return [];
    }

    // Buscar proyectos donde el empleado esté asignado
    const proyectosDelEmpleado = proyectos.filter(proyecto => {
      return proyecto.trabajadoresAsignados.some(trabajador => trabajador.id === empleado.id);
    });

    const imputaciones: ImputacionSalarial[] = [];

    proyectosDelEmpleado.forEach(proyecto => {
      const diasTrabajados = calcularDiasTrabajadosEnProyecto(empleado.id, proyecto.id, mes, anio);
      
      if (diasTrabajados > 0) {
        // Calcular prorrateo
        const factorProrrateo = diasTrabajados / costeEmpleado.diasLaboralesMes;
        const salarioBrutoProrrateo = costeEmpleado.salarioBrutoMes * factorProrrateo;
        const seguridadSocialEmpresaProrrateo = costeEmpleado.seguridadSocialEmpresaMes * factorProrrateo;

        // Calcular costes de horas extras (se asignan proporcionalmente)
        const horasExtrasProyecto = Math.round(horasExtras * factorProrrateo);
        const horasFestivasProyecto = Math.round(horasFestivas * factorProrrateo);
        const importeHorasExtras = horasExtrasProyecto * empleado.precioHoraExtra;
        const importeHorasFestivas = horasFestivasProyecto * empleado.precioHoraFestiva;

        const imputacion: ImputacionSalarial = {
          empleadoId: empleado.id,
          proyectoId: proyecto.id,
          mes,
          anio,
          diasTrabajados,
          diasLaboralesMes: costeEmpleado.diasLaboralesMes,
          salarioBrutoProrrateo,
          seguridadSocialEmpresaProrrateo,
          horasExtras: horasExtrasProyecto,
          horasFestivas: horasFestivasProyecto,
          importeHorasExtras,
          importeHorasFestivas
        };

        imputaciones.push(imputacion);

        // Registrar el gasto en el sistema
        registrarGastoEmpleadoProyecto({
          empleadoId: empleado.id,
          proyectoId: proyecto.id,
          mes,
          anio,
          diasAsignados: diasTrabajados,
          horasExtras: horasExtrasProyecto,
          horasFestivas: horasFestivasProyecto,
          gastos: []
        });

        console.log(`Imputado ${salarioBrutoProrrateo.toFixed(2)}€ al proyecto ${proyecto.nombre} por ${diasTrabajados} días`);
      }
    });

    return imputaciones;
  }, [proyectos, calcularCosteEmpleado, calcularDiasTrabajadosEnProyecto, registrarGastoEmpleadoProyecto]);

  // Imputar costes de todos los empleados activos para un mes específico
  const imputarCostesSalarialesMes = useCallback((
    empleados: Empleado[],
    mes: number,
    anio: number
  ): ImputacionSalarial[] => {
    console.log(`Imputando costes salariales de todos los empleados para ${mes}/${anio}`);

    const todasLasImputaciones: ImputacionSalarial[] = [];

    empleados.forEach(empleado => {
      if (empleado.activo) {
        const imputacionesEmpleado = imputarCostesSalarialesEmpleado(empleado, mes, anio);
        todasLasImputaciones.push(...imputacionesEmpleado);
      }
    });

    return todasLasImputaciones;
  }, [imputarCostesSalarialesEmpleado]);

  return {
    imputarCostesSalarialesEmpleado,
    imputarCostesSalarialesMes,
    calcularDiasTrabajadosEnProyecto
  };
};
