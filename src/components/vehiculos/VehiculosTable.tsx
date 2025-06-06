
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2, Receipt } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { VehiculoCompleto } from "@/types/vehiculo";

interface VehiculosTableProps {
  vehiculos: VehiculoCompleto[];
  onEdit: (vehiculo: VehiculoCompleto) => void;
  onDelete: (id: number) => void;
  onAgregarGasto: (vehiculoId: number) => void;
}

export const VehiculosTable = ({ vehiculos, onEdit, onDelete, onAgregarGasto }: VehiculosTableProps) => {
  const esPróximoAVencer = (fecha: Date) => {
    const ahora = new Date();
    const unMes = new Date();
    unMes.setMonth(unMes.getMonth() + 1);
    return fecha <= unMes && fecha >= ahora;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Matrícula</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Marca/Modelo</TableHead>
          <TableHead>ITV</TableHead>
          <TableHead>Seguro</TableHead>
          <TableHead>Kilómetros</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {vehiculos.map((vehiculo) => (
          <TableRow key={vehiculo.id}>
            <TableCell className="font-medium">{vehiculo.matricula}</TableCell>
            <TableCell>{vehiculo.tipo}</TableCell>
            <TableCell>{vehiculo.marca} {vehiculo.modelo}</TableCell>
            <TableCell>
              <span className={`px-2 py-1 rounded-full text-xs ${
                esPróximoAVencer(vehiculo.caducidadITV) 
                  ? 'bg-yellow-100 text-yellow-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {format(vehiculo.caducidadITV, "dd/MM/yyyy", { locale: es })}
              </span>
            </TableCell>
            <TableCell>
              <span className={`px-2 py-1 rounded-full text-xs ${
                esPróximoAVencer(vehiculo.caducidadSeguro) 
                  ? 'bg-yellow-100 text-yellow-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {format(vehiculo.caducidadSeguro, "dd/MM/yyyy", { locale: es })}
              </span>
            </TableCell>
            <TableCell>{vehiculo.kilometros.toLocaleString()} km</TableCell>
            <TableCell>
              <span className={`px-2 py-1 rounded-full text-xs ${
                vehiculo.asignado 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {vehiculo.asignado ? `Asignado a ${vehiculo.empleadoAsignado}` : 'Disponible'}
              </span>
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onAgregarGasto(vehiculo.id)}
                >
                  <Receipt className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onEdit(vehiculo)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onDelete(vehiculo.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
