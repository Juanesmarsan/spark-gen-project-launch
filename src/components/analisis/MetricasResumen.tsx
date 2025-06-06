
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleDollarSign, Users, TrendingUp, Calculator } from "lucide-react";

interface MetricasResumenProps {
  ingresosTotales: number;
  gastosVariables: number;
  salariosAnuales: number;
  minimoViable: number;
}

export const MetricasResumen: React.FC<MetricasResumenProps> = ({
  ingresosTotales,
  gastosVariables,
  salariosAnuales,
  minimoViable
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CircleDollarSign className="w-5 h-5" />
            Ingresos Totales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">€{ingresosTotales.toFixed(2)}</div>
          <p className="text-sm text-muted-foreground">
            Ingresos totales generados por proyectos
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Gastos Variables
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">€{gastosVariables.toFixed(2)}</div>
          <p className="text-sm text-muted-foreground">
            Gastos variables totales de la empresa
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Salarios Anuales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">€{salariosAnuales.toFixed(2)}</div>
          <p className="text-sm text-muted-foreground">
            Salario anual total de empleados
          </p>
        </CardContent>
      </Card>

      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700">
            <Calculator className="w-5 h-5" />
            Mínimo Viable Anual
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-700">€{minimoViable.toFixed(2)}</div>
          <p className="text-sm text-red-600">
            Facturación mínima necesaria para cubrir gastos
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
