
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Euro, TrendingUp, Calculator, Percent, Clock, Edit, Save, X } from "lucide-react";
import { Proyecto } from "@/types/proyecto";
import { useCalculosBeneficios } from "@/hooks/useCalculosBeneficios";
import { generarCalendarioMesPuro } from "@/utils/calendarioUtils";

interface AnalisisFinancieroTabProps {
  proyecto: Proyecto;
  onUpdateProyecto?: (proyecto: Proyecto) => void;
}

export const AnalisisFinancieroTab = ({ proyecto, onUpdateProyecto }: AnalisisFinancieroTabProps) => {
  const [editandoCertificacion, setEditandoCertificacion] = useState(false);
  const [certificacionTemp, setCertificacionTemp] = useState(proyecto.certificacionReal?.toString() || '');

  const {
    calcularBeneficioBrutoAdministracion,
    calcularBeneficioBrutoPresupuesto,
    calcularGastosTotales,
    calcularBeneficioNeto,
    calcularMargenProyecto
  } = useCalculosBeneficios();

  // Calcular total de horas trabajadas para proyectos de administración
  const calcularTotalHorasTrabajadas = () => {
    if (proyecto.tipo !== 'administracion') return 0;

    let totalHoras = 0;
    const añoActual = new Date().getFullYear();
    const fechaActual = new Date();

    proyecto.trabajadoresAsignados.forEach(trabajador => {
      // Si no hay fecha de entrada, no contar horas
      if (!trabajador.fechaEntrada) {
        return;
      }

      const fechaEntrada = trabajador.fechaEntrada;
      const fechaSalida = trabajador.fechaSalida || fechaActual;
      
      // Determinar el rango de meses a procesar
      const mesInicio = fechaEntrada.getMonth() + 1;
      const añoInicio = fechaEntrada.getFullYear();
      const mesFin = fechaSalida.getMonth() + 1;
      const añoFin = fechaSalida.getFullYear();

      // Solo calcular si hay intersección con el año actual
      if (añoFin >= añoActual && añoInicio <= añoActual) {
        const mesInicioReal = añoInicio === añoActual ? mesInicio : 1;
        const mesFinReal = añoFin === añoActual ? mesFin : 12;

        for (let mes = mesInicioReal; mes <= mesFinReal; mes++) {
          const calendario = generarCalendarioMesPuro(trabajador.id, mes, añoActual);
          
          // Determinar fechas límite para este mes específico
          const primerDiaMes = new Date(añoActual, mes - 1, 1);
          const ultimoDiaMes = new Date(añoActual, mes, 0);
          
          // Fecha efectiva de inicio para este mes
          const fechaInicioMes = mes === mesInicio && añoInicio === añoActual 
            ? fechaEntrada 
            : primerDiaMes;
            
          // Fecha efectiva de fin para este mes
          const fechaFinMes = mes === mesFin && añoFin === añoActual 
            ? fechaSalida 
            : ultimoDiaMes;
          
          calendario.dias.forEach(dia => {
            const fechaDia = new Date(añoActual, mes - 1, dia.fecha.getDate());
            
            // Solo contar días dentro del período efectivo del trabajador para este mes
            if (fechaDia >= fechaInicioMes && fechaDia <= fechaFinMes) {
              if (dia.tipo === 'laborable' || dia.tipo === 'sabado') {
                if (!dia.ausencia || !['vacaciones', 'baja_medica', 'baja_laboral', 'baja_personal'].includes(dia.ausencia.tipo)) {
                  totalHoras += dia.horasReales || 0;
                }
              }
            }
          });
        }
      }
    });

    return totalHoras;
  };

  const totalHoras = calcularTotalHorasTrabajadas();

  // Usar certificación real si está disponible, sino usar el cálculo teórico
  const beneficioBruto = proyecto.tipo === 'administracion' 
    ? (proyecto.certificacionReal || calcularBeneficioBrutoAdministracion(proyecto))
    : calcularBeneficioBrutoPresupuesto(proyecto);
  
  const gastosTotales = calcularGastosTotales(proyecto);
  const beneficioNeto = beneficioBruto - gastosTotales;
  const margen = beneficioBruto > 0 ? (beneficioNeto / beneficioBruto) * 100 : 0;

  const getMargenColor = (margen: number) => {
    if (margen >= 20) return "bg-green-100 text-green-800";
    if (margen >= 10) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const handleGuardarCertificacion = () => {
    if (!onUpdateProyecto) return;

    const certificacionNumerica = certificacionTemp ? parseFloat(certificacionTemp) : undefined;
    
    const proyectoActualizado = {
      ...proyecto,
      certificacionReal: certificacionNumerica
    };

    onUpdateProyecto(proyectoActualizado);
    setEditandoCertificacion(false);
  };

  const handleCancelarEdicion = () => {
    setCertificacionTemp(proyecto.certificacionReal?.toString() || '');
    setEditandoCertificacion(false);
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
                  {proyecto.tipo === 'administracion' ? 
                    (proyecto.certificacionReal ? 'Certificación Real' : 'Beneficio Teórico') : 
                    'Certificado'
                  }
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
          <>
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
                  <span className="text-sm text-gray-600">Total horas trabajadas:</span>
                  <span className="font-medium">{totalHoras.toLocaleString()} h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Beneficio teórico:</span>
                  <span className="font-medium">{calcularBeneficioBrutoAdministracion(proyecto).toLocaleString()}€</span>
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

            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base">Certificación del Cliente</CardTitle>
                  {!editandoCertificacion && onUpdateProyecto && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditandoCertificacion(true)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {editandoCertificacion ? (
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="certificacion">Importe certificado por el cliente</Label>
                      <Input
                        id="certificacion"
                        type="number"
                        value={certificacionTemp}
                        onChange={(e) => setCertificacionTemp(e.target.value)}
                        placeholder="Introduce el importe..."
                        className="mt-1"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={handleGuardarCertificacion}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Save className="w-4 h-4 mr-1" />
                        Guardar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancelarEdicion}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {proyecto.certificacionReal ? (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Certificación real:</span>
                        <span className="font-medium text-green-600">
                          {proyecto.certificacionReal.toLocaleString()}€
                        </span>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">
                        No se ha registrado certificación del cliente
                      </p>
                    )}
                    <div className="text-xs text-gray-500">
                      Este es el importe que realmente certificará/pagará el cliente
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
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
