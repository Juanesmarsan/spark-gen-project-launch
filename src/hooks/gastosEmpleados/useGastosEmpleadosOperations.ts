
import { useCallback } from 'react';
import { GastoEmpleadoProyecto, AsignacionProyectoEmpleado, GastoVariableEmpleadoProyecto } from '@/types/gastoEmpleado';
import { useEmpleados } from '../useEmpleados';
import { useCalculosEmpleados } from './useCalculosEmpleados';

export const useGastosEmpleadosOperations = (
  gastosEmpleadosProyectos: GastoEmpleadoProyecto[],
  setGastosEmpleadosProyectos: (gastos: GastoEmpleadoProyecto[]) => void,
  guardarEnStorage: (gastos: GastoEmpleadoProyecto[]) => void
) => {
  const { empleados } = useEmpleados();
  const { calcularCosteEmpleado } = useCalculosEmpleados();

  // Registrar gastos de empleado para un proyecto
  const registrarGastoEmpleadoProyecto = useCallback((asignacion: AsignacionProyectoEmpleado) => {
    console.log('useGastosEmpleadosOperations: Registrando gasto de empleado para proyecto...');
    
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
  }, [empleados, gastosEmpleadosProyectos, calcularCosteEmpleado, setGastosEmpleadosProyectos, guardarEnStorage]);

  // Agregar gasto variable a un registro existente
  const agregarGastoVariable = useCallback((gastoEmpleadoId: number, gastoVariable: Omit<GastoVariableEmpleadoProyecto, 'id'>) => {
    console.log('useGastosEmpleadosOperations: Agregando gasto variable...');
    
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
  }, [gastosEmpleadosProyectos, setGastosEmpleadosProyectos, guardarEnStorage]);

  return {
    registrarGastoEmpleadoProyecto,
    agregarGastoVariable
  };
};
