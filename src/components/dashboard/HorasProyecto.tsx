
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface HorasProyectoProps {
  datos: Array<{
    nombre: string;
    horas: number;
    ingresos: number;
    gastos: number;
  }>;
}

export const HorasProyecto: React.FC<HorasProyectoProps> = ({ datos }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Horas Trabajadas por Proyecto</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={datos}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="nombre" 
              angle={-45}
              textAnchor="end"
              height={100}
            />
            <YAxis />
            <Tooltip 
              formatter={(value: number, name: string) => [
                name === 'horas' ? `${value} horas` : `€${value.toFixed(2)}`,
                name === 'horas' ? 'Horas' : name === 'ingresos' ? 'Ingresos' : 'Gastos'
              ]}
            />
            <Bar dataKey="horas" fill="#8884d8" name="horas" />
          </BarChart>
        </ResponsiveContainer>
        
        <div className="mt-4 space-y-2">
          <h4 className="font-semibold">Desglose por Proyecto:</h4>
          {datos.map((proyecto, index) => (
            <div key={index} className="flex justify-between items-center p-2 border rounded">
              <span className="font-medium">{proyecto.nombre}</span>
              <div className="text-sm space-x-4">
                <span>{proyecto.horas} horas</span>
                <span className="text-green-600">+€{proyecto.ingresos.toFixed(2)}</span>
                <span className="text-red-600">-€{proyecto.gastos.toFixed(2)}</span>
                <span className="font-semibold">
                  Neto: €{(proyecto.ingresos - proyecto.gastos).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
