import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/MetricCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useProyectos } from "@/hooks/useProyectos";
import { useEmpleados } from "@/hooks/useEmpleados";
import { useCalculosBeneficios } from "@/hooks/useCalculosBeneficios";
import { Euro, TrendingUp, Building, Percent, Calendar, Users, Clock, BarChart3, UserCheck } from "lucide-react";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { generarCalendarioMesPuro } from "@/utils/calendarioUtils";

const AnalisisFinanciero = () => {
  const { proyectos } = useProyectos();
  const { empleados } = useEmpleados();
  const { calcularBeneficioNeto, calcularMargenProyecto, calcularAnalisisMensual, calcularBeneficioBrutoAdministracion, calcularBeneficioBrutoPresupuesto, calcularGastosTotales } = useCalculosBeneficios();
  
  const [añoSeleccionado, setAñoSeleccionado] = useState(new Date().getFullYear());
  const [vistaActual, setVistaActual] = useState<'general' | 'mensual' | 'obras' | 'trabajadores'>('general');

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
                  <PieChart>
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
                  </PieChart>
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
