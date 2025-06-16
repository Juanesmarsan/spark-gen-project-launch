import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Proyecto, Trabajador } from "@/types/proyecto";
import { Empleado } from "@/types/empleado";
import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { generarCalendarioMesPuro } from "@/utils/calendarioUtils";
import { TrabajadoresHeader } from "./trabajadores/TrabajadoresHeader";
import { TrabajadoresTable } from "./trabajadores/TrabajadoresTable";
import { TrabajadorEditDialog } from "./trabajadores/TrabajadorEditDialog";
import { TrabajadoresResumenMes } from "./trabajadores/TrabajadoresResumenMes";

interface TrabajadoresTabProps {
  proyecto: Proyecto;
  empleados: Empleado[];
  onUpdateProyecto: (proyecto: Proyecto) => void;
}

const calcularHorasTrabajador = (trabajador: Trabajador, mesSeleccionado: Date): number => {
  console.log(`Calculando horas para ${trabajador.nombre} en ${format(mesSeleccionado, 'MMMM yyyy', { locale: es })}`);
  
  // Si no hay fecha de entrada, no contar horas
  if (!trabajador.fechaEntrada) {
    console.log(`${trabajador.nombre}: Sin fecha de entrada, 0 horas`);
    return 0;
  }
  
  const mes = mesSeleccionado.getMonth() + 1;
  const año = mesSeleccionado.getFullYear();
  
  // Fechas de trabajo del empleado
  const fechaEntrada = trabajador.fechaEntrada;
  const fechaSalida = trabajador.fechaSalida || new Date();
  
  // Fechas límite del mes seleccionado
  const primerDiaMes = new Date(año, mes - 1, 1);
  const ultimoDiaMes = new Date(año, mes, 0);

  // Verificar si el trabajador estaba activo durante ese mes
  if (fechaEntrada > ultimoDiaMes || fechaSalida < primerDiaMes) {
    console.log(`${trabajador.nombre}: 0 horas (no activo en ${format(mesSeleccionado, 'MMMM yyyy', { locale: es })})`);
    return 0;
  }
  
  // Determinar las fechas efectivas para este mes
  const fechaInicioEfectiva = fechaEntrada > primerDiaMes ? fechaEntrada : primerDiaMes;
  const fechaFinEfectiva = fechaSalida < ultimoDiaMes ? fechaSalida : ultimoDiaMes;
  
  console.log(`Período efectivo: ${fechaInicioEfectiva.toLocaleDateString()} - ${fechaFinEfectiva.toLocaleDateString()}`);
  
  const calendario = generarCalendarioMesPuro(trabajador.id, mes, año);
  
  let horasTotales = 0;
  calendario.dias.forEach(dia => {
    const fechaDia = new Date(año, mes - 1, dia.fecha.getDate());
    
    // Solo contar días dentro del período efectivo del trabajador
    if (fechaDia >= fechaInicioEfectiva && fechaDia <= fechaFinEfectiva) {
      if (dia.tipo === 'laborable' || dia.tipo === 'sabado') {
        if (!dia.ausencia || !['vacaciones', 'baja_medica', 'baja_laboral', 'baja_personal'].includes(dia.ausencia.tipo)) {
          horasTotales += dia.horasReales || 0;
        }
      }
    }
  });
  
  console.log(`${trabajador.nombre}: ${horasTotales} horas en ${format(mesSeleccionado, 'MMMM yyyy', { locale: es })}`);
  return horasTotales;
};

