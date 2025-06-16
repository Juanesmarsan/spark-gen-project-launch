
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MapPin, Calendar, Clock, Users } from "lucide-react";
import { Empleado } from "@/types/empleado";
import { useProyectos } from "@/hooks/useProyectos";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { generarCalendarioMesPuro } from "@/utils/calendarioUtils";

interface ProyectosTabProps {
  empleado: Empleado;
}

export const ProyectosTab = ({ empleado }: ProyectosTabProps) => {
  const { proyectos } = useProyectos();

  // Filtrar proyectos donde está asignado el empleado
  const proyectosEmpleado = proyectos.filter(proyecto =>
    proyecto.trabajadoresAsignados.some(trabajador => trabajador.id === empleado.id)
  );

  const calcularHorasEmpleadoProyecto = (proyectoId: number, mes: number, año: number) => {
    const proyecto = proyectos.find(p => p.id === proyectoId);
    if (!proyecto) return 0;

    const trabajador = proyecto.trabajadoresAsignados.find(t => t.id === empleado.id);
    if (!trabajador || !trabajador.fechaEntrada) return 0;

    // Fechas límite del mes
    const primerDiaMes = new Date(año, mes - 1, 1);
    const ultimoDiaMes = new Date(año, mes, 0);

    // Verificar si el trabajador estaba activo durante ese mes
    const fechaEntrada = trabajador.fechaEntrada;
    const fechaSalida = trabajador.fechaSalida || new Date();

    if (fechaEntrada > ultimoDiaMes || fechaSalida < primerDiaMes) {
      return 0;
    }

    // Determinar las fechas efectivas para este mes
    const fechaInicioEfectiva = fechaEntrada > primerDiaMes ? fechaEntrada : primerDiaMes;
    const fechaFinEfectiva = fechaSalida < ultimoDiaMes ? fechaSalida : ultimoDiaMes;

    const calendario = generarCalendarioMesPuro(empleado.id, mes, año);

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

    return horasTotales;
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'activo': return 'bg-green-100 text-green-800';
      case 'completado': return 'bg-blue-100 text-blue-800';
      case 'pausado': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTipoColor = (tipo: string) => {
    return tipo === 'presupuesto' ? 'bg-purple-100 text-purple-800' : 'bg-orange-100 text-orange-800';
  };

  if (proyectosEmpleado.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center">
            <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No hay proyectos asignados a este empleado.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Proyectos Asignados</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Proyecto</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Ciudad</TableHead>
                <TableHead>Fecha Entrada</TableHead>
                <TableHead>Fecha Salida</TableHead>
                <TableHead>Horas Mes Actual</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {proyectosEmpleado.map(proyecto => {
                const trabajador = proyecto.trabajadoresAsignados.find(t => t.id === empleado.id);
                const mesActual = new Date().getMonth() + 1;
                const añoActual = new Date().getFullYear();
                const horasMesActual = calcularHorasEmpleadoProyecto(proyecto.id, mesActual, añoActual);

                return (
                  <TableRow key={proyecto.id}>
                    <TableCell className="font-medium">{proyecto.nombre}</TableCell>
                    <TableCell>
                      <Badge className={getTipoColor(proyecto.tipo)}>
                        {proyecto.tipo === 'presupuesto' ? 'Presupuesto' : 'Administración'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getEstadoColor(proyecto.estado)}>
                        {proyecto.estado.charAt(0).toUpperCase() + proyecto.estado.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {proyecto.ciudad}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {trabajador?.fechaEntrada 
                          ? format(trabajador.fechaEntrada, 'dd/MM/yyyy') 
                          : 'No especificada'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {trabajador?.fechaSalida 
                          ? format(trabajador.fechaSalida, 'dd/MM/yyyy') 
                          : 'Activo'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {horasMesActual}h
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
