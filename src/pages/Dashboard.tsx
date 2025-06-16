
import { MetricCard } from "@/components/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HorasProyecto } from "@/components/dashboard/HorasProyecto";
import { RentabilidadTrabajadores } from "@/components/dashboard/RentabilidadTrabajadores";
import { useDashboardMetrics } from "@/hooks/useDashboardMetrics";
import { useEmpleados } from "@/hooks/useEmpleados";
import { useProyectos } from "@/hooks/useProyectos";

const Dashboard = () => {
  const { empleados } = useEmpleados();
  const { proyectos } = useProyectos();
  const { horasPorProyecto, rentabilidadTrabajadores } = useDashboardMetrics();

  // Calcular métricas resumidas
  const totalEmpleados = empleados.filter(emp => emp.activo).length;
  const proyectosActivos = proyectos.filter(p => p.estado === 'activo').length;
  
  const gastosFijosMes = rentabilidadTrabajadores.reduce((sum, t) => sum + t.costoTotalEmpleado, 0);
  const ingresosTotales = horasPorProyecto.reduce((sum, p) => sum + p.ingresos, 0);
  const gastosTotales = horasPorProyecto.reduce((sum, p) => sum + p.gastos, 0) + gastosFijosMes;
  const beneficioMes = ingresosTotales - gastosTotales;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard Principal</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Empleados"
          value={totalEmpleados.toString()}
          icon="👥"
          color="blue"
        />
        <MetricCard
          title="Proyectos Activos"
          value={proyectosActivos.toString()}
          icon="📋"
          color="green"
        />
        <MetricCard
          title="Gastos Fijos Mes"
          value={`€${gastosFijosMes.toFixed(0)}`}
          icon="💰"
          color="red"
        />
        <MetricCard
          title="Beneficio Mes"
          value={`€${beneficioMes.toFixed(0)}`}
          icon="📈"
          color={beneficioMes >= 0 ? "green" : "red"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HorasProyecto datos={horasPorProyecto} />
        
        <Card>
          <CardHeader>
            <CardTitle>Resumen Financiero</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Ingresos Totales:</span>
                <span className="font-semibold text-green-600">€{ingresosTotales.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Gastos Proyectos:</span>
                <span className="text-red-600">€{(gastosTotales - gastosFijosMes).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Gastos Personal:</span>
                <span className="text-red-600">€{gastosFijosMes.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-semibold">Beneficio Neto:</span>
                <span className={`font-bold ${beneficioMes >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  €{beneficioMes.toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <RentabilidadTrabajadores trabajadores={rentabilidadTrabajadores} />
      </div>
    </div>
  );
};

export default Dashboard;
