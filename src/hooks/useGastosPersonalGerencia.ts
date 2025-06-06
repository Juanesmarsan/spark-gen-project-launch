
import { useCallback } from 'react';
import { useGastosFijos } from './useGastosFijos';
import { useEmpleados } from './useEmpleados';
import { GastoFijo } from '@/types/gastosFijos';
import { GastoVariableEmpleado } from '@/types/empleado';

export const useGastosPersonalGerencia = () => {
  const { gastosFijos, agregarGasto, actualizarGasto, eliminarGasto } = useGastosFijos();
  const { empleados } = useEmpleados();

  // Obtener empleados de gerencia
  const empleadosGerencia = empleados.filter(emp => {
    const esGerencia = emp.departamento === 'gerencia' || emp.categoria === 'gerencia';
    const esEsteban = emp.nombre.toLowerCase().includes('esteban');
    const esNuria = emp.nombre.toLowerCase().includes('nuria') || emp.apellidos.toLowerCase().includes('nuria');
    return esGerencia || esEsteban || esNuria;
  });

  // Sincronizar gasto variable de empleado de gerencia con gastos fijos
  const sincronizarGastoVariableConGastosFijos = useCallback((empleadoId: number, gasto: GastoVariableEmpleado) => {
    const empleado = empleados.find(emp => emp.id === empleadoId);
    if (!empleado) return;

    // Verificar si es personal de gerencia
    const esGerencia = empleadosGerencia.some(emp => emp.id === empleadoId);
    if (!esGerencia) return;

    const conceptoGastoFijo = `${gasto.concepto} - ${empleado.nombre} ${empleado.apellidos}`;
    
    // Buscar si ya existe un gasto fijo para este concepto
    const gastoFijoExistente = gastosFijos.find(gf => 
      gf.concepto.includes(`${gasto.concepto} - ${empleado.nombre}`)
    );

    if (gastoFijoExistente) {
      // Actualizar el gasto fijo existente
      const gastoActualizado: GastoFijo = {
        ...gastoFijoExistente,
        totalBruto: gastoFijoExistente.totalBruto + gasto.importe,
        baseImponible: gastoFijoExistente.baseImponible + gasto.importe,
        importe: gastoFijoExistente.importe + gasto.importe
      };
      actualizarGasto(gastoActualizado);
    } else {
      // Crear nuevo gasto fijo
      const nuevoGastoFijo: Omit<GastoFijo, 'id'> = {
        concepto: conceptoGastoFijo,
        totalBruto: gasto.importe,
        baseImponible: gasto.importe,
        tieneIva: false,
        importe: gasto.importe,
        frecuencia: 'mensual'
      };
      agregarGasto(nuevoGastoFijo);
    }
  }, [empleados, empleadosGerencia, gastosFijos, agregarGasto, actualizarGasto]);

  // Sincronizar salarios de gerencia con gastos fijos
  const sincronizarSalariosGerenciaConGastosFijos = useCallback(() => {
    empleadosGerencia.forEach(empleado => {
      const conceptoSalario = `Salario - ${empleado.nombre} ${empleado.apellidos}`;
      const conceptoSS = `SS Empresa - ${empleado.nombre} ${empleado.apellidos}`;
      const conceptoRetenciones = `Retenciones - ${empleado.nombre} ${empleado.apellidos}`;

      // Verificar y crear/actualizar gasto de salario
      const gastoSalarioExistente = gastosFijos.find(gf => gf.concepto === conceptoSalario);
      if (!gastoSalarioExistente) {
        agregarGasto({
          concepto: conceptoSalario,
          totalBruto: empleado.salarioBruto,
          baseImponible: empleado.salarioBruto,
          tieneIva: false,
          importe: empleado.salarioBruto,
          frecuencia: 'mensual'
        });
      }

      // Verificar y crear/actualizar gasto de seguridad social
      const gastoSSExistente = gastosFijos.find(gf => gf.concepto === conceptoSS);
      if (!gastoSSExistente) {
        agregarGasto({
          concepto: conceptoSS,
          totalBruto: empleado.seguridadSocialEmpresa,
          baseImponible: empleado.seguridadSocialEmpresa,
          tieneIva: false,
          importe: empleado.seguridadSocialEmpresa,
          frecuencia: 'mensual'
        });
      }

      // Verificar y crear/actualizar gasto de retenciones
      const gastoRetencionesExistente = gastosFijos.find(gf => gf.concepto === conceptoRetenciones);
      if (!gastoRetencionesExistente && empleado.retenciones > 0) {
        agregarGasto({
          concepto: conceptoRetenciones,
          totalBruto: empleado.retenciones,
          baseImponible: empleado.retenciones,
          tieneIva: false,
          importe: empleado.retenciones,
          frecuencia: 'mensual'
        });
      }
    });
  }, [empleadosGerencia, gastosFijos, agregarGasto]);

  // Verificar si un gasto fijo es de personal de gerencia
  const esGastoDePersonalGerencia = useCallback((gastoFijo: GastoFijo): boolean => {
    return empleadosGerencia.some(empleado => 
      gastoFijo.concepto.includes(`${empleado.nombre} ${empleado.apellidos}`) ||
      gastoFijo.concepto.includes(empleado.nombre)
    );
  }, [empleadosGerencia]);

  // Obtener gastos fijos que NO son de personal de gerencia (para evitar duplicados en análisis)
  const gastosFijosSinPersonalGerencia = gastosFijos.filter(gasto => 
    !esGastoDePersonalGerencia(gasto)
  );

  return {
    empleadosGerencia,
    sincronizarGastoVariableConGastosFijos,
    sincronizarSalariosGerenciaConGastosFijos,
    esGastoDePersonalGerencia,
    gastosFijosSinPersonalGerencia
  };
};
