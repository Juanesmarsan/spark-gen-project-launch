
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Plus } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Epi } from "@/types/empleado";

interface EpiDialogProps {
  inventarioEpis: Epi[];
  onAsignarEpi: (epiId: number, fecha: Date) => void;
}

export const EpiDialog = ({ inventarioEpis, onAsignarEpi }: EpiDialogProps) => {
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [epiSeleccionado, setEpiSeleccionado] = useState("");
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date>();

  const handleSubmit = () => {
    if (epiSeleccionado && fechaSeleccionada) {
      onAsignarEpi(parseInt(epiSeleccionado), fechaSeleccionada);
      setEpiSeleccionado("");
      setFechaSeleccionada(undefined);
      setDialogoAbierto(false);
    }
  };

  return (
    <Dialog open={dialogoAbierto} onOpenChange={setDialogoAbierto}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Asignar EPI
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Asignar EPI</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>EPI</Label>
            <Select value={epiSeleccionado} onValueChange={setEpiSeleccionado}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar EPI" />
              </SelectTrigger>
              <SelectContent>
                {inventarioEpis.filter(epi => epi.disponible).map((epi) => (
                  <SelectItem key={epi.id} value={epi.id.toString()}>
                    {epi.nombre} - €{epi.precio}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Fecha de Entrega</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {fechaSeleccionada ? format(fechaSeleccionada, "dd/MM/yyyy", { locale: es }) : "Seleccionar fecha"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={fechaSeleccionada}
                  onSelect={setFechaSeleccionada}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setDialogoAbierto(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!epiSeleccionado || !fechaSeleccionada}
            >
              Asignar EPI
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
