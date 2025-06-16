
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Empleado, GastoVariableEmpleado } from "@/types/empleado";
import { useToast } from "@/hooks/use-toast";
import { useProyectos } from "@/hooks/useProyectos";
import { useGastosEmpleados } from "@/hooks/useGastosEmpleados";
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

  const { proyectos, agregarGastoProyecto } = useProyectos();
  const { agregarGastoVariable } = useGastosEmpleados();
  const { toast } = useToast();

  const buscarProyectosActivos = (fechaGasto: Date) => {
    console.log('GastosVariablesTab: Buscando proyectos activos para empleado:', empleado.id, 'en fecha:', fechaGasto);
    
    const proyectosDelEmpleado = proyectos.filter(proyecto => {
      const empleadoAsignado = proyecto.trabajadoresAsignados.some(trabajador => trabajador.id === empleado.id);
      if (!empleadoAsignado) return false;

      const trabajadorAsignado = proyecto.trabajadoresAsignados.find(t => t.id === empleado.id);
      if (!trabajadorAsignado) return false;

      // Verificar fechas de trabajo en el proyecto
      const despuesFechaEntrada = !trabajadorAsignado.fechaEntrada || fechaGasto >= trabajadorAsignado.fechaEntrada;
      const antesFechaSalida = !trabajadorAsignado.fechaSalida || fechaGasto <= trabajadorAsignado.fechaSalida;
      
      return despuesFechaEntrada && antesFechaSalida && proyecto.estado === 'activo';
    });

    console.log('GastosVariablesTab: Proyectos encontrados:', proyectosDelEmpleado.length);
    return proyectosDelEmpleado;
  };

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
      
      // Buscar proyectos activos para la fecha del gasto
      const proyectosActivos = buscarProyectosActivos(formData.fecha);
      
      if (proyectosActivos.length === 1) {
        // Imputar automáticamente al único proyecto
        const proyecto = proyectosActivos[0];
        
        // Agregar como gasto de proyecto
        const gastoProyecto = {
          concepto: `${formData.concepto} - ${empleado.nombre}`,
          categoria: 'otro' as const,
          descripcion: formData.descripcion || `Gasto de ${formData.concepto}`,
          importe: formData.importe,
          fecha: formData.fecha,
          factura: `EMP-${empleado.id}-${Date.now()}`
        };
        
        agregarGastoProyecto(proyecto.id, gastoProyecto);
        
        // También agregar como gasto variable del empleado para el proyecto
        const mes = formData.fecha.getMonth() + 1;
        const anio = formData.fecha.getFullYear();
        
        agregarGastoVariable(Date.now(), {
          tipo: formData.concepto,
          concepto: formData.descripcion,
          importe: formData.importe,
          fecha: formData.fecha,
          descripcion: formData.descripcion
        });
        
        toast({
          title: "Gasto imputado automáticamente",
          description: `El gasto se ha imputado al proyecto: ${proyecto.nombre}`,
        });
      } else if (proyectosActivos.length > 1) {
        // Mostrar dialog de selección
        setGastoParaImputar(formData);
        setProyectosDisponibles(proyectosActivos.map(p => ({ id: p.id, nombre: p.nombre })));
        setMostrarDialogProyectos(true);
        setMostrarDialog(false);
        return;
      } else {
        // No hay proyectos activos
        toast({
          title: "Gasto agregado al empleado",
          description: "No se encontraron proyectos activos para la fecha. El gasto se ha registrado como gasto general del empleado.",
        });
      }
      
      // Agregar el gasto al empleado en todos los casos
      onAgregarGasto(formData);
      setMostrarDialog(false);
    }
  };

  const handleImputarProyectoSeleccionado = (proyectoId: number) => {
    if (gastoParaImputar) {
      // Imputar al proyecto seleccionado
      const gastoProyecto = {
        concepto: `${gastoParaImputar.concepto} - ${empleado.nombre}`,
        categoria: 'otro' as const,
        descripcion: gastoParaImputar.descripcion || `Gasto de ${gastoParaImputar.concepto}`,
        importe: gastoParaImputar.importe,
        fecha: gastoParaImputar.fecha,
        factura: `EMP-${empleado.id}-${Date.now()}`
      };
      
      agregarGastoProyecto(proyectoId, gastoProyecto);
      
      // También agregar como gasto variable del empleado
      agregarGastoVariable(Date.now(), {
        tipo: gastoParaImputar.concepto,
        concepto: gastoParaImputar.descripcion,
        importe: gastoParaImputar.importe,
        fecha: gastoParaImputar.fecha,
        descripcion: gastoParaImputar.descripcion
      });
      
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
