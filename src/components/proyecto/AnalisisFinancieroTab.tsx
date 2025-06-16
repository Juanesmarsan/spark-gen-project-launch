
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, TrendingDown, DollarSign, Percent, Calculator, Clock } from "lucide-react";
import { Proyecto } from "@/types/proyecto";
import { useCalculosBeneficios } from "@/hooks/useCalculosBeneficios";
import { TimelinePresupuesto } from "./TimelinePresupuesto";

interface AnalisisFinancieroTabProps {
  proyecto: Proyecto;
  onUpdateProyecto: (proyecto: Proyecto) => void;
}

export const AnalisisFinancieroTab: React.FC<AnalisisFinancieroTabProps> = ({ 
  proyecto,
  onUpdateProyecto 
}) => {
  const { 
    calcularBeneficioBrutoAdministracion,
    calcularBeneficioBrutoPresupuesto,
    calcularGastosTotales,
    calcularBeneficioNeto,
    calcularMargenProyecto,
    calcularBeneficioMensualAdministracion,
    calcularBeneficioMensualPresupuesto,
    calcularGastosMensuales
  } = useCalculosBeneficios();

  const beneficioBruto = proyecto.tipo === 'administracion' 
    ? calcularBeneficioBrutoAdministracion(proyecto)
    : calcularBeneficioBrutoPresupuesto(proyecto);

  const gastosTotales = calcularGastosTotales(proyecto);
  const beneficioNeto = calcularBeneficioNeto(proyecto);
  const margenProyecto = calcularMargenProyecto(proyecto);

  // Calcular análisis mensual para el proyecto individual
  const calcularAnalisisMensualProyecto = (año: number = new Date().getFullYear()) => {
    const meses = Array.from({ length: 12 }, (_, i) => i + 1);
    
    return meses.map(mes => {
      const beneficioBrutoMes = proyecto.tipo === 'administracion' 
        ? calcularBeneficioMensualAdministracion(proyecto, mes, año)
        : calcularBeneficioMensualPresupuesto(proyecto, mes, año);
      
      const gastosMes = calcularGastosMensuales(proyecto, mes, año);
      const beneficioNeto = beneficioBrutoMes - gastosMes;

      return {
        mes,
        nombreMes: new Date(año, mes - 1).toLocaleDateString('es-ES', { month: 'long' }),
        beneficioBruto: beneficioBrutoMes,
        gastos: gastosMes,
        beneficioNeto,
        margen: beneficioBrutoMes > 0 ? (beneficioNeto / beneficioBrutoMes) * 100 : 0
      };
    });
  };

  const analisisMensual = calcularAnalisisMensualProyecto();

  return (
    <div className="space-y-6">
      {/* Timeline específico para proyectos de presupuesto */}
      {proyecto.tipo === 'presupuesto' && (
        <TimelinePresupuesto proyecto={proyecto} onUpdateProyecto={onUpdateProyecto} />
      )}

      {/* Métricas principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Beneficio Bruto</p>
                <p className="text-lg font-bold text-green-600">
                  €{beneficioBruto.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-blue-600" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Gastos Totales</p>
                <p className="text-lg font-bold text-blue-600">
                  €{gastosTotales.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              {beneficioNeto >= 0 ? (
                <TrendingUp className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Beneficio Neto</p>
                <p className={`text-lg font-bold ${beneficioNeto >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  €{beneficioNeto.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Percent className="w-4 h-4 text-purple-600" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Margen</p>
                <p className="text-lg font-bold text-purple-600">
                  {margenProyecto.toFixed(1)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detalles específicos por tipo de proyecto */}
      {proyecto.tipo === 'presupuesto' ? (
        <Card>
          <CardHeader>
            <CardTitle>Análisis de Certificaciones</CardTitle>
          </CardHeader>
          <CardContent>
            {proyecto.certificaciones && proyecto.certificaciones.length > 0 ? (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Total Certificado</p>
                    <p className="text-2xl font-bold text-blue-600">
                      €{proyecto.certificaciones.reduce((sum, cert) => sum + cert.importe, 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Presupuesto Total</p>
                    <p className="text-2xl font-bold text-green-600">
                      €{proyecto.presupuestoTotal?.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-muted-foreground">% Ejecutado</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {proyecto.presupuestoTotal 
                        ? ((proyecto.certificaciones.reduce((sum, cert) => sum + cert.importe, 0) / proyecto.presupuestoTotal) * 100).toFixed(1) 
                        : 0}%
                    </p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-3">Certificaciones por Mes</h4>
                  <div className="space-y-2">
                    {proyecto.certificaciones
                      .sort((a, b) => new Date(a.anio, a.mes - 1).getTime() - new Date(b.anio, b.mes - 1).getTime())
                      .map((cert) => (
                        <div key={cert.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                          <div>
                            <span className="font-medium">
                              {new Date(cert.anio, cert.mes - 1).toLocaleDateString('es-ES', { 
                                month: 'long', 
                                year: 'numeric' 
                              })}
                            </span>
                            {cert.descripcion && (
                              <p className="text-sm text-muted-foreground">{cert.descripcion}</p>
                            )}
                          </div>
                          <Badge variant="outline" className="font-mono">
                            €{cert.importe.toLocaleString()}
                          </Badge>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No hay certificaciones registradas aún.</p>
                <p className="text-sm text-muted-foreground">
                  Agrega certificaciones en la pestaña correspondiente para ver el análisis.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Análisis por Administración</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Precio por Hora</p>
                  <p className="text-2xl font-bold text-orange-600">
                    €{proyecto.precioHora}/h
                  </p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Trabajadores Asignados</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {proyecto.trabajadoresAsignados.length}
                  </p>
                </div>
              </div>

              {proyecto.certificacionReal && (
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Certificación Real</p>
                  <p className="text-2xl font-bold text-green-600">
                    €{proyecto.certificacionReal.toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Análisis mensual si está disponible */}
      {analisisMensual.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Evolución Mensual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analisisMensual.map((mes, index) => (
                <div key={index} className="flex justify-between items-center p-3 border rounded">
                  <span className="font-medium">{mes.nombreMes}</span>
                  <div className="flex gap-4 text-sm">
                    <span className="text-green-600">Ingresos: €{mes.beneficioBruto.toLocaleString()}</span>
                    <span className="text-red-600">Gastos: €{mes.gastos.toLocaleString()}</span>
                    <span className={`font-medium ${mes.beneficioNeto >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      Beneficio: €{mes.beneficioNeto.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
