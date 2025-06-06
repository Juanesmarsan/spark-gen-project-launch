
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
    vehiculoId: gasto?.vehiculoId || vehiculoPreseleccionado || "",
    tipo: gasto?.tipo || "",
    concepto: gasto?.concepto || "",
    fecha: gasto?.fecha || undefined as Date | undefined,
    importe: gasto?.importe || "",
    descripcion: gasto?.descripcion || "",
    factura: gasto?.factura || ""
  });

  const handleSave = () => {
    console.log("Datos del formulario:", formData);
    
    // Validación más específica
    if (!formData.vehiculoId || formData.vehiculoId === "") {
      console.log("Error: No hay vehículo seleccionado");
      return;
    }
    
    if (!formData.tipo || formData.tipo === "") {
      console.log("Error: No hay tipo seleccionado");
      return;
    }
    
    if (!formData.concepto || formData.concepto.trim() === "") {
      console.log("Error: No hay concepto");
      return;
    }
    
    if (!formData.fecha) {
      console.log("Error: No hay fecha seleccionada");
      return;
    }
    
    const importeNum = typeof formData.importe === 'string' ? parseFloat(formData.importe) : formData.importe;
    if (!importeNum || importeNum <= 0) {
      console.log("Error: Importe inválido");
      return;
    }

    const gastoData = {
      vehiculoId: typeof formData.vehiculoId === 'string' ? parseInt(formData.vehiculoId) : formData.vehiculoId,
      tipo: formData.tipo as 'ITV' | 'revision' | 'reparacion' | 'otro',
      concepto: formData.concepto,
      fecha: formData.fecha,
      importe: importeNum,
      descripcion: formData.descripcion,
      factura: formData.factura
    };

    console.log("Guardando gasto:", gastoData);
    onSave(gastoData);
  };

  const isFormValid = () => {
    return formData.vehiculoId && 
           formData.vehiculoId !== "" && 
           formData.tipo && 
           formData.tipo !== "" && 
           formData.concepto && 
           formData.concepto.trim() !== "" && 
           formData.fecha && 
           formData.importe && 
           parseFloat(formData.importe.toString()) > 0;
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Vehículo</Label>
        <Select 
          value={formData.vehiculoId.toString()} 
          onValueChange={(value) => {
            console.log("Vehículo seleccionado:", value);
            setFormData(prev => ({ ...prev, vehiculoId: value }));
          }}
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
          onValueChange={(value) => {
            console.log("Tipo seleccionado:", value);
            setFormData(prev => ({ ...prev, tipo: value }));
          }}
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
          onChange={(e) => {
            console.log("Concepto:", e.target.value);
            setFormData(prev => ({ ...prev, concepto: e.target.value }));
          }}
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
              onSelect={(fecha) => {
                console.log("Fecha seleccionada:", fecha);
                setFormData(prev => ({ ...prev, fecha }));
              }}
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
          onChange={(e) => {
            console.log("Importe:", e.target.value);
            setFormData(prev => ({ ...prev, importe: e.target.value }));
          }}
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
              console.log("Archivo seleccionado:", file.name);
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
        <Button 
          onClick={handleSave}
          disabled={!isFormValid()}
        >
          {gasto ? 'Guardar Cambios' : 'Registrar Gasto'}
        </Button>
      </div>
    </div>
  );
};
