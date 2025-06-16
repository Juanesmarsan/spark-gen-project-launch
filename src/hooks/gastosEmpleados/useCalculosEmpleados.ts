
import { useCallback } from 'react';
import { CalculoCosteEmpleado } from '@/types/gastoEmpleado';
import { useEmpleados } from '../useEmpleados';

export const useCalculosEmpleados = () => {
  const { empleados } = useEmpleados();

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

  return {
    calcularDiasLaborales,
    calcularCosteEmpleado
  };
};
