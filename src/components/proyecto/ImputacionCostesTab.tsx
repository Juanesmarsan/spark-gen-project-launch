
import { useState } from "react";
import { Proyecto } from "@/types/proyecto";
import { Empleado } from "@/types/empleado";
import { useImputacionCostesSalariales } from "@/hooks/useImputacionCostesSalariales";
import { useGastosEmpleados } from "@/hooks/useGastosEmpleados";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ImputacionHeader } from "./imputacion/ImputacionHeader";
import { CosteSummaryCards } from "./imputacion/CosteSummaryCards";
import { CostesTable } from "./imputacion/CostesTable";
import { TrabajadoresAusenciasSection } from "./imputacion/TrabajadoresAusenciasSection";

interface ImputacionCostesTabProps {
  proyecto: Proyecto;
  empleados: Empleado[];
}

export const ImputacionCostesTab = ({ proyecto, empleados }: ImputacionCostesTabProps) => {
  const [mesSeleccionado, setMesSeleccionado] = useState<string>('2025-06');
  const [procesando, setProcesando] = useState(false);

  const { imputarCostesSalarialesEmpleado } = useImputacionCostesSalariales();
  const { obtenerGastosPorProyectoMes, eliminarGastoEmpleadoProyecto } = useGastosEmpleados();
  const { toast } = useToast();

  const [anio, mes] = mesSeleccionado.split('-').map(Number);

  // Obtener gastos ya imputados para el mes seleccionado
  const gastosImputados = obtenerGastosPorProyectoMes(proyecto.id, mes, anio);

  // Calcular gastos variables del proyecto para el mes seleccionado
  const gastosVariablesProyecto = proyecto.gastosVariables?.filter(gasto => {
    const fechaGasto = new Date(gasto.fecha);
    return fechaGasto.getMonth() + 1 === mes && fechaGasto.getFullYear() === anio;
  }).reduce((total, gasto) => total + gasto.importe, 0) || 0;

  // Calcular totales
  const totalCostesSalariales = gastosImputados.reduce((total, gasto) => 
    total + (gasto.salarioBrutoProrrateo || 0) + (gasto.seguridadSocialEmpresaProrrateo || 0) + 
    (gasto.importeHorasExtras || 0) + (gasto.importeHorasFestivas || 0), 0
  );

  const totalGastosVariablesEmpleados = gastosImputados.reduce((total, gasto) => 
    total + (gasto.gastos?.reduce((subTotal, gastoVar) => subTotal + (gastoVar.importe || 0), 0) || 0), 0
  );

  const totalGastosVariables = totalGastosVariablesEmpleados + gastosVariablesProyecto;
  const totalGeneral = totalCostesSalariales + totalGastosVariables;

  const handleImputarCostes = async () => {
    setProcesando(true);
    
    try {
      let imputacionesRealizadas = 0;

      // Imputar costes de cada trabajador asignado al proyecto
      for (const trabajador of proyecto.trabajadoresAsignados) {
        const empleado = empleados.find(e => e.id === trabajador.id);
        if (empleado && empleado.activo) {
          const imputaciones = imputarCostesSalarialesEmpleado(empleado, mes, anio);
          const imputacionProyecto = imputaciones.find(imp => imp.proyectoId === proyecto.id);
          
          if (imputacionProyecto && imputacionProyecto.diasTrabajados > 0) {
            imputacionesRealizadas++;
          }
        }
      }

      toast({
        title: "Costes imputados correctamente",
        description: `Se han imputado los costes de ${imputacionesRealizadas} trabajadores para ${format(new Date(anio, mes - 1), 'MMMM yyyy', { locale: es })}`,
      });

    } catch (error) {
      console.error('Error al imputar costes:', error);
      toast({
        title: "Error",
        description: "Hubo un error al imputar los costes salariales.",
        variant: "destructive"
      });
    } finally {
      setProcesando(false);
    }
  };

  const handleEliminarCoste = async (gastoId: number) => {
    try {
      eliminarGastoEmpleadoProyecto(gastoId);
      toast({
        title: "Coste eliminado",
        description: "El coste imputado se ha eliminado correctamente.",
      });
    } catch (error) {
      console.error('Error al eliminar coste:', error);
      toast({
        title: "Error",
        description: "Hubo un error al eliminar el coste.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <ImputacionHeader
        mesSeleccionado={mesSeleccionado}
        onMesChange={setMesSeleccionado}
        onImputarCostes={handleImputarCostes}
        procesando={procesando}
      />

      <CosteSummaryCards
        totalCostesSalariales={totalCostesSalariales}
        totalGastosVariables={totalGastosVariables}
        totalGeneral={totalGeneral}
        mes={mes}
        anio={anio}
        cantidadRegistros={gastosImputados.length}
        gastosVariablesProyecto={gastosVariablesProyecto}
        gastosVariablesEmpleados={totalGastosVariablesEmpleados}
      />

      <TrabajadoresAusenciasSection
        proyecto={proyecto}
        empleados={empleados}
        mes={mes}
        anio={anio}
      />

      <CostesTable
        gastosImputados={gastosImputados}
        empleados={empleados}
        mes={mes}
        anio={anio}
        onEliminarCoste={handleEliminarCoste}
      />
    </div>
  );
};
