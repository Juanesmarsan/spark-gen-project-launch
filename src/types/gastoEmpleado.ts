
export interface GastoEmpleadoProyecto {
  id: number;
  empleadoId: number;
  proyectoId: number;
  mes: number;
  anio: number;
  
  // Costes fijos mensuales prorrateados
  salarioBrutoProrrateo: number;
  seguridadSocialEmpresaProrrateo: number;
  seguridadSocialTrabajadorProrrateo: number;
  retencionesIRPFProrrateo: number;
  embargosProrrateo: number;
  diasTrabajados: number;
  diasLaboralesMes: number;
  
  // Horas extras y festivas
  horasExtras: number;
  horasFestivas: number;
  importeHorasExtras: number;
  importeHorasFestivas: number;
  
  // Gastos variables específicos
  gastos: GastoVariableEmpleadoProyecto[];
  
  fechaRegistro: Date;
}

export interface GastoVariableEmpleadoProyecto {
  id: number;
  tipo: 'dieta' | 'alojamiento' | 'combustible' | 'viaje' | 'otro';
  concepto: string;
  importe: number;
  fecha: Date;
  descripcion?: string;
  factura?: string;
}

export interface CalculoCosteEmpleado {
  empleadoId: number;
  mes: number;
  anio: number;
  salarioBrutoMes: number;
  seguridadSocialEmpresaMes: number;
  seguridadSocialTrabajadorMes: number;
  retencionesIRPFMes: number;
  embargosMes: number;
  costeTotalMensual: number;
  costePorDiaLaboral: number;
  diasLaboralesMes: number;
}

export interface AsignacionProyectoEmpleado {
  empleadoId: number;
  proyectoId: number;
  mes: number;
  anio: number;
  diasAsignados: number;
  horasExtras: number;
  horasFestivas: number;
  gastos: GastoVariableEmpleadoProyecto[];
}
