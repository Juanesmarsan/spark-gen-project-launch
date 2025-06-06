
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCalendario } from '@/hooks/useCalendario';
import { DiaCalendario } from '@/types/calendario';
import { cn } from '@/lib/utils';

interface CalendarioMensualProps {
  empleadoId: number;
}

const meses = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export const CalendarioMensual = ({ empleadoId }: CalendarioMensualProps) => {
  const fechaActual = new Date();
  const [mesActual, setMesActual] = useState(fechaActual.getMonth() + 1);
  const [añoActual, setAñoActual] = useState(fechaActual.getFullYear());

  const { generarCalendarioMes, actualizarDia } = useCalendario(empleadoId);
  const calendario = generarCalendarioMes(mesActual, añoActual);

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
  );
};
