
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, CalendarDays, UserPlus } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Empleado } from "@/types/empleado";
import { TrabajadorAssignment } from "../TrabajadorAssignment";

interface TrabajadoresHeaderProps {
  mesSeleccionado: Date;
  onMesChange: (date: Date) => void;
  empleadosDisponibles: Empleado[];
  mostrarAsignacion: boolean;
  onMostrarAsignacionChange: (show: boolean) => void;
  trabajadoresAsignados: number[];
  trabajadoresConFechas: {id: number; fechaEntrada?: Date; fechaSalida?: Date}[];
  onTrabajadorToggle: (empleadoId: number, checked: boolean) => void;
  onUpdateTrabajadorFecha: (empleadoId: number, tipo: 'entrada' | 'salida', fecha: Date | undefined) => void;
  onAsignarTrabajadores: () => void;
}

export const TrabajadoresHeader = ({
  mesSeleccionado,
  onMesChange,
  empleadosDisponibles,
  mostrarAsignacion,
  onMostrarAsignacionChange,
  trabajadoresAsignados,
  trabajadoresConFechas,
  onTrabajadorToggle,
  onUpdateTrabajadorFecha,
  onAsignarTrabajadores
}: TrabajadoresHeaderProps) => {
  const mesesDisponibles = [
    { value: '2025-01', label: 'Enero 2025', date: new Date(2025, 0, 1) },
    { value: '2025-02', label: 'Febrero 2025', date: new Date(2025, 1, 1) },
    { value: '2025-03', label: 'Marzo 2025', date: new Date(2025, 2, 1) },
    { value: '2025-04', label: 'Abril 2025', date: new Date(2025, 3, 1) },
    { value: '2025-05', label: 'Mayo 2025', date: new Date(2025, 4, 1) },
    { value: '2025-06', label: 'Junio 2025', date: new Date(2025, 5, 1) },
    { value: '2025-07', label: 'Julio 2025', date: new Date(2025, 6, 1) },
    { value: '2025-08', label: 'Agosto 2025', date: new Date(2025, 7, 1) },
    { value: '2025-09', label: 'Septiembre 2025', date: new Date(2025, 8, 1) },
    { value: '2025-10', label: 'Octubre 2025', date: new Date(2025, 9, 1) },
    { value: '2025-11', label: 'Noviembre 2025', date: new Date(2025, 10, 1) },
    { value: '2025-12', label: 'Diciembre 2025', date: new Date(2025, 11, 1) },
  ];

  const mesActual = format(mesSeleccionado, 'yyyy-MM');

  return (
    <div className="flex justify-between items-center">
      <CardTitle className="flex items-center gap-2">
        <Users className="w-5 h-5" />
        Trabajadores Asignados
      </CardTitle>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4" />
          <Select value={mesActual} onValueChange={(value) => {
            const mesEncontrado = mesesDisponibles.find(m => m.value === value);
            if (mesEncontrado) {
              onMesChange(mesEncontrado.date);
            }
          }}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Seleccionar mes" />
            </SelectTrigger>
            <SelectContent>
              {mesesDisponibles.map((mes) => (
                <SelectItem key={mes.value} value={mes.value}>
                  {mes.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {empleadosDisponibles.length > 0 && (
          <Dialog open={mostrarAsignacion} onOpenChange={onMostrarAsignacionChange}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="w-4 h-4 mr-2" />
                Asignar Trabajadores
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Asignar Nuevos Trabajadores</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <TrabajadorAssignment
                  empleadosActivos={empleadosDisponibles}
                  trabajadoresAsignados={trabajadoresAsignados}
                  trabajadoresConFechas={trabajadoresConFechas}
                  onTrabajadorToggle={onTrabajadorToggle}
                  onUpdateTrabajadorFecha={onUpdateTrabajadorFecha}
                />
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => onMostrarAsignacionChange(false)}>
                    Cancelar
                  </Button>
                  <Button 
                    onClick={onAsignarTrabajadores}
                    disabled={trabajadoresAsignados.length === 0}
                  >
                    Asignar Trabajadores
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};
