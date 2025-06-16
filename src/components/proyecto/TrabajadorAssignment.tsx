
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Empleado } from "@/types/empleado";

interface TrabajadorConFechas {
  id: number;
  fechaEntrada?: Date;
  fechaSalida?: Date;
}

interface TrabajadorAssignmentProps {
  empleadosActivos: Empleado[];
  trabajadoresAsignados: number[];
  trabajadoresConFechas: TrabajadorConFechas[];
  onTrabajadorToggle: (empleadoId: number, checked: boolean) => void;
  onUpdateTrabajadorFecha: (empleadoId: number, tipo: 'entrada' | 'salida', fecha: Date | undefined) => void;
}

export const TrabajadorAssignment = ({
  empleadosActivos,
  trabajadoresAsignados,
  trabajadoresConFechas,
  onTrabajadorToggle,
  onUpdateTrabajadorFecha
}: TrabajadorAssignmentProps) => {
  return (
    <div>
      <Label>Trabajadores Asignados</Label>
      <div className="border rounded-md p-4 max-h-96 overflow-y-auto space-y-4">
        {empleadosActivos.length > 0 ? (
          empleadosActivos.map((empleado) => {
            const isSelected = trabajadoresAsignados.includes(empleado.id);
            const trabajadorFechas = trabajadoresConFechas.find(t => t.id === empleado.id);
            
            return (
              <div key={empleado.id} className="space-y-3 p-3 border rounded">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`trabajador-${empleado.id}`}
                    checked={isSelected}
                    onCheckedChange={(checked) => 
                      onTrabajadorToggle(empleado.id, checked as boolean)
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
                            onSelect={(fecha) => onUpdateTrabajadorFecha(empleado.id, 'entrada', fecha)}
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
                              onSelect={(fecha) => onUpdateTrabajadorFecha(empleado.id, 'salida', fecha)}
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
                            onClick={() => onUpdateTrabajadorFecha(empleado.id, 'salida', undefined)}
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
  );
};
