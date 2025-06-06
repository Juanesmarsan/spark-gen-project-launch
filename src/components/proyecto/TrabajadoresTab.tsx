import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CalendarIcon, Edit, UserMinus, UserPlus, Clock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Proyecto, Trabajador } from "@/types/proyecto";
import { useEmpleados } from "@/hooks/useEmpleados";

interface TrabajadoresTabProps {
  proyecto: Proyecto;
  onUpdateProyecto: (proyecto: Proyecto) => void;
}

export const TrabajadoresTab = ({ proyecto, onUpdateProyecto }: TrabajadoresTabProps) => {
  const [editingTrabajador, setEditingTrabajador] = useState<Trabajador | null>(null);
  const [fechaEntrada, setFechaEntrada] = useState<Date | undefined>();
  const [fechaSalida, setFechaSalida] = useState<Date | undefined>();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedEmpleados, setSelectedEmpleados] = useState<number[]>([]);
  const [fechaEntradaNuevos, setFechaEntradaNuevos] = useState<Date | undefined>(new Date());
  const [mostrarHoras, setMostrarHoras] = useState(false);

  const { empleados } = useEmpleados();

  // Filtrar empleados que no están ya asignados al proyecto
  const empleadosDisponibles = empleados.filter(emp => 
    emp.activo && !proyecto.trabajadoresAsignados.some(t => t.id === emp.id)
  );

  // Festivos fijos para el cálculo
  const festivosFijos = [
    '01-01', '01-06', '05-01', '08-15', '10-12', '11-01', '12-06', '12-08', '12-25', // Nacionales
    '03-19', '04-22', '06-24', '10-09' // Valencia (fechas aproximadas, pueden variar por año)
  ];

  const esFestivo = (fecha: Date): boolean => {
    const mesYDia = String(fecha.getMonth() + 1).padStart(2, '0') + '-' + String(fecha.getDate()).padStart(2, '0');
    return festivosFijos.includes(mesYDia);
  };

  const getTipoDia = (fecha: Date): 'laborable' | 'festivo' | 'sabado' | 'domingo' => {
    const diaSemana = fecha.getDay();
    
    if (diaSemana === 0) return 'domingo';
    if (diaSemana === 6) return 'sabado';
    if (esFestivo(fecha)) return 'festivo';
    
    return 'laborable';
  };

  // Calcular horas trabajadas para un trabajador específico por mes
  const calcularHorasTrabajador = (trabajador: Trabajador) => {
    if (!trabajador.fechaEntrada) return { horasLaborales: 0, horasExtras: 0, horasFestivas: 0 };

    let horasLaborales = 0;
    let horasExtras = 0;
    let horasFestivas = 0;

    // Calcular desde el mes de entrada hasta el mes actual o hasta la fecha de salida
    const fechaFin = trabajador.fechaSalida || new Date();
    const fechaInicio = new Date(trabajador.fechaEntrada);
    
    // Iterar mes por mes
    let fechaActual = new Date(fechaInicio.getFullYear(), fechaInicio.getMonth(), 1);
    
    while (fechaActual <= fechaFin) {
      const año = fechaActual.getFullYear();
      const mes = fechaActual.getMonth();
      
      // Obtener el primer y último día del mes
      const primerDiaMes = new Date(año, mes, 1);
      const ultimoDiaMes = new Date(año, mes + 1, 0);
      
      // Determinar el rango de fechas a considerar en este mes
      const fechaInicioMes = fechaInicio > primerDiaMes ? fechaInicio : primerDiaMes;
      const fechaFinMes = fechaFin < ultimoDiaMes ? fechaFin : ultimoDiaMes;
      
      // Calcular horas para cada día del mes en el rango de trabajo
      for (let fecha = new Date(fechaInicioMes); fecha <= fechaFinMes; fecha.setDate(fecha.getDate() + 1)) {
        const tipoDia = getTipoDia(fecha);
        
        if (tipoDia === 'laborable') {
          horasLaborales += 8; // Siempre 8 horas por día laborable
        } else if (tipoDia === 'sabado') {
          // Los sábados no se trabajan por defecto (0 horas)
          // Si se quisiera contar como extras, se haría aquí
        } else if (tipoDia === 'festivo' || tipoDia === 'domingo') {
          // Festivos y domingos no se trabajan por defecto (0 horas)
          // Si se quisiera contar como festivas, se haría aquí
        }
      }
      
      // Avanzar al siguiente mes
      fechaActual = new Date(año, mes + 1, 1);
    }

    return { horasLaborales, horasExtras, horasFestivas };
  };

  const handleEditTrabajador = (trabajador: Trabajador) => {
    setEditingTrabajador(trabajador);
    setFechaEntrada(trabajador.fechaEntrada);
    setFechaSalida(trabajador.fechaSalida);
  };

  const handleSaveFechas = () => {
    if (!editingTrabajador) return;

    const trabajadoresActualizados = proyecto.trabajadoresAsignados.map(t => 
      t.id === editingTrabajador.id 
        ? { ...t, fechaEntrada, fechaSalida }
        : t
    );

    onUpdateProyecto({
      ...proyecto,
      trabajadoresAsignados: trabajadoresActualizados
    });

    setEditingTrabajador(null);
    setFechaEntrada(undefined);
    setFechaSalida(undefined);
  };

  const handleRemoveTrabajador = (trabajadorId: number) => {
    const trabajadoresFiltrados = proyecto.trabajadoresAsignados.filter(t => t.id !== trabajadorId);
    onUpdateProyecto({
      ...proyecto,
      trabajadoresAsignados: trabajadoresFiltrados
    });
  };

  const handleAddTrabajadores = () => {
    if (selectedEmpleados.length === 0 || !fechaEntradaNuevos) return;

    const nuevosTrabajadores = selectedEmpleados.map(empleadoId => {
      const empleado = empleados.find(e => e.id === empleadoId);
      if (!empleado) return null;

      return {
        id: empleado.id,
        nombre: empleado.nombre,
        apellidos: empleado.apellidos,
        precioHora: proyecto.tipo === 'administracion' ? proyecto.precioHora : undefined,
        fechaEntrada: fechaEntradaNuevos,
        fechaSalida: undefined
      };
    }).filter(Boolean) as Trabajador[];

    onUpdateProyecto({
      ...proyecto,
      trabajadoresAsignados: [...proyecto.trabajadoresAsignados, ...nuevosTrabajadores]
    });

    setShowAddDialog(false);
    setSelectedEmpleados([]);
    setFechaEntradaNuevos(new Date());
  };

  const handleEmpleadoToggle = (empleadoId: number, checked: boolean) => {
    setSelectedEmpleados(prev => 
      checked 
        ? [...prev, empleadoId]
        : prev.filter(id => id !== empleadoId)
    );
  };

  const getEstadoTrabajador = (trabajador: Trabajador) => {
    const hoy = new Date();
    
    if (!trabajador.fechaEntrada) return 'pendiente';
    if (trabajador.fechaEntrada > hoy) return 'programado';
    if (trabajador.fechaSalida && trabajador.fechaSalida < hoy) return 'finalizado';
    return 'activo';
  };

  const getEstadoBadgeColor = (estado: string) => {
    switch (estado) {
      case 'activo':
        return 'bg-green-100 text-green-800';
      case 'programado':
        return 'bg-blue-100 text-blue-800';
      case 'finalizado':
        return 'bg-gray-100 text-gray-800';
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Trabajadores del Proyecto</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMostrarHoras(!mostrarHoras)}
          >
            <Clock className="w-4 h-4 mr-1" />
            {mostrarHoras ? 'Ocultar Horas' : 'Ver Horas'}
          </Button>
          <span className="text-sm text-gray-500">
            {proyecto.trabajadoresAsignados.length} trabajadores asignados
          </span>
          {empleadosDisponibles.length > 0 && (
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-omenar-green hover:bg-omenar-dark-green">
                  <UserPlus className="w-4 h-4 mr-1" />
                  Añadir Trabajadores
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Añadir Trabajadores al Proyecto</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div>
                    <Label>Fecha de entrada a la obra *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !fechaEntradaNuevos && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {fechaEntradaNuevos ? format(fechaEntradaNuevos, "dd/MM/yyyy") : "Seleccionar fecha"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={fechaEntradaNuevos}
                          onSelect={setFechaEntradaNuevos}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <Label>Seleccionar Empleados</Label>
                    <div className="border rounded-md p-4 max-h-64 overflow-y-auto space-y-2">
                      {empleadosDisponibles.map((empleado) => (
                        <div key={empleado.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`nuevo-trabajador-${empleado.id}`}
                            checked={selectedEmpleados.includes(empleado.id)}
                            onCheckedChange={(checked) => 
                              handleEmpleadoToggle(empleado.id, checked as boolean)
                            }
                          />
                          <label htmlFor={`nuevo-trabajador-${empleado.id}`} className="text-sm">
                            {empleado.nombre} {empleado.apellidos}
                          </label>
                        </div>
                      ))}
                      {empleadosDisponibles.length === 0 && (
                        <p className="text-sm text-gray-500">
                          Todos los empleados activos ya están asignados al proyecto
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleAddTrabajadores}
                    disabled={selectedEmpleados.length === 0 || !fechaEntradaNuevos}
                    className="bg-omenar-green hover:bg-omenar-dark-green"
                  >
                    Añadir Trabajadores
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {mostrarHoras && proyecto.trabajadoresAsignados.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Resumen de Horas por Trabajador (Valores por Defecto)</CardTitle>
            <p className="text-sm text-gray-600">
              Cálculo basado en 8 horas por día laborable. Los sábados, domingos y festivos no se cuentan por defecto.
            </p>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Trabajador</TableHead>
                  <TableHead>Fecha Entrada</TableHead>
                  <TableHead>Fecha Salida</TableHead>
                  <TableHead className="text-right">Horas Laborales</TableHead>
                  <TableHead className="text-right">Horas Extras</TableHead>
                  <TableHead className="text-right">Horas Festivas</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {proyecto.trabajadoresAsignados.map((trabajador) => {
                  const horas = calcularHorasTrabajador(trabajador);
                  const totalHoras = horas.horasLaborales + horas.horasExtras + horas.horasFestivas;
                  
                  return (
                    <TableRow key={trabajador.id}>
                      <TableCell className="font-medium">
                        {trabajador.nombre} {trabajador.apellidos}
                      </TableCell>
                      <TableCell>
                        {trabajador.fechaEntrada ? 
                          format(trabajador.fechaEntrada, "dd/MM/yyyy") : 
                          <span className="text-red-500">No definida</span>
                        }
                      </TableCell>
                      <TableCell>
                        {trabajador.fechaSalida ? 
                          format(trabajador.fechaSalida, "dd/MM/yyyy") : 
                          <span className="text-green-600">Activo</span>
                        }
                      </TableCell>
                      <TableCell className="text-right">{horas.horasLaborales}h</TableCell>
                      <TableCell className="text-right">{horas.horasExtras}h</TableCell>
                      <TableCell className="text-right">{horas.horasFestivas}h</TableCell>
                      <TableCell className="text-right font-semibold">{totalHoras}h</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {proyecto.trabajadoresAsignados.map((trabajador) => {
          const estado = getEstadoTrabajador(trabajador);
          
          return (
            <Card key={trabajador.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium">
                        {trabajador.nombre} {trabajador.apellidos}
                      </h4>
                      <Badge className={getEstadoBadgeColor(estado)}>
                        {estado.charAt(0).toUpperCase() + estado.slice(1)}
                      </Badge>
                      {trabajador.precioHora && (
                        <Badge variant="outline">{trabajador.precioHora}€/hora</Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Fecha de entrada:</span>
                        <br />
                        {trabajador.fechaEntrada ? (
                          format(trabajador.fechaEntrada, "dd/MM/yyyy")
                        ) : (
                          <span className="text-red-500">No definida</span>
                        )}
                      </div>
                      <div>
                        <span className="font-medium">Fecha de salida:</span>
                        <br />
                        {trabajador.fechaSalida ? (
                          format(trabajador.fechaSalida, "dd/MM/yyyy")
                        ) : (
                          <span className="text-green-600">Activo en obra</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditTrabajador(trabajador)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            Editar fechas - {trabajador.nombre} {trabajador.apellidos}
                          </DialogTitle>
                        </DialogHeader>
                        
                        <div className="space-y-4 py-4">
                          <div>
                            <Label>Fecha de entrada *</Label>
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
                                  className="pointer-events-auto"
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                          
                          <div>
                            <Label>Fecha de salida (opcional)</Label>
                            <div className="flex gap-2">
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      "flex-1 justify-start text-left font-normal",
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
                                    className="pointer-events-auto"
                                  />
                                </PopoverContent>
                              </Popover>
                              {fechaSalida && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setFechaSalida(undefined)}
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
                        
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setEditingTrabajador(null)}>
                            Cancelar
                          </Button>
                          <Button onClick={handleSaveFechas}>
                            Guardar
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRemoveTrabajador(trabajador.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <UserMinus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
        
        {proyecto.trabajadoresAsignados.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">No hay trabajadores asignados a este proyecto</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
