
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DesgloseMinimoViableProps {
  gastosFijosAnuales: number;
  salariosAnuales: number;
  gastosVariables: number;
  minimoViable: number;
}

export const DesgloseMinimoViable: React.FC<DesgloseMinimoViableProps> = ({
  gastosFijosAnuales,
  salariosAnuales,
  gastosVariables,
  minimoViable
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Desglose del Mínimo Viable</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
            <span className="font-medium">Gastos Fijos Anuales:</span>
            <span className="font-bold text-blue-700">€{gastosFijosAnuales.toLocaleString('es-ES', { maximumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
            <span className="font-medium">Salarios Anuales:</span>
            <span className="font-bold text-green-700">€{salariosAnuales.toLocaleString('es-ES', { maximumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
            <span className="font-medium">Gastos Variables:</span>
            <span className="font-bold text-yellow-700">€{gastosVariables.toLocaleString('es-ES', { maximumFractionDigits: 2 })}</span>
          </div>
          <div className="border-t pt-3">
            <div className="flex justify-between items-center p-3 bg-red-100 rounded-lg">
              <span className="font-bold text-lg">TOTAL MÍNIMO:</span>
              <span className="font-bold text-xl text-red-700">€{minimoViable.toLocaleString('es-ES', { maximumFractionDigits: 2 })}</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Este es el mínimo que la empresa debe facturar anualmente para cubrir todos los gastos fijos, salarios y gastos variables actuales.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
