
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Empleado } from "@/types/empleado";
import { AdelantoDialog } from "../AdelantoDialog";

interface DatosPersonalesTabProps {
  empleado: Empleado;
  onUpdateEmpleado: (empleado: Empleado) => void;
  onAgregarAdelanto: (concepto: string, cantidad: number) => void;
}

const departamentos = [
  { value: 'operario', label: 'Operario' },
  { value: 'tecnico', label: 'Técnico' },
  { value: 'administracion', label: 'Administración' },
  { value: 'gerencia', label: 'Gerencia' },
];

const categorias = [
  { value: 'peon', label: 'Peón' },
  { value: 'oficial_3', label: 'Oficial de 3ª' },
  { value: 'oficial_2', label: 'Oficial de 2ª' },
  { value: 'oficial_1', label: 'Oficial de 1ª' },
  { value: 'encargado', label: 'Encargado' },
  { value: 'tecnico', label: 'Técnico' },
  { value: 'gerencia', label: 'Gerencia' },
];

export const DatosPersonalesTab = ({ empleado, onUpdateEmpleado, onAgregarAdelanto }: DatosPersonalesTabProps) => {
  const updateField = (field: keyof Empleado, value: any) => {
    onUpdateEmpleado({ ...empleado, [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Información Laboral */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Información Laboral</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Departamento</Label>
              <Select 
                value={empleado.departamento || ''} 
                onValueChange={(value) => updateField('departamento', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar departamento" />
                </SelectTrigger>
                <SelectContent>
                  {departamentos.map(dept => (
                    <SelectItem key={dept.value} value={dept.value}>
                      {dept.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Categoría</Label>
              <Select 
                value={empleado.categoria || ''} 
                onValueChange={(value) => updateField('categoria', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Información Salarial */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Información Salarial</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Salario Bruto</Label>
              <Input 
                type="number" 
                value={empleado.salarioBruto}
                onChange={(e) => updateField('salarioBruto', parseFloat(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label>Precio Hora Extra (€)</Label>
              <Input 
                type="number" 
                step="0.01"
                value={empleado.precioHoraExtra || 0}
                onChange={(e) => updateField('precioHoraExtra', parseFloat(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label>Precio Hora Festiva (€)</Label>
              <Input 
                type="number" 
                step="0.01"
                value={empleado.precioHoraFestiva || 0}
                onChange={(e) => updateField('precioHoraFestiva', parseFloat(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label>Seguridad Social Trabajador</Label>
              <Input 
                type="number" 
                value={empleado.seguridadSocialTrabajador}
                onChange={(e) => updateField('seguridadSocialTrabajador', parseFloat(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label>Seguridad Social Empresa</Label>
              <Input 
                type="number" 
                value={empleado.seguridadSocialEmpresa}
                onChange={(e) => updateField('seguridadSocialEmpresa', parseFloat(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label>Retenciones</Label>
              <Input 
                type="number" 
                value={empleado.retenciones}
                onChange={(e) => updateField('retenciones', parseFloat(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label>Embargo</Label>
              <Input 
                type="number" 
                value={empleado.embargo}
                onChange={(e) => updateField('embargo', parseFloat(e.target.value))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Adelantos */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Adelantos</h3>
            <AdelantoDialog onAgregarAdelanto={onAgregarAdelanto} />
          </div>
          
          {empleado.adelantos.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Concepto</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {empleado.adelantos.map((adelanto) => (
                  <TableRow key={adelanto.id}>
                    <TableCell>{adelanto.concepto}</TableCell>
                    <TableCell>€{adelanto.cantidad}</TableCell>
                    <TableCell>{format(adelanto.fecha, "dd/MM/yyyy", { locale: es })}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
