
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Plus } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Empleado, GastoVariableEmpleado } from "@/types/empleado";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface GastosVariablesTabProps {
  empleado: Empleado;
  onAgregarGasto: (gasto: Omit<GastoVariableEmpleado, 'id'>) => void;
}

export const GastosVariablesTab = ({ empleado, onAgregarGasto }: GastosVariablesTabProps) => {
  const [mostrarDialog, setMostrarDialog] = useState(false);
  const [formData, setFormData] = useState({
    concepto: 'dieta' as const,
    descripcion: '',
    importe: 0,
    fecha: new Date()
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAgregarGasto(formData);
    setMostrarDialog(false);
    setFormData({
      concepto: 'dieta' as const,
      descripcion: '',
      importe: 0,
      fecha: new Date()
    });
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
                <Label>Concepto</Label>
                <Select 
                  value={formData.concepto} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, concepto: value as any }))}
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
          <p className="text-sm text-muted-foreground">Total de gastos variables</p>
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
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
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
