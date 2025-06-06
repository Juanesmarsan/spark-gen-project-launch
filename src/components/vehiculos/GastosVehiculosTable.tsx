
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { GastoVehiculo, VehiculoCompleto } from "@/types/vehiculo";

interface GastosVehiculosTableProps {
  gastos: GastoVehiculo[];
  vehiculos: VehiculoCompleto[];
  onEdit: (gasto: GastoVehiculo) => void;
  onDelete: (id: number) => void;
}

export const GastosVehiculosTable = ({ gastos, vehiculos, onEdit, onDelete }: GastosVehiculosTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Vehículo</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Concepto</TableHead>
          <TableHead>Fecha</TableHead>
          <TableHead>Importe</TableHead>
          <TableHead>Factura</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {gastos.map((gasto) => {
          const vehiculo = vehiculos.find(v => v.id === gasto.vehiculoId);
          return (
            <TableRow key={gasto.id}>
              <TableCell className="font-medium">
                {vehiculo ? `${vehiculo.matricula} - ${vehiculo.marca} ${vehiculo.modelo}` : 'N/A'}
              </TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  gasto.tipo === 'ITV' ? 'bg-blue-100 text-blue-800' :
                  gasto.tipo === 'revision' ? 'bg-green-100 text-green-800' :
                  gasto.tipo === 'reparacion' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {gasto.tipo.toUpperCase()}
                </span>
              </TableCell>
              <TableCell>{gasto.concepto}</TableCell>
              <TableCell>{format(gasto.fecha, "dd/MM/yyyy", { locale: es })}</TableCell>
              <TableCell>€{gasto.importe.toFixed(2)}</TableCell>
              <TableCell>
                {gasto.factura ? (
                  <span className="text-green-600">✓</span>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onEdit(gasto)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onDelete(gasto.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
