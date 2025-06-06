
export interface Trabajador {
  id: number;
  nombre: string;
  apellidos: string;
  precioHora?: number; // Solo para proyectos por administración
}

export interface Proyecto {
  id: number;
  nombre: string;
  ciudad: string;
  tipo: 'presupuesto' | 'administracion';
  estado: 'activo' | 'completado' | 'pausado';
  presupuestoTotal?: number; // Para proyectos por presupuesto
  precioHora?: number; // Para proyectos por administración
  descripcion?: string;
  trabajadoresAsignados: Trabajador[];
  fechaCreacion: Date;
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
}
