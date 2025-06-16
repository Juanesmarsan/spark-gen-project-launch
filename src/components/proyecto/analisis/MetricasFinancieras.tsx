
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, Calculator, TrendingUp, TrendingDown, Percent } from "lucide-react";

interface MetricasFinancierasProps {
  beneficioBruto: number;
  gastosTotales: number;
  beneficioNeto: number;
  margenProyecto: number;
}

export const MetricasFinancieras: React.FC<MetricasFinancierasProps> = ({
  beneficioBruto,
  gastosTotales,
  beneficioNeto,
  margenProyecto
}) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-600" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Beneficio Bruto</p>
              <p className="text-lg font-bold text-green-600">
                €{beneficioBruto.toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-blue-600" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Gastos Totales</p>
              <p className="text-lg font-bold text-blue-600">
                €{gastosTotales.toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            {beneficioNeto >= 0 ? (
              <TrendingUp className="w-4 h-4 text-green-600" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-600" />
            )}
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Beneficio Neto</p>
              <p className={`text-lg font-bold ${beneficioNeto >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                €{beneficioNeto.toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Percent className="w-4 h-4 text-purple-600" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Margen</p>
              <p className="text-lg font-bold text-purple-600">
                {margenProyecto.toFixed(1)}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
