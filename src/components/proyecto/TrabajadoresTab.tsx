
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Clock, CalendarDays, Edit, Trash2 } from "lucide-react";
import { Proyecto, Trabajador } from "@/types/proyecto";
import { Empleado } from "@/types/empleado";
import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isWeekend } from "date-fns";
import { es } from "date-fns/locale";

interface TrabajadoresTabProps {
  proyecto: Proyecto;
  empleados: Empleado[];
  onUpdateProyecto: (proyecto: Proyecto) => void;
}

// Lista de días festivos (puedes expandir esta lista)
const diasFestivos = [
  '2025-01-01', // Año Nuevo
  '2025-01-06', // Reyes
  '2025-04-18', // Viernes Santo
  '2025-04-21', // Lunes de Pascua
  '2025-05-01', // Día del Trabajo
  '2025-08-15', // Asunción
  '2025-10-12', // Día de la Hispanidad
  '2025-11-01', // Todos los Santos
  '2025-12-06', // Día de la Constitución
  '2025-12-08', // Inmaculada Concepción
  '2025-12-25', // Navidad
];

const esFestivo = (fecha: Date): boolean => {
  const fechaStr = format(fecha, 'yyyy-MM-dd');
  return diasFestivos.includes(fechaStr);
};

const calcularHorasTrabajador = (trabajador: Trabajador, mesSeleccionado: Date): number => {
  console.log(`Calculando horas para ${trabajador.nombre} en ${format(mesSeleccionado, 'MMMM yyyy', { locale: es })}`);
  
  const inicioMes = startOfMonth(mesSeleccionado);
  const finMes = endOfMonth(mesSeleccionado);
  
  // Determinar fecha de inicio para el cálculo
  let fechaInicio = inicioMes;
  if (trabajador.fechaEntrada && trabajador.fechaEntrada > inicioMes) {
    fechaInicio = trabajador.fechaEntrada;
  }
  
  // Determinar fecha de fin para el cálculo
  let fechaFin = finMes;
  if (trabajador.fechaSalida && trabajador.fechaSalida < finMes) {
    fechaFin = trabajador.fechaSalida;
  }
  
  console.log(`${trabajador.nombre}: Calculando desde ${format(fechaInicio, 'dd/MM/yyyy')} hasta ${format(fechaFin, 'dd/MM/yyyy')}`);
  
  if (fechaInicio > fechaFin) {
    console.log(`${trabajador.nombre}: No trabajó en este mes`);
    return 0;
  }
  
  const diasTrabajo = eachDayOfInterval({ start: fechaInicio, end: fechaFin });
  
  let horasTotales = 0;
  diasTrabajo.forEach(dia => {
    if (!isWeekend(dia) && !esFestivo(dia)) {
      horasTotales += 8; // 8 horas por día laborable
    }
  });
  
  console.log(`${trabajador.nombre}: ${horasTotales} horas en ${format(mesSeleccionado, 'MMMM yyyy', { locale: es })}`);
  return horasTotales;
};

export const TrabajadoresTab = ({ proyecto, empleados, onUpdateProyecto }: TrabajadoresTabProps) => {
  const [mesSeleccionado, setMesSeleccionado] = useState<Date>(new Date());

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
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </Button>
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
