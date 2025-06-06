import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Clock, CalendarDays, Edit, Trash2 } from "lucide-react";
import { Proyecto, Trabajador } from "@/types/proyecto";
import { Empleado } from "@/types/empleado";
import { useState } from "react";
import { format, startOfMonth } from "date-fns";
import { es } from "date-fns/locale";
import { generarCalendarioMesPuro } from "@/utils/calendarioUtils";

interface TrabajadoresTabProps {
  proyecto: Proyecto;
  empleados: Empleado[];
  onUpdateProyecto: (proyecto: Proyecto) => void;
}

const calcularHorasTrabajador = (trabajador: Trabajador, mesSeleccionado: Date): number => {
  console.log(`Calculando horas para ${trabajador.nombre} en ${format(mesSeleccionado, 'MMMM yyyy', { locale: es })}`);
  
  const mes = mesSeleccionado.getMonth() + 1;
  const año = mesSeleccionado.getFullYear();
  
  // Verificar si el trabajador estaba activo en ese mes
  const fechaEntrada = trabajador.fechaEntrada || new Date(año, 0, 1);
  const fechaSalida = trabajador.fechaSalida || new Date(año, 11, 31);
  const inicioMes = new Date(año, mes - 1, 1);
  const finMes = new Date(año, mes, 0);

  // Si el trabajador no estaba activo durante ese mes, devolver 0
  if (fechaEntrada > finMes || fechaSalida < inicioMes) {
    console.log(`${trabajador.nombre}: 0 horas (no activo en ${format(mesSeleccionado, 'MMMM yyyy', { locale: es })})`);
    return 0;
  }
  
  const calendario = generarCalendarioMesPuro(trabajador.id, mes, año);
  
  let horasTotales = 0;
  calendario.dias.forEach(dia => {
    const fechaDia = new Date(año, mes - 1, dia.fecha.getDate());
    
    // Solo contar días dentro del período de trabajo del empleado
    if (fechaDia >= fechaEntrada && fechaDia <= fechaSalida) {
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
