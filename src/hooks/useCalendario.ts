
import { useState, useMemo } from 'react';
import { DiaCalendario, CalendarioMensual, FestivoEspañol } from '@/types/calendario';

// Festivos nacionales fijos de España 2024-2025
const festivosNacionalesFijos: FestivoEspañol[] = [
  // 2024
  { fecha: '2024-01-01', nombre: 'Año Nuevo', ambito: 'nacional' },
  { fecha: '2024-01-06', nombre: 'Epifanía del Señor', ambito: 'nacional' },
  { fecha: '2024-05-01', nombre: 'Día del Trabajador', ambito: 'nacional' },
  { fecha: '2024-08-15', nombre: 'Asunción de la Virgen', ambito: 'nacional' },
  { fecha: '2024-10-12', nombre: 'Fiesta Nacional de España', ambito: 'nacional' },
  { fecha: '2024-11-01', nombre: 'Todos los Santos', ambito: 'nacional' },
  { fecha: '2024-12-06', nombre: 'Día de la Constitución', ambito: 'nacional' },
  { fecha: '2024-12-08', nombre: 'Inmaculada Concepción', ambito: 'nacional' },
  { fecha: '2024-12-25', nombre: 'Navidad', ambito: 'nacional' },
  
  // 2025
  { fecha: '2025-01-01', nombre: 'Año Nuevo', ambito: 'nacional' },
  { fecha: '2025-01-06', nombre: 'Epifanía del Señor', ambito: 'nacional' },
  { fecha: '2025-05-01', nombre: 'Día del Trabajador', ambito: 'nacional' },
  { fecha: '2025-08-15', nombre: 'Asunción de la Virgen', ambito: 'nacional' },
  { fecha: '2025-10-12', nombre: 'Fiesta Nacional de España', ambito: 'nacional' },
  { fecha: '2025-11-01', nombre: 'Todos los Santos', ambito: 'nacional' },
  { fecha: '2025-12-06', nombre: 'Día de la Constitución', ambito: 'nacional' },
  { fecha: '2025-12-08', nombre: 'Inmaculada Concepción', ambito: 'nacional' },
  { fecha: '2025-12-25', nombre: 'Navidad', ambito: 'nacional' },
];

// Festivos de Valencia
const festivosValencia: FestivoEspañol[] = [
  // 2024
  { fecha: '2024-03-19', nombre: 'San José (Fallas)', ambito: 'valencia' },
  { fecha: '2024-04-22', nombre: 'Lunes de Pascua', ambito: 'valencia' },
  { fecha: '2024-06-24', nombre: 'San Juan', ambito: 'valencia' },
  { fecha: '2024-10-09', nombre: 'Día de la Comunidad Valenciana', ambito: 'valencia' },
  
  // 2025
  { fecha: '2025-03-19', nombre: 'San José (Fallas)', ambito: 'valencia' },
  { fecha: '2025-04-21', nombre: 'Lunes de Pascua', ambito: 'valencia' },
  { fecha: '2025-06-24', nombre: 'San Juan', ambito: 'valencia' },
  { fecha: '2025-10-09', nombre: 'Día de la Comunidad Valenciana', ambito: 'valencia' },
];

export const useCalendario = (empleadoId: number) => {
  const [calendarios, setCalendarios] = useState<Map<string, CalendarioMensual>>(new Map());

  const todosLosFestivos = useMemo(() => {
    return [...festivosNacionalesFijos, ...festivosValencia];
  }, []);

  const esFestivo = (fecha: Date): boolean => {
    const fechaStr = fecha.toISOString().split('T')[0];
    return todosLosFestivos.some(festivo => festivo.fecha === fechaStr);
  };

  const getTipoDia = (fecha: Date): 'laborable' | 'festivo' | 'sabado' | 'domingo' => {
    const diaSemana = fecha.getDay();
    
    if (diaSemana === 0) return 'domingo';
    if (diaSemana === 6) return 'sabado';
    if (esFestivo(fecha)) return 'festivo';
    
    return 'laborable';
  };

  const getHorasDefecto = (tipo: string): number => {
    return tipo === 'laborable' ? 8 : 0;
  };

  const generarCalendarioMes = (mes: number, año: number): CalendarioMensual => {
    const claveCalendario = `${empleadoId}-${año}-${mes}`;
    const calendarioExistente = calendarios.get(claveCalendario);
    
    if (calendarioExistente) {
      return calendarioExistente;
    }

    const primerDia = new Date(año, mes - 1, 1);
    const ultimoDia = new Date(año, mes, 0);
    const dias: DiaCalendario[] = [];

    for (let dia = 1; dia <= ultimoDia.getDate(); dia++) {
      const fecha = new Date(año, mes - 1, dia);
      const tipo = getTipoDia(fecha);
      const horasDefecto = getHorasDefecto(tipo);

      dias.push({
        fecha,
        diaSemana: fecha.getDay(),
        horasDefecto,
        horasReales: horasDefecto,
        tipo,
      });
    }

    const nuevoCalendario: CalendarioMensual = {
      mes,
      año,
      dias,
    };

    setCalendarios(prev => new Map(prev).set(claveCalendario, nuevoCalendario));
    return nuevoCalendario;
  };

  const actualizarDia = (fecha: Date, cambios: Partial<DiaCalendario>) => {
    const año = fecha.getFullYear();
    const mes = fecha.getMonth() + 1;
    const claveCalendario = `${empleadoId}-${año}-${mes}`;
    
    setCalendarios(prev => {
      const nuevoMapa = new Map(prev);
      const calendario = nuevoMapa.get(claveCalendario);
      
      if (calendario) {
        const nuevosDeias = calendario.dias.map(dia => {
          if (dia.fecha.getTime() === fecha.getTime()) {
            return { ...dia, ...cambios };
          }
          return dia;
        });
        
        nuevoMapa.set(claveCalendario, {
          ...calendario,
          dias: nuevosDeias,
        });
      }
      
      return nuevoMapa;
    });
  };

  return {
    generarCalendarioMes,
    actualizarDia,
    esFestivo,
    todosLosFestivos,
  };
};
