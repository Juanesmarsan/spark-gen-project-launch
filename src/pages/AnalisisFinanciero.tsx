
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useGastosVariables } from '@/hooks/useGastosVariables';
import { useProyectos } from '@/hooks/useProyectos';
import { useEmpleados } from '@/hooks/useEmpleados';
import { useCalculosBeneficios } from '@/hooks/useCalculosBeneficios';
import { useGastosFijos } from '@/hooks/useGastosFijos';
import { CircleDollarSign, Users, BarChart3, TrendingUp, PieChart as PieChartIcon, Calculator } from "lucide-react";

const AnalisisFinanciero = () => {
  const { gastosVariables } = useGastosVariables();
  const { proyectos } = useProyectos();
  const { empleados } = useEmpleados();
  const { gastosFijos } = useGastosFijos();
  const {
    calcularBeneficioBrutoAdministracion,
    calcularBeneficioBrutoPresupuesto
  } = useCalculosBeneficios();

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

  // Calcular gastos fijos totales anuales
  const totalGastosFijosAnual = gastosFijos.reduce((total, gasto) => {
    const importeAnual = gasto.frecuencia === 'mensual' 
      ? gasto.importe * 12 
      : gasto.frecuencia === 'trimestral' 
        ? gasto.importe * 4 
        : gasto.frecuencia === 'semestral' 
          ? gasto.importe * 2 
          : gasto.importe;
    return total + importeAnual;
  }, 0);

  // Calcular el total de ingresos por proyecto
  const ingresosPorProyecto = proyectos.reduce((acc, proyecto) => {
    const ingresoBruto = proyecto.tipo === 'administracion' 
      ? calcularBeneficioBrutoAdministracion(proyecto)
      : calcularBeneficioBrutoPresupuesto(proyecto);
    return acc + ingresoBruto;
  }, 0);

  // Calcular el salario total de los empleados
  const salarioTotalEmpleados = empleados.reduce((acc, empleado) => acc + (empleado.salarioActual || 0), 0);

  // Calcular salarios anuales
  const salarioAnualEmpleados = salarioTotalEmpleados * 12;

  // Calcular el mínimo viable anual
  const minimoViableAnual = totalGastosFijosAnual + salarioAnualEmpleados + totalGastosVariables;

  // Top 10 gastos fijos
  const top10GastosFijos = gastosFijos
    .map(gasto => ({
      descripcion: gasto.descripcion,
      importe: gasto.frecuencia === 'mensual' 
        ? gasto.importe * 12 
        : gasto.frecuencia === 'trimestral' 
          ? gasto.importe * 4 
          : gasto.frecuencia === 'semestral' 
            ? gasto.importe * 2 
            : gasto.importe,
      fill: `hsl(${Math.random() * 360}, 70%, 50%)`
    }))
    .sort((a, b) => b.importe - a.importe)
    .slice(0, 10);

  // Datos para el gráfico de ingresos vs gastos
  const dataIngresosGastos = [
    { name: 'Ingresos', value: ingresosPorProyecto },
    { name: 'Gastos Variables', value: totalGastosVariables },
    { name: 'Gastos Fijos', value: totalGastosFijosAnual },
    { name: 'Salarios', value: salarioAnualEmpleados },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Análisis Financiero</h1>
      <p className="text-muted-foreground">
        Visualización de datos financieros clave para la toma de decisiones
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
              Gastos Variables
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
              Salarios Anuales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{salarioAnualEmpleados.toFixed(2)}</div>
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
            <div className="text-2xl font-bold text-red-700">€{minimoViableAnual.toFixed(2)}</div>
            <p className="text-sm text-red-600">
              Facturación mínima necesaria para cubrir gastos
            </p>
          </CardContent>
        </Card>
      </div>

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

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Desglose del Mínimo Viable</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="font-medium">Gastos Fijos Anuales:</span>
                <span className="font-bold text-blue-700">€{totalGastosFijosAnual.toLocaleString('es-ES', { maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="font-medium">Salarios Anuales:</span>
                <span className="font-bold text-green-700">€{salarioAnualEmpleados.toLocaleString('es-ES', { maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                <span className="font-medium">Gastos Variables:</span>
                <span className="font-bold text-yellow-700">€{totalGastosVariables.toLocaleString('es-ES', { maximumFractionDigits: 2 })}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between items-center p-3 bg-red-100 rounded-lg">
                  <span className="font-bold text-lg">TOTAL MÍNIMO:</span>
                  <span className="font-bold text-xl text-red-700">€{minimoViableAnual.toLocaleString('es-ES', { maximumFractionDigits: 2 })}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Este es el mínimo que la empresa debe facturar anualmente para cubrir todos los gastos fijos, salarios y gastos variables actuales.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalisisFinanciero;
