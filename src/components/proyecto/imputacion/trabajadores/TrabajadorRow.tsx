
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Clock, AlertTriangle } from "lucide-react";
import { Trabajador } from "@/types/proyecto";
import { Empleado } from "@/types/empleado";
import { TrabajadorStats } from "./TrabajadorStatsCalculator";

interface TrabajadorRowProps {
  trabajador: Trabajador;
  empleado: Empleado;
  estadisticas: TrabajadorStats;
}

const getAusenciaColor = (tipo: string) => {
  switch (tipo) {
    case 'vacaciones': return 'bg-blue-100 text-blue-800';
    case 'baja': return 'bg-red-100 text-red-800';
    case 'ausencia': return 'bg-yellow-100 text-yellow-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const TrabajadorRow = ({ trabajador, empleado, estadisticas }: TrabajadorRowProps) => {
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
};
