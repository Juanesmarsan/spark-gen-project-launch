
import { useGastosEmpleadosStorage } from './gastosEmpleados/useGastosEmpleadosStorage';
import { useCalculosEmpleados } from './gastosEmpleados/useCalculosEmpleados';
import { useGastosEmpleadosOperations } from './gastosEmpleados/useGastosEmpleadosOperations';
import { useGastosEmpleadosQueries } from './gastosEmpleados/useGastosEmpleadosQueries';

export const useGastosEmpleados = () => {
  const { gastosEmpleadosProyectos, setGastosEmpleadosProyectos, guardarEnStorage } = useGastosEmpleadosStorage();
  const { calcularCosteEmpleado, calcularDiasLaborales } = useCalculosEmpleados();
  const { registrarGastoEmpleadoProyecto, agregarGastoVariable, eliminarGastoEmpleadoProyecto } = useGastosEmpleadosOperations(
    gastosEmpleadosProyectos,
    setGastosEmpleadosProyectos,
    guardarEnStorage
  );
  const { obtenerGastosPorEmpleadoMes, obtenerGastosPorProyectoMes, calcularCosteTotalEmpleadoProyecto } = useGastosEmpleadosQueries(gastosEmpleadosProyectos);

  return {
    gastosEmpleadosProyectos,
    calcularCosteEmpleado,
    registrarGastoEmpleadoProyecto,
    agregarGastoVariable,
    eliminarGastoEmpleadoProyecto,
    obtenerGastosPorEmpleadoMes,
    obtenerGastosPorProyectoMes,
    calcularCosteTotalEmpleadoProyecto,
    calcularDiasLaborales
  };
};
