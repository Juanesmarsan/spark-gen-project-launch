
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { Empleado, HistorialSalario } from "@/types/empleado";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface HistorialSalariosTabProps {
  empleado: Empleado;
  onAgregarCambioSalario: (empleadoId: number, nuevosSalarios: Omit<HistorialSalario, 'id' | 'fechaCambio'>) => void;
}

export const HistorialSalariosTab = ({ empleado, onAgregarCambioSalario }: HistorialSalariosTabProps) => {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [formData, setFormData] = useState({
    mes: new Date().getMonth() + 1,
    anio: new Date().getFullYear(),
    salarioBruto: empleado.salarioBruto,
    seguridadSocialTrabajador: empleado.seguridadSocialTrabajador,
    seguridadSocialEmpresa: empleado.seguridadSocialEmpresa,
    retenciones: empleado.retenciones,
    embargo: empleado.embargo
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAgregarCambioSalario(empleado.id, formData);
    setMostrarFormulario(false);
  };

  const historialOrdenado = [...(empleado.historialSalarios || [])].sort((a, b) => {
    if (a.anio !== b.anio) return b.anio - a.anio;
    return b.mes - a.mes;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Historial de Salarios</h3>
          <p className="text-sm text-muted-foreground">
            Registro de cambios salariales mensuales
          </p>
        </div>
        <Dialog open={mostrarFormulario} onOpenChange={setMostrarFormulario}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Registrar Cambio
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Registrar Cambio de Salario</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Mes</Label>
                  <Select
                    value={formData.mes.toString()}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, mes: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => (
                        <SelectItem key={i + 1} value={(i + 1).toString()}>
                          {new Date(2024, i).toLocaleDateString('es-ES', { month: 'long' })}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Año</Label>
                  <Input
                    type="number"
                    value={formData.anio}
                    onChange={(e) => setFormData(prev => ({ ...prev, anio: parseInt(e.target.value) }))}
                    min="2020"
                    max="2030"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Salario Bruto (€)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.salarioBruto}
                    onChange={(e) => setFormData(prev => ({ ...prev, salarioBruto: parseFloat(e.target.value) }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Seguridad Social Trabajador (€)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.seguridadSocialTrabajador}
                    onChange={(e) => setFormData(prev => ({ ...prev, seguridadSocialTrabajador: parseFloat(e.target.value) }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Seguridad Social Empresa (€)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.seguridadSocialEmpresa}
                    onChange={(e) => setFormData(prev => ({ ...prev, seguridadSocialEmpresa: parseFloat(e.target.value) }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Retenciones (€)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.retenciones}
                    onChange={(e) => setFormData(prev => ({ ...prev, retenciones: parseFloat(e.target.value) }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Embargo (€)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.embargo}
                  onChange={(e) => setFormData(prev => ({ ...prev, embargo: parseFloat(e.target.value) }))}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setMostrarFormulario(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  Registrar Cambio
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historial de Cambios</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Período</TableHead>
                <TableHead>Salario Bruto</TableHead>
                <TableHead>SS Trabajador</TableHead>
                <TableHead>SS Empresa</TableHead>
                <TableHead>Retenciones</TableHead>
                <TableHead>Embargo</TableHead>
                <TableHead>Fecha Cambio</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {historialOrdenado.map((registro) => (
                <TableRow key={registro.id}>
                  <TableCell>
                    {new Date(2024, registro.mes - 1).toLocaleDateString('es-ES', { month: 'long' })} {registro.anio}
                  </TableCell>
                  <TableCell>€{registro.salarioBruto.toFixed(2)}</TableCell>
                  <TableCell>€{registro.seguridadSocialTrabajador.toFixed(2)}</TableCell>
                  <TableCell>€{registro.seguridadSocialEmpresa.toFixed(2)}</TableCell>
                  <TableCell>€{registro.retenciones.toFixed(2)}</TableCell>
                  <TableCell>€{registro.embargo.toFixed(2)}</TableCell>
                  <TableCell>
                    {format(new Date(registro.fechaCambio), "dd/MM/yyyy", { locale: es })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
