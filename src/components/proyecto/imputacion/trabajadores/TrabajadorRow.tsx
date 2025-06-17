
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trabajador } from "@/types/proyecto";
import { Empleado } from "@/types/empleado";
import { EstadisticasTrabajador } from "./TrabajadorStatsCalculator";

interface TrabajadorRowProps {
  trabajador: Trabajador;
  empleado: Empleado;
  estadisticas: EstadisticasTrabajador;
}

export const TrabajadorRow = ({ trabajador, empleado, estadisticas }: TrabajadorRowProps) => {
  const safeToFixed = (value: number | undefined | null, decimals: number = 2): string => {
    if (value === null || value === undefined || isNaN(value)) {
      return "0.00";
    }
    return Number(value).toFixed(decimals);
  };

  return (
    <TableRow>
      <TableCell className="font-medium">
        {empleado.nombre} {empleado.apellidos}
      </TableCell>
      <TableCell>
        <Badge variant="outline" className="bg-blue-50 text-blue-700">
          {safeToFixed(estadisticas.horasLaborales, 1)}h
        </Badge>
      </TableCell>
      <TableCell>
        {estadisticas.horasExtras > 0 ? (
          <Badge variant="outline" className="bg-orange-50 text-orange-700">
            {safeToFixed(estadisticas.horasExtras, 1)}h
          </Badge>
        ) : (
          <span className="text-muted-foreground">-</span>
        )}
      </TableCell>
      <TableCell>
        {estadisticas.horasFestivas > 0 ? (
          <Badge variant="outline" className="bg-purple-50 text-purple-700">
            {safeToFixed(estadisticas.horasFestivas, 1)}h
          </Badge>
        ) : (
          <span className="text-muted-foreground">-</span>
        )}
      </TableCell>
      <TableCell>
        {estadisticas.diasVacaciones > 0 ? (
          <Badge variant="outline" className="bg-green-50 text-green-700">
            {estadisticas.diasVacaciones} días
          </Badge>
        ) : (
          <span className="text-muted-foreground">-</span>
        )}
      </TableCell>
      <TableCell>
        {estadisticas.diasBajas > 0 ? (
          <Badge variant="outline" className="bg-red-50 text-red-700">
            {estadisticas.diasBajas} días
          </Badge>
        ) : (
          <span className="text-muted-foreground">-</span>
        )}
      </TableCell>
      <TableCell>
        {estadisticas.diasAusencias > 0 ? (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
            {estadisticas.diasAusencias} días
          </Badge>
        ) : (
          <span className="text-muted-foreground">-</span>
        )}
      </TableCell>
      <TableCell>
        {estadisticas.gastosVariables > 0 ? (
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700">
            €{safeToFixed(estadisticas.gastosVariables)}
          </Badge>
        ) : (
          <span className="text-muted-foreground">-</span>
        )}
      </TableCell>
    </TableRow>
  );
};
