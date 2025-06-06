
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/MetricCard";

const AnalisisFinanciero = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Análisis Financiero</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="ROI Mensual"
          value="23.5%"
          icon="📊"
          color="green"
        />
        <MetricCard
          title="Margen Bruto"
          value="42.8%"
          icon="💹"
          color="blue"
        />
        <MetricCard
          title="Flujo de Caja"
          value="8.750€"
          icon="💰"
          color="purple"
        />
        <MetricCard
          title="EBITDA"
          value="12.340€"
          icon="📈"
          color="green"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Evolución de Ingresos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center text-muted-foreground py-8">
              Gráfico de evolución de ingresos mensuales
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Análisis de Costos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center text-muted-foreground py-8">
              Desglose de costos por categoría
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rentabilidad por Proyecto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center text-muted-foreground py-8">
              Análisis de rentabilidad individual
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Proyecciones Financieras</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center text-muted-foreground py-8">
              Proyecciones a 6 meses
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalisisFinanciero;
