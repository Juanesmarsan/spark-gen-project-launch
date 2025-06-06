
import { Badge } from "@/components/ui/badge";
import { Empleado, Vehiculo } from "@/types/empleado";
import { VehiculoDialog } from "../VehiculoDialog";

interface VehiculoTabProps {
  empleado: Empleado;
  inventarioVehiculos: Vehiculo[];
  onAsignarVehiculo: (vehiculoId: number) => void;
}

export const VehiculoTab = ({ empleado, inventarioVehiculos, onAsignarVehiculo }: VehiculoTabProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Vehículo Asignado</h3>
        <VehiculoDialog 
          inventarioVehiculos={inventarioVehiculos}
          onAsignarVehiculo={onAsignarVehiculo}
        />
      </div>
      
      {empleado.vehiculo && (
        <div className="p-4 border rounded-lg">
          <p className="font-medium">Vehículo asignado:</p>
          <Badge variant="secondary" className="mt-2">{empleado.vehiculo}</Badge>
        </div>
      )}
    </div>
  );
};
