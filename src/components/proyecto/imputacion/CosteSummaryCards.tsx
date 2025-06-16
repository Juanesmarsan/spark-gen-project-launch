
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Euro, Calculator, Calendar } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface CosteSummaryCardsProps {
  totalCostesSalariales: number;
  totalGastosVariables: number;
  totalGeneral: number;
  mes: number;
  anio: number;
  cantidadRegistros: number;
}

export const CosteSummaryCards = ({
  totalCostesSalariales,
  totalGastosVariables,
  totalGeneral,
  mes,
  anio,
  cantidadRegistros
}: CosteSummaryCardsProps) => {
  const safeToFixed = (value: number | null | undefined, decimals: number = 2): string => {
    return (value ?? 0).toFixed(decimals);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Users className="w-4 h-4" />
            Costes Salariales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            €{safeToFixed(totalCostesSalariales)}
          </div>
          <p className="text-xs text-muted-foreground">
            Salarios + SS + Extras
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Euro className="w-4 h-4" />
            Gastos Variables
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">
            €{safeToFixed(totalGastosVariables)}
          </div>
          <p className="text-xs text-muted-foreground">
            Dietas, transporte, etc.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Calculator className="w-4 h-4" />
            Coste Total
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            €{safeToFixed(totalGeneral)}
          </div>
          <p className="text-xs text-muted-foreground">
            Total del mes
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Período
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm font-medium">
            {format(new Date(anio, mes - 1), 'MMMM yyyy', { locale: es })}
          </div>
          <p className="text-xs text-muted-foreground">
            {cantidadRegistros} registros
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
