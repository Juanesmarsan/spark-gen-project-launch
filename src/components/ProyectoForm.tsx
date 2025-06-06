
import { useState } from "react";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ProyectoFormData } from "@/types/proyecto";
import { Empleado } from "@/types/empleado";

interface ProyectoFormProps {
  onSubmit: (data: ProyectoFormData) => void;
  onCancel: () => void;
  empleados: Empleado[];
  proyecto?: ProyectoFormData;
}

export const ProyectoForm = ({ onSubmit, onCancel, empleados, proyecto }: ProyectoFormProps) => {
  const [formData, setFormData] = useState<ProyectoFormData>(
    proyecto || {
      nombre: "",
      ciudad: "",
      tipo: "presupuesto",
      estado: "activo",
      presupuestoTotal: undefined,
      precioHora: undefined,
      descripcion: "",
      trabajadoresAsignados: [],
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleTrabajadorToggle = (empleadoId: number, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      trabajadoresAsignados: checked
        ? [...prev.trabajadoresAsignados, empleadoId]
        : prev.trabajadoresAsignados.filter(id => id !== empleadoId)
    }));
  };

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Gestión de Proyecto</DialogTitle>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="nombre">Nombre del Proyecto</Label>
            <Input
              id="nombre"
              value={formData.nombre}
              onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="ciudad">Ciudad</Label>
            <Input
              id="ciudad"
              value={formData.ciudad}
              onChange={(e) => setFormData(prev => ({ ...prev, ciudad: e.target.value }))}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="tipo">Tipo</Label>
            <Select value={formData.tipo} onValueChange={(value: 'presupuesto' | 'administracion') => 
              setFormData(prev => ({ ...prev, tipo: value }))
            }>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="presupuesto">Por Presupuesto</SelectItem>
                <SelectItem value="administracion">Por Administración</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="estado">Estado</Label>
            <Select value={formData.estado} onValueChange={(value: 'activo' | 'completado' | 'pausado') => 
              setFormData(prev => ({ ...prev, estado: value }))
            }>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="activo">Activo</SelectItem>
                <SelectItem value="completado">Completado</SelectItem>
                <SelectItem value="pausado">Pausado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {formData.tipo === 'presupuesto' ? (
          <div>
            <Label htmlFor="presupuestoTotal">Presupuesto Total (€)</Label>
            <Input
              id="presupuestoTotal"
              type="number"
              value={formData.presupuestoTotal || ''}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                presupuestoTotal: e.target.value ? parseFloat(e.target.value) : undefined 
              }))}
              required
            />
          </div>
        ) : (
          <div>
            <Label htmlFor="precioHora">Precio por Hora (€)</Label>
            <Input
              id="precioHora"
              type="number"
              step="0.01"
              value={formData.precioHora || ''}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                precioHora: e.target.value ? parseFloat(e.target.value) : undefined 
              }))}
              required
            />
          </div>
        )}

        <div>
          <Label htmlFor="descripcion">Descripción</Label>
          <Textarea
            id="descripcion"
            value={formData.descripcion}
            onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
            rows={3}
          />
        </div>

        <div>
          <Label>Trabajadores Asignados</Label>
          <div className="border rounded-md p-4 max-h-40 overflow-y-auto space-y-2">
            {empleados.map((empleado) => (
              <div key={empleado.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`trabajador-${empleado.id}`}
                  checked={formData.trabajadoresAsignados.includes(empleado.id)}
                  onCheckedChange={(checked) => 
                    handleTrabajadorToggle(empleado.id, checked as boolean)
                  }
                />
                <label htmlFor={`trabajador-${empleado.id}`} className="text-sm">
                  {empleado.nombre} {empleado.apellidos}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" className="bg-omenar-green hover:bg-omenar-dark-green">
            Guardar
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};
