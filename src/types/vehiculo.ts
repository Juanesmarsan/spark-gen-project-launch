
export interface GastoVehiculo {
  id: number;
  vehiculoId: number;
  tipo: 'ITV' | 'revision' | 'reparacion' | 'otro';
  concepto: string;
  fecha: Date;
  importe: number;
  factura?: string; // URL o nombre del archivo de factura
  descripcion?: string;
}

export interface VehiculoCompleto {
  id: number;
  matricula: string;
  tipo: string;
  marca: string;
  modelo: string;
  caducidadITV: Date;
  caducidadSeguro: Date;
  kilometros: number;
  asignado: boolean;
  empleadoAsignado?: string;
  gastos: GastoVehiculo[];
}
