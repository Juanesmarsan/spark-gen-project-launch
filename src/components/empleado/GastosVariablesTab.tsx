
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Calendar as CalendarIcon, Plus, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Empleado, GastoVariableEmpleado } from "@/types/empleado";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface GastosVariablesTabProps {
  empleado: Empleado;
  onAgregarGasto: (gasto: Omit<GastoVariableEmpleado, 'id'>) => void;
  onEditarGasto?: (gastoId: number, gastoActualizado: Omit<GastoVariableEmpleado, 'id'>) => void;
  onEliminarGasto?: (gastoId: number) => void;
}

export const GastosVariablesTab = ({ empleado, onAgregarGasto, onEditarGasto, onEliminarGasto }: GastosVariablesTabProps) => {
  const [mostrarDialog, setMostrarDialog] = useState(false);
  const [gastoEditando, setGastoEditando] = useState<GastoVariableEmpleado | null>(null);
  const [formData, setFormData] = useState<{
    concepto: 'dieta' | 'alojamiento' | 'transporte' | 'otro';
    descripcion: string;
    importe: number;
    fecha: Date;
  }>({
    concepto: 'dieta',
    descripcion: '',
    importe: 0,
    fecha: new Date()
  });

  const resetForm = () => {
    setFormData({
      concepto: 'dieta',
      descripcion: '',
      importe: 0,
      fecha: new Date()
    });
    setGastoEditando(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('GastosVariablesTab: Procesando gasto:', formData);
    
    // Validar que el importe sea mayor que 0
    if (formData.importe <= 0) {
      alert('El importe debe ser mayor que 0');
      return;
    }

    // Validar que el concepto no esté vacío
    if (!formData.concepto) {
      alert('Debe seleccionar un concepto');
      return;
    }

    if (gastoEditando && onEditarGasto) {
      console.log('GastosVariablesTab: Editando gasto existente');
      onEditarGasto(gastoEditando.id, formData);
    } else {
      console.log('GastosVariablesTab: Agregando nuevo gasto');
      onAgregarGasto(formData);
    }
    
    setMostrarDialog(false);
    resetForm();
  };

  const handleEditar = (gasto: GastoVariableEmpleado) => {
    console.log('GastosVariablesTab: Preparando edición de gasto:', gasto);
    setGastoEditando(gasto);
    setFormData({
      concepto: gasto.concepto,
      descripcion: gasto.descripcion || '',
      importe: gasto.importe,
      fecha: gasto.fecha
    });
    setMostrarDialog(true);
  };

  const handleEliminar = (gastoId: number) => {
    console.log('GastosVariablesTab: Eliminando gasto:', gastoId);
    if (onEliminarGasto) {
      onEliminarGasto(gastoId);
    }
  };

  const getConceptoLabel = (concepto: string) => {
    const labels = {
      dieta: 'Dieta',
      alojamiento: 'Alojamiento',
      transporte: 'Transporte',
      otro: 'Otro'
    };
    return labels[concepto as keyof typeof labels] || concepto;
  };

  const totalGastos = empleado.gastosVariables?.reduce((total, gasto) => total + gasto.importe, 0) || 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Gastos Variables</h3>
          <p className="text-sm text-muted-foreground">
            Gestiona dietas, alojamiento, transporte y otros gastos del empleado
          </p>
        </div>
        
        <Dialog open={mostrarDialog} onOpenChange={(open) => {
          setMostrarDialog(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Añadir Gasto
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {gastoEditando ? 'Editar Gasto Variable' : 'Nuevo Gasto Variable'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Concepto</Label>
                <Select 
                  value={formData.concepto} 
                  onValueChange={(value) => setFormData(prev => ({ 
                    ...prev, 
                    concepto: value as 'dieta' | 'alojamiento' | 'transporte' | 'otro'
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dieta">Dieta</SelectItem>
                    <SelectItem value="alojamiento">Alojamiento</SelectItem>
                    <SelectItem value="transporte">Transporte</SelectItem>
                    <SelectItem value="otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Input
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
                  placeholder="Descripción del gasto (opcional)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="importe">Importe (€)</Label>
                <Input
                  id="importe"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.importe}
                  onChange={(e) => setFormData(prev => ({ ...prev, importe: parseFloat(e.target.value) || 0 }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Fecha</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(formData.fecha, "dd/MM/yyyy", { locale: es })}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.fecha}
                      onSelect={(date) => date && setFormData(prev => ({ ...prev, fecha: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setMostrarDialog(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {gastoEditando ? 'Actualizar Gasto' : 'Guardar Gasto'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Resumen */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Resumen de Gastos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">€{totalGastos.toFixed(2)}</div>
          <p className="text-sm text-muted-foreground">
            Total de gastos variables ({empleado.gastosVariables?.length || 0} gastos)
          </p>
        </CardContent>
      </Card>

      {/* Tabla de gastos */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Concepto</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className="text-right">Importe</TableHead>
              <TableHead className="text-center">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {empleado.gastosVariables?.length > 0 ? (
              empleado.gastosVariables.map((gasto) => (
                <TableRow key={gasto.id}>
                  <TableCell className="font-medium">
                    {getConceptoLabel(gasto.concepto)}
                  </TableCell>
                  <TableCell>{gasto.descripcion || '-'}</TableCell>
                  <TableCell>{format(gasto.fecha, "dd/MM/yyyy", { locale: es })}</TableCell>
                  <TableCell className="text-right">€{gasto.importe.toFixed(2)}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center space-x-2">
                      {onEditarGasto && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditar(gasto)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      {onEliminarGasto && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Eliminar gasto?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción no se puede deshacer. Se eliminará permanentemente el gasto de {getConceptoLabel(gasto.concepto)} por €{gasto.importe.toFixed(2)}.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleEliminar(gasto.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  No hay gastos variables registrados
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
