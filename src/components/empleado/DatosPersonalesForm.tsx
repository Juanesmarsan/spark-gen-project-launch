
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Edit, CalendarIcon, Save, X } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Empleado } from "@/types/empleado";

interface DatosPersonalesFormProps {
  empleado: Empleado;
  onUpdateEmpleado: (empleado: Empleado) => void;
}

export const DatosPersonalesForm = ({ empleado, onUpdateEmpleado }: DatosPersonalesFormProps) => {
  const [editando, setEditando] = useState(false);
  const [datosEditados, setDatosEditados] = useState(empleado);

  const handleGuardar = () => {
    console.log('DatosPersonalesForm: Guardando cambios del empleado');
    onUpdateEmpleado(datosEditados);
    setEditando(false);
  };

  const handleCancelar = () => {
    setDatosEditados(empleado);
    setEditando(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Datos Personales</CardTitle>
          {!editando ? (
            <Button variant="outline" onClick={() => setEditando(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCancelar}>
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
              <Button onClick={handleGuardar}>
                <Save className="w-4 h-4 mr-2" />
                Guardar
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {editando ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Nombre</Label>
                <Input
                  value={datosEditados.nombre}
                  onChange={(e) => setDatosEditados({...datosEditados, nombre: e.target.value})}
                />
              </div>
              <div>
                <Label>Apellidos</Label>
                <Input
                  value={datosEditados.apellidos}
                  onChange={(e) => setDatosEditados({...datosEditados, apellidos: e.target.value})}
                />
              </div>
              <div>
                <Label>Teléfono</Label>
                <Input
                  value={datosEditados.telefono}
                  onChange={(e) => setDatosEditados({...datosEditados, telefono: e.target.value})}
                />
              </div>
              <div>
                <Label>Fecha de Ingreso</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !datosEditados.fechaIngreso && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {datosEditados.fechaIngreso ? format(datosEditados.fechaIngreso, "dd/MM/yyyy", { locale: es }) : "Seleccionar fecha"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={datosEditados.fechaIngreso}
                      onSelect={(date) => setDatosEditados({...datosEditados, fechaIngreso: date || new Date()})}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label>Departamento</Label>
                <Select 
                  value={datosEditados.departamento} 
                  onValueChange={(value: any) => setDatosEditados({...datosEditados, departamento: value})}
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
              <div>
                <Label>Categoría</Label>
                <Select 
                  value={datosEditados.categoria} 
                  onValueChange={(value: any) => setDatosEditados({...datosEditados, categoria: value})}
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
              <div>
                <Label>Precio Hora Extra (€)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={datosEditados.precioHoraExtra}
                  onChange={(e) => setDatosEditados({...datosEditados, precioHoraExtra: parseFloat(e.target.value) || 0})}
                />
              </div>
              <div>
                <Label>Precio Hora Festiva (€)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={datosEditados.precioHoraFestiva}
                  onChange={(e) => setDatosEditados({...datosEditados, precioHoraFestiva: parseFloat(e.target.value) || 0})}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Nombre</Label>
                <p className="font-medium">{empleado.nombre}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Apellidos</Label>
                <p className="font-medium">{empleado.apellidos}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Teléfono</Label>
                <p className="font-medium">{empleado.telefono}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Fecha de Ingreso</Label>
                <p className="font-medium">{format(empleado.fechaIngreso, "dd/MM/yyyy", { locale: es })}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Departamento</Label>
                <p className="font-medium capitalize">{empleado.departamento}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Categoría</Label>
                <p className="font-medium">{empleado.categoria.replace('_', ' ')}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Precio Hora Extra</Label>
                <p className="font-medium">{empleado.precioHoraExtra} €</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Precio Hora Festiva</Label>
                <p className="font-medium">{empleado.precioHoraFestiva} €</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
