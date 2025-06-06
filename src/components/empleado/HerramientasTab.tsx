
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Empleado, Herramienta } from "@/types/empleado";
import { HerramientaDialog } from "../HerramientaDialog";

interface HerramientasTabProps {
  empleado: Empleado;
  inventarioHerramientas: Herramienta[];
  onAsignarHerramienta: (herramientaId: number, fecha: Date) => void;
}

export const HerramientasTab = ({ empleado, inventarioHerramientas, onAsignarHerramienta }: HerramientasTabProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Herramientas Asignadas</h3>
        <HerramientaDialog 
          inventarioHerramientas={inventarioHerramientas}
          onAsignarHerramienta={onAsignarHerramienta}
        />
      </div>

      {empleado.herramientas.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Herramienta</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Fecha Entrega</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {empleado.herramientas.map((herramienta) => (
              <TableRow key={herramienta.id}>
                <TableCell>{herramienta.nombre}</TableCell>
                <TableCell>€{herramienta.precio}</TableCell>
                <TableCell>{format(herramienta.fechaEntrega, "dd/MM/yyyy", { locale: es })}</TableCell>
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
