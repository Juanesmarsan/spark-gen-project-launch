
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GastoFijo } from "@/types/gastosFijos";

interface GastosFijosTableProps {
  gastos: GastoFijo[];
  onEdit: (gasto: GastoFijo) => void;
  onDelete: (id: number) => void;
}

export const GastosFijosTable = ({ gastos, onEdit, onDelete }: GastosFijosTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Concepto</TableHead>
          <TableHead className="text-right">Total Bruto</TableHead>
          <TableHead className="text-right">Base Imponible</TableHead>
          <TableHead className="text-center">IVA</TableHead>
          <TableHead className="text-center">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {gastos.map((gasto) => (
          <TableRow key={gasto.id}>
            <TableCell className="font-medium">{gasto.concepto}</TableCell>
            <TableCell className="text-right">€{gasto.totalBruto.toFixed(2)}</TableCell>
            <TableCell className="text-right">€{gasto.baseImponible.toFixed(2)}</TableCell>
            <TableCell className="text-center">
              {gasto.tieneIva ? (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  €{gasto.iva?.toFixed(2)}
                </span>
              ) : (
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  No
                </span>
              )}
            </TableCell>
            <TableCell className="text-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(gasto)}
              >
                Editar
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(gasto.id)}
              >
                Eliminar
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
