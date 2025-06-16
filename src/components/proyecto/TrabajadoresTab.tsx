import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Users, Clock, CalendarDays, Edit, Trash2, CalendarIcon, UserPlus } from "lucide-react";
import { Proyecto, Trabajador } from "@/types/proyecto";
import { Empleado } from "@/types/empleado";
import { useState } from "react";
import { format, startOfMonth } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { generarCalendarioMesPuro } from "@/utils/calendarioUtils";
import { TrabajadorAssignment } from "./TrabajadorAssignment";

interface TrabajadoresTabProps {
  proyecto: Proyecto;
  empleados: Empleado[];
  onUpdateProyecto: (proyecto: Proyecto) => void;
}

const calcularHorasTrabajador = (trabajador: Trabajador, mesSeleccionado: Date): number => {
  console.log(`Calculando horas para ${trabajador.nombre} en ${format(mesSeleccionado, 'MMMM yyyy', { locale: es })}`);
  
  // Si no hay fecha de entrada, no contar horas
  if (!trabajador.fechaEntrada) {
    console.log(`${trabajador.nombre}: Sin fecha de entrada, 0 horas`);
    return 0;
  }
  
  const mes = mesSeleccionado.getMonth() + 1;
  const año = mesSeleccionado.getFullYear();
  
  // Fechas de trabajo del empleado
  const fechaEntrada = trabajador.fechaEntrada;
  const fechaSalida = trabajador.fechaSalida || new Date();
  
  // Fechas límite del mes seleccionado
  const primerDiaMes = new Date(año, mes - 1, 1);
  const ultimoDiaMes = new Date(año, mes, 0);

  // Verificar si el trabajador estaba activo durante ese mes
  if (fechaEntrada > ultimoDiaMes || fechaSalida < primerDiaMes) {
    console.log(`${trabajador.nombre}: 0 horas (no activo en ${format(mesSeleccionado, 'MMMM yyyy', { locale: es })})`);
    return 0;
  }
  
  // Determinar las fechas efectivas para este mes
  const fechaInicioEfectiva = fechaEntrada > primerDiaMes ? fechaEntrada : primerDiaMes;
  const fechaFinEfectiva = fechaSalida < ultimoDiaMes ? fechaSalida : ultimoDiaMes;
  
  console.log(`Período efectivo: ${fechaInicioEfectiva.toLocaleDateString()} - ${fechaFinEfectiva.toLocaleDateString()}`);
  
  const calendario = generarCalendarioMesPuro(trabajador.id, mes, año);
  
  let horasTotales = 0;
  calendario.dias.forEach(dia => {
    const fechaDia = new Date(año, mes - 1, dia.fecha.getDate());
    
    // Solo contar días dentro del período efectivo del trabajador
    if (fechaDia >= fechaInicioEfectiva && fechaDia <= fechaFinEfectiva) {
      if (dia.tipo === 'laborable' || dia.tipo === 'sabado') {
        if (!dia.ausencia || !['vacaciones', 'baja_medica', 'baja_laboral', 'baja_personal'].includes(dia.ausencia.tipo)) {
          horasTotales += dia.horasReales || 0;
        }
      }
    }
  });
  
  console.log(`${trabajador.nombre}: ${horasTotales} horas en ${format(mesSeleccionado, 'MMMM yyyy', { locale: es })}`);
  return horasTotales;
};

