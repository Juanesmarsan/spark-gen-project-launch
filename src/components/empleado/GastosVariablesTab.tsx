
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { Empleado, GastoVariableEmpleado } from "@/types/empleado";
import { useImputacionGastosProyectos } from "@/hooks/useImputacionGastosProyectos";
import { useToast } from "@/hooks/use-toast";
import { GastoVariableForm } from "./gastos/GastoVariableForm";
import { ProyectoSelectionDialog } from "./gastos/ProyectoSelectionDialog";
import { GastosVariablesSummary } from "./gastos/GastosVariablesSummary";
import { GastosVariablesTable } from "./gastos/GastosVariablesTable";

interface GastosVariablesTabProps {
  empleado: Empleado;
  onAgregarGasto: (gasto: Omit<GastoVariableEmpleado, 'id'>) => void;
  onEditarGasto?: (gastoId: number, gastoActualizado: Omit<GastoVariableEmpleado, 'id'>) => void;
  onEliminarGasto?: (gastoId: number) => void;
}

export const GastosVariablesTab = ({ empleado, onAgregarGasto, onEditarGasto, onEliminarGasto }: GastosVariablesTabProps) => {
  const [mostrarDialog, setMostrarDialog] = useState(false);
  const [gastoEditando, setGastoEditando] = useState<GastoVariableEmpleado | null>(null);
  const [mostrarDialogProyectos, setMostrarDialogProyectos] = useState(false);
  const [proyectosDisponibles, setProyectosDisponibles] = useState<Array<{id: number, nombre: string}>>([]);
  const [gastoParaImputar, setGastoParaImputar] = useState<Omit<GastoVariableEmpleado, 'id'> | null>(null);

  const { imputarGastoAProyecto, imputarGastoManual } = useImputacionGastosProyectos();
  const { toast } = useToast();

  const handleSubmit = (formData: {
    concepto: 'dieta' | 'alojamiento' | 'transporte' | 'otro';
    descripcion: string;
    importe: number;
    fecha: Date;
  }) => {
    console.log('GastosVariablesTab: Procesando gasto:', formData);
    
    if (gastoEditando && onEditarGasto) {
      console.log('GastosVariablesTab: Editando gasto existente');
      onEditarGasto(gastoEditando.id, formData);
      setMostrarDialog(false);
      setGastoEditando(null);
    } else {
      console.log('GastosVariablesTab: Agregando nuevo gasto');
      
      // Intentar imputar automáticamente a un proyecto
      const resultadoImputacion = imputarGastoAProyecto(empleado.id, formData);
      
      if (resultadoImputacion.imputado) {
        // Se imputó automáticamente
        toast({
          title: "Gasto imputado automáticamente",
          description: `El gasto se ha imputado al proyecto: ${resultadoImputacion.proyecto}`,
        });
      } else if (resultadoImputacion.proyectosDisponibles && resultadoImputacion.proyectosDisponibles.length > 0) {
        // Hay múltiples proyectos, mostrar dialog de selección
        setGastoParaImputar(formData);
        setProyectosDisponibles(resultadoImputacion.proyectosDisponibles);
        setMostrarDialogProyectos(true);
        setMostrarDialog(false);
        return;
      } else {
        // No hay proyectos, agregar como gasto general del empleado
        toast({
          title: "Gasto agregado al empleado",
          description: "No se encontraron proyectos activos. El gasto se ha registrado como gasto general del empleado.",
        });
      }
      
      // Agregar el gasto al empleado en cualquier caso
      onAgregarGasto(formData);
      setMostrarDialog(false);
    }
  };

  const handleImputarProyectoSeleccionado = (proyectoId: number) => {
    if (gastoParaImputar) {
      // Imputar manualmente al proyecto seleccionado
      imputarGastoManual(proyectoId, empleado.id, gastoParaImputar);
      
      // Agregar también como gasto del empleado
      onAgregarGasto(gastoParaImputar);
      
      const proyectoSeleccionado = proyectosDisponibles.find(p => p.id === proyectoId);
      toast({
        title: "Gasto imputado",
        description: `El gasto se ha imputado al proyecto: ${proyectoSeleccionado?.nombre}`,
      });
    }
    
    setMostrarDialogProyectos(false);
    setGastoParaImputar(null);
    setProyectosDisponibles([]);
  };

  const handleNoImputar = () => {
    if (gastoParaImputar) {
      // Solo agregar como gasto del empleado sin imputar a proyecto
      onAgregarGasto(gastoParaImputar);
      toast({
        title: "Gasto agregado",
        description: "El gasto se ha registrado como gasto general del empleado.",
      });
    }
    
    setMostrarDialogProyectos(false);
    setGastoParaImputar(null);
    setProyectosDisponibles([]);
  };

  const handleEditar = (gasto: GastoVariableEmpleado) => {
    console.log('GastosVariablesTab: Preparando edición de gasto:', gasto);
    setGastoEditando(gasto);
    setMostrarDialog(true);
  };

  const handleEliminar = (gastoId: number) => {
    console.log('GastosVariablesTab: Eliminando gasto:', gastoId);
    if (onEliminarGasto) {
      onEliminarGasto(gastoId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Gastos Variables</h3>
          <p className="text-sm text-muted-foreground">
            Gestiona dietas, alojamiento, transporte y otros gastos del empleado
          </p>
        </div>
        
        <Button onClick={() => setMostrarDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Añadir Gasto
        </Button>
      </div>

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
