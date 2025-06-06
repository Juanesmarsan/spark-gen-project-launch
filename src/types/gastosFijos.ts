
export interface GastoFijo {
  id: number;
  concepto: string;
  totalBruto: number;
  baseImponible: number;
  tieneIva: boolean;
  iva?: number;
  importe: number;
  frecuencia: 'mensual' | 'trimestral' | 'semestral' | 'anual';
}

export interface ResumenGastosFijos {
  totalBruto: number;
  totalBaseImponible: number;
  coeficienteEmpresa: number;
  coeficienteEmpresaDiario: number;
  numeroOperarios: number;
}