export const TrabajadoresTab = ({ proyecto, empleados, onUpdateProyecto }: TrabajadoresTabProps) => {
  const [mesSeleccionado, setMesSeleccionado] = useState<Date>(new Date());
  const [trabajadorEditando, setTrabajadorEditando] = useState<Trabajador | null>(null);
  const [fechaEntrada, setFechaEntrada] = useState<Date | undefined>();
  const [fechaSalida, setFechaSalida] = useState<Date | undefined>();
  const [precioHora, setPrecioHora] = useState<number | undefined>();
  const [mostrarAsignacion, setMostrarAsignacion] = useState(false);
  const [trabajadoresAsignados, setTrabajadoresAsignados] = useState<number[]>([]);
  const [trabajadoresConFechas, setTrabajadoresConFechas] = useState<{id: number; fechaEntrada?: Date; fechaSalida?: Date}[]>([]);

  const mesesDisponibles = [
    { value: '2025-01', label: 'Enero 2025', date: new Date(2025, 0, 1) },
    { value: '2025-02', label: 'Febrero 2025', date: new Date(2025, 1, 1) },
    { value: '2025-03', label: 'Marzo 2025', date: new Date(2025, 2, 1) },
    { value: '2025-04', label: 'Abril 2025', date: new Date(2025, 3, 1) },
    { value: '2025-05', label: 'Mayo 2025', date: new Date(2025, 4, 1) },
    { value: '2025-06', label: 'Junio 2025', date: new Date(2025, 5, 1) },
    { value: '2025-07', label: 'Julio 2025', date: new Date(2025, 6, 1) },
    { value: '2025-08', label: 'Agosto 2025', date: new Date(2025, 7, 1) },
    { value: '2025-09', label: 'Septiembre 2025', date: new Date(2025, 8, 1) },
    { value: '2025-10', label: 'Octubre 2025', date: new Date(2025, 9, 1) },
    { value: '2025-11', label: 'Noviembre 2025', date: new Date(2025, 10, 1) },
    { value: '2025-12', label: 'Diciembre 2025', date: new Date(2025, 11, 1) },
  ];

  const mesActual = format(mesSeleccionado, 'yyyy-MM');

  const empleadosActivos = empleados.filter(e => e.activo);
  const empleadosDisponibles = empleadosActivos.filter(e => 
    !proyecto.trabajadoresAsignados.some(t => t.id === e.id)
  );

  const handleTrabajadorToggle = (empleadoId: number, checked: boolean) => {
    if (checked) {
      setTrabajadoresAsignados(prev => [...prev, empleadoId]);
      setTrabajadoresConFechas(prev => [...prev, { id: empleadoId, fechaEntrada: new Date() }]);
    } else {
      setTrabajadoresAsignados(prev => prev.filter(id => id !== empleadoId));
      setTrabajadoresConFechas(prev => prev.filter(t => t.id !== empleadoId));
    }
  };

  const handleUpdateTrabajadorFecha = (empleadoId: number, tipo: 'entrada' | 'salida', fecha: Date | undefined) => {
    setTrabajadoresConFechas(prev => 
      prev.map(t => 
        t.id === empleadoId 
          ? { ...t, [tipo === 'entrada' ? 'fechaEntrada' : 'fechaSalida']: fecha }
          : t
      )
    );
  };

  const handleAsignarTrabajadores = () => {
    const nuevosTrabajadores: Trabajador[] = trabajadoresAsignados.map(empleadoId => {
      const empleado = empleados.find(e => e.id === empleadoId);
      const fechasTrabajador = trabajadoresConFechas.find(t => t.id === empleadoId);
      
      return {
        id: empleado!.id,
        nombre: empleado!.nombre,
        apellidos: empleado!.apellidos,
        precioHora: proyecto.tipo === 'administracion' ? proyecto.precioHora : undefined,
        fechaEntrada: fechasTrabajador?.fechaEntrada,
        fechaSalida: fechasTrabajador?.fechaSalida
      };
    });

    const proyectoActualizado = {
      ...proyecto,
      trabajadoresAsignados: [...proyecto.trabajadoresAsignados, ...nuevosTrabajadores]
    };

    onUpdateProyecto(proyectoActualizado);
    setMostrarAsignacion(false);
    setTrabajadoresAsignados([]);
    setTrabajadoresConFechas([]);
  };

  const handleEditarTrabajador = (trabajador: Trabajador) => {
    setTrabajadorEditando(trabajador);
    setFechaEntrada(trabajador.fechaEntrada);
    setFechaSalida(trabajador.fechaSalida);
    setPrecioHora(trabajador.precioHora);
  };

  const handleGuardarEdicion = () => {
    if (!trabajadorEditando) return;

    const trabajadoresActualizados = proyecto.trabajadoresAsignados.map(t => 
      t.id === trabajadorEditando.id 
        ? { ...t, fechaEntrada, fechaSalida, precioHora }
        : t
    );

    const proyectoActualizado = {
      ...proyecto,
      trabajadoresAsignados: trabajadoresActualizados
    };

    onUpdateProyecto(proyectoActualizado);
    setTrabajadorEditando(null);
    setFechaEntrada(undefined);
    setFechaSalida(undefined);
    setPrecioHora(undefined);
  };

  const handleEliminarTrabajador = (trabajadorId: number) => {
    const trabajadoresFiltrados = proyecto.trabajadoresAsignados.filter(t => t.id !== trabajadorId);
    
    const proyectoActualizado = {
      ...proyecto,
      trabajadoresAsignados: trabajadoresFiltrados
    };

    onUpdateProyecto(proyectoActualizado);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Trabajadores Asignados
            </CardTitle>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4" />
                <Select value={mesActual} onValueChange={(value) => {
                  const mesEncontrado = mesesDisponibles.find(m => m.value === value);
                  if (mesEncontrado) {
                    setMesSeleccionado(mesEncontrado.date);
                  }
                }}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Seleccionar mes" />
                  </SelectTrigger>
                  <SelectContent>
                    {mesesDisponibles.map((mes) => (
                      <SelectItem key={mes.value} value={mes.value}>
                        {mes.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {empleadosDisponibles.length > 0 && (
                <Dialog open={mostrarAsignacion} onOpenChange={setMostrarAsignacion}>
                  <DialogTrigger asChild>
                    <Button>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Asignar Trabajadores
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Asignar Nuevos Trabajadores</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <TrabajadorAssignment
                        empleadosActivos={empleadosDisponibles}
                        trabajadoresAsignados={trabajadoresAsignados}
                        trabajadoresConFechas={trabajadoresConFechas}
                        onTrabajadorToggle={handleTrabajadorToggle}
                        onUpdateTrabajadorFecha={handleUpdateTrabajadorFecha}
                      />
                      
                      <div className="flex justify-end gap-2 pt-4">
                        <Button variant="outline" onClick={() => setMostrarAsignacion(false)}>
                          Cancelar
                        </Button>
                        <Button 
                          onClick={handleAsignarTrabajadores}
                          disabled={trabajadoresAsignados.length === 0}
                        >
                          Asignar Trabajadores
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {proyecto.trabajadoresAsignados.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No hay trabajadores asignados a este proyecto.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Trabajador</TableHead>
                  <TableHead>Fecha Entrada</TableHead>
                  <TableHead>Fecha Salida</TableHead>
                  <TableHead>Horas en {format(mesSeleccionado, 'MMMM yyyy', { locale: es })}</TableHead>
                  {proyecto.tipo === 'administracion' && <TableHead>Precio/Hora</TableHead>}
                  {proyecto.tipo === 'administracion' && <TableHead>Total Mes</TableHead>}
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {proyecto.trabajadoresAsignados.map((trabajador) => {
                  const horasDelMes = calcularHorasTrabajador(trabajador, mesSeleccionado);
                  const totalMes = proyecto.tipo === 'administracion' && trabajador.precioHora 
                    ? horasDelMes * trabajador.precioHora 
                    : null;

                  return (
                    <TableRow key={trabajador.id}>
                      <TableCell className="font-medium">
                        {trabajador.nombre} {trabajador.apellidos}
                      </TableCell>
                      <TableCell>
                        {trabajador.fechaEntrada 
                          ? format(trabajador.fechaEntrada, 'dd/MM/yyyy') 
                          : 'No especificada'}
                      </TableCell>
                      <TableCell>
                        {trabajador.fechaSalida 
                          ? format(trabajador.fechaSalida, 'dd/MM/yyyy') 
                          : 'Activo'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {horasDelMes}h
                        </div>
                      </TableCell>
                      {proyecto.tipo === 'administracion' && (
                        <TableCell>
                          {trabajador.precioHora ? `${trabajador.precioHora}€` : 'No especificado'}
                        </TableCell>
                      )}
                      {proyecto.tipo === 'administracion' && (
                        <TableCell>
                          {totalMes ? `${totalMes.toFixed(2)}€` : '-'}
                        </TableCell>
                      )}
                      <TableCell>
                        <Badge variant={trabajador.fechaSalida ? "secondary" : "default"}>
                          {trabajador.fechaSalida ? "Finalizado" : "Activo"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleEditarTrabajador(trabajador)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Editar Trabajador</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label>Trabajador: {trabajador.nombre} {trabajador.apellidos}</Label>
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

                                {proyecto.tipo === 'administracion' && (
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
                                  <Button variant="outline" onClick={() => setTrabajadorEditando(null)}>
                                    Cancelar
                                  </Button>
                                  <Button onClick={handleGuardarEdicion}>
                                    Guardar
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" className="text-red-600">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>¿Eliminar trabajador?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta acción eliminará a {trabajador.nombre} {trabajador.apellidos} del proyecto. 
                                  Esta acción no se puede deshacer.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleEliminarTrabajador(trabajador.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Eliminar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {proyecto.tipo === 'administracion' && proyecto.trabajadoresAsignados.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Resumen del Mes - {format(mesSeleccionado, 'MMMM yyyy', { locale: es })}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900">Total Horas</h3>
                <p className="text-2xl font-bold text-blue-700">
                  {proyecto.trabajadoresAsignados.reduce((total, trabajador) => 
                    total + calcularHorasTrabajador(trabajador, mesSeleccionado), 0
                  )}h
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-900">Total Coste</h3>
                <p className="text-2xl font-bold text-green-700">
                  €{proyecto.trabajadoresAsignados.reduce((total, trabajador) => {
                    const horas = calcularHorasTrabajador(trabajador, mesSeleccionado);
                    return total + (trabajador.precioHora ? horas * trabajador.precioHora : 0);
                  }, 0).toFixed(2)}
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-900">Trabajadores Activos</h3>
                <p className="text-2xl font-bold text-purple-700">
                  {proyecto.trabajadoresAsignados.filter(t => !t.fechaSalida || t.fechaSalida >= startOfMonth(mesSeleccionado)).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
