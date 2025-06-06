import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Edit, Plus, CalendarIcon, Save, X } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Empleado } from "@/types/empleado";

interface DatosPersonalesTabProps {
  empleado: Empleado;
  onUpdateEmpleado: (empleado: Empleado) => void;
  onAgregarAdelanto: (concepto: string, cantidad: number) => void;
}

export const DatosPersonalesTab = ({ empleado, onUpdateEmpleado, onAgregarAdelanto }: DatosPersonalesTabProps) => {
  const [editando, setEditando] = useState(false);
  const [datosEditados, setDatosEditados] = useState(empleado);
  const [showAdelantoDialog, setShowAdelantoDialog] = useState(false);
  const [adelantoData, setAdelantoData] = useState({ concepto: "", cantidad: 0 });

  const handleGuardar = () => {
    console.log('DatosPersonalesTab: Guardando cambios del empleado');
    onUpdateEmpleado(datosEditados);
    setEditando(false);
  };

  const handleCancelar = () => {
    setDatosEditados(empleado);
    setEditando(false);
  };

  const handleAgregarAdelantoSubmit = () => {
    onAgregarAdelanto(adelantoData.concepto, adelantoData.cantidad);
    setAdelantoData({ concepto: "", cantidad: 0 });
    setShowAdelantoDialog(false);
  };

  const salarioNeto = empleado.salarioBruto - empleado.seguridadSocialTrabajador - empleado.retenciones - empleado.embargo;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Datos Personales</CardTitle>
            {!editando ? (
              <Button variant="outline" onClick={() => setEditando(true)}>
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleCancelar}>
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
                <Button onClick={handleGuardar}>
                  <Save className="w-4 h-4 mr-2" />
                  Guardar
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {editando ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Nombre</Label>
                <Input
                  value={datosEditados.nombre}
                  onChange={(e) => setDatosEditados({...datosEditados, nombre: e.target.value})}
                />
              </div>
              <div>
                <Label>Apellidos</Label>
                <Input
                  value={datosEditados.apellidos}
                  onChange={(e) => setDatosEditados({...datosEditados, apellidos: e.target.value})}
                />
              </div>
              <div>
                <Label>Teléfono</Label>
                <Input
                  value={datosEditados.telefono}
                  onChange={(e) => setDatosEditados({...datosEditados, telefono: e.target.value})}
                />
              </div>
              <div>
                <Label>Fecha de Ingreso</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !datosEditados.fechaIngreso && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {datosEditados.fechaIngreso ? format(datosEditados.fechaIngreso, "dd/MM/yyyy", { locale: es }) : "Seleccionar fecha"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={datosEditados.fechaIngreso}
                      onSelect={(date) => setDatosEditados({...datosEditados, fechaIngreso: date || new Date()})}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label>Departamento</Label>
                <Select 
                  value={datosEditados.departamento} 
                  onValueChange={(value: any) => setDatosEditados({...datosEditados, departamento: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="operario">Operario</SelectItem>
                    <SelectItem value="tecnico">Técnico</SelectItem>
                    <SelectItem value="administracion">Administración</SelectItem>
                    <SelectItem value="gerencia">Gerencia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Categoría</Label>
                <Select 
                  value={datosEditados.categoria} 
                  onValueChange={(value: any) => setDatosEditados({...datosEditados, categoria: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="peon">Peón</SelectItem>
                    <SelectItem value="oficial_3">Oficial 3ª</SelectItem>
                    <SelectItem value="oficial_2">Oficial 2ª</SelectItem>
                    <SelectItem value="oficial_1">Oficial 1ª</SelectItem>
                    <SelectItem value="encargado">Encargado</SelectItem>
                    <SelectItem value="tecnico">Técnico</SelectItem>
                    <SelectItem value="gerencia">Gerencia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Nombre</Label>
                <p className="font-medium">{empleado.nombre}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Apellidos</Label>
                <p className="font-medium">{empleado.apellidos}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Teléfono</Label>
                <p className="font-medium">{empleado.telefono}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Fecha de Ingreso</Label>
                <p className="font-medium">{format(empleado.fechaIngreso, "dd/MM/yyyy", { locale: es })}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Departamento</Label>
                <p className="font-medium capitalize">{empleado.departamento}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Categoría</Label>
                <p className="font-medium">{empleado.categoria.replace('_', ' ')}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Salario</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-muted-foreground">Salario Bruto</Label>
              <p className="font-medium">{empleado.salarioBruto} €</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Salario Neto Aprox.</Label>
              <p className="font-medium">{salarioNeto.toFixed(2)} €</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Seguridad Social (Trabajador)</Label>
              <p className="font-medium">{empleado.seguridadSocialTrabajador} €</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Seguridad Social (Empresa)</Label>
              <p className="font-medium">{empleado.seguridadSocialEmpresa} €</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Retenciones</Label>
              <p className="font-medium">{empleado.retenciones} €</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Embargo</Label>
              <p className="font-medium">{empleado.embargo} €</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Adelantos</CardTitle>
            <Dialog open={showAdelantoDialog} onOpenChange={setShowAdelantoDialog}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Añadir Adelanto
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Añadir Adelanto</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="concepto" className="text-right">
                      Concepto
                    </Label>
                    <Input
                      id="concepto"
                      value={adelantoData.concepto}
                      onChange={(e) => setAdelantoData({ ...adelantoData, concepto: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="cantidad" className="text-right">
                      Cantidad
                    </Label>
                    <Input
                      type="number"
                      id="cantidad"
                      value={adelantoData.cantidad}
                      onChange={(e) => setAdelantoData({ ...adelantoData, cantidad: parseFloat(e.target.value) })}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="ghost" onClick={() => setShowAdelantoDialog(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" onClick={handleAgregarAdelantoSubmit}>
                    Añadir
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Concepto</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead>Fecha</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {empleado.adelantos.map((adelanto) => (
                <TableRow key={adelanto.id}>
                  <TableCell>{adelanto.concepto}</TableCell>
                  <TableCell>{adelanto.cantidad} €</TableCell>
                  <TableCell>{format(adelanto.fecha, "dd/MM/yyyy", { locale: es })}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
