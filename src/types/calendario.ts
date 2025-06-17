
export interface DiaCalendario {
  fecha: Date;
  diaSemana: number; // 0 = domingo, 1 = lunes, etc.
  horasDefecto: number;
  horasReales: number;
  horasExtras: number; // Nueva propiedad añadida
  horasFestivas: number; // Nueva propiedad añadida
  tipo: 'laborable' | 'festivo' | 'sabado' | 'domingo';
  ausencia?: {
    tipo: 'baja_medica' | 'baja_laboral' | 'baja_personal' | 'ausencia' | 'vacaciones';
    motivo?: string;
  };
}

export interface CalendarioMensual {
  mes: number;
  año: number;
  dias: DiaCalendario[];
}

export interface FestivoEspañol {
  fecha: string; // formato YYYY-MM-DD
  nombre: string;
  ambito: 'nacional' | 'valencia';
}

export interface ResumenHoras {
  horasLaborales: number;
  horasRealesLaborales: number;
  horasRealesFestivas: number;
  horasExtras: number;
}
