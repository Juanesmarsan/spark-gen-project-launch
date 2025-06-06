import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/MetricCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useProyectos } from "@/hooks/useProyectos";
import { useEmpleados } from "@/hooks/useEmpleados";
import { useGastosFijos } from "@/hooks/useGastosFijos";
import { useVehiculosGastos } from "@/hooks/useVehiculosGastos";
import { useCalculosBeneficios } from "@/hooks/useCalculosBeneficios";
import { Euro, TrendingUp, Building, Percent, Calendar, Users, Clock, BarChart3, UserCheck, PieChart } from "lucide-react";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Legend, LineChart, Line, ComposedChart } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { generarCalendarioMesPuro } from "@/utils/calendarioUtils";

const AnalisisFinanciero = () => {
  const { proyectos } = useProyectos();
  const { empleados } = useEmpleados();
  const { gastosFijos, calcularResumen } = useGastosFijos();
  const { gastosVehiculos, getTotalGastosPorMes } = useVehiculosGastos();
  const { calcularBeneficioNeto, calcularMargenProyecto, calcularAnalisisMensual, calcularBeneficioBrutoAdministracion, calcularBeneficioBrutoPresupuesto, calcularGastosTotales } = useCalculosBeneficios();
  
  const [añoSeleccionado, setAñoSeleccionado] = useState(new Date().getFullYear());
  const [vistaActual, setVistaActual] = useState<'general' | 'mensual' | 'obras' | 'trabajadores' | 'gastos'>('general');

  // Calcular métricas globales
  const proyectosActivos = proyectos.filter(p => p.estado === 'activo');
  const totalBeneficioNeto = proyectos.reduce((total, proyecto) => 
    total + calcularBeneficioNeto(proyecto), 0
  );
  
  const margenPromedio = proyectos.length > 0 
    ? proyectos.reduce((total, proyecto) => 
        total + calcularMargenProyecto(proyecto), 0
      ) / proyectos.length 
    : 0;

  const proyectosPorPresupuesto = proyectos.filter(p => p.tipo === 'presupuesto');
  const proyectosPorAdministracion = proyectos.filter(p => p.tipo === 'administracion');

  // Datos mensuales
  const datosMensuales = calcularAnalisisMensual(proyectos, añoSeleccionado);
  const beneficioNetoAnual = datosMensuales.reduce((sum, mes) => sum + mes.beneficioNeto, 0);

  // Datos para gráficos de obras
  const datosObras = proyectos.map(proyecto => {
    const beneficioBruto = proyecto.tipo === 'administracion' 
      ? (proyecto.certificacionReal || calcularBeneficioBrutoAdministracion(proyecto))
      : calcularBeneficioBrutoPresupuesto(proyecto);
    const gastos = calcularGastosTotales(proyecto);
    
    return {
      nombre: proyecto.nombre,
      ciudad: proyecto.ciudad,
      tipo: proyecto.tipo,
      ingresos: beneficioBruto,
      gastos: gastos,
      beneficio: beneficioBruto - gastos,
      margen: beneficioBruto > 0 ? ((beneficioBruto - gastos) / beneficioBruto) * 100 : 0
    };
  });

  // Datos de gastos fijos y variables
  const resumenGastosFijos = calcularResumen();
  const fechaActual = new Date();
  const mesActual = fechaActual.getMonth();
  const añoActual = fechaActual.getFullYear();
  
  const totalGastosVehiculos = getTotalGastosPorMes(añoActual, mesActual);
  const gastosEmpleadosDelMes = empleados.flatMap(empleado => 
    (empleado.gastosVariables || [])
      .filter(gasto => {
        const fechaGasto = new Date(gasto.fecha);
        return fechaGasto.getFullYear() === añoActual && fechaGasto.getMonth() === mesActual;
      })
  ).reduce((total, gasto) => total + gasto.importe, 0);

  // Cálculo del mínimo viable anual
  const gastosFijosMensuales = resumenGastosFijos.totalBruto;
  const gastosVariablesMensuales = totalGastosVehiculos + gastosEmpleadosDelMes + 
    proyectos.reduce((sum, proyecto) => {
      return sum + (proyecto.gastosVariables?.reduce((catSum, g) => catSum + g.importe, 0) || 0);
    }, 0);
  
  const gastosTotalesMensuales = gastosFijosMensuales + gastosVariablesMensuales;
  const gastosTotalesAnuales = gastosTotalesMensuales * 12;
  
  // Considerando un margen de seguridad del 20% y margen de beneficio del 15%
  const margenSeguridad = 0.20;
  const margenBeneficio = 0.15;
  const facturacionMinimaViable = gastosTotalesAnuales * (1 + margenSeguridad + margenBeneficio);

  // Datos para gráficos de gastos fijos mejorados
  const datosGastosFijos = gastosFijos.map(gasto => ({
    concepto: gasto.concepto.length > 15 ? gasto.concepto.substring(0, 15) + "..." : gasto.concepto,
    conceptoCompleto: gasto.concepto,
    importe: gasto.totalBruto,
    baseImponible: gasto.baseImponible,
    tieneIva: gasto.tieneIva,
    iva: gasto.iva || 0
  })).sort((a, b) => b.importe - a.importe);

  // Datos para gráfico de gastos variables mejorados
  const datosGastosVariables = [
    {
      categoria: "Vehículos",
      importe: totalGastosVehiculos,
      color: "#3b82f6",
      porcentaje: 0
    },
    {
      categoria: "Empleados",
      importe: gastosEmpleadosDelMes,
      color: "#8b5cf6",
      porcentaje: 0
    },
    {
      categoria: "Material",
      importe: proyectos.reduce((sum, proyecto) => {
        return sum + (proyecto.gastosVariables?.filter(g => g.categoria === 'material').reduce((catSum, g) => catSum + g.importe, 0) || 0);
      }, 0),
      color: "#10b981",
      porcentaje: 0
    },
    {
      categoria: "Otros",
      importe: proyectos.reduce((sum, proyecto) => {
        return sum + (proyecto.gastosVariables?.filter(g => g.categoria === 'otro').reduce((catSum, g) => catSum + g.importe, 0) || 0);
      }, 0),
      color: "#f59e0b",
      porcentaje: 0
    }
  ].filter(item => item.importe > 0);

  // Calcular porcentajes
  const totalGastosVariables = datosGastosVariables.reduce((sum, item) => sum + item.importe, 0);
  datosGastosVariables.forEach(item => {
    item.porcentaje = totalGastosVariables > 0 ? (item.importe / totalGastosVariables) * 100 : 0;
  });

  // Datos comparativos gastos fijos vs variables
  const datosComparativos = [
    {
      tipo: "Gastos Fijos",
      importe: gastosFijosMensuales,
      porcentaje: gastosTotalesMensuales > 0 ? (gastosFijosMensuales / gastosTotalesMensuales) * 100 : 0,
      color: "#ef4444"
    },
    {
      tipo: "Gastos Variables",
      importe: gastosVariablesMensuales,
      porcentaje: gastosTotalesMensuales > 0 ? (gastosVariablesMensuales / gastosTotalesMensuales) * 100 : 0,
      color: "#3b82f6"
    }
  ];

  // Calcular rendimiento de trabajadores
  const calcularRendimientoTrabajador = (empleadoId: number) => {
    const añoActual = new Date().getFullYear();
    const fechaActual = new Date();
    let diasTrabajados = 0;
    let diasVacaciones = 0;
    let diasAusencias = 0;
    let horasReales = 0;

    // Iterar por todos los meses del año
    for (let mes = 1; mes <= 12; mes++) {
      if (mes > fechaActual.getMonth() + 1) break; // No procesar meses futuros
      
      const calendario = generarCalendarioMesPuro(empleadoId, mes, añoActual);
      
      calendario.dias.forEach(dia => {
        if (dia.tipo === 'laborable' || dia.tipo === 'sabado') {
          if (dia.ausencia) {
            if (dia.ausencia.tipo === 'vacaciones') {
              diasVacaciones++;
            } else if (['baja_medica', 'baja_laboral', 'baja_personal'].includes(dia.ausencia.tipo)) {
              diasAusencias++;
            }
          } else {
            diasTrabajados++;
            horasReales += dia.horasReales || 0;
          }
        }
      });
    }

    return {
      diasTrabajados,
      diasVacaciones,
      diasAusencias,
      horasReales,
      eficiencia: diasTrabajados > 0 ? (horasReales / (diasTrabajados * 8)) * 100 : 0
    };
  };

  const datosRendimiento = empleados.filter(e => e.activo).map(empleado => {
    const rendimiento = calcularRendimientoTrabajador(empleado.id);
    const proyectosAsignados = proyectos.filter(p => 
      p.trabajadoresAsignados.some(t => t.id === empleado.id)
    );

    return {
      ...empleado,
      ...rendimiento,
      proyectosAsignados: proyectosAsignados.length
    };
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  const chartConfig = {
    ingresos: {
      label: "Ingresos",
      color: "#22c55e",
    },
    gastos: {
      label: "Gastos",
      color: "#ef4444",
    },
    beneficio: {
      label: "Beneficio",
      color: "#3b82f6",
    },
    importe: {
      label: "Importe",
      color: "#3b82f6",
    },
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Análisis Financiero</h1>
        <div className="flex gap-2">
          <Button
            variant={vistaActual === 'general' ? 'default' : 'outline'}
            onClick={() => setVistaActual('general')}
          >
            Vista General
          </Button>
          <Button
            variant={vistaActual === 'obras' ? 'default' : 'outline'}
            onClick={() => setVistaActual('obras')}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Por Obras
          </Button>
          <Button
            variant={vistaActual === 'gastos' ? 'default' : 'outline'}
            onClick={() => setVistaActual('gastos')}
          >
            <PieChart className="w-4 h-4 mr-2" />
            Gastos
          </Button>
          <Button
            variant={vistaActual === 'trabajadores' ? 'default' : 'outline'}
            onClick={() => setVistaActual('trabajadores')}
          >
            <UserCheck className="w-4 h-4 mr-2" />
            Rendimiento
          </Button>
          <Button
            variant={vistaActual === 'mensual' ? 'default' : 'outline'}
            onClick={() => setVistaActual('mensual')}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Por Mes
          </Button>
        </div>
      </div>

      {vistaActual === 'general' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Beneficio Neto Total"
              value={`${totalBeneficioNeto.toLocaleString()}€`}
              icon="💰"
              color="green"
            />
            <MetricCard
              title="Margen Promedio"
              value={`${margenPromedio.toFixed(1)}%`}
              icon="📊"
              color="blue"
            />
            <MetricCard
              title="Proyectos Activos"
              value={proyectosActivos.length.toString()}
              icon="🏗️"
              color="purple"
            />
            <MetricCard
              title="Total Proyectos"
              value={proyectos.length.toString()}
              icon="📈"
              color="green"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Proyectos por Tipo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Por Presupuesto ({proyectosPorPresupuesto.length})</h4>
                    <div className="space-y-1">
                      {proyectosPorPresupuesto.map((proyecto, index) => (
                        <div key={proyecto.id} className="text-sm flex justify-between">
                          <span>{index + 1}. {proyecto.nombre}</span>
                          <span className="text-gray-500">{proyecto.ciudad}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Por Administración ({proyectosPorAdministracion.length})</h4>
                    <div className="space-y-1">
                      {proyectosPorAdministracion.map((proyecto, index) => (
                        <div key={proyecto.id} className="text-sm flex justify-between">
                          <span>{index + 1}. {proyecto.nombre}</span>
                          <span className="text-gray-500">{proyecto.ciudad}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Rentabilidad por Proyecto</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {proyectos.map((proyecto) => {
                    const beneficio = calcularBeneficioNeto(proyecto);
                    const margen = calcularMargenProyecto(proyecto);
                    
                    return (
                      <div key={proyecto.id} className="flex justify-between items-center p-2 border rounded">
                        <div>
                          <p className="font-medium text-sm">{proyecto.nombre}</p>
                          <p className="text-xs text-gray-500">{proyecto.ciudad}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-sm">{beneficio.toLocaleString()}€</p>
                          <Badge 
                            className={
                              margen >= 20 ? "bg-green-100 text-green-800" :
                              margen >= 10 ? "bg-yellow-100 text-yellow-800" :
                              "bg-red-100 text-red-800"
                            }
                          >
                            {margen.toFixed(1)}%
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                  {proyectos.length === 0 && (
                    <p className="text-center text-gray-500 py-4">No hay proyectos para analizar</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {vistaActual === 'gastos' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <MetricCard
              title="Gastos Fijos Mensuales"
              value={`${gastosFijosMensuales.toLocaleString()}€`}
              icon="📋"
              color="red"
            />
            <MetricCard
              title="Gastos Variables Mensuales"
              value={`${gastosVariablesMensuales.toLocaleString()}€`}
              icon="📊"
              color="blue"
            />
            <MetricCard
              title="Total Gastos Anuales"
              value={`${gastosTotalesAnuales.toLocaleString()}€`}
              icon="💰"
              color="purple"
            />
            <MetricCard
              title="Facturación Mínima Viable"
              value={`${facturacionMinimaViable.toLocaleString()}€`}
              icon="🎯"
              color="green"
            />
            <MetricCard
              title="Coeficiente por Operario"
              value={`${resumenGastosFijos.coeficienteEmpresa.toLocaleString()}€`}
              icon="👷"
              color="blue"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribución Gastos Fijos vs Variables</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={datosComparativos}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="importe"
                        label={({ tipo, porcentaje }) => `${tipo} ${porcentaje.toFixed(0)}%`}
                      >
                        {datosComparativos.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-white p-3 border rounded-lg shadow-lg">
                                <p className="font-medium text-gray-900">{data.tipo}</p>
                                <p className="text-lg font-bold" style={{ color: data.color }}>
                                  {data.importe.toLocaleString()}€
                                </p>
                                <p className="text-sm text-gray-600">
                                  {data.porcentaje.toFixed(1)}% del total
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Análisis de Viabilidad Económica</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-red-50 border border-red-200 rounded">
                    <h4 className="font-semibold text-red-800 mb-2">Gastos Totales Anuales</h4>
                    <p className="text-2xl font-bold text-red-600">{gastosTotalesAnuales.toLocaleString()}€</p>
                    <p className="text-sm text-red-600">Mínimo para cubrir gastos</p>
                  </div>
                  
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
                    <h4 className="font-semibold text-yellow-800 mb-2">Con Margen de Seguridad (20%)</h4>
                    <p className="text-xl font-bold text-yellow-600">
                      {(gastosTotalesAnuales * 1.20).toLocaleString()}€
                    </p>
                  </div>
                  
                  <div className="p-4 bg-green-50 border border-green-200 rounded">
                    <h4 className="font-semibold text-green-800 mb-2">Facturación Mínima Viable</h4>
                    <p className="text-2xl font-bold text-green-600">{facturacionMinimaViable.toLocaleString()}€</p>
                    <p className="text-sm text-green-600">Incluye 20% seguridad + 15% beneficio</p>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                    <h4 className="font-semibold text-blue-800 mb-2">Objetivo Mensual</h4>
                    <p className="text-xl font-bold text-blue-600">
                      {(facturacionMinimaViable / 12).toLocaleString()}€
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Top 10 Gastos Fijos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={datosGastosFijos.slice(0, 10)} 
                      margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                      layout="horizontal"
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        type="number"
                        tickFormatter={(value) => `${(value / 1000).toFixed(0)}k€`}
                        fontSize={12}
                      />
                      <YAxis 
                        type="category"
                        dataKey="concepto" 
                        width={120}
                        fontSize={10}
                        tick={{ textAnchor: 'end' }}
                      />
                      <ChartTooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-white p-4 border rounded-lg shadow-lg max-w-xs">
                                <p className="font-semibold text-gray-900 mb-2">{data.conceptoCompleto}</p>
                                <div className="space-y-1">
                                  <p className="text-sm">
                                    <span className="font-medium text-blue-600">Total: </span>
                                    <span className="font-bold">{data.importe.toLocaleString()}€</span>
                                  </p>
                                  <p className="text-sm">
                                    <span className="font-medium text-green-600">Base: </span>
                                    {data.baseImponible.toLocaleString()}€
                                  </p>
                                  {data.tieneIva && (
                                    <p className="text-sm">
                                      <span className="font-medium text-orange-600">IVA: </span>
                                      {data.iva.toLocaleString()}€
                                    </p>
                                  )}
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar 
                        dataKey="importe" 
                        fill="#ef4444" 
                        name="Importe Total"
                        radius={[0, 4, 4, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Gastos Variables por Categoría
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={datosGastosVariables}
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="importe"
                        label={({ categoria, porcentaje, importe }) => 
                          importe > 0 ? `${categoria}\n${porcentaje.toFixed(0)}%` : ''
                        }
                        labelLine={false}
                      >
                        {datosGastosVariables.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-white p-4 border rounded-lg shadow-lg">
                                <p className="font-semibold text-gray-900 mb-2">{data.categoria}</p>
                                <p className="text-lg font-bold" style={{ color: data.color }}>
                                  {data.importe.toLocaleString()}€
                                </p>
                                <p className="text-sm text-gray-600">
                                  {data.porcentaje.toFixed(1)}% del total
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Legend 
                        verticalAlign="bottom" 
                        height={36}
                        formatter={(value, entry) => `${value}: ${entry.payload.importe.toLocaleString()}€`}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Detalle Completo de Gastos Fijos</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Concepto</TableHead>
                    <TableHead className="text-right">Total Bruto</TableHead>
                    <TableHead className="text-right">Base Imponible</TableHead>
                    <TableHead className="text-center">IVA</TableHead>
                    <TableHead className="text-right">Importe IVA</TableHead>
                    <TableHead className="text-right">% del Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gastosFijos.sort((a, b) => b.totalBruto - a.totalBruto).map((gasto) => (
                    <TableRow key={gasto.id}>
                      <TableCell className="font-medium">{gasto.concepto}</TableCell>
                      <TableCell className="text-right font-medium">{gasto.totalBruto.toLocaleString()}€</TableCell>
                      <TableCell className="text-right">{gasto.baseImponible.toLocaleString()}€</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={gasto.tieneIva ? "default" : "secondary"}>
                          {gasto.tieneIva ? "Sí" : "No"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {gasto.iva ? `${gasto.iva.toLocaleString()}€` : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline">
                          {((gasto.totalBruto / gastosFijosMensuales) * 100).toFixed(1)}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}

      {vistaActual === 'obras' && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Análisis Financiero por Obras</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={datosObras}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nombre" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="ingresos" fill="#22c55e" name="Ingresos" />
                    <Bar dataKey="gastos" fill="#ef4444" name="Gastos" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Detalle de Ingresos y Gastos por Obra</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Obra</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="text-right">Ingresos</TableHead>
                    <TableHead className="text-right">Gastos</TableHead>
                    <TableHead className="text-right">Beneficio</TableHead>
                    <TableHead className="text-right">Margen</TableHead>
                    <TableHead>Trabajadores</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {datosObras.map((obra) => {
                    const proyecto = proyectos.find(p => p.nombre === obra.nombre);
                    return (
                      <TableRow key={obra.nombre}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{obra.nombre}</p>
                            <p className="text-sm text-gray-500">{obra.ciudad}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {obra.tipo === 'presupuesto' ? 'Presupuesto' : 'Administración'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium text-green-600">
                          {obra.ingresos.toLocaleString()}€
                        </TableCell>
                        <TableCell className="text-right font-medium text-red-600">
                          {obra.gastos.toLocaleString()}€
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          <span className={obra.beneficio >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {obra.beneficio.toLocaleString()}€
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className={
                            obra.margen >= 20 ? "bg-green-100 text-green-800" :
                            obra.margen >= 10 ? "bg-yellow-100 text-yellow-800" :
                            "bg-red-100 text-red-800"
                          }>
                            {obra.margen.toFixed(1)}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {proyecto?.trabajadoresAsignados.map(trabajador => (
                              <div key={trabajador.id} className="text-xs">
                                {trabajador.nombre} {trabajador.apellidos}
                              </div>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Conceptos de Gastos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['material', 'transporte', 'herramienta', 'otro'].map(categoria => {
                    const totalCategoria = proyectos.reduce((sum, proyecto) => {
                      return sum + (proyecto.gastosVariables?.filter(g => g.categoria === categoria).reduce((catSum, g) => catSum + g.importe, 0) || 0);
                    }, 0);
                    
                    if (totalCategoria === 0) return null;
                    
                    return (
                      <div key={categoria} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="capitalize font-medium">{categoria}</span>
                        <span className="font-bold">{totalCategoria.toLocaleString()}€</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribución de Gastos</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <RechartsPieChart>
                    <Pie
                      data={['material', 'transporte', 'herramienta', 'otro'].map(categoria => {
                        const total = proyectos.reduce((sum, proyecto) => {
                          return sum + (proyecto.gastosVariables?.filter(g => g.categoria === categoria).reduce((catSum, g) => catSum + g.importe, 0) || 0);
                        }, 0);
                        return {
                          name: categoria.charAt(0).toUpperCase() + categoria.slice(1),
                          value: total
                        };
                      }).filter(item => item.value > 0)}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {['material', 'transporte', 'herramienta', 'otro'].map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${Number(value).toLocaleString()}€`, 'Importe']} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {vistaActual === 'trabajadores' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <MetricCard
              title="Trabajadores Activos"
              value={datosRendimiento.length.toString()}
              icon="👥"
              color="blue"
            />
            <MetricCard
              title="Promedio Horas/Mes"
              value={`${(datosRendimiento.reduce((sum, t) => sum + t.horasReales, 0) / Math.max(datosRendimiento.length, 1) / (new Date().getMonth() + 1)).toFixed(0)}h`}
              icon="⏰"
              color="green"
            />
            <MetricCard
              title="Eficiencia Promedio"
              value={`${(datosRendimiento.reduce((sum, t) => sum + t.eficiencia, 0) / Math.max(datosRendimiento.length, 1)).toFixed(1)}%`}
              icon="📊"
              color="purple"
            />
            <MetricCard
              title="Total Días Vacaciones"
              value={datosRendimiento.reduce((sum, t) => sum + t.diasVacaciones, 0).toString()}
              icon="🏖️"
              color="blue"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Rendimiento de Trabajadores</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Trabajador</TableHead>
                    <TableHead>Departamento</TableHead>
                    <TableHead className="text-right">Días Trabajados</TableHead>
                    <TableHead className="text-right">Vacaciones</TableHead>
                    <TableHead className="text-right">Ausencias</TableHead>
                    <TableHead className="text-right">Horas Reales</TableHead>
                    <TableHead className="text-right">Eficiencia</TableHead>
                    <TableHead>Proyectos</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {datosRendimiento.map((trabajador) => (
                    <TableRow key={trabajador.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{trabajador.nombre} {trabajador.apellidos}</p>
                          <p className="text-sm text-gray-500">{trabajador.categoria}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{trabajador.departamento}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {trabajador.diasTrabajados}
                      </TableCell>
                      <TableCell className="text-right">
                        {trabajador.diasVacaciones}
                      </TableCell>
                      <TableCell className="text-right">
                        {trabajador.diasAusencias}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {trabajador.horasReales.toLocaleString()}h
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge className={
                          trabajador.eficiencia >= 90 ? "bg-green-100 text-green-800" :
                          trabajador.eficiencia >= 75 ? "bg-yellow-100 text-yellow-800" :
                          "bg-red-100 text-red-800"
                        }>
                          {trabajador.eficiencia.toFixed(1)}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {trabajador.proyectosAsignados} proyecto{trabajador.proyectosAsignados !== 1 ? 's' : ''}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}

      {vistaActual === 'mensual' && (
        <>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold">Análisis Mensual {añoSeleccionado}</h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAñoSeleccionado(añoSeleccionado - 1)}
                >
                  {añoSeleccionado - 1}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAñoSeleccionado(añoSeleccionado + 1)}
                >
                  {añoSeleccionado + 1}
                </Button>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-600">
                {beneficioNetoAnual.toLocaleString()}€
              </p>
              <p className="text-sm text-gray-600">Beneficio Neto Anual</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Evolución Mensual</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mes</TableHead>
                    <TableHead className="text-right">Beneficio Bruto</TableHead>
                    <TableHead className="text-right">Gastos</TableHead>
                    <TableHead className="text-right">Beneficio Neto</TableHead>
                    <TableHead className="text-right">Margen</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {datosMensuales.map((mes) => (
                    <TableRow key={mes.mes}>
                      <TableCell className="font-medium capitalize">
                        {mes.nombreMes}
                      </TableCell>
                      <TableCell className="text-right">
                        {mes.beneficioBruto.toLocaleString()}€
                      </TableCell>
                      <TableCell className="text-right text-red-600">
                        -{mes.gastos.toLocaleString()}€
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        <span className={mes.beneficioNeto >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {mes.beneficioNeto.toLocaleString()}€
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge 
                          className={
                            mes.margen >= 20 ? "bg-green-100 text-green-800" :
                            mes.margen >= 10 ? "bg-yellow-100 text-yellow-800" :
                            "bg-red-100 text-red-800"
                          }
                        >
                          {mes.margen.toFixed(1)}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard
              title="Mejor Mes"
              value={`${Math.max(...datosMensuales.map(m => m.beneficioNeto)).toLocaleString()}€`}
              icon="🏆"
              color="green"
            />
            <MetricCard
              title="Promedio Mensual"
              value={`${(beneficioNetoAnual / 12).toLocaleString()}€`}
              icon="📊"
              color="blue"
            />
            <MetricCard
              title="Margen Promedio"
              value={`${(datosMensuales.reduce((sum, m) => sum + m.margen, 0) / 12).toFixed(1)}%`}
              icon="📈"
              color="purple"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default AnalisisFinanciero;
