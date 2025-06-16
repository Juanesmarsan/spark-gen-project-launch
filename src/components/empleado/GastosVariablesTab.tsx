
import { Empleado, GastoVariableEmpleado } from "@/types/empleado";
import { useGastosVariablesLogic } from "@/hooks/empleado/useGastosVariablesLogic";
import { GastoVariableForm } from "./gastos/GastoVariableForm";
import { ProyectoSelectionDialog } from "./gastos/ProyectoSelectionDialog";
import { GastosVariablesSummary } from "./gastos/GastosVariablesSummary";
import { GastosVariablesTable } from "./gastos/GastosVariablesTable";
import { GastosVariablesHeader } from "./gastos/GastosVariablesHeader";

interface GastosVariablesTabProps {
  empleado: Empleado;
  onAgregarGasto: (gasto: Omit<GastoVariableEmpleado, 'id'>) => void;
  onEditarGasto?: (gastoId: number, gastoActualizado: Omit<GastoVariableEmpleado, 'id'>) => void;
  onEliminarGasto?: (gastoId: number) => void;
}

export const GastosVariablesTab = ({ empleado, onAgregarGasto, onEditarGasto, onEliminarGasto }: GastosVariablesTabProps) => {
  const {
    mostrarDialog,
    setMostrarDialog,
    gastoEditando,
    mostrarDialogProyectos,
    setMostrarDialogProyectos,
    proyectosDisponibles,
    handleSubmit,
    handleImputarProyectoSeleccionado,
    handleNoImputar,
    handleEditar,
    handleEliminar
  } = useGastosVariablesLogic(empleado, onAgregarGasto, onEditarGasto, onEliminarGasto);

  return (
    <div className="space-y-6">
      <GastosVariablesHeader onAgregarGasto={() => setMostrarDialog(true)} />

      <GastoVariableForm
        open={mostrarDialog}
        onOpenChange={setMostrarDialog}
        gastoEditando={gastoEditando}
        onSubmit={handleSubmit}
      />

      <ProyectoSelectionDialog
        open={mostrarDialogProyectos}
        onOpenChange={setMostrarDialogProyectos}
        proyectosDisponibles={proyectosDisponibles}
        onSelectProyecto={handleImputarProyectoSeleccionado}
        onNoImputar={handleNoImputar}
      />

      <GastosVariablesSummary empleado={empleado} />

      <GastosVariablesTable
        empleado={empleado}
        onEditar={handleEditar}
        onEliminar={handleEliminar}
      />
    </div>
  );
};
