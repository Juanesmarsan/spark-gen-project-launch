
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AnalisisMensual {
  mes: number;
  nombreMes: string;
  beneficioBruto: number;
  gastos: number;
  beneficioNeto: number;
  margen: number;
}

interface EvolucionMensualProps {
  analisisMensual: AnalisisMensual[];
}

export const EvolucionMensual: React.FC<EvolucionMensualProps> = ({ analisisMensual }) => {
  if (analisisMensual.length === 0) {
    return null;
  }

  // Filtrar meses con actividad
  const mesesConActividad = analisisMensual.filter(mes => mes.beneficioBruto > 0 || mes.gastos > 0);

  if (mesesConActividad.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Evolución Mensual</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            No hay actividad registrada para este proyecto
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Evolución Mensual</CardTitle>
        <p className="text-sm text-muted-foreground">
          Incluye gastos salariales proporcionales de trabajadores asignados
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mesesConActividad.map((mes, index) => (
            <div key={index} className="flex justify-between items-center p-4 border rounded-lg bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center gap-3">
                <span className="font-medium text-gray-900">{mes.nombreMes}</span>
                <Badge variant={mes.beneficioNeto >= 0 ? "default" : "destructive"} className="text-xs">
                  {mes.margen.toFixed(1)}% margen
                </Badge>
              </div>
              <div className="flex gap-6 text-sm">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Ingresos</p>
                  <span className="font-medium text-green-600">€{mes.beneficioBruto.toLocaleString()}</span>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Gastos</p>
                  <span className="font-medium text-red-600">€{mes.gastos.toLocaleString()}</span>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Beneficio</p>
                  <span className={`font-bold ${mes.beneficioNeto >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    €{mes.beneficioNeto.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