export const TrabajadoresTab = ({ proyecto, empleados, onUpdateProyecto }: TrabajadoresTabProps) => {
  const [mesSeleccionado, setMesSeleccionado] = useState<Date>(new Date());
  const [trabajadorEditando, setTrabajadorEditando] = useState<Trabajador | null>(null);
  const [fechaEntrada, setFechaEntrada] = useState<Date | undefined>();
  const [fechaSalida, setFechaSalida] = useState<Date | undefined>();
  const [precioHora, setPrecioHora] = useState<number | undefined>();
  const [mostrarAsignacion, setMostrarAsignacion] = useState(false);
  const [trabajadoresAsignados, setTrabajadoresAsignados] = useState<number[]>([]);
  const [trabajadoresConFechas, setTrabajadoresConFechas] = useState<{id: number; fechaEntrada?: Date; fechaSalida?: Date}[]>([]);

  const empleadosActivos = empleados.filter(e => e.activo);
  const empleadosDisponibles = empleadosActivos.filter(e => 
    !proyecto.trabajadoresAsignados.some(t => t.id === e.id)
  );

  const handleTrabajadorToggle = (empleadoId: number, checked: boolean) => {
    if (checked) {
      setTrabajadoresAsignados(prev => [...prev, empleadoId]);
      setTrabajadoresConFechas(prev => [...prev, { id: empleadoId, fechaEntrada: new Date() }]);
    } else {
      setTrabajadoresAsignados(prev => prev.filter(id => id !== empleadoId));
      setTrabajadoresConFechas(prev => prev.filter(t => t.id !== empleadoId));
    }
  };

  const handleUpdateTrabajadorFecha = (empleadoId: number, tipo: 'entrada' | 'salida', fecha: Date | undefined) => {
    setTrabajadoresConFechas(prev => 
      prev.map(t => 
        t.id === empleadoId 
          ? { ...t, [tipo === 'entrada' ? 'fechaEntrada' : 'fechaSalida']: fecha }
          : t
      )
    );
  };

  const handleAsignarTrabajadores = () => {
    const nuevosTrabajadores: Trabajador[] = trabajadoresAsignados.map(empleadoId => {
      const empleado = empleados.find(e => e.id === empleadoId);
      const fechasTrabajador = trabajadoresConFechas.find(t => t.id === empleadoId);
      
      return {
        id: empleado!.id,
        nombre: empleado!.nombre,
        apellidos: empleado!.apellidos,
        precioHora: proyecto.tipo === 'administracion' ? proyecto.precioHora : undefined,
        fechaEntrada: fechasTrabajador?.fechaEntrada,
        fechaSalida: fechasTrabajador?.fechaSalida
      };
    });

    const proyectoActualizado = {
      ...proyecto,
      trabajadoresAsignados: [...proyecto.trabajadoresAsignados, ...nuevosTrabajadores]
    };

    onUpdateProyecto(proyectoActualizado);
    setMostrarAsignacion(false);
    setTrabajadoresAsignados([]);
    setTrabajadoresConFechas([]);
  };

  const handleEditarTrabajador = (trabajador: Trabajador) => {
    setTrabajadorEditando(trabajador);
    setFechaEntrada(trabajador.fechaEntrada);
    setFechaSalida(trabajador.fechaSalida);
    setPrecioHora(trabajador.precioHora);
  };

  const handleGuardarEdicion = () => {
    if (!trabajadorEditando) return;

    const trabajadoresActualizados = proyecto.trabajadoresAsignados.map(t => 
      t.id === trabajadorEditando.id 
        ? { ...t, fechaEntrada, fechaSalida, precioHora }
        : t
    );

    const proyectoActualizado = {
      ...proyecto,
      trabajadoresAsignados: trabajadoresActualizados
    };

    onUpdateProyecto(proyectoActualizado);
    setTrabajadorEditando(null);
    setFechaEntrada(undefined);
    setFechaSalida(undefined);
    setPrecioHora(undefined);
  };

  const handleEliminarTrabajador = (trabajadorId: number) => {
    const trabajadoresFiltrados = proyecto.trabajadoresAsignados.filter(t => t.id !== trabajadorId);
    
    const proyectoActualizado = {
      ...proyecto,
      trabajadoresAsignados: trabajadoresFiltrados
    };

    onUpdateProyecto(proyectoActualizado);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <TrabajadoresHeader
            mesSeleccionado={mesSeleccionado}
            onMesChange={setMesSeleccionado}
            empleadosDisponibles={empleadosDisponibles}
            mostrarAsignacion={mostrarAsignacion}
            onMostrarAsignacionChange={setMostrarAsignacion}
            trabajadoresAsignados={trabajadoresAsignados}
            trabajadoresConFechas={trabajadoresConFechas}
            onTrabajadorToggle={handleTrabajadorToggle}
            onUpdateTrabajadorFecha={handleUpdateTrabajadorFecha}
            onAsignarTrabajadores={handleAsignarTrabajadores}
          />
        </CardHeader>
        <CardContent>
          <TrabajadoresTable
            proyecto={proyecto}
            mesSeleccionado={mesSeleccionado}
            calcularHorasTrabajador={calcularHorasTrabajador}
            onEditarTrabajador={handleEditarTrabajador}
            onEliminarTrabajador={handleEliminarTrabajador}
          />
        </CardContent>
      </Card>

      <TrabajadorEditDialog
        trabajadorEditando={trabajadorEditando}
        proyecto={proyecto}
        fechaEntrada={fechaEntrada}
        fechaSalida={fechaSalida}
        precioHora={precioHora}
        onClose={() => setTrabajadorEditando(null)}
        onFechaEntradaChange={setFechaEntrada}
        onFechaSalidaChange={setFechaSalida}
        onPrecioHoraChange={setPrecioHora}
        onGuardar={handleGuardarEdicion}
      />

      <TrabajadoresResumenMes
        proyecto={proyecto}
        mesSeleccionado={mesSeleccionado}
        calcularHorasTrabajador={calcularHorasTrabajador}
      />
    </div>
  );
};
