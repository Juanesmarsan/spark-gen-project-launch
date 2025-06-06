import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  dni: string;
  telefono: string;
  email: string;
  direccion: string;
  fechaIngreso: Date;
  salarioBruto: number;
  seguridadSocialTrabajador: number;
  seguridadSocialEmpresa: number;
  retenciones: number;
  embargo: number;
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
    dni: "",
    telefono: "",
    email: "",
    direccion: "",
    fechaIngreso: initialDate,
    salarioBruto: 0,
    seguridadSocialTrabajador: 0,
    seguridadSocialEmpresa: 0,
    retenciones: 0,
    embargo: 0
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
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Añadir Nuevo Empleado</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
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
            <Label htmlFor="dni">DNI</Label>
            <Input
              id="dni"
              value={formData.dni}
              onChange={(e) => setFormData(prev => ({ ...prev, dni: e.target.value }))}
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
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
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
        
        <div className="space-y-2">
          <Label htmlFor="direccion">Dirección</Label>
          <Input
            id="direccion"
            value={formData.direccion}
            onChange={(e) => setFormData(prev => ({ ...prev, direccion: e.target.value }))}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="salarioBruto">Salario Bruto</Label>
            <Input
              id="salarioBruto"
              type="number"
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
              value={formData.seguridadSocialTrabajador}
              onChange={(e) => setFormData(prev => ({ ...prev, seguridadSocialTrabajador: parseFloat(e.target.value) || 0 }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="seguridadSocialEmpresa">Seguridad Social Empresa</Label>
            <Input
              id="seguridadSocialEmpresa"
              type="number"
              value={formData.seguridadSocialEmpresa}
              onChange={(e) => setFormData(prev => ({ ...prev, seguridadSocialEmpresa: parseFloat(e.target.value) || 0 }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="retenciones">Retenciones</Label>
            <Input
              id="retenciones"
              type="number"
              value={formData.retenciones}
              onChange={(e) => setFormData(prev => ({ ...prev, retenciones: parseFloat(e.target.value) || 0 }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="embargo">Embargo</Label>
            <Input
              id="embargo"
              type="number"
              value={formData.embargo}
              onChange={(e) => setFormData(prev => ({ ...prev, embargo: parseFloat(e.target.value) || 0 }))}
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
