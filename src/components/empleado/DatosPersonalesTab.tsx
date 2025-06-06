
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

export const DatosPersonalesTab = ({ empleado, onUpdateEmpleado, onAgregarAdelanto }: DatosPersonalesTabProps) => {
  const updateField = (field: keyof Empleado, value: any) => {
    onUpdateEmpleado({ ...empleado, [field]: value });
  };

  return (
    <div className="space-y-4">
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

      <div className="space-y-4">
        <div className="flex justify-between items-center">
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
      </div>
    </div>
  );
};
