
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { GastoVariableEmpleado } from "@/types/empleado";

interface GastoVariableFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gastoEditando: GastoVariableEmpleado | null;
  onSubmit: (formData: {
    concepto: 'dieta' | 'alojamiento' | 'transporte' | 'otro';
    descripcion: string;
    importe: number;
    fecha: Date;
  }) => void;
}

export const GastoVariableForm = ({ open, onOpenChange, gastoEditando, onSubmit }: GastoVariableFormProps) => {
  const [formData, setFormData] = useState<{
    concepto: 'dieta' | 'alojamiento' | 'transporte' | 'otro';
    descripcion: string;
    importe: number;
    fecha: Date;
  }>({
    concepto: gastoEditando?.concepto || 'dieta',
    descripcion: gastoEditando?.descripcion || '',
    importe: gastoEditando?.importe || 0,
    fecha: gastoEditando?.fecha || new Date()
  });

  const resetForm = () => {
    setFormData({
      concepto: 'dieta',
      descripcion: '',
      importe: 0,
      fecha: new Date()
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.importe <= 0) {
      alert('El importe debe ser mayor que 0');
      return;
    }

    if (!formData.concepto) {
      alert('Debe seleccionar un concepto');
      return;
    }

    onSubmit(formData);
    resetForm();
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetForm();
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {gastoEditando ? 'Editar Gasto Variable' : 'Nuevo Gasto Variable'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Concepto</Label>
            <Select 
              value={formData.concepto} 
              onValueChange={(value) => setFormData(prev => ({ 
                ...prev, 
                concepto: value as 'dieta' | 'alojamiento' | 'transporte' | 'otro'
              }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dieta">Dieta</SelectItem>
                <SelectItem value="alojamiento">Alojamiento</SelectItem>
                <SelectItem value="transporte">Transporte</SelectItem>
                <SelectItem value="otro">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Input
              id="descripcion"
              value={formData.descripcion}
              onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
              placeholder="Descripción del gasto (opcional)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="importe">Importe (€)</Label>
            <Input
              id="importe"
              type="number"
              step="0.01"
              min="0.01"
              value={formData.importe}
              onChange={(e) => setFormData(prev => ({ ...prev, importe: parseFloat(e.target.value) || 0 }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Fecha</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(formData.fecha, "dd/MM/yyyy", { locale: es })}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.fecha}
                  onSelect={(date) => date && setFormData(prev => ({ ...prev, fecha: date }))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {gastoEditando ? 'Actualizar Gasto' : 'Guardar Gasto'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
