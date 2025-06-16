
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Empleado {
  id: number;
  nombre: string;
  apellidos: string;
  telefono: string;
  fechaIngreso: Date;
  salarioBruto: number;
  seguridadSocialTrabajador: number;
  seguridadSocialEmpresa: number;
  retenciones: number;
  embargo: number;
  departamento: 'operario' | 'tecnico' | 'administracion' | 'gerencia';
  categoria: 'peon' | 'oficial_3' | 'oficial_2' | 'oficial_1' | 'encargado' | 'tecnico' | 'gerencia';
  precioHoraExtra: number;
  precioHoraFestiva: number;
  adelantos: any[];
  epis: any[];
  herramientas: any[];
  documentos: any[];
  proyectos: string[];
  vehiculo?: string;
}

interface EmpleadoFormProps {
  onSubmit: (empleado: Omit<Empleado, 'id' | 'adelantos' | 'epis' | 'herramientas' | 'documentos' | 'proyectos' | 'vehiculo'>) => void;
  onCancel: () => void;
}

// Initialize date outside component to prevent re-renders
const initialDate = new Date();

export const EmpleadoForm = ({ onSubmit, onCancel }: EmpleadoFormProps) => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    telefono: "",
    fechaIngreso: initialDate,
    salarioBruto: 0,
    seguridadSocialTrabajador: 0,
    seguridadSocialEmpresa: 0,
    retenciones: 0,
    embargo: 0,
    departamento: 'operario' as const,
    categoria: 'peon' as const,
    precioHoraExtra: 20,
    precioHoraFestiva: 25
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({ ...prev, fechaIngreso: date }));
    }
  };

  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Añadir Nuevo Empleado</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              id="nombre"
              value={formData.nombre}
              onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="apellidos">Apellidos</Label>
            <Input
              id="apellidos"
              value={formData.apellidos}
              onChange={(e) => setFormData(prev => ({ ...prev, apellidos: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="telefono">Teléfono</Label>
            <Input
              id="telefono"
              value={formData.telefono}
              onChange={(e) => setFormData(prev => ({ ...prev, telefono: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Fecha de Ingreso</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.fechaIngreso ? format(formData.fechaIngreso, "dd/MM/yyyy", { locale: es }) : "Seleccionar fecha"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.fechaIngreso}
                  onSelect={handleDateSelect}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="departamento">Departamento</Label>
            <Select 
              value={formData.departamento} 
              onValueChange={(value: any) => setFormData(prev => ({ ...prev, departamento: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="operario">Operario</SelectItem>
                <SelectItem value="tecnico">Técnico</SelectItem>
                <SelectItem value="administracion">Administración</SelectItem>
                <SelectItem value="gerencia">Gerencia</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="categoria">Categoría</Label>
            <Select 
              value={formData.categoria} 
              onValueChange={(value: any) => setFormData(prev => ({ ...prev, categoria: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="peon">Peón</SelectItem>
                <SelectItem value="oficial_3">Oficial 3ª</SelectItem>
                <SelectItem value="oficial_2">Oficial 2ª</SelectItem>
                <SelectItem value="oficial_1">Oficial 1ª</SelectItem>
                <SelectItem value="encargado">Encargado</SelectItem>
                <SelectItem value="tecnico">Técnico</SelectItem>
                <SelectItem value="gerencia">Gerencia</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="salarioBruto">Salario Bruto</Label>
            <Input
              id="salarioBruto"
              type="number"
              step="0.01"
              value={formData.salarioBruto}
              onChange={(e) => setFormData(prev => ({ ...prev, salarioBruto: parseFloat(e.target.value) || 0 }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="seguridadSocialTrabajador">Seguridad Social Trabajador</Label>
            <Input
              id="seguridadSocialTrabajador"
              type="number"
              step="0.01"
              value={formData.seguridadSocialTrabajador}
              onChange={(e) => setFormData(prev => ({ ...prev, seguridadSocialTrabajador: parseFloat(e.target.value) || 0 }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="seguridadSocialEmpresa">Seguridad Social Empresa</Label>
            <Input
              id="seguridadSocialEmpresa"
              type="number"
              step="0.01"
              value={formData.seguridadSocialEmpresa}
              onChange={(e) => setFormData(prev => ({ ...prev, seguridadSocialEmpresa: parseFloat(e.target.value) || 0 }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="retenciones">Retenciones</Label>
            <Input
              id="retenciones"
              type="number"
              step="0.01"
              value={formData.retenciones}
              onChange={(e) => setFormData(prev => ({ ...prev, retenciones: parseFloat(e.target.value) || 0 }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="embargo">Embargo</Label>
            <Input
              id="embargo"
              type="number"
              step="0.01"
              value={formData.embargo}
              onChange={(e) => setFormData(prev => ({ ...prev, embargo: parseFloat(e.target.value) || 0 }))}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="precioHoraExtra">Precio Hora Extra (€)</Label>
            <Input
              id="precioHoraExtra"
              type="number"
              step="0.01"
              value={formData.precioHoraExtra}
              onChange={(e) => setFormData(prev => ({ ...prev, precioHoraExtra: parseFloat(e.target.value) || 0 }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="precioHoraFestiva">Precio Hora Festiva (€)</Label>
            <Input
              id="precioHoraFestiva"
              type="number"
              step="0.01"
              value={formData.precioHoraFestiva}
              onChange={(e) => setFormData(prev => ({ ...prev, precioHoraFestiva: parseFloat(e.target.value) || 0 }))}
              required
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            Añadir Empleado
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};
