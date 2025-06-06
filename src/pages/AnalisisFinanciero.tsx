
import React from 'react';
import { useGastosVariables } from '@/hooks/useGastosVariables';
import { useProyectos } from '@/hooks/useProyectos';
import { useEmpleados } from '@/hooks/useEmpleados';
import { useCalculosBeneficios } from '@/hooks/useCalculosBeneficios';
import { useGastosFijos } from '@/hooks/useGastosFijos';
import { useGastosPersonalGerencia } from '@/hooks/useGastosPersonalGerencia';
import { MetricasResumen } from '@/components/analisis/MetricasResumen';
import { GraficosFinancieros } from '@/components/analisis/GraficosFinancieros';
import { DesgloseMinimoViable } from '@/components/analisis/DesgloseMinimoViable';

const AnalisisFinanciero = () => {
  const { gastosVariables } = useGastosVariables();
  const { proyectos } = useProyectos();
  const { empleados } = useEmpleados();
  const { calcularResumenSinPersonalGerencia } = useGastosFijos();
  const { gastosFijosSinPersonalGerencia } = useGastosPersonalGerencia();
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

  // Usar gastos fijos sin personal de gerencia para evitar duplicaciones
  const resumenGastosFijos = calcularResumenSinPersonalGerencia();
  const totalGastosFijosAnual = resumenGastosFijos.totalBruto * 12;

  // Calcular el total de ingresos por proyecto
  const ingresosPorProyecto = proyectos.reduce((acc, proyecto) => {
    const ingresoBruto = proyecto.tipo === 'administracion' 
      ? calcularBeneficioBrutoAdministracion(proyecto)
      : calcularBeneficioBrutoPresupuesto(proyecto);
    return acc + ingresoBruto;
  }, 0);

  // Calcular el salario total de los empleados
  const salarioTotalEmpleados = empleados.reduce((acc, empleado) => acc + (empleado.salarioBruto || 0), 0);

  // Calcular salarios anuales
  const salarioAnualEmpleados = salarioTotalEmpleados * 12;

  // Calcular el mínimo viable anual
  const minimoViableAnual = totalGastosFijosAnual + salarioAnualEmpleados + totalGastosVariables;

  // Top 10 gastos fijos sin personal de gerencia
  const top10GastosFijos = gastosFijosSinPersonalGerencia
    .map(gasto => ({
      descripcion: gasto.concepto,
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

      <MetricasResumen
        ingresosTotales={ingresosPorProyecto}
        gastosVariables={totalGastosVariables}
        salariosAnuales={salarioAnualEmpleados}
        minimoViable={minimoViableAnual}
      />

      <GraficosFinancieros
        dataIngresosGastos={dataIngresosGastos}
        top10GastosFijos={top10GastosFijos}
        dataGastosVariablesPorCategoria={dataGastosVariablesPorCategoria}
      />

      <DesgloseMinimoViable
        gastosFijosAnuales={totalGastosFijosAnual}
        salariosAnuales={salarioAnualEmpleados}
        gastosVariables={totalGastosVariables}
        minimoViable={minimoViableAnual}
      />
    </div>
  );
};

export default AnalisisFinanciero;
