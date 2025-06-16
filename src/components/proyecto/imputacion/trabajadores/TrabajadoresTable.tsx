
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Proyecto, Trabajador } from "@/types/proyecto";
import { Empleado } from "@/types/empleado";
import { calcularEstadisticasTrabajador } from "./TrabajadorStatsCalculator";
import { TrabajadorRow } from "./TrabajadorRow";

interface TrabajadoresTableProps {
  proyecto: Proyecto;
  empleados: Empleado[];
  mes: number;
  anio: number;
}

export const TrabajadoresTable = ({ proyecto, empleados, mes, anio }: TrabajadoresTableProps) => {
  return (
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

            const estadisticas = calcularEstadisticasTrabajador(trabajador, empleado, mes, anio);

            return (
              <TrabajadorRow
                key={trabajador.id}
                trabajador={trabajador}
                empleado={empleado}
                estadisticas={estadisticas}
              />
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
  );
};
