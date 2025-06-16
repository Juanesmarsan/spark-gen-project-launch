
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Edit, Trash2, UserX, UserCheck } from "lucide-react";
import { Empleado } from "@/types/empleado";
import { EmpleadosBulkActions } from "./EmpleadosBulkActions";

interface EmpleadosListProps {
  empleados: Empleado[];
  onSelectEmpleado: (empleado: Empleado) => void;
  onEliminarEmpleado: (empleadoId: number) => void;
  onDeshabilitarEmpleado: (empleadoId: number) => void;
  onHabilitarEmpleado: (empleadoId: number) => void;
  allowPermanentDelete?: boolean;
}

export const EmpleadosList = ({ 
  empleados, 
  onSelectEmpleado, 
  onEliminarEmpleado, 
  onDeshabilitarEmpleado, 
  onHabilitarEmpleado,
  allowPermanentDelete = false 
}: EmpleadosListProps) => {
  console.log('EmpleadosList: Renderizando lista con', empleados.length, 'empleados');

  const [selectedEmpleados, setSelectedEmpleados] = useState<number[]>([]);

  const handleEditarEmpleado = (empleado: Empleado) => {
    console.log('EmpleadosList: Editando empleado', empleado.id);
    onSelectEmpleado(empleado);
  };

  const handleEliminarEmpleado = (empleadoId: number) => {
    console.log('EmpleadosList: Eliminando empleado', empleadoId);
    onEliminarEmpleado(empleadoId);
    setSelectedEmpleados(prev => prev.filter(id => id !== empleadoId));
  };

  const handleDeshabilitarEmpleado = (empleadoId: number) => {
    console.log('EmpleadosList: Deshabilitando empleado', empleadoId);
    onDeshabilitarEmpleado(empleadoId);
    setSelectedEmpleados(prev => prev.filter(id => id !== empleadoId));
  };

  const handleHabilitarEmpleado = (empleadoId: number) => {
    console.log('EmpleadosList: Habilitando empleado', empleadoId);
    onHabilitarEmpleado(empleadoId);
  };

  const handleSelectEmpleado = (empleadoId: number, selected: boolean) => {
    setSelectedEmpleados(prev => 
      selected 
        ? [...prev, empleadoId]
        : prev.filter(id => id !== empleadoId)
    );
  };

  const handleSelectAll = (selected: boolean) => {
    setSelectedEmpleados(selected ? empleados.map(emp => emp.id) : []);
  };

  const handleBulkDisable = (empleadoIds: number[]) => {
    empleadoIds.forEach(id => onDeshabilitarEmpleado(id));
    setSelectedEmpleados([]);
  };

  const handleBulkDelete = (empleadoIds: number[]) => {
    empleadoIds.forEach(id => onEliminarEmpleado(id));
    setSelectedEmpleados([]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Empleados</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <EmpleadosBulkActions
          empleados={empleados}
          selectedEmpleados={selectedEmpleados}
          onSelectEmpleado={handleSelectEmpleado}
          onSelectAll={handleSelectAll}
          onBulkDisable={handleBulkDisable}
          onBulkDelete={handleBulkDelete}
          allowPermanentDelete={allowPermanentDelete}
        />

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <span className="sr-only">Seleccionar</span>
              </TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Salario Bruto</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Vehículo</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {empleados.map((empleado) => (
              <TableRow key={empleado.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedEmpleados.includes(empleado.id)}
                    onCheckedChange={(checked) => 
                      handleSelectEmpleado(empleado.id, checked as boolean)
                    }
                  />
                </TableCell>
                <TableCell>{empleado.nombre} {empleado.apellidos}</TableCell>
                <TableCell>{empleado.telefono}</TableCell>
                <TableCell>€{empleado.salarioBruto}</TableCell>
                <TableCell>
                  <Badge variant={empleado.activo ? "default" : "secondary"}>
                    {empleado.activo ? "Activo" : "Inactivo"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {empleado.vehiculo ? (
                    <Badge variant="secondary">{empleado.vehiculo}</Badge>
                  ) : (
                    <span className="text-muted-foreground">Sin asignar</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditarEmpleado(empleado)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    
                    {empleado.activo ? (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <UserX className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Deshabilitar Empleado</AlertDialogTitle>
                            <AlertDialogDescription>
                              ¿Estás seguro de que quieres deshabilitar a {empleado.nombre} {empleado.apellidos}? 
                              El empleado será marcado como inactivo pero se mantendrán todos sus datos.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeshabilitarEmpleado(empleado.id)}>
                              Deshabilitar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    ) : (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-green-600">
                            <UserCheck className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Habilitar Empleado</AlertDialogTitle>
                            <AlertDialogDescription>
                              ¿Estás seguro de que quieres reactivar a {empleado.nombre} {empleado.apellidos}? 
                              El empleado volverá a estar activo y disponible para nuevas asignaciones.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleHabilitarEmpleado(empleado.id)}>
                              Habilitar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                    
                    {allowPermanentDelete && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Eliminar Empleado Permanentemente</AlertDialogTitle>
                            <AlertDialogDescription>
                              ¿Estás seguro de que quieres eliminar permanentemente a {empleado.nombre} {empleado.apellidos}? 
                              Esta acción no se puede deshacer y se perderán todos los datos del empleado.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleEliminarEmpleado(empleado.id)}>
                              Eliminar Permanentemente
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
