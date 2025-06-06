
import { useState, useMemo, useEffect } from 'react';
import { DiaCalendario, CalendarioMensual, FestivoEspañol, ResumenHoras } from '@/types/calendario';

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

  // Cargar calendarios desde localStorage al inicializar
  useEffect(() => {
    console.log(`Cargando calendarios para empleado ${empleadoId} desde localStorage...`);
    const calendarioKey = `calendarios_empleado_${empleadoId}`;
    const calendariosGuardados = localStorage.getItem(calendarioKey);
    
    if (calendariosGuardados) {
      try {
        const calendariosParseados = JSON.parse(calendariosGuardados);
        const mapaCalendarios = new Map<string, CalendarioMensual>();
        
        Object.entries(calendariosParseados).forEach(([clave, calendario]: [string, any]) => {
          // Convertir las fechas de string a Date
          const calendarioConFechas = {
            ...calendario,
            dias: calendario.dias.map((dia: any) => ({
              ...dia,
              fecha: new Date(dia.fecha)
            }))
          };
          mapaCalendarios.set(clave, calendarioConFechas);
        });
        
        setCalendarios(mapaCalendarios);
        console.log(`Calendarios cargados para empleado ${empleadoId}:`, mapaCalendarios.size);
      } catch (error) {
        console.error('Error al cargar calendarios desde localStorage:', error);
      }
    }
  }, [empleadoId]);

  // Guardar calendarios en localStorage cuando cambien
  useEffect(() => {
    if (calendarios.size > 0) {
      console.log(`Guardando calendarios para empleado ${empleadoId} en localStorage...`);
      const calendarioKey = `calendarios_empleado_${empleadoId}`;
      
      // Convertir el Map a un objeto plano para localStorage
      const calendariosObj: Record<string, CalendarioMensual> = {};
      calendarios.forEach((calendario, clave) => {
        calendariosObj[clave] = calendario;
      });
      
      localStorage.setItem(calendarioKey, JSON.stringify(calendariosObj));
      console.log(`Calendarios guardados para empleado ${empleadoId}:`, calendarios.size);
    }
  }, [calendarios, empleadoId]);

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

  const calcularResumenHoras = (calendario: CalendarioMensual): ResumenHoras => {
    let horasLaborales = 0;
    let horasRealesLaborales = 0;
    let horasRealesFestivas = 0;

    calendario.dias.forEach(dia => {
      if (dia.tipo === 'laborable') {
        horasLaborales += dia.horasDefecto;
        horasRealesLaborales += dia.horasReales;
      } else if (dia.tipo === 'sabado') {
        // Los sábados se suman como horas reales laborales, no festivas
        horasRealesLaborales += dia.horasReales;
      } else if (dia.tipo === 'festivo' || dia.tipo === 'domingo') {
        horasRealesFestivas += dia.horasReales;
      }
    });

    const horasExtras = Math.max(0, horasRealesLaborales - horasLaborales);

    return {
      horasLaborales,
      horasRealesLaborales,
      horasRealesFestivas,
      horasExtras
    };
  };

  const generarCalendarioMes = (mes: number, año: number): CalendarioMensual => {
    const claveCalendario = `${empleadoId}-${año}-${mes}`;
    const calendarioExistente = calendarios.get(claveCalendario);
    
    if (calendarioExistente) {
      return calendarioExistente;
    }

    console.log(`Generando nuevo calendario para ${mes}/${año} del empleado ${empleadoId}`);
    
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

    // Actualizar el estado inmediatamente para que se guarde en localStorage
    setCalendarios(prev => {
      const nuevoMapa = new Map(prev);
      nuevoMapa.set(claveCalendario, nuevoCalendario);
      return nuevoMapa;
    });

    return nuevoCalendario;
  };

  const actualizarDia = (fecha: Date, cambios: Partial<DiaCalendario>) => {
    const año = fecha.getFullYear();
    const mes = fecha.getMonth() + 1;
    const claveCalendario = `${empleadoId}-${año}-${mes}`;
    
    console.log(`Actualizando día ${fecha.toISOString().split('T')[0]} para empleado ${empleadoId}`);
    
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
    calcularResumenHoras,
  };
};
