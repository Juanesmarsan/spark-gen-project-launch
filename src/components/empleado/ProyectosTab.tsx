import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, Trash2, CalendarIcon, MapPin, Users } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Empleado } from "@/types/empleado";
import { Proyecto } from "@/types/proyecto";
import { useProyectos } from "@/hooks/useProyectos";
import { useToast } from "@/hooks/use-toast";

interface ProyectosTabProps {
  empleado: Empleado;
  onUpdateEmpleado: (empleado: Empleado) => void;
}

export const ProyectosTab = ({ empleado, onUpdateEmpleado }: ProyectosTabProps) => {
  const { proyectos, updateProyecto } = useProyectos();
  const { toast } = useToast();
  const [showAsignarDialog, setShowAsignarDialog] = useState(false);
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState<string>("");
  const [fechaEntrada, setFechaEntrada] = useState<Date | undefined>(new Date());
  const [fechaSalida, setFechaSalida] = useState<Date | undefined>();
  const [precioHora, setPrecioHora] = useState<number | undefined>();

  // Obtener proyectos donde está asignado el empleado
  const proyectosAsignados = proyectos.filter(proyecto => 
    proyecto.trabajadoresAsignados.some(trabajador => trabajador.id === empleado.id)
  );

  // Filtrar proyectos disponibles solo para empleados activos
  const proyectosDisponibles = proyectos.filter(proyecto => 
    proyecto.estado === 'activo' && 
    !proyecto.trabajadoresAsignados.some(trabajador => trabajador.id === empleado.id) &&
    empleado.activo // Solo mostrar proyectos si el empleado está activo
  );

  const handleAsignarProyecto = () => {
    if (!proyectoSeleccionado) return;

    const proyecto = proyectos.find(p => p.id.toString() === proyectoSeleccionado);
    if (!proyecto) return;

    const nuevoTrabajador = {
      id: empleado.id,
      nombre: empleado.nombre,
      apellidos: empleado.apellidos,
      fechaEntrada,
      fechaSalida,
      precioHora: proyecto.tipo === 'administracion' ? precioHora : undefined
    };

    const proyectoActualizado = {
      ...proyecto,
      trabajadoresAsignados: [...proyecto.trabajadoresAsignados, nuevoTrabajador]
    };

    updateProyecto(proyectoActualizado);
    
    setShowAsignarDialog(false);
    setProyectoSeleccionado("");
    setFechaEntrada(new Date());
    setFechaSalida(undefined);
    setPrecioHora(undefined);

    toast({
      title: "Empleado asignado",
      description: `${empleado.nombre} ha sido asignado al proyecto ${proyecto.nombre}`,
    });
  };

  const handleDesasignarProyecto = (proyectoId: number) => {
    const proyecto = proyectos.find(p => p.id === proyectoId);
    if (!proyecto) return;

    const proyectoActualizado = {
      ...proyecto,
      trabajadoresAsignados: proyecto.trabajadoresAsignados.filter(
        trabajador => trabajador.id !== empleado.id
      )
    };

    updateProyecto(proyectoActualizado);

    toast({
      title: "Empleado desasignado",
      description: `${empleado.nombre} ha sido desasignado del proyecto ${proyecto.nombre}`,
    });
  };

  const proyectoSeleccionadoObj = proyectos.find(p => p.id.toString() === proyectoSeleccionado);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Proyectos Asignados
            </CardTitle>
            {empleado.activo && (
              <Dialog open={showAsignarDialog} onOpenChange={setShowAsignarDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-omenar-green hover:bg-omenar-dark-green">
                    <Plus className="w-4 h-4 mr-2" />
                    Asignar a Proyecto
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Asignar a Proyecto</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Proyecto</Label>
                      <Select value={proyectoSeleccionado} onValueChange={setProyectoSeleccionado}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar proyecto" />
                        </SelectTrigger>
                        <SelectContent>
                          {proyectosDisponibles.map((proyecto) => (
                            <SelectItem key={proyecto.id} value={proyecto.id.toString()}>
                              <div className="flex items-center gap-2">
                                <span>{proyecto.nombre}</span>
                                <Badge variant="outline">{proyecto.ciudad}</Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Fecha de Entrada</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !fechaEntrada && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {fechaEntrada ? format(fechaEntrada, "dd/MM/yyyy") : "Seleccionar fecha"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={fechaEntrada}
                            onSelect={setFechaEntrada}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <Label>Fecha de Salida (opcional)</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !fechaSalida && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {fechaSalida ? format(fechaSalida, "dd/MM/yyyy") : "Sin fecha de salida"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={fechaSalida}
                            onSelect={setFechaSalida}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      {fechaSalida && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setFechaSalida(undefined)}
                          className="mt-2 text-red-600 hover:text-red-700"
                        >
                          Quitar fecha de salida
                        </Button>
                      )}
                    </div>

                    {proyectoSeleccionadoObj?.tipo === 'administracion' && (
                      <div>
                        <Label>Precio por Hora (€)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={precioHora || ''}
                          onChange={(e) => setPrecioHora(e.target.value ? parseFloat(e.target.value) : undefined)}
                          placeholder="Precio por hora"
                        />
                      </div>
                    )}

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowAsignarDialog(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleAsignarProyecto} disabled={!proyectoSeleccionado}>
                        Asignar
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {!empleado.activo && (
            <div className="text-center py-4 mb-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                <p className="text-yellow-800 text-sm">
                  Este empleado está inactivo y no puede ser asignado a nuevos proyectos.
                </p>
              </div>
            </div>
          )}
          
          {proyectosAsignados.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 mb-4">
                {empleado.nombre} no está asignado a ningún proyecto.
              </p>
              {proyectosDisponibles.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  Haz clic en "Asignar a Proyecto" para comenzar.
                </p>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Proyecto</TableHead>
                  <TableHead>Ciudad</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha Entrada</TableHead>
                  <TableHead>Fecha Salida</TableHead>
                  <TableHead>Precio/Hora</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {proyectosAsignados.map((proyecto) => {
                  const trabajadorData = proyecto.trabajadoresAsignados.find(t => t.id === empleado.id);
                  
                  return (
                    <TableRow key={proyecto.id}>
                      <TableCell className="font-medium">{proyecto.nombre}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          {proyecto.ciudad}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={proyecto.tipo === 'presupuesto' ? 'default' : 'secondary'}>
                          {proyecto.tipo === 'presupuesto' ? 'Presupuesto' : 'Administración'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={proyecto.estado === 'activo' ? 'default' : 'secondary'}>
                          {proyecto.estado.charAt(0).toUpperCase() + proyecto.estado.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {trabajadorData?.fechaEntrada 
                          ? format(trabajadorData.fechaEntrada, 'dd/MM/yyyy') 
                          : 'No especificada'}
                      </TableCell>
                      <TableCell>
                        {trabajadorData?.fechaSalida 
                          ? format(trabajadorData.fechaSalida, 'dd/MM/yyyy') 
                          : 'Activo'}
                      </TableCell>
                      <TableCell>
                        {trabajadorData?.precioHora ? `${trabajadorData.precioHora}€` : '-'}
                      </TableCell>
                      <TableCell>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" className="text-red-600">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Desasignar del proyecto?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción eliminará a {empleado.nombre} {empleado.apellidos} del proyecto "{proyecto.nombre}". 
                                Esta acción no se puede deshacer.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDesasignarProyecto(proyecto.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Desasignar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {proyectosDisponibles.length === 0 && proyectosAsignados.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              <p>No hay más proyectos activos disponibles para asignar.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
