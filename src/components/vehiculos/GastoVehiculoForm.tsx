
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { GastoVehiculo, VehiculoCompleto } from "@/types/vehiculo";

interface GastoVehiculoFormProps {
  vehiculos: VehiculoCompleto[];
  gasto?: GastoVehiculo;
  onSave: (gasto: Omit<GastoVehiculo, 'id'>) => void;
  onCancel: () => void;
  vehiculoPreseleccionado?: number;
}

export const GastoVehiculoForm = ({ vehiculos, gasto, onSave, onCancel, vehiculoPreseleccionado }: GastoVehiculoFormProps) => {
  const [formData, setFormData] = useState({
    vehiculoId: gasto?.vehiculoId || vehiculoPreseleccionado || 0,
    tipo: gasto?.tipo || "" as 'ITV' | 'revision' | 'reparacion' | 'otro',
    concepto: gasto?.concepto || "",
    fecha: gasto?.fecha || undefined as Date | undefined,
    importe: gasto?.importe || 0,
    descripcion: gasto?.descripcion || "",
    factura: gasto?.factura || ""
  });

  const handleSave = () => {
    if (formData.vehiculoId && formData.tipo && formData.concepto && 
        formData.fecha && formData.importe > 0) {
      onSave(formData);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Vehículo</Label>
        <Select 
          value={formData.vehiculoId.toString()} 
          onValueChange={(value) => setFormData(prev => ({ ...prev, vehiculoId: parseInt(value) }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar vehículo" />
          </SelectTrigger>
          <SelectContent>
            {vehiculos.map((vehiculo) => (
              <SelectItem key={vehiculo.id} value={vehiculo.id.toString()}>
                {vehiculo.matricula} - {vehiculo.marca} {vehiculo.modelo}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Tipo de Gasto</Label>
        <Select 
          value={formData.tipo} 
          onValueChange={(value: 'ITV' | 'revision' | 'reparacion' | 'otro') => setFormData(prev => ({ ...prev, tipo: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Tipo de gasto" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ITV">ITV</SelectItem>
            <SelectItem value="revision">Revisión</SelectItem>
            <SelectItem value="reparacion">Reparación</SelectItem>
            <SelectItem value="otro">Otro</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Concepto</Label>
        <Input 
          value={formData.concepto}
          onChange={(e) => setFormData(prev => ({ ...prev, concepto: e.target.value }))}
          placeholder="Descripción del gasto"
        />
      </div>
      <div className="space-y-2">
        <Label>Fecha</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formData.fecha ? format(formData.fecha, "dd/MM/yyyy", { locale: es }) : "Seleccionar fecha"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={formData.fecha}
              onSelect={(fecha) => setFormData(prev => ({ ...prev, fecha }))}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="space-y-2">
        <Label>Importe (€)</Label>
        <Input 
          type="number"
          step="0.01"
          value={formData.importe}
          onChange={(e) => setFormData(prev => ({ ...prev, importe: parseFloat(e.target.value) || 0 }))}
          placeholder="0.00"
        />
      </div>
      <div className="space-y-2">
        <Label>Factura (opcional)</Label>
        <Input 
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setFormData(prev => ({ ...prev, factura: file.name }));
            }
          }}
        />
      </div>
      <div className="space-y-2 col-span-2">
        <Label>Descripción (opcional)</Label>
        <Textarea 
          value={formData.descripcion}
          onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
          placeholder="Detalles adicionales del gasto"
        />
      </div>
      <div className="flex gap-2 col-span-2">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={handleSave}>
          {gasto ? 'Guardar Cambios' : 'Registrar Gasto'}
        </Button>
      </div>
    </div>
  );
};
