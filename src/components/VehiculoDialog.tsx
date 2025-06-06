
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { Vehiculo } from "@/types/empleado";

interface VehiculoDialogProps {
  inventarioVehiculos: Vehiculo[];
  onAsignarVehiculo: (vehiculoId: number) => void;
}

export const VehiculoDialog = ({ inventarioVehiculos, onAsignarVehiculo }: VehiculoDialogProps) => {
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState("");

  const handleSubmit = () => {
    if (vehiculoSeleccionado) {
      onAsignarVehiculo(parseInt(vehiculoSeleccionado));
      setVehiculoSeleccionado("");
      setDialogoAbierto(false);
    }
  };

  return (
    <Dialog open={dialogoAbierto} onOpenChange={setDialogoAbierto}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Asignar Vehículo
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Asignar Vehículo</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Vehículo</Label>
            <Select value={vehiculoSeleccionado} onValueChange={setVehiculoSeleccionado}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar vehículo" />
              </SelectTrigger>
              <SelectContent>
                {inventarioVehiculos.filter(vehiculo => !vehiculo.asignado).map((vehiculo) => (
                  <SelectItem key={vehiculo.id} value={vehiculo.id.toString()}>
                    {vehiculo.tipo} {vehiculo.matricula} - {vehiculo.marca} {vehiculo.modelo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setDialogoAbierto(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!vehiculoSeleccionado}
            >
              Asignar Vehículo
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
