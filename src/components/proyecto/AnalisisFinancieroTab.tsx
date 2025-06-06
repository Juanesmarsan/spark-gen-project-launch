
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Euro, TrendingUp, Calculator, Percent } from "lucide-react";
import { Proyecto } from "@/types/proyecto";
import { useCalculosBeneficios } from "@/hooks/useCalculosBeneficios";

interface AnalisisFinancieroTabProps {
  proyecto: Proyecto;
}

export const AnalisisFinancieroTab = ({ proyecto }: AnalisisFinancieroTabProps) => {
  const {
    calcularBeneficioBrutoAdministracion,
    calcularBeneficioBrutoPresupuesto,
    calcularGastosTotales,
    calcularBeneficioNeto,
    calcularMargenProyecto
  } = useCalculosBeneficios();

  const beneficioBruto = proyecto.tipo === 'administracion' 
    ? calcularBeneficioBrutoAdministracion(proyecto)
    : calcularBeneficioBrutoPresupuesto(proyecto);
  
  const gastosTotales = calcularGastosTotales(proyecto);
  const beneficioNeto = calcularBeneficioNeto(proyecto);
  const margen = calcularMargenProyecto(proyecto);

  const getMargenColor = (margen: number) => {
    if (margen >= 20) return "bg-green-100 text-green-800";
    if (margen >= 10) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Análisis Financiero del Proyecto</h3>
        <p className="text-sm text-gray-600">
          {proyecto.tipo === 'administracion' 
            ? "Basado en horas trabajadas × precio por hora (excluye vacaciones y bajas)"
            : "Basado en certificaciones mensuales registradas"
          }
        </p>
      </div>

      {/* Métricas principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Euro className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">
                  {proyecto.tipo === 'administracion' ? 'Beneficio Bruto' : 'Certificado'}
                </p>
                <p className="text-lg font-semibold">{beneficioBruto.toLocaleString()}€</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Gastos Variables</p>
                <p className="text-lg font-semibold">{gastosTotales.toLocaleString()}€</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Beneficio Neto</p>
                <p className="text-lg font-semibold">{beneficioNeto.toLocaleString()}€</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Percent className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Margen</p>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-semibold">{margen.toFixed(1)}%</p>
                  <Badge className={getMargenColor(margen)}>
                    {margen >= 20 ? 'Excelente' : margen >= 10 ? 'Bueno' : 'Bajo'}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detalles adicionales */}
      <div className="grid gap-4 md:grid-cols-2">
        {proyecto.tipo === 'administracion' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Detalles de Administración</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Precio por hora:</span>
                <span className="font-medium">{proyecto.precioHora}€/h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Trabajadores asignados:</span>
                <span className="font-medium">{proyecto.trabajadoresAsignados.length}</span>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                * Las horas de vacaciones y bajas no se incluyen en el cálculo
              </div>
            </CardContent>
          </Card>
        )}

        {proyecto.tipo === 'presupuesto' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Detalles de Presupuesto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Presupuesto total:</span>
                <span className="font-medium">{proyecto.presupuestoTotal?.toLocaleString()}€</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Certificaciones:</span>
                <span className="font-medium">{proyecto.certificaciones?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">% Ejecutado:</span>
                <span className="font-medium">
                  {proyecto.presupuestoTotal ? 
                    ((beneficioBruto / proyecto.presupuestoTotal) * 100).toFixed(1) : '0'
                  }%
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Resumen de Gastos</CardTitle>
          </CardHeader>
          <CardContent>
            {proyecto.gastosVariables && proyecto.gastosVariables.length > 0 ? (
              <div className="space-y-1">
                {['material', 'transporte', 'herramienta', 'otro'].map(categoria => {
                  const gastoCategoria = proyecto.gastosVariables
                    ?.filter(g => g.categoria === categoria)
                    .reduce((sum, g) => sum + g.importe, 0) || 0;
                  
                  if (gastoCategoria === 0) return null;
                  
                  return (
                    <div key={categoria} className="flex justify-between text-sm">
                      <span className="text-gray-600 capitalize">{categoria}:</span>
                      <span className="font-medium">{gastoCategoria.toLocaleString()}€</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No hay gastos registrados</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
