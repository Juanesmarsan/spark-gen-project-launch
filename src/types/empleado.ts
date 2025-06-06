
export interface Empleado {
  id: number;
  nombre: string;
  apellidos: string;
  dni: string;
  telefono: string;
  email: string;
  direccion: string;
  fechaIngreso: Date;
  salarioBruto: number;
  seguridadSocialTrabajador: number;
  seguridadSocialEmpresa: number;
  retenciones: number;
  embargo: number;
  adelantos: Adelanto[];
  epis: EpiAsignado[];
  herramientas: HerramientaAsignada[];
  documentos: Documento[];
  proyectos: string[];
  vehiculo?: string;
}

export interface Adelanto {
  id: number;
  concepto: string;
  cantidad: number;
  fecha: Date;
}

export interface EpiAsignado {
  id: number;
  nombre: string;
  precio: number;
  fechaEntrega: Date;
}

export interface HerramientaAsignada {
  id: number;
  nombre: string;
  precio: number;
  fechaEntrega: Date;
}

export interface Documento {
  id: number;
  tipo: string;
  nombre: string;
  fechaCaducidad?: Date;
  archivo: string;
}

export interface Epi {
  id: number;
  nombre: string;
  precio: number;
  disponible: boolean;
}

export interface Herramienta {
  id: number;
  tipo: string;
  marca: string;
  coste: number;
  disponible: boolean;
}

export interface Vehiculo {
  id: number;
  matricula: string;
  tipo: string;
  marca: string;
  modelo: string;
  asignado: boolean;
}
