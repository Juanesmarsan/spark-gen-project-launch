import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCalendario } from '@/hooks/useCalendario';
import { DiaCalendario } from '@/types/calendario';
import { Empleado } from '@/types/empleado';
import { cn } from '@/lib/utils';

interface CalendarioMensualProps {
  empleado: Empleado;
}

const meses = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export const CalendarioMensual = ({ empleado }: CalendarioMensualProps) => {
  const fechaActual = new Date();
  const [mesActual, setMesActual] = useState(fechaActual.getMonth() + 1);
  const [añoActual, setAñoActual] = useState(fechaActual.getFullYear());

  const { generarCalendarioMes, actualizarDia, calcularResumenHoras } = useCalendario(empleado.id);
  const calendario = generarCalendarioMes(mesActual, añoActual);
  const resumen = calcularResumenHoras(calendario);

  // Cálculos salariales
  const totalAdelantos = empleado.adelantos.reduce((sum, adelanto) => sum + adelanto.cantidad, 0);
  const valorHorasExtras = resumen.horasExtras * empleado.precioHoraExtra;
  const valorHorasFestivas = resumen.horasRealesFestivas * empleado.precioHoraFestiva;
  const complemento = valorHorasExtras + valorHorasFestivas;
  const salarioNeto = empleado.salarioBruto - empleado.seguridadSocialTrabajador - empleado.retenciones;
  const totalAPagar = salarioNeto + complemento - totalAdelantos - empleado.embargo;

  const cambiarMes = (direccion: 'anterior' | 'siguiente') => {
    if (direccion === 'anterior') {
      if (mesActual === 1) {
        setMesActual(12);
        setAñoActual(añoActual - 1);
      } else {
        setMesActual(mesActual - 1);
      }
    } else {
      if (mesActual === 12) {
        setMesActual(1);
        setAñoActual(añoActual + 1);
      } else {
        setMesActual(mesActual + 1);
      }
    }
  };

  const getColorDia = (dia: DiaCalendario): string => {
    if (dia.ausencia) {
      switch (dia.ausencia.tipo) {
        case 'baja_medica':
        case 'baja_laboral':
        case 'baja_personal':
          return 'bg-yellow-200 border-yellow-400';
        case 'ausencia':
          return 'bg-orange-200 border-orange-400';
        case 'vacaciones':
          return 'bg-blue-200 border-blue-400';
        default:
          return '';
      }
    }

    switch (dia.tipo) {
      case 'festivo':
        return 'bg-red-100 border-red-300';
      case 'domingo':
        return 'bg-red-50 border-red-200';
      case 'sabado':
        return 'bg-gray-100 border-gray-300';
      default:
        return 'bg-white border-gray-200';
    }
  };

  const actualizarHorasReales = (dia: DiaCalendario, horas: string) => {
    const horasNum = parseFloat(horas) || 0;
    actualizarDia(dia.fecha, { horasReales: horasNum });
  };

  const actualizarAusencia = (dia: DiaCalendario, tipoAusencia: string | null) => {
    if (!tipoAusencia || tipoAusencia === 'ninguna') {
      actualizarDia(dia.fecha, { 
        ausencia: undefined,
        horasReales: dia.horasDefecto 
      });
    } else {
      const horasDefectoAusencia = tipoAusencia === 'ausencia' ? 0 : 8;
      actualizarDia(dia.fecha, { 
        ausencia: { 
          tipo: tipoAusencia as any 
        },
        horasReales: horasDefectoAusencia
      });
    }
  };

  // Calcular días del mes anterior para llenar la primera semana
  const primerDiaMes = new Date(añoActual, mesActual - 1, 1);
  const primerDiaSemana = primerDiaMes.getDay();
  const diasMesAnterior = [];
  
  for (let i = primerDiaSemana - 1; i >= 0; i--) {
    const fecha = new Date(añoActual, mesActual - 1, -i);
    diasMesAnterior.push(fecha);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Calendario de Horas - {meses[mesActual - 1]} {añoActual}</CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => cambiarMes('anterior')}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => cambiarMes('siguiente')}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1 mb-4">
            {diasSemana.map(dia => (
              <div key={dia} className="text-center font-semibold text-sm p-2 bg-gray-50">
                {dia}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {/* Días del mes anterior (grises) */}
            {diasMesAnterior.map(fecha => (
              <div key={fecha.toISOString()} className="h-24 bg-gray-50 border border-gray-200 p-1">
                <div className="text-xs text-gray-400 text-center">{fecha.getDate()}</div>
              </div>
            ))}

            {/* Días del mes actual */}
            {calendario.dias.map(dia => (
              <div 
                key={dia.fecha.toISOString()} 
                className={cn("h-24 border-2 p-1 relative", getColorDia(dia))}
              >
                <div className="text-xs font-semibold text-center mb-1">
                  {dia.fecha.getDate()}
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-600">Def:</span>
                    <span className="font-medium">{dia.horasDefecto}h</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Real:</span>
                    <Input
                      type="number"
                      min="0"
                      max="24"
                      step="0.5"
                      value={dia.horasReales}
                      onChange={(e) => actualizarHorasReales(dia, e.target.value)}
                      className="w-12 h-5 text-xs p-1 text-center"
                    />
                  </div>

                  <Select
                    value={dia.ausencia?.tipo || 'ninguna'}
                    onValueChange={(value) => actualizarAusencia(dia, value === 'ninguna' ? null : value)}
                  >
                    <SelectTrigger className="w-full h-5 text-xs p-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ninguna">Normal</SelectItem>
                      <SelectItem value="baja_medica">Baja Médica</SelectItem>
                      <SelectItem value="baja_laboral">Baja Laboral</SelectItem>
                      <SelectItem value="baja_personal">Baja Personal</SelectItem>
                      <SelectItem value="ausencia">Ausencia</SelectItem>
                      <SelectItem value="vacaciones">Vacaciones</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Indicador visual del tipo de día */}
                {dia.tipo === 'festivo' && (
                  <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></div>
                )}
              </div>
            ))}
          </div>

          {/* Leyenda */}
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-white border border-gray-200"></div>
              <span>Laborable</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-100 border border-red-300"></div>
              <span>Festivo</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-100 border border-gray-300"></div>
              <span>Sábado</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-50 border border-red-200"></div>
              <span>Domingo</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-200 border border-yellow-400"></div>
              <span>Baja</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-orange-200 border border-orange-400"></div>
              <span>Ausencia</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-200 border border-blue-400"></div>
              <span>Vacaciones</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumen de Horas */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen de Horas - {meses[mesActual - 1]} {añoActual}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800">Horas Laborales</h4>
              <p className="text-2xl font-bold text-blue-600">{resumen.horasLaborales}h</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800">Horas Reales Laborales</h4>
              <p className="text-2xl font-bold text-green-600">{resumen.horasRealesLaborales}h</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-800">Horas Festivas</h4>
              <p className="text-2xl font-bold text-purple-600">{resumen.horasRealesFestivas}h</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="font-semibold text-orange-800">Horas Extras</h4>
              <p className="text-2xl font-bold text-orange-600">{resumen.horasExtras}h</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">Cálculo Económico Detallado</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Salario Bruto:</span>
                  <span className="font-bold">€{empleado.salarioBruto.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-red-600">
                  <span>- Seguridad Social Trabajador:</span>
                  <span className="font-bold">€{empleado.seguridadSocialTrabajador.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-red-600">
                  <span>- Retenciones:</span>
                  <span className="font-bold">€{empleado.retenciones.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold text-blue-600">
                  <span>Salario Neto:</span>
                  <span>€{salarioNeto.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>+ Horas Extras ({resumen.horasExtras}h × €{empleado.precioHoraExtra}):</span>
                  <span className="font-bold">€{valorHorasExtras.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>+ Horas Festivas ({resumen.horasRealesFestivas}h × €{empleado.precioHoraFestiva}):</span>
                  <span className="font-bold">€{valorHorasFestivas.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold text-purple-600">
                  <span>Complemento:</span>
                  <span>€{complemento.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-red-600">
                  <span>- Adelantos:</span>
                  <span className="font-bold">€{totalAdelantos.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-red-600">
                  <span>- Embargo:</span>
                  <span className="font-bold">€{empleado.embargo.toFixed(2)}</span>
                </div>
                <div className="border-t-2 pt-2 flex justify-between font-bold text-lg text-green-700">
                  <span>TOTAL A PAGAR:</span>
                  <span>€{totalAPagar.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">Información del Empleado</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Departamento:</span>
                  <span className="font-medium capitalize">{empleado.departamento}</span>
                </div>
                <div className="flex justify-between">
                  <span>Categoría:</span>
                  <span className="font-medium capitalize">{empleado.categoria?.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Precio Hora Extra:</span>
                  <span className="font-medium">€{empleado.precioHoraExtra}</span>
                </div>
                <div className="flex justify-between">
                  <span>Precio Hora Festiva:</span>
                  <span className="font-medium">€{empleado.precioHoraFestiva}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between">
                    <span>Total Adelantos:</span>
                    <span className="font-medium">€{totalAdelantos.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
