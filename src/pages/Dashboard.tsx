
import { MetricCard } from "@/components/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard Principal</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Empleados"
          value="20"
          icon="👥"
          color="blue"
        />
        <MetricCard
          title="Proyectos Activos"
          value="5"
          icon="📋"
          color="green"
        />
        <MetricCard
          title="Gastos Fijos Mes"
          value="20.491€"
          icon="💰"
          color="red"
        />
        <MetricCard
          title="Beneficio Mes"
          value="15.342€"
          icon="📈"
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Horas Trabajadas por Proyecto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center text-muted-foreground py-8">
              Gráfico de horas por proyecto
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rentabilidad por Trabajador</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center text-muted-foreground py-8">
              Gráfico de rentabilidad
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
