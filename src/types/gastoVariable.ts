
export interface GastoVariable {
  id: number;
  concepto: string;
  importe: number;
  fecha: Date;
  categoria: 'material' | 'vehiculo' | 'empleado' | 'otros';
  descripcion?: string;
  factura?: string;
  // Para gastos de vehículo
  vehiculoId?: number;
  tipoGastoVehiculo?: 'ITV' | 'revision' | 'reparacion' | 'otro';
  // Para gastos de empleado
  empleadoId?: number;
  tipoGastoEmpleado?: 'dieta' | 'alojamiento' | 'transporte' | 'otro';
}

export interface ResumenGastosVariables {
  totalMes: number;
  gastosPorCategoria: {
    material: number;
    vehiculo: number;
    empleado: number;
    otros: number;
  };
  gastosVehiculos: GastoVariable[];
  gastosEmpleados: GastoVariable[];
}
