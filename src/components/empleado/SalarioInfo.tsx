
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Empleado } from "@/types/empleado";

interface SalarioInfoProps {
  empleado: Empleado;
}

export const SalarioInfo = ({ empleado }: SalarioInfoProps) => {
  const salarioNeto = empleado.salarioBruto - empleado.seguridadSocialTrabajador - empleado.retenciones - empleado.embargo;

  return (
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
  );
};
