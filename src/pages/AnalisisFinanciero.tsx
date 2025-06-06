
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/MetricCard";
import { Badge } from "@/components/ui/badge";
import { useProyectos } from "@/hooks/useProyectos";
import { useCalculosBeneficios } from "@/hooks/useCalculosBeneficios";
import { Euro, TrendingUp, Building, Percent } from "lucide-react";

const AnalisisFinanciero = () => {
  const { proyectos } = useProyectos();
  const { calcularBeneficioNeto, calcularMargenProyecto } = useCalculosBeneficios();

  // Calcular métricas globales
  const proyectosActivos = proyectos.filter(p => p.estado === 'activo');
  const totalBeneficioNeto = proyectos.reduce((total, proyecto) => 
    total + calcularBeneficioNeto(proyecto), 0
  );
  
  const margenPromedio = proyectos.length > 0 
    ? proyectos.reduce((total, proyecto) => 
        total + calcularMargenProyecto(proyecto), 0
      ) / proyectos.length 
    : 0;

  const proyectosPorPresupuesto = proyectos.filter(p => p.tipo === 'presupuesto');
  const proyectosPorAdministracion = proyectos.filter(p => p.tipo === 'administracion');

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Análisis Financiero</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Beneficio Neto Total"
          value={`${totalBeneficioNeto.toLocaleString()}€`}
          icon="💰"
          color="green"
        />
        <MetricCard
          title="Margen Promedio"
          value={`${margenPromedio.toFixed(1)}%`}
          icon="📊"
          color="blue"
        />
        <MetricCard
          title="Proyectos Activos"
          value={proyectosActivos.length.toString()}
          icon="🏗️"
          color="purple"
        />
        <MetricCard
          title="Total Proyectos"
          value={proyectos.length.toString()}
          icon="📈"
          color="green"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Proyectos por Tipo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Por Presupuesto:</span>
              <Badge variant="outline">{proyectosPorPresupuesto.length} proyectos</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Por Administración:</span>
              <Badge variant="outline">{proyectosPorAdministracion.length} proyectos</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rentabilidad por Proyecto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {proyectos.map((proyecto) => {
                const beneficio = calcularBeneficioNeto(proyecto);
                const margen = calcularMargenProyecto(proyecto);
                
                return (
                  <div key={proyecto.id} className="flex justify-between items-center p-2 border rounded">
                    <div>
                      <p className="font-medium text-sm">{proyecto.nombre}</p>
                      <p className="text-xs text-gray-500">{proyecto.ciudad}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">{beneficio.toLocaleString()}€</p>
                      <Badge 
                        className={
                          margen >= 20 ? "bg-green-100 text-green-800" :
                          margen >= 10 ? "bg-yellow-100 text-yellow-800" :
                          "bg-red-100 text-red-800"
                        }
                      >
                        {margen.toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                );
              })}
              {proyectos.length === 0 && (
                <p className="text-center text-gray-500 py-4">No hay proyectos para analizar</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribución por Estado</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {['activo', 'completado', 'pausado'].map(estado => {
              const count = proyectos.filter(p => p.estado === estado).length;
              const beneficio = proyectos
                .filter(p => p.estado === estado)
                .reduce((total, p) => total + calcularBeneficioNeto(p), 0);
              
              return (
                <div key={estado} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 capitalize">{estado}:</span>
                  <div className="text-right">
                    <Badge variant="outline">{count} proyectos</Badge>
                    <p className="text-xs text-gray-500">{beneficio.toLocaleString()}€</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumen Ejecutivo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {totalBeneficioNeto.toLocaleString()}€
              </p>
              <p className="text-sm text-gray-600">Beneficio Total</p>
            </div>
            <div className="border-t pt-3">
              <p className="text-sm text-gray-600 text-center">
                Margen promedio del <strong>{margenPromedio.toFixed(1)}%</strong> 
                en {proyectos.length} proyectos
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalisisFinanciero;
