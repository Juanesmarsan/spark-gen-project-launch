
export interface GastoVariable {
  id: number;
  concepto: string;
  importe: number;
  fecha: Date;
  categoria: 'material' | 'vehiculo' | 'otros';
  descripcion?: string;
  factura?: string;
  // Para gastos de vehículo
  vehiculoId?: number;
  tipoGastoVehiculo?: 'ITV' | 'revision' | 'reparacion' | 'otro';
}

export interface ResumenGastosVariables {
  totalMes: number;
  gastosPorCategoria: {
    material: number;
    vehiculo: number;
    otros: number;
  };
  gastosVehiculos: GastoVariable[];
}
