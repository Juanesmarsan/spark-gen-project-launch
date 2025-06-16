
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Euro, Calculator, Calendar, Building, UserCheck } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface CosteSummaryCardsProps {
  totalCostesSalariales: number;
  totalGastosVariables: number;
  totalGeneral: number;
  mes: number;
  anio: number;
  cantidadRegistros: number;
  gastosVariablesProyecto?: number;
  gastosVariablesEmpleados?: number;
}

export const CosteSummaryCards = ({
  totalCostesSalariales,
  totalGastosVariables,
  totalGeneral,
  mes,
  anio,
  cantidadRegistros,
  gastosVariablesProyecto = 0,
  gastosVariablesEmpleados = 0
}: CosteSummaryCardsProps) => {
  const safeToFixed = (value: number | null | undefined, decimals: number = 2): string => {
    return (value ?? 0).toFixed(decimals);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Users className="w-4 h-4" />
            Costes Salariales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold text-blue-600">
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
            <UserCheck className="w-4 h-4" />
            Gastos Empleados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold text-green-600">
            €{safeToFixed(gastosVariablesEmpleados)}
          </div>
          <p className="text-xs text-muted-foreground">
            Gastos individuales
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Building className="w-4 h-4" />
            Gastos Proyecto
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold text-purple-600">
            €{safeToFixed(gastosVariablesProyecto)}
          </div>
          <p className="text-xs text-muted-foreground">
            Gastos del proyecto
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Euro className="w-4 h-4" />
            Total Gastos Variables
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold text-orange-600">
            €{safeToFixed(totalGastosVariables)}
          </div>
          <p className="text-xs text-muted-foreground">
            Empleados + Proyecto
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
          <div className="text-xl font-bold text-red-600">
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
