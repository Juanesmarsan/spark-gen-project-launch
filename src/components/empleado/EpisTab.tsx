
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Empleado, Epi } from "@/types/empleado";
import { EpiDialog } from "../EpiDialog";

interface EpisTabProps {
  empleado: Empleado;
  inventarioEpis: Epi[];
  onAsignarEpi: (epiId: number, fecha: Date) => void;
}

export const EpisTab = ({ empleado, inventarioEpis, onAsignarEpi }: EpisTabProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">EPIs Asignados</h3>
        <EpiDialog 
          inventarioEpis={inventarioEpis}
          onAsignarEpi={onAsignarEpi}
        />
      </div>

      {empleado.epis.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>EPI</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Fecha Entrega</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {empleado.epis.map((epi) => (
              <TableRow key={epi.id}>
                <TableCell>{epi.nombre}</TableCell>
                <TableCell>€{epi.precio}</TableCell>
                <TableCell>{format(epi.fechaEntrega, "dd/MM/yyyy", { locale: es })}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};
