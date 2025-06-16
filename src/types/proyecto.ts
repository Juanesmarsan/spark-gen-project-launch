
export interface Trabajador {
  id: number;
  nombre: string;
  apellidos: string;
  precioHora?: number; // Solo para proyectos por administración
  fechaEntrada?: Date;
  fechaSalida?: Date;
}

export interface GastoVariableProyecto {
  id: number;
  concepto: string;
  importe: number;
  fecha: Date;
  categoria: 'material' | 'transporte' | 'herramienta' | 'otro';
  descripcion?: string;
  factura?: string;
}

export interface CertificacionMensual {
  id: number;
  mes: number;
  anio: number;
  importe: number;
  descripcion?: string;
  fechaRegistro: Date;
}

export interface Proyecto {
  id: number;
  nombre: string;
  ciudad: string;
  tipo: 'presupuesto' | 'administracion';
  estado: 'activo' | 'completado' | 'pausado';
  presupuestoTotal?: number; // Para proyectos por presupuesto
  precioHora?: number; // Para proyectos por administración
  certificacionReal?: number; // Para proyectos por administración - importe real certificado por el cliente
  descripcion?: string;
  trabajadoresAsignados: Trabajador[];
  fechaCreacion: Date;
  gastosVariables?: GastoVariableProyecto[];
  certificaciones?: CertificacionMensual[]; // Para proyectos por presupuesto
}

export interface ProyectoFormData {
  nombre: string;
  ciudad: string;
  tipo: 'presupuesto' | 'administracion';
  estado: 'activo' | 'completado' | 'pausado';
  presupuestoTotal?: number;
  precioHora?: number;
  descripcion?: string;
  trabajadoresAsignados: number[];
  trabajadoresConFechas?: {
    id: number;
    fechaEntrada?: Date;
    fechaSalida?: Date;
  }[];
}
