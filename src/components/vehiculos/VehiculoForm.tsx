
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { VehiculoCompleto } from "@/types/vehiculo";

interface VehiculoFormProps {
  vehiculo?: VehiculoCompleto;
  onSave: (vehiculo: Omit<VehiculoCompleto, 'id' | 'gastos'>) => void;
  onCancel: () => void;
}

export const VehiculoForm = ({ vehiculo, onSave, onCancel }: VehiculoFormProps) => {
  const [formData, setFormData] = useState({
    matricula: vehiculo?.matricula || "",
    tipo: vehiculo?.tipo || "",
    marca: vehiculo?.marca || "",
    modelo: vehiculo?.modelo || "",
    caducidadITV: vehiculo?.caducidadITV || undefined as Date | undefined,
    caducidadSeguro: vehiculo?.caducidadSeguro || undefined as Date | undefined,
    kilometros: vehiculo?.kilometros || 0,
    asignado: vehiculo?.asignado || false,
    empleadoAsignado: vehiculo?.empleadoAsignado || undefined
  });

  const handleSave = () => {
    if (formData.matricula && formData.tipo && formData.marca && 
        formData.modelo && formData.caducidadITV && formData.caducidadSeguro) {
      onSave(formData);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Matrícula</Label>
        <Input 
          value={formData.matricula}
          onChange={(e) => setFormData(prev => ({ ...prev, matricula: e.target.value }))}
          placeholder="1234-ABC"
        />
      </div>
      <div className="space-y-2">
        <Label>Tipo de Vehículo</Label>
        <Input 
          value={formData.tipo}
          onChange={(e) => setFormData(prev => ({ ...prev, tipo: e.target.value }))}
          placeholder="Furgoneta, Camión, Coche..."
        />
      </div>
      <div className="space-y-2">
        <Label>Marca</Label>
        <Input 
          value={formData.marca}
          onChange={(e) => setFormData(prev => ({ ...prev, marca: e.target.value }))}
          placeholder="Ford, Mercedes, Volkswagen..."
        />
      </div>
      <div className="space-y-2">
        <Label>Modelo</Label>
        <Input 
          value={formData.modelo}
          onChange={(e) => setFormData(prev => ({ ...prev, modelo: e.target.value }))}
          placeholder="Transit, Sprinter, Golf..."
        />
      </div>
      <div className="space-y-2">
        <Label>Caducidad ITV</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formData.caducidadITV ? format(formData.caducidadITV, "dd/MM/yyyy", { locale: es }) : "Seleccionar fecha"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={formData.caducidadITV}
              onSelect={(fecha) => setFormData(prev => ({ ...prev, caducidadITV: fecha }))}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="space-y-2">
        <Label>Caducidad Seguro</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formData.caducidadSeguro ? format(formData.caducidadSeguro, "dd/MM/yyyy", { locale: es }) : "Seleccionar fecha"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={formData.caducidadSeguro}
              onSelect={(fecha) => setFormData(prev => ({ ...prev, caducidadSeguro: fecha }))}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="space-y-2 col-span-2">
        <Label>Kilómetros</Label>
        <Input 
          type="number"
          value={formData.kilometros}
          onChange={(e) => setFormData(prev => ({ ...prev, kilometros: parseInt(e.target.value) || 0 }))}
          placeholder="0"
        />
      </div>
      <div className="flex gap-2 col-span-2">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={handleSave}>
          {vehiculo ? 'Guardar Cambios' : 'Registrar Vehículo'}
        </Button>
      </div>
    </div>
  );
};
