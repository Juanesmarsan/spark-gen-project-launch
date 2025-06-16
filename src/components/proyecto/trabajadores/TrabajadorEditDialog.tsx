
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Trabajador, Proyecto } from "@/types/proyecto";

interface TrabajadorEditDialogProps {
  trabajadorEditando: Trabajador | null;
  proyecto: Proyecto;
  fechaEntrada?: Date;
  fechaSalida?: Date;
  precioHora?: number;
  onClose: () => void;
  onFechaEntradaChange: (fecha: Date | undefined) => void;
  onFechaSalidaChange: (fecha: Date | undefined) => void;
  onPrecioHoraChange: (precio: number | undefined) => void;
  onGuardar: () => void;
}

export const TrabajadorEditDialog = ({
  trabajadorEditando,
  proyecto,
  fechaEntrada,
  fechaSalida,
  precioHora,
  onClose,
  onFechaEntradaChange,
  onFechaSalidaChange,
  onPrecioHoraChange,
  onGuardar
}: TrabajadorEditDialogProps) => {
  return (
    <Dialog open={!!trabajadorEditando} onOpenChange={() => onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Trabajador</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Trabajador: {trabajadorEditando?.nombre} {trabajadorEditando?.apellidos}</Label>
          </div>
          
          <div>
            <Label>Fecha de Entrada</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !fechaEntrada && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {fechaEntrada ? format(fechaEntrada, "dd/MM/yyyy") : "Seleccionar fecha"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={fechaEntrada}
                  onSelect={onFechaEntradaChange}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label>Fecha de Salida (opcional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !fechaSalida && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {fechaSalida ? format(fechaSalida, "dd/MM/yyyy") : "Sin fecha de salida"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={fechaSalida}
                  onSelect={onFechaSalidaChange}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            {fechaSalida && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onFechaSalidaChange(undefined)}
                className="mt-2 text-red-600 hover:text-red-700"
              >
                Quitar fecha de salida
              </Button>
            )}
          </div>

          {proyecto.tipo === 'administracion' && (
            <div>
              <Label>Precio por Hora (€)</Label>
              <Input
                type="number"
                step="0.01"
                value={precioHora || ''}
                onChange={(e) => onPrecioHoraChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                placeholder="Precio por hora"
              />
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={onGuardar}>
              Guardar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
