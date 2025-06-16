import { useState, useEffect } from "react";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { ProyectoFormData, Proyecto } from "@/types/proyecto";
import { Empleado } from "@/types/empleado";

interface ProyectoFormProps {
  onSubmit: (data: ProyectoFormData) => void;
  onCancel: () => void;
  empleados: Empleado[];
  proyecto?: Proyecto;
  isEditing?: boolean;
}

interface TrabajadorConFechas {
  id: number;
  fechaEntrada?: Date;
  fechaSalida?: Date;
}

export const ProyectoForm = ({ onSubmit, onCancel, empleados, proyecto, isEditing = false }: ProyectoFormProps) => {
  const [formData, setFormData] = useState<ProyectoFormData>({
    nombre: "",
    ciudad: "",
    tipo: "presupuesto",
    estado: "activo",
    presupuestoTotal: undefined,
    precioHora: undefined,
    descripcion: "",
    trabajadoresAsignados: [],
  });

  const [trabajadoresConFechas, setTrabajadoresConFechas] = useState<TrabajadorConFechas[]>([]);

  // Filtrar solo empleados activos
  const empleadosActivos = empleados.filter(empleado => empleado.activo);

  // Cargar datos del proyecto cuando se está editando
  useEffect(() => {
    if (proyecto && isEditing) {
      console.log("Cargando proyecto para editar:", proyecto);
      setFormData({
        nombre: proyecto.nombre,
        ciudad: proyecto.ciudad,
        tipo: proyecto.tipo,
        estado: proyecto.estado,
        presupuestoTotal: proyecto.presupuestoTotal,
        precioHora: proyecto.precioHora,
        descripcion: proyecto.descripcion || "",
        trabajadoresAsignados: proyecto.trabajadoresAsignados.map(t => t.id),
      });
      
      // Cargar fechas de trabajadores
      setTrabajadoresConFechas(
        proyecto.trabajadoresAsignados.map(t => ({
          id: t.id,
          fechaEntrada: t.fechaEntrada,
          fechaSalida: t.fechaSalida
        }))
      );
    } else if (!isEditing) {
      // Reset form for new project
      setFormData({
        nombre: "",
        ciudad: "",
        tipo: "presupuesto",
        estado: "activo",
        presupuestoTotal: undefined,
        precioHora: undefined,
        descripcion: "",
        trabajadoresAsignados: [],
      });
      setTrabajadoresConFechas([]);
    }
  }, [proyecto, isEditing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Enviando datos del formulario:", formData);
    
    // Crear formData extendido con fechas de trabajadores
    const formDataConFechas = {
      ...formData,
      trabajadoresConFechas
    };
    
    onSubmit(formDataConFechas);
  };

  const handleTrabajadorToggle = (empleadoId: number, checked: boolean) => {
    console.log("Toggling trabajador:", empleadoId, checked);
    setFormData(prev => ({
      ...prev,
      trabajadoresAsignados: checked
        ? [...prev.trabajadoresAsignados, empleadoId]
        : prev.trabajadoresAsignados.filter(id => id !== empleadoId)
    }));

    if (checked) {
      // Agregar trabajador con fecha de entrada por defecto (hoy) y sin fecha de salida
      setTrabajadoresConFechas(prev => [
        ...prev,
        { id: empleadoId, fechaEntrada: new Date(), fechaSalida: undefined }
      ]);
    } else {
      // Remover trabajador
      setTrabajadoresConFechas(prev => prev.filter(t => t.id !== empleadoId));
    }
  };

  const updateTrabajadorFecha = (empleadoId: number, tipo: 'entrada' | 'salida', fecha: Date | undefined) => {
    setTrabajadoresConFechas(prev => 
      prev.map(t => 
        t.id === empleadoId 
          ? { ...t, [tipo === 'entrada' ? 'fechaEntrada' : 'fechaSalida']: fecha }
          : t
      )
    );
  };

  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{isEditing ? "Editar Proyecto" : "Nuevo Proyecto"}</DialogTitle>
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
            <Select 
              value={formData.tipo} 
              onValueChange={(value: 'presupuesto' | 'administracion') => 
                setFormData(prev => ({ ...prev, tipo: value }))
              }
            >
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
            <Select 
              value={formData.estado} 
              onValueChange={(value: 'activo' | 'completado' | 'pausado') => 
                setFormData(prev => ({ ...prev, estado: value }))
              }
            >
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
                presupuestoTotal: e.target.value ? parseFloat(e.target.value) : undefined,
                precioHora: undefined
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
                precioHora: e.target.value ? parseFloat(e.target.value) : undefined,
                presupuestoTotal: undefined
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
          <div className="border rounded-md p-4 max-h-96 overflow-y-auto space-y-4">
            {empleadosActivos.length > 0 ? (
              empleadosActivos.map((empleado) => {
                const isSelected = formData.trabajadoresAsignados.includes(empleado.id);
                const trabajadorFechas = trabajadoresConFechas.find(t => t.id === empleado.id);
                
                return (
                  <div key={empleado.id} className="space-y-3 p-3 border rounded">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`trabajador-${empleado.id}`}
                        checked={isSelected}
                        onCheckedChange={(checked) => 
                          handleTrabajadorToggle(empleado.id, checked as boolean)
                        }
                      />
                      <label htmlFor={`trabajador-${empleado.id}`} className="text-sm font-medium">
                        {empleado.nombre} {empleado.apellidos}
                      </label>
                    </div>
                    
                    {isSelected && (
                      <div className="space-y-3 pl-6">
                        <div>
                          <Label className="text-xs text-gray-600">Fecha de entrada a la obra *</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !trabajadorFechas?.fechaEntrada && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {trabajadorFechas?.fechaEntrada 
                                  ? format(trabajadorFechas.fechaEntrada, "dd/MM/yyyy") 
                                  : "Seleccionar fecha"
                                }
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={trabajadorFechas?.fechaEntrada}
                                onSelect={(fecha) => updateTrabajadorFecha(empleado.id, 'entrada', fecha)}
                                initialFocus
                                className="pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        
                        <div>
                          <Label className="text-xs text-gray-600">Fecha de salida de la obra (opcional)</Label>
                          <div className="flex gap-2">
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className={cn(
                                    "flex-1 justify-start text-left font-normal",
                                    !trabajadorFechas?.fechaSalida && "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {trabajadorFechas?.fechaSalida 
                                    ? format(trabajadorFechas.fechaSalida, "dd/MM/yyyy") 
                                    : "Sin fecha de salida"
                                  }
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={trabajadorFechas?.fechaSalida}
                                  onSelect={(fecha) => updateTrabajadorFecha(empleado.id, 'salida', fecha)}
                                  initialFocus
                                  className="pointer-events-auto"
                                />
                              </PopoverContent>
                            </Popover>
                            {trabajadorFechas?.fechaSalida && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => updateTrabajadorFecha(empleado.id, 'salida', undefined)}
                                className="text-red-600 hover:text-red-700"
                              >
                                Quitar
                              </Button>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Deja vacío si el trabajador sigue activo en la obra
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-sm text-gray-500">
                No hay empleados activos disponibles. Verifica que haya empleados activos en la sección de Empleados.
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" className="bg-omenar-green hover:bg-omenar-dark-green">
            {isEditing ? "Actualizar" : "Crear"}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};
