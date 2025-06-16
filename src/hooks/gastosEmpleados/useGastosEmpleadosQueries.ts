
import { useCallback } from 'react';
import { GastoEmpleadoProyecto } from '@/types/gastoEmpleado';

export const useGastosEmpleadosQueries = (gastosEmpleadosProyectos: GastoEmpleadoProyecto[]) => {
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
    obtenerGastosPorEmpleadoMes,
    obtenerGastosPorProyectoMes,
    calcularCosteTotalEmpleadoProyecto
  };
};
