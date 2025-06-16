
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Empleado } from "@/types/empleado";

interface GastosVariablesSummaryProps {
  empleado: Empleado;
}

export const GastosVariablesSummary = ({ empleado }: GastosVariablesSummaryProps) => {
  const totalGastos = empleado.gastosVariables?.reduce((total, gasto) => total + gasto.importe, 0) || 0;

  return (
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
  );
};
