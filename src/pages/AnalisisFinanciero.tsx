import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useGastosVariables } from '@/hooks/useGastosVariables';
import { useProyectos } from '@/hooks/useProyectos';
import { useEmpleados } from '@/hooks/useEmpleados';
import { Badge } from "@/components/ui/badge"
import { CircleDollarSign, PieChart as PieChartIcon, FileText, Users, Coins, Landmark, BarChart3, TrendingUp, Wallet, PiggyBank, ClipboardList, Shield } from "lucide-react";

const AnalisisFinanciero = () => {
  const { gastosVariables } = useGastosVariables();
  const { proyectos } = useProyectos();
  const { empleados } = useEmpleados();

  // Datos para gráfico de gastos variables por categoría
  const gastosVariablesPorCategoria = gastosVariables.reduce((acc, gasto) => {
    const categoria = gasto.categoria || 'Sin categoría';
    acc[categoria] = (acc[categoria] || 0) + gasto.importe;
    return acc;
  }, {} as Record<string, number>);

  const dataGastosVariablesPorCategoria = Object.entries(gastosVariablesPorCategoria)
    .map(([categoria, total]) => ({
      categoria,
      total,
      fill: `hsl(${Math.random() * 360}, 70%, 50%)`
    }))
    .sort((a, b) => b.total - a.total);

  // Calcular el total de gastos variables
  const totalGastosVariables = gastosVariables.reduce((acc, gasto) => acc + gasto.importe, 0);

  // Calcular el total de ingresos por proyecto
  const ingresosPorProyecto = proyectos.reduce((acc, proyecto) => acc + proyecto.precio, 0);

  // Calcular el salario total de los empleados
  const salarioTotalEmpleados = empleados.reduce((acc, empleado) => acc + empleado.salario, 0);

  // Calcular el número total de proyectos
  const totalProyectos = proyectos.length;

  // Calcular el número total de empleados
  const totalEmpleados = empleados.length;

  // Datos para el gráfico de ingresos vs gastos
  const dataIngresosGastos = [
    { name: 'Ingresos', value: ingresosPorProyecto },
    { name: 'Gastos Variables', value: totalGastosVariables },
    { name: 'Salarios', value: salarioTotalEmpleados },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Análisis Financiero</h1>
      <p className="text-muted-foreground">
        Visualización de datos financieros clave para la toma de decisiones
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CircleDollarSign className="w-5 h-5" />
              Ingresos Totales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{ingresosPorProyecto.toFixed(2)}</div>
            <p className="text-sm text-muted-foreground">
              Ingresos totales generados por proyectos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Gastos Variables Totales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{totalGastosVariables.toFixed(2)}</div>
            <p className="text-sm text-muted-foreground">
              Gastos variables totales de la empresa
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Salario Total Empleados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{salarioTotalEmpleados.toFixed(2)}</div>
            <p className="text-sm text-muted-foreground">
              Salario total pagado a los empleados
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Ingresos vs Gastos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataIngresosGastos}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `€${value.toFixed(2)}`} />
                  <Legend />
                  <Bar dataKey="value" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="w-5 h-5" />
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
                          label={({ categoria, total }) => `${categoria}: €${total.toFixed(0)}`}
                        >
                          {dataGastosVariablesPorCategoria.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value: number) => [`€${value.toFixed(2)}`, 'Total']}
                          labelFormatter={(label) => `Categoría: ${label}`}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
      </div>
    </div>
  );
};

export default AnalisisFinanciero;
