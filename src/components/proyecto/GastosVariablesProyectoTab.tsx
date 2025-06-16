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
import { Calendar as CalendarIcon, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Proyecto, GastoVariableProyecto } from "@/types/proyecto";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface GastosVariablesProyectoTabProps {
  proyecto: Proyecto;
  onAgregarGasto: (gasto: Omit<GastoVariableProyecto, 'id'>) => void;
  onEliminarGasto: (gastoId: number) => void;
}

export const GastosVariablesProyectoTab = ({ proyecto, onAgregarGasto, onEliminarGasto }: GastosVariablesProyectoTabProps) => {
  const [mostrarDialog, setMostrarDialog] = useState(false);
  const [formData, setFormData] = useState({
    concepto: '',
    categoria: 'material' as const,
    descripcion: '',
    importe: 0,
    fecha: new Date(),
    factura: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAgregarGasto(formData);
    setMostrarDialog(false);
    setFormData({
      concepto: '',
      categoria: 'material' as const,
      descripcion: '',
      importe: 0,
      fecha: new Date(),
      factura: ''
    });
  };

  const getCategoriaLabel = (categoria: string) => {
    const labels = {
      material: 'Material',
      transporte: 'Transporte',
      herramienta: 'Herramienta',
      otro: 'Otro'
    };
    return labels[categoria as keyof typeof labels] || categoria;
  };

  const totalGastos = proyecto.gastosVariables?.reduce((total, gasto) => total + gasto.importe, 0) || 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Gastos Variables del Proyecto</h3>
          <p className="text-sm text-muted-foreground">
            Gestiona materiales, transporte, herramientas y otros gastos del proyecto
          </p>
        </div>
        
        <Dialog open={mostrarDialog} onOpenChange={setMostrarDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Añadir Gasto
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nuevo Gasto Variable</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="concepto">Concepto</Label>
                <Input
                  id="concepto"
                  value={formData.concepto}
                  onChange={(e) => setFormData(prev => ({ ...prev, concepto: e.target.value }))}
                  placeholder="Descripción del concepto"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Categoría</Label>
                <Select 
                  value={formData.categoria} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, categoria: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="material">Material</SelectItem>
                    <SelectItem value="transporte">Transporte</SelectItem>
                    <SelectItem value="herramienta">Herramienta</SelectItem>
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
                  placeholder="Descripción adicional (opcional)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="importe">Importe (€)</Label>
                <Input
                  id="importe"
                  type="number"
                  step="0.01"
                  value={formData.importe}
                  onChange={(e) => setFormData(prev => ({ ...prev, importe: parseFloat(e.target.value) || 0 }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="factura">Número de Factura</Label>
                <Input
                  id="factura"
                  value={formData.factura}
                  onChange={(e) => setFormData(prev => ({ ...prev, factura: e.target.value }))}
                  placeholder="Número de factura (opcional)"
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
                  Guardar Gasto
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
          <p className="text-sm text-muted-foreground">Total de gastos variables del proyecto</p>
        </CardContent>
      </Card>

      {/* Tabla de gastos */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Concepto</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Factura</TableHead>
              <TableHead className="text-right">Importe</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {proyecto.gastosVariables?.length > 0 ? (
              proyecto.gastosVariables.map((gasto) => (
                <TableRow key={gasto.id}>
                  <TableCell className="font-medium">
                    {gasto.concepto}
                    {gasto.descripcion && (
                      <div className="text-sm text-muted-foreground">{gasto.descripcion}</div>
                    )}
                  </TableCell>
                  <TableCell>{getCategoriaLabel(gasto.categoria)}</TableCell>
                  <TableCell>{format(gasto.fecha, "dd/MM/yyyy", { locale: es })}</TableCell>
                  <TableCell>{gasto.factura || '-'}</TableCell>
                  <TableCell className="text-right">€{gasto.importe.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Eliminar gasto?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción no se puede deshacer. Se eliminará permanentemente el gasto "{gasto.concepto}".
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onEliminarGasto(gasto.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
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
