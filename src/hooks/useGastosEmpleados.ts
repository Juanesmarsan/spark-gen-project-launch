
import { useState, useEffect, useCallback } from 'react';
import { GastoEmpleadoProyecto, CalculoCosteEmpleado, AsignacionProyectoEmpleado, GastoVariableEmpleadoProyecto } from '@/types/gastoEmpleado';
import { useEmpleados } from './useEmpleados';

export const useGastosEmpleados = () => {
  const [gastosEmpleadosProyectos, setGastosEmpleadosProyectos] = useState<GastoEmpleadoProyecto[]>([]);
  const { empleados } = useEmpleados();

  // Cargar gastos desde localStorage
  useEffect(() => {
    console.log('useGastosEmpleados: Cargando gastos desde localStorage...');
    
    try {
      const gastosGuardados = localStorage.getItem('gastosEmpleadosProyectos');
      
      if (gastosGuardados) {
        const gastosParsedos = JSON.parse(gastosGuardados);
        const gastosProcesados = gastosParsedos.map((gasto: any) => ({
          ...gasto,
          fechaRegistro: new Date(gasto.fechaRegistro),
          gastos: gasto.gastos?.map((g: any) => ({
            ...g,
            fecha: new Date(g.fecha)
          })) || []
        }));
        
        setGastosEmpleadosProyectos(gastosProcesados);
      } else {
        console.log('useGastosEmpleados: No se encontraron gastos en localStorage');
        setGastosEmpleadosProyectos([]);
      }
    } catch (error) {
      console.error("Error al cargar gastos de empleados:", error);
      setGastosEmpleadosProyectos([]);
    }
  }, []);

  // Guardar en localStorage
  const guardarEnStorage = useCallback((gastosActualizados: GastoEmpleadoProyecto[]) => {
    try {
      const gastosParaGuardar = gastosActualizados.map(gasto => ({
        ...gasto,
        fechaRegistro: gasto.fechaRegistro.toISOString(),
        gastos: gasto.gastos.map(g => ({
          ...g,
          fecha: g.fecha.toISOString()
        }))
      }));
      
      localStorage.setItem('gastosEmpleadosProyectos', JSON.stringify(gastosParaGuardar));
      console.log('useGastosEmpleados: Gastos guardados correctamente');
    } catch (error) {
      console.error("Error al guardar gastos de empleados:", error);
    }
  }, []);

  // Calcular días laborales de un mes (excluyendo sábados y domingos)
  const calcularDiasLaborales = useCallback((mes: number, anio: number) => {
    const fecha = new Date(anio, mes - 1, 1);
    const ultimoDia = new Date(anio, mes, 0).getDate();
    let diasLaborales = 0;

    for (let dia = 1; dia <= ultimoDia; dia++) {
      fecha.setDate(dia);
      const diaSemana = fecha.getDay();
      if (diaSemana !== 0 && diaSemana !== 6) { // No es domingo (0) ni sábado (6)
        diasLaborales++;
      }
    }

    return diasLaborales;
  }, []);

  // Calcular coste total de un empleado para un mes
  const calcularCosteEmpleado = useCallback((empleadoId: number, mes: number, anio: number): CalculoCosteEmpleado | null => {
    const empleado = empleados.find(e => e.id === empleadoId);
    if (!empleado) return null;

    const diasLaboralesMes = calcularDiasLaborales(mes, anio);
    
    const salarioBrutoMes = empleado.salarioBruto;
    const seguridadSocialEmpresaMes = empleado.seguridadSocialEmpresa;
    const seguridadSocialTrabajadorMes = empleado.seguridadSocialTrabajador;
    const retencionesIRPFMes = empleado.retenciones;
    const embargosMes = empleado.embargo || 0;

    const costeTotalMensual = salarioBrutoMes + seguridadSocialEmpresaMes;
    const costePorDiaLaboral = costeTotalMensual / diasLaboralesMes;

    return {
      empleadoId,
      mes,
      anio,
      salarioBrutoMes,
      seguridadSocialEmpresaMes,
      seguridadSocialTrabajadorMes,
      retencionesIRPFMes,
      embargosMes,
      costeTotalMensual,
      costePorDiaLaboral,
      diasLaboralesMes
    };
  }, [empleados, calcularDiasLaborales]);

  // Registrar gastos de empleado para un proyecto
  const registrarGastoEmpleadoProyecto = useCallback((asignacion: AsignacionProyectoEmpleado) => {
    console.log('useGastosEmpleados: Registrando gasto de empleado para proyecto...');
    
    const costeEmpleado = calcularCosteEmpleado(asignacion.empleadoId, asignacion.mes, asignacion.anio);
    if (!costeEmpleado) {
      console.error('No se pudo calcular el coste del empleado');
      return;
    }

    const empleado = empleados.find(e => e.id === asignacion.empleadoId);
    if (!empleado) return;

    // Calcular prorrateo por días trabajados
    const costePorDia = costeEmpleado.costePorDiaLaboral;
    const salarioBrutoProrrateo = (costeEmpleado.salarioBrutoMes / costeEmpleado.diasLaboralesMes) * asignacion.diasAsignados;
    const seguridadSocialEmpresaProrrateo = (costeEmpleado.seguridadSocialEmpresaMes / costeEmpleado.diasLaboralesMes) * asignacion.diasAsignados;
    const seguridadSocialTrabajadorProrrateo = (costeEmpleado.seguridadSocialTrabajadorMes / costeEmpleado.diasLaboralesMes) * asignacion.diasAsignados;
    const retencionesIRPFProrrateo = (costeEmpleado.retencionesIRPFMes / costeEmpleado.diasLaboralesMes) * asignacion.diasAsignados;
    const embargosProrrateo = (costeEmpleado.embargosMes / costeEmpleado.diasLaboralesMes) * asignacion.diasAsignados;

    // Calcular importe de horas extras y festivas
    const importeHorasExtras = asignacion.horasExtras * empleado.precioHoraExtra;
    const importeHorasFestivas = asignacion.horasFestivas * empleado.precioHoraFestiva;

    // Convertir gastos sin ID a gastos con ID
    const gastosConId: GastoVariableEmpleadoProyecto[] = asignacion.gastos.map(gasto => ({
      ...gasto,
      id: gasto.id || Date.now() + Math.random()
    }));

    const nuevoGasto: GastoEmpleadoProyecto = {
      id: Date.now(),
      empleadoId: asignacion.empleadoId,
      proyectoId: asignacion.proyectoId,
      mes: asignacion.mes,
      anio: asignacion.anio,
      salarioBrutoProrrateo,
      seguridadSocialEmpresaProrrateo,
      seguridadSocialTrabajadorProrrateo,
      retencionesIRPFProrrateo,
      embargosProrrateo,
      diasTrabajados: asignacion.diasAsignados,
      diasLaboralesMes: costeEmpleado.diasLaboralesMes,
      horasExtras: asignacion.horasExtras,
      horasFestivas: asignacion.horasFestivas,
      importeHorasExtras,
      importeHorasFestivas,
      gastos: gastosConId,
      fechaRegistro: new Date()
    };

    const gastosActualizados = [...gastosEmpleadosProyectos, nuevoGasto];
    setGastosEmpleadosProyectos(gastosActualizados);
    guardarEnStorage(gastosActualizados);
  }, [empleados, gastosEmpleadosProyectos, calcularCosteEmpleado, guardarEnStorage]);

  // Agregar gasto variable a un registro existente
  const agregarGastoVariable = useCallback((gastoEmpleadoId: number, gastoVariable: Omit<GastoVariableEmpleadoProyecto, 'id'>) => {
    console.log('useGastosEmpleados: Agregando gasto variable...');
    
    const gastosActualizados = gastosEmpleadosProyectos.map(gasto => {
      if (gasto.id === gastoEmpleadoId) {
        return {
          ...gasto,
          gastos: [...gasto.gastos, { ...gastoVariable, id: Date.now() }]
        };
      }
      return gasto;
    });

    setGastosEmpleadosProyectos(gastosActualizados);
    guardarEnStorage(gastosActualizados);
  }, [gastosEmpleadosProyectos, guardarEnStorage]);

  // Obtener gastos por empleado y mes
  const obtenerGastosPorEmpleadoMes = useCallback((empleadoId: number, mes: number, anio: number) => {
    return gastosEmpleadosProyectos.filter(
      gasto => gasto.empleadoId === empleadoId && gasto.mes === mes && gasto.anio === anio
    );
  }, [gastosEmpleadosProyectos]);

  // Obtener gastos por proyecto y mes
  const obtenerGastosPorProyectoMes = useCallback((proyectoId: number, mes: number, anio: number) => {
    return gastosEmpleadosProyectos.filter(
      gasto => gasto.proyectoId === proyectoId && gasto.mes === mes && gasto.anio === anio
    );
  }, [gastosEmpleadosProyectos]);

  // Calcular coste total de un empleado en un proyecto para un mes
  const calcularCosteTotalEmpleadoProyecto = useCallback((gastoEmpleado: GastoEmpleadoProyecto) => {
    const costeFijo = gastoEmpleado.salarioBrutoProrrateo + gastoEmpleado.seguridadSocialEmpresaProrrateo;
    const costeHoras = gastoEmpleado.importeHorasExtras + gastoEmpleado.importeHorasFestivas;
    const costeGastosVariables = gastoEmpleado.gastos.reduce((total, gasto) => total + gasto.importe, 0);
    
    return costeFijo + costeHoras + costeGastosVariables;
  }, []);

  return {
    gastosEmpleadosProyectos,
    calcularCosteEmpleado,
    registrarGastoEmpleadoProyecto,
    agregarGastoVariable,
    obtenerGastosPorEmpleadoMes,
    obtenerGastosPorProyectoMes,
    calcularCosteTotalEmpleadoProyecto,
    calcularDiasLaborales
  };
};
