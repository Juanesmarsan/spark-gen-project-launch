
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, AlertTriangle } from "lucide-react";
import { Proyecto, Trabajador } from "@/types/proyecto";
import { Empleado } from "@/types/empleado";
import { generarCalendarioMesPuro } from "@/utils/calendarioUtils";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface TrabajadoresAusenciasSectionProps {
  proyecto: Proyecto;
  empleados: Empleado[];
  mes: number;
  anio: number;
}

export const TrabajadoresAusenciasSection = ({
  proyecto,
  empleados,
  mes,
  anio
}: TrabajadoresAusenciasSectionProps) => {
  const calcularEstadisticasTrabajador = (trabajador: Trabajador, empleado: Empleado) => {
    // Verificar si trabajaba en el proyecto durante el mes
    const primerDiaMes = new Date(anio, mes - 1, 1);
    const ultimoDiaMes = new Date(anio, mes, 0);
    
    const fechaEntrada = trabajador.fechaEntrada || primerDiaMes;
    const fechaSalida = trabajador.fechaSalida || ultimoDiaMes;

    if (fechaEntrada > ultimoDiaMes || fechaSalida < primerDiaMes) {
      return {
        horasLaborales: 0,
        horasExtras: 0,
        horasFestivas: 0,
        diasVacaciones: 0,
        diasBaja: 0,
        diasAusencia: 0,
        gastosVariables: 0
      };
    }

    const calendario = generarCalendarioMesPuro(empleado.id, mes, anio);
    
    let horasLaborales = 0;
    let horasExtras = 0;
    let horasFestivas = 0;
    let diasVacaciones = 0;
    let diasBaja = 0;
    let diasAusencia = 0;

    const fechaInicioEfectiva = fechaEntrada > primerDiaMes ? fechaEntrada : primerDiaMes;
    const fechaFinEfectiva = fechaSalida < ultimoDiaMes ? fechaSalida : ultimoDiaMes;

    calendario.dias.forEach(dia => {
      const fechaDia = new Date(anio, mes - 1, dia.fecha.getDate());
      
      if (fechaDia >= fechaInicioEfectiva && fechaDia <= fechaFinEfectiva) {
        if (dia.ausencia) {
          switch (dia.ausencia.tipo) {
            case 'vacaciones':
              diasVacaciones++;
              break;
            case 'baja_medica':
            case 'baja_laboral':
            case 'baja_personal':
              diasBaja++;
              break;
            case 'ausencia':
              diasAusencia++;
              break;
          }
        } else {
          if (dia.tipo === 'laborable' || dia.tipo === 'sabado') {
            horasLaborales += dia.horasReales || 0;
            
            // Calcular horas extras (más de 8 horas en día laboral)
            if (dia.horasReales > 8) {
              horasExtras += dia.horasReales - 8;
            }
          } else if (dia.tipo === 'festivo' && dia.horasReales > 0) {
            horasFestivas += dia.horasReales;
          }
        }
      }
    });

    // Calcular gastos variables del empleado (usando datos del empleado)
    const gastosVariables = empleado.gastosVariables?.filter(gasto => {
      const fechaGasto = new Date(gasto.fecha);
      return fechaGasto.getMonth() + 1 === mes && fechaGasto.getFullYear() === anio;
    }).reduce((total, gasto) => total + gasto.importe, 0) || 0;

    return {
      horasLaborales,
      horasExtras,
      horasFestivas,
      diasVacaciones,
      diasBaja,
      diasAusencia,
      gastosVariables
    };
  };

  const getAusenciaColor = (tipo: string) => {
    switch (tipo) {
      case 'vacaciones': return 'bg-blue-100 text-blue-800';
      case 'baja': return 'bg-red-100 text-red-800';
      case 'ausencia': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Detalle de Trabajadores - {format(new Date(anio, mes - 1), 'MMMM yyyy', { locale: es })}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Trabajador</TableHead>
              <TableHead>Horas Laborales</TableHead>
              <TableHead>Horas Extras</TableHead>
              <TableHead>Horas Festivas</TableHead>
              <TableHead>Vacaciones</TableHead>
              <TableHead>Bajas</TableHead>
              <TableHead>Ausencias</TableHead>
              <TableHead>Gastos Variables</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {proyecto.trabajadoresAsignados.length > 0 ? (
              proyecto.trabajadoresAsignados.map((trabajador) => {
                const empleado = empleados.find(e => e.id === trabajador.id);
                if (!empleado) return null;

                const estadisticas = calcularEstadisticasTrabajador(trabajador, empleado);

                return (
                  <TableRow key={trabajador.id}>
                    <TableCell className="font-medium">
                      {trabajador.nombre} {trabajador.apellidos}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {estadisticas.horasLaborales}h
                      </div>
                    </TableCell>
                    <TableCell>
                      {estadisticas.horasExtras > 0 ? (
                        <Badge variant="outline" className="bg-orange-50 text-orange-700">
                          {estadisticas.horasExtras}h
                        </Badge>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>
                      {estadisticas.horasFestivas > 0 ? (
                        <Badge variant="outline" className="bg-purple-50 text-purple-700">
                          {estadisticas.horasFestivas}h
                        </Badge>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>
                      {estadisticas.diasVacaciones > 0 ? (
                        <Badge className={getAusenciaColor('vacaciones')}>
                          {estadisticas.diasVacaciones} días
                        </Badge>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>
                      {estadisticas.diasBaja > 0 ? (
                        <Badge className={getAusenciaColor('baja')}>
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          {estadisticas.diasBaja} días
                        </Badge>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>
                      {estadisticas.diasAusencia > 0 ? (
                        <Badge className={getAusenciaColor('ausencia')}>
                          {estadisticas.diasAusencia} días
                        </Badge>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>
                      {estadisticas.gastosVariables > 0 ? (
                        <span className="font-medium text-green-600">
                          €{estadisticas.gastosVariables.toFixed(2)}
                        </span>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                  No hay trabajadores asignados al proyecto
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
