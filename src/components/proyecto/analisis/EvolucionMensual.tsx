
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Evolución Mensual</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {analisisMensual.map((mes, index) => (
            <div key={index} className="flex justify-between items-center p-3 border rounded">
              <span className="font-medium">{mes.nombreMes}</span>
              <div className="flex gap-4 text-sm">
                <span className="text-green-600">Ingresos: €{mes.beneficioBruto.toLocaleString()}</span>
                <span className="text-red-600">Gastos: €{mes.gastos.toLocaleString()}</span>
                <span className={`font-medium ${mes.beneficioNeto >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  Beneficio: €{mes.beneficioNeto.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
