
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Users, Clock, Edit, Trash2 } from "lucide-react";
import { Proyecto, Trabajador } from "@/types/proyecto";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface TrabajadoresTableProps {
  proyecto: Proyecto;
  mesSeleccionado: Date;
  calcularHorasTrabajador: (trabajador: Trabajador, mesSeleccionado: Date) => number;
  onEditarTrabajador: (trabajador: Trabajador) => void;
  onEliminarTrabajador: (trabajadorId: number) => void;
}

export const TrabajadoresTable = ({
  proyecto,
  mesSeleccionado,
  calcularHorasTrabajador,
  onEditarTrabajador,
  onEliminarTrabajador
}: TrabajadoresTableProps) => {
  if (proyecto.trabajadoresAsignados.length === 0) {
    return (
      <div className="text-center py-8">
        <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-500">No hay trabajadores asignados a este proyecto.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Trabajador</TableHead>
          <TableHead>Fecha Entrada</TableHead>
          <TableHead>Fecha Salida</TableHead>
          <TableHead>Horas en {format(mesSeleccionado, 'MMMM yyyy', { locale: es })}</TableHead>
          {proyecto.tipo === 'administracion' && <TableHead>Precio/Hora</TableHead>}
          {proyecto.tipo === 'administracion' && <TableHead>Total Mes</TableHead>}
          <TableHead>Estado</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {proyecto.trabajadoresAsignados.map((trabajador) => {
          const horasDelMes = calcularHorasTrabajador(trabajador, mesSeleccionado);
          const totalMes = proyecto.tipo === 'administracion' && trabajador.precioHora 
            ? horasDelMes * trabajador.precioHora 
            : null;

          return (
            <TableRow key={trabajador.id}>
              <TableCell className="font-medium">
                {trabajador.nombre} {trabajador.apellidos}
              </TableCell>
              <TableCell>
                {trabajador.fechaEntrada 
                  ? format(trabajador.fechaEntrada, 'dd/MM/yyyy') 
                  : 'No especificada'}
              </TableCell>
              <TableCell>
                {trabajador.fechaSalida 
                  ? format(trabajador.fechaSalida, 'dd/MM/yyyy') 
                  : 'Activo'}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {horasDelMes}h
                </div>
              </TableCell>
              {proyecto.tipo === 'administracion' && (
                <TableCell>
                  {trabajador.precioHora ? `${trabajador.precioHora}€` : 'No especificado'}
                </TableCell>
              )}
              {proyecto.tipo === 'administracion' && (
                <TableCell>
                  {totalMes ? `${totalMes.toFixed(2)}€` : '-'}
                </TableCell>
              )}
              <TableCell>
                <Badge variant={trabajador.fechaSalida ? "secondary" : "default"}>
                  {trabajador.fechaSalida ? "Finalizado" : "Activo"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onEditarTrabajador(trabajador)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar trabajador?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción eliminará a {trabajador.nombre} {trabajador.apellidos} del proyecto. 
                          Esta acción no se puede deshacer.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => onEliminarTrabajador(trabajador.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
