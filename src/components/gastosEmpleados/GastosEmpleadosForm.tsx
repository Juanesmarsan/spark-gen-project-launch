
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, Plus, Trash2, Euro } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Empleado } from "@/types/empleado";
import { Proyecto } from "@/types/proyecto";
import { AsignacionProyectoEmpleado, GastoVariableEmpleadoProyecto } from "@/types/gastoEmpleado";
import { useGastosEmpleados } from "@/hooks/useGastosEmpleados";
import { useToast } from "@/hooks/use-toast";

interface GastosEmpleadosFormProps {
  empleados: Empleado[];
  proyectos: Proyecto[];
  onClose: () => void;
}

export const GastosEmpleadosForm = ({ empleados, proyectos, onClose }: GastosEmpleadosFormProps) => {
  const { registrarGastoEmpleadoProyecto, calcularCosteEmpleado, calcularDiasLaborales } = useGastosEmpleados();
  const { toast } = useToast();
  
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState<number | null>(null);
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState<number | null>(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date>(new Date());
  const [diasAsignados, setDiasAsignados] = useState<number>(1);
  const [horasExtras, setHorasExtras] = useState<number>(0);
  const [horasFestivas, setHorasFestivas] = useState<number>(0);
  const [gastosVariables, setGastosVariables] = useState<Omit<GastoVariableEmpleadoProyecto, 'id'>[]>([]);

  // Estado para nuevo gasto variable
  const [nuevoGasto, setNuevoGasto] = useState({
    tipo: 'dieta' as const,
    concepto: '',
    importe: 0,
    fecha: new Date(),
    descripcion: '',
    factura: ''
  });

  const mes = fechaSeleccionada.getMonth() + 1;
  const anio = fechaSeleccionada.getFullYear();
  const empleado = empleados.find(e => e.id === empleadoSeleccionado);
  const proyecto = proyectos.find(p => p.id === proyectoSeleccionado);

  // Calcular costes si tenemos empleado seleccionado
  const costeEmpleado = empleadoSeleccionado ? calcularCosteEmpleado(empleadoSeleccionado, mes, anio) : null;
  const diasLaboralesMes = calcularDiasLaborales(mes, anio);

  const handleAgregarGastoVariable = () => {
    if (!nuevoGasto.concepto || nuevoGasto.importe <= 0) {
      toast({
        title: "Error",
        description: "El concepto y el importe son obligatorios",
        variant: "destructive"
      });
      return;
    }

    setGastosVariables([...gastosVariables, { ...nuevoGasto }]);
    setNuevoGasto({
      tipo: 'dieta',
      concepto: '',
      importe: 0,
      fecha: new Date(),
      descripcion: '',
      factura: ''
    });
  };

  const handleEliminarGastoVariable = (index: number) => {
    setGastosVariables(gastosVariables.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!empleadoSeleccionado || !proyectoSeleccionado) {
      toast({
        title: "Error",
        description: "Debe seleccionar un empleado y un proyecto",
        variant: "destructive"
      });
      return;
    }

    if (diasAsignados <= 0 || diasAsignados > diasLaboralesMes) {
      toast({
        title: "Error",
        description: `Los días asignados deben estar entre 1 y ${diasLaboralesMes}`,
        variant: "destructive"
      });
      return;
    }

    const asignacion: AsignacionProyectoEmpleado = {
      empleadoId: empleadoSeleccionado,
      proyectoId: proyectoSeleccionado,
      mes,
      anio,
      diasAsignados,
      horasExtras,
      horasFestivas,
      gastos: gastosVariables
    };

    registrarGastoEmpleadoProyecto(asignacion);

    toast({
      title: "Gasto registrado",
      description: `Se ha registrado el gasto de ${empleado?.nombre} en el proyecto ${proyecto?.nombre}`,
    });

    onClose();
  };

  const calcularCostesPreview = () => {
    if (!costeEmpleado) return null;

    const salarioProrrateo = (costeEmpleado.salarioBrutoMes / diasLaboralesMes) * diasAsignados;
    const seguridadSocialProrrateo = (costeEmpleado.seguridadSocialEmpresaMes / diasLaboralesMes) * diasAsignados;
    const costeHorasExtras = horasExtras * (empleado?.precioHoraExtra || 0);
    const costeHorasFestivas = horasFestivas * (empleado?.precioHoraFestiva || 0);
    const totalGastosVariables = gastosVariables.reduce((total, gasto) => total + gasto.importe, 0);

    return {
      salarioProrrateo,
      seguridadSocialProrrateo,
      costeHorasExtras,
      costeHorasFestivas,
      totalGastosVariables,
      total: salarioProrrateo + seguridadSocialProrrateo + costeHorasExtras + costeHorasFestivas + totalGastosVariables
    };
  };

  const costesPreview = calcularCostesPreview();

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Registrar Gastos de Empleado en Proyecto</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="asignacion" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="asignacion">Asignación</TabsTrigger>
            <TabsTrigger value="gastos">Gastos Variables</TabsTrigger>
            <TabsTrigger value="resumen">Resumen</TabsTrigger>
          </TabsList>

          <TabsContent value="asignacion" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Empleado</Label>
                <Select value={empleadoSeleccionado?.toString() || ""} onValueChange={(value) => setEmpleadoSeleccionado(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar empleado" />
                  </SelectTrigger>
                  <SelectContent>
                    {empleados.filter(e => e.activo).map((empleado) => (
                      <SelectItem key={empleado.id} value={empleado.id.toString()}>
                        {empleado.nombre} {empleado.apellidos}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Proyecto</Label>
                <Select value={proyectoSeleccionado?.toString() || ""} onValueChange={(value) => setProyectoSeleccionado(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar proyecto" />
                  </SelectTrigger>
                  <SelectContent>
                    {proyectos.filter(p => p.estado === 'activo').map((proyecto) => (
                      <SelectItem key={proyecto.id} value={proyecto.id.toString()}>
                        {proyecto.nombre} - {proyecto.ciudad}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Mes/Año</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !fechaSeleccionada && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {fechaSeleccionada ? format(fechaSeleccionada, "MMMM yyyy", { locale: es }) : "Seleccionar mes"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={fechaSeleccionada}
                      onSelect={(date) => date && setFechaSeleccionada(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label>Días Laborales del Mes: {diasLaboralesMes}</Label>
                <p className="text-sm text-muted-foreground">
                  Días laborales calculados automáticamente (sin sábados ni domingos)
                </p>
              </div>

              <div>
                <Label>Días Asignados al Proyecto</Label>
                <Input
                  type="number"
                  min="1"
                  max={diasLaboralesMes}
                  value={diasAsignados}
                  onChange={(e) => setDiasAsignados(parseInt(e.target.value) || 1)}
                />
              </div>

              <div>
                <Label>Horas Extras</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.5"
                  value={horasExtras}
                  onChange={(e) => setHorasExtras(parseFloat(e.target.value) || 0)}
                />
                {empleado && (
                  <p className="text-sm text-muted-foreground">
                    Precio: {empleado.precioHoraExtra}€/hora
                  </p>
                )}
              </div>

              <div>
                <Label>Horas Festivas</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.5"
                  value={horasFestivas}
                  onChange={(e) => setHorasFestivas(parseFloat(e.target.value) || 0)}
                />
                {empleado && (
                  <p className="text-sm text-muted-foreground">
                    Precio: {empleado.precioHoraFestiva}€/hora
                  </p>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="gastos" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
              <div>
                <Label>Tipo de Gasto</Label>
                <Select value={nuevoGasto.tipo} onValueChange={(value: any) => setNuevoGasto({...nuevoGasto, tipo: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dieta">Dieta</SelectItem>
                    <SelectItem value="alojamiento">Alojamiento</SelectItem>
                    <SelectItem value="combustible">Combustible</SelectItem>
                    <SelectItem value="viaje">Viaje</SelectItem>
                    <SelectItem value="otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Concepto</Label>
                <Input
                  value={nuevoGasto.concepto}
                  onChange={(e) => setNuevoGasto({...nuevoGasto, concepto: e.target.value})}
                  placeholder="Descripción del gasto"
                />
              </div>

              <div>
                <Label>Importe (€)</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={nuevoGasto.importe}
                  onChange={(e) => setNuevoGasto({...nuevoGasto, importe: parseFloat(e.target.value) || 0})}
                />
              </div>

              <div>
                <Label>Fecha</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(nuevoGasto.fecha, "dd/MM/yyyy")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={nuevoGasto.fecha}
                      onSelect={(date) => date && setNuevoGasto({...nuevoGasto, fecha: date})}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="md:col-span-2">
                <Label>Descripción (opcional)</Label>
                <Textarea
                  value={nuevoGasto.descripcion}
                  onChange={(e) => setNuevoGasto({...nuevoGasto, descripcion: e.target.value})}
                  placeholder="Detalles adicionales del gasto"
                />
              </div>

              <div>
                <Label>Nº Factura (opcional)</Label>
                <Input
                  value={nuevoGasto.factura}
                  onChange={(e) => setNuevoGasto({...nuevoGasto, factura: e.target.value})}
                  placeholder="Número de factura"
                />
              </div>

              <div className="flex items-end">
                <Button onClick={handleAgregarGastoVariable} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Gasto
                </Button>
              </div>
            </div>

            {gastosVariables.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Gastos Variables Agregados:</h4>
                {gastosVariables.map((gasto, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{gasto.tipo.toUpperCase()}</Badge>
                        <span className="font-medium">{gasto.concepto}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {format(gasto.fecha, "dd/MM/yyyy")} - €{gasto.importe.toFixed(2)}
                      </div>
                      {gasto.descripcion && (
                        <div className="text-sm text-muted-foreground">{gasto.descripcion}</div>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEliminarGastoVariable(index)}
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="resumen" className="space-y-4">
            {costesPreview && empleado && proyecto ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Empleado</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="font-medium">{empleado.nombre} {empleado.apellidos}</p>
                      <p className="text-sm text-muted-foreground">Salario: €{empleado.salarioBruto}/mes</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Proyecto</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="font-medium">{proyecto.nombre}</p>
                      <p className="text-sm text-muted-foreground">{proyecto.ciudad}</p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Euro className="w-5 h-5" />
                      Desglose de Costes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span>Salario Prorrateado ({diasAsignados}/{diasLaboralesMes} días):</span>
                      <span className="font-medium">€{costesPreview.salarioProrrateo.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Seguridad Social Empresa:</span>
                      <span className="font-medium">€{costesPreview.seguridadSocialProrrateo.toFixed(2)}</span>
                    </div>
                    
                    {horasExtras > 0 && (
                      <div className="flex justify-between">
                        <span>Horas Extras ({horasExtras}h x €{empleado.precioHoraExtra}):</span>
                        <span className="font-medium">€{costesPreview.costeHorasExtras.toFixed(2)}</span>
                      </div>
                    )}
                    
                    {horasFestivas > 0 && (
                      <div className="flex justify-between">
                        <span>Horas Festivas ({horasFestivas}h x €{empleado.precioHoraFestiva}):</span>
                        <span className="font-medium">€{costesPreview.costeHorasFestivas.toFixed(2)}</span>
                      </div>
                    )}
                    
                    {gastosVariables.length > 0 && (
                      <div className="flex justify-between">
                        <span>Gastos Variables ({gastosVariables.length}):</span>
                        <span className="font-medium">€{costesPreview.totalGastosVariables.toFixed(2)}</span>
                      </div>
                    )}
                    
                    <div className="border-t pt-3">
                      <div className="flex justify-between text-lg font-bold">
                        <span>TOTAL:</span>
                        <span>€{costesPreview.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Complete la información en las pestañas anteriores para ver el resumen
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!empleadoSeleccionado || !proyectoSeleccionado}
          >
            Registrar Gastos
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
