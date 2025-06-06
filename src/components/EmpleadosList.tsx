
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit } from "lucide-react";
import { Empleado } from "@/types/empleado";

interface EmpleadosListProps {
  empleados: Empleado[];
  onSelectEmpleado: (empleado: Empleado) => void;
}

export const EmpleadosList = ({ empleados, onSelectEmpleado }: EmpleadosListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Empleados</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>DNI</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Salario Bruto</TableHead>
              <TableHead>Vehículo</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {empleados.map((empleado) => (
              <TableRow key={empleado.id}>
                <TableCell>{empleado.nombre} {empleado.apellidos}</TableCell>
                <TableCell>{empleado.dni}</TableCell>
                <TableCell>{empleado.telefono}</TableCell>
                <TableCell>{empleado.email}</TableCell>
                <TableCell>€{empleado.salarioBruto}</TableCell>
                <TableCell>
                  {empleado.vehiculo ? (
                    <Badge variant="secondary">{empleado.vehiculo}</Badge>
                  ) : (
                    <span className="text-muted-foreground">Sin asignar</span>
                  )}
                </TableCell>
                <TableCell>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onSelectEmpleado(empleado)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
