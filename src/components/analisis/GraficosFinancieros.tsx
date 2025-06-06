
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { BarChart3, PieChart as PieChartIcon } from "lucide-react";

interface GraficosFinancierosProps {
  dataIngresosGastos: Array<{ name: string; value: number }>;
  top10GastosFijos: Array<{ descripcion: string; importe: number; fill: string }>;
  dataGastosVariablesPorCategoria: Array<{ categoria: string; total: number; fill: string }>;
}

export const GraficosFinancieros: React.FC<GraficosFinancierosProps> = ({
  dataIngresosGastos,
  top10GastosFijos,
  dataGastosVariablesPorCategoria
}) => {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Ingresos vs Gastos (Anual)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataIngresosGastos} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    formatter={(value: number) => [`€${value.toLocaleString('es-ES', { maximumFractionDigits: 2 })}`, 'Importe']}
                    labelStyle={{ color: '#000' }}
                    contentStyle={{ backgroundColor: '#f8f9fa', border: '1px solid #dee2e6' }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="value" 
                    fill="#82ca9d"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="w-5 h-5" />
              Top 10 Gastos Fijos (Anual)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={top10GastosFijos}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="importe"
                    label={({ descripcion, importe }) => 
                      `${descripcion.substring(0, 15)}${descripcion.length > 15 ? '...' : ''}: €${importe.toLocaleString('es-ES', { maximumFractionDigits: 0 })}`
                    }
                    labelLine={false}
                  >
                    {top10GastosFijos.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`€${value.toLocaleString('es-ES', { maximumFractionDigits: 2 })}`, 'Importe Anual']}
                    labelFormatter={(label) => `Gasto: ${label}`}
                    contentStyle={{ backgroundColor: '#f8f9fa', border: '1px solid #dee2e6' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="w-5 h-5" />
              Gastos Variables por Categoría
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dataGastosVariablesPorCategoria}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="total"
                    label={({ categoria, total }) => 
                      `${categoria.substring(0, 15)}${categoria.length > 15 ? '...' : ''}: €${total.toLocaleString('es-ES', { maximumFractionDigits: 0 })}`
                    }
                    labelLine={false}
                  >
                    {dataGastosVariablesPorCategoria.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`€${value.toLocaleString('es-ES', { maximumFractionDigits: 2 })}`, 'Total']}
                    labelFormatter={(label) => `Categoría: ${label}`}
                    contentStyle={{ backgroundColor: '#f8f9fa', border: '1px solid #dee2e6' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
