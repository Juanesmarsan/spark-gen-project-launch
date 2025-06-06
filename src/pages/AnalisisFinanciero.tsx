import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/MetricCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useProyectos } from "@/hooks/useProyectos";
import { useCalculosBeneficios } from "@/hooks/useCalculosBeneficios";
import { Euro, TrendingUp, Building, Percent, Calendar } from "lucide-react";
import { useState } from "react";

const AnalisisFinanciero = () => {
  const { proyectos } = useProyectos();
  const { calcularBeneficioNeto, calcularMargenProyecto, calcularAnalisisMensual } = useCalculosBeneficios();
  
  const [añoSeleccionado, setAñoSeleccionado] = useState(new Date().getFullYear());
  const [vistaActual, setVistaActual] = useState<'general' | 'mensual'>('general');

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

  // Datos mensuales
  const datosMensuales = calcularAnalisisMensual(proyectos, añoSeleccionado);
  const beneficioNetoAnual = datosMensuales.reduce((sum, mes) => sum + mes.beneficioNeto, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Análisis Financiero</h1>
        <div className="flex gap-2">
          <Button
            variant={vistaActual === 'general' ? 'default' : 'outline'}
            onClick={() => setVistaActual('general')}
          >
            Vista General
          </Button>
          <Button
            variant={vistaActual === 'mensual' ? 'default' : 'outline'}
            onClick={() => setVistaActual('mensual')}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Por Mes
          </Button>
        </div>
      </div>

      {vistaActual === 'general' && (
        <>
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
        </>
      )}

      {vistaActual === 'mensual' && (
        <>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold">Análisis Mensual {añoSeleccionado}</h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAñoSeleccionado(añoSeleccionado - 1)}
                >
                  {añoSeleccionado - 1}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAñoSeleccionado(añoSeleccionado + 1)}
                >
                  {añoSeleccionado + 1}
                </Button>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-600">
                {beneficioNetoAnual.toLocaleString()}€
              </p>
              <p className="text-sm text-gray-600">Beneficio Neto Anual</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Evolución Mensual</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mes</TableHead>
                    <TableHead className="text-right">Beneficio Bruto</TableHead>
                    <TableHead className="text-right">Gastos</TableHead>
                    <TableHead className="text-right">Beneficio Neto</TableHead>
                    <TableHead className="text-right">Margen</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {datosMensuales.map((mes) => (
                    <TableRow key={mes.mes}>
                      <TableCell className="font-medium capitalize">
                        {mes.nombreMes}
                      </TableCell>
                      <TableCell className="text-right">
                        {mes.beneficioBruto.toLocaleString()}€
                      </TableCell>
                      <TableCell className="text-right text-red-600">
                        -{mes.gastos.toLocaleString()}€
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        <span className={mes.beneficioNeto >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {mes.beneficioNeto.toLocaleString()}€
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge 
                          className={
                            mes.margen >= 20 ? "bg-green-100 text-green-800" :
                            mes.margen >= 10 ? "bg-yellow-100 text-yellow-800" :
                            "bg-red-100 text-red-800"
                          }
                        >
                          {mes.margen.toFixed(1)}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard
              title="Mejor Mes"
              value={`${Math.max(...datosMensuales.map(m => m.beneficioNeto)).toLocaleString()}€`}
              icon="🏆"
              color="green"
            />
            <MetricCard
              title="Promedio Mensual"
              value={`${(beneficioNetoAnual / 12).toLocaleString()}€`}
              icon="📊"
              color="blue"
            />
            <MetricCard
              title="Margen Promedio"
              value={`${(datosMensuales.reduce((sum, m) => sum + m.margen, 0) / 12).toFixed(1)}%`}
              icon="📈"
              color="purple"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default AnalisisFinanciero;
