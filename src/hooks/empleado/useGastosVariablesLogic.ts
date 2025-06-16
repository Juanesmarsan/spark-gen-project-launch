import { useState, useCallback } from "react";
import { Empleado, GastoVariableEmpleado } from "@/types/empleado";
import { useToast } from "@/hooks/use-toast";
import { useProyectos } from "@/hooks/useProyectos";
import { useGastosEmpleados } from "@/hooks/useGastosEmpleados";
import { useImputacionCostesSalariales } from "@/hooks/useImputacionCostesSalariales";

export const useGastosVariablesLogic = (
  empleado: Empleado,
  onAgregarGasto: (gasto: Omit<GastoVariableEmpleado, 'id'>) => void,
  onEditarGasto?: (gastoId: number, gastoActualizado: Omit<GastoVariableEmpleado, 'id'>) => void,
  onEliminarGasto?: (gastoId: number) => void
) => {
  const [mostrarDialog, setMostrarDialog] = useState(false);
  const [gastoEditando, setGastoEditando] = useState<GastoVariableEmpleado | null>(null);
  const [mostrarDialogProyectos, setMostrarDialogProyectos] = useState(false);
  const [proyectosDisponibles, setProyectosDisponibles] = useState<Array<{id: number, nombre: string}>>([]);
  const [gastoParaImputar, setGastoParaImputar] = useState<Omit<GastoVariableEmpleado, 'id'> | null>(null);

  const { proyectos, agregarGastoProyecto } = useProyectos();
  const { agregarGastoVariable } = useGastosEmpleados();
  const { imputarCostesSalarialesEmpleado } = useImputacionCostesSalariales();
  const { toast } = useToast();

  const buscarProyectosActivos = useCallback((fechaGasto: Date) => {
    console.log('useGastosVariablesLogic: Buscando proyectos activos para empleado:', empleado.id, 'en fecha:', fechaGasto);
    
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

    console.log('useGastosVariablesLogic: Proyectos encontrados:', proyectosDelEmpleado.length);
    return proyectosDelEmpleado;
  }, [empleado.id, proyectos]);

  // Imputar gastos salariales automáticamente
  const imputarGastosSalariales = useCallback((fechaGasto: Date) => {
    console.log('useGastosVariablesLogic: Imputando gastos salariales automáticamente para fecha:', fechaGasto);
    
    const mes = fechaGasto.getMonth() + 1;
    const anio = fechaGasto.getFullYear();
    
    // Imputar costes salariales del empleado para el mes del gasto
    const imputaciones = imputarCostesSalarialesEmpleado(empleado, mes, anio);
    
    if (imputaciones.length > 0) {
      console.log('useGastosVariablesLogic: Gastos salariales imputados:', imputaciones.length, 'proyectos');
      toast({
        title: "Gastos salariales imputados",
        description: `Se han imputado automáticamente los costes salariales a ${imputaciones.length} proyecto(s) para ${mes}/${anio}`,
      });
    }
  }, [empleado, imputarCostesSalarialesEmpleado, toast]);

  // Mapear conceptos de empleado a tipos de gastos de proyecto
  const mapearConceptoAProyecto = useCallback((concepto: 'dieta' | 'alojamiento' | 'transporte' | 'otro') => {
    switch (concepto) {
      case 'transporte':
        return 'viaje';
      case 'otro':
        return 'otro';
      default:
        return concepto;
    }
  }, []);

  const handleSubmit = useCallback((formData: {
    concepto: 'dieta' | 'alojamiento' | 'transporte' | 'otro';
    descripcion: string;
    importe: number;
    fecha: Date;
  }) => {
    console.log('useGastosVariablesLogic: Procesando gasto:', formData);
    
    if (gastoEditando && onEditarGasto) {
      console.log('useGastosVariablesLogic: Editando gasto existente');
      onEditarGasto(gastoEditando.id, formData);
      setMostrarDialog(false);
      setGastoEditando(null);
    } else {
      console.log('useGastosVariablesLogic: Agregando nuevo gasto');
      
      // Imputar gastos salariales automáticamente cuando se agrega un gasto
      imputarGastosSalariales(formData.fecha);
      
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
        const tipoGastoEmpleado = mapearConceptoAProyecto(formData.concepto) as 'dieta' | 'alojamiento' | 'combustible' | 'viaje' | 'otro';
        
        agregarGastoVariable(Date.now(), {
          tipo: tipoGastoEmpleado,
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
  }, [gastoEditando, onEditarGasto, onAgregarGasto, empleado.id, empleado.nombre, buscarProyectosActivos, agregarGastoProyecto, agregarGastoVariable, mapearConceptoAProyecto, imputarGastosSalariales, toast]);

  const handleImputarProyectoSeleccionado = useCallback((proyectoId: number) => {
    if (gastoParaImputar) {
      // Imputar gastos salariales cuando se selecciona un proyecto
      imputarGastosSalariales(gastoParaImputar.fecha);
      
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
      const tipoGastoEmpleado = mapearConceptoAProyecto(gastoParaImputar.concepto) as 'dieta' | 'alojamiento' | 'combustible' | 'viaje' | 'otro';
      
      agregarGastoVariable(Date.now(), {
        tipo: tipoGastoEmpleado,
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
  }, [gastoParaImputar, empleado.id, empleado.nombre, agregarGastoProyecto, agregarGastoVariable, mapearConceptoAProyecto, onAgregarGasto, proyectosDisponibles, imputarGastosSalariales, toast]);

  const handleNoImputar = useCallback(() => {
    if (gastoParaImputar) {
      // Imputar gastos salariales aunque no se impute el gasto variable
      imputarGastosSalariales(gastoParaImputar.fecha);
      
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
  }, [gastoParaImputar, onAgregarGasto, imputarGastosSalariales, toast]);

  const handleEditar = useCallback((gasto: GastoVariableEmpleado) => {
    console.log('useGastosVariablesLogic: Preparando edición de gasto:', gasto);
    setGastoEditando(gasto);
    setMostrarDialog(true);
  }, []);

  const handleEliminar = useCallback((gastoId: number) => {
    console.log('useGastosVariablesLogic: Eliminando gasto:', gastoId);
    if (onEliminarGasto) {
      onEliminarGasto(gastoId);
    }
  }, [onEliminarGasto]);

  return {
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
  };
};
