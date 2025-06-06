import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, Calendar as CalendarIcon, Receipt, Car } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { GastoVehiculo, VehiculoCompleto } from "@/types/vehiculo";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const Vehiculos = () => {
  const [vehiculos, setVehiculos] = useState<VehiculoCompleto[]>([]);
  const [gastosVehiculos, setGastosVehiculos] = useState<GastoVehiculo[]>([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarFormularioGasto, setMostrarFormularioGasto] = useState(false);
  const [vehiculoEnEdicion, setVehiculoEnEdicion] = useState<VehiculoCompleto | null>(null);
  const [gastoEnEdicion, setGastoEnEdicion] = useState<GastoVehiculo | null>(null);

  const [nuevoVehiculo, setNuevoVehiculo] = useState({
    matricula: "",
    tipo: "",
    marca: "",
    modelo: "",
    caducidadITV: undefined as Date | undefined,
    caducidadSeguro: undefined as Date | undefined,
    kilometros: 0
  });

  const [nuevoGasto, setNuevoGasto] = useState({
    vehiculoId: 0,
    tipo: "" as 'ITV' | 'revision' | 'reparacion' | 'otro',
    concepto: "",
    fecha: undefined as Date | undefined,
    importe: 0,
    descripcion: "",
    factura: ""
  });

  // Cargar datos desde localStorage
  useEffect(() => {
    const vehiculosGuardados = localStorage.getItem('vehiculos');
    const gastosGuardados = localStorage.getItem('gastosVehiculos');
    
    if (vehiculosGuardados) {
      const vehiculosParseados = JSON.parse(vehiculosGuardados).map((v: any) => ({
        ...v,
        caducidadITV: new Date(v.caducidadITV),
        caducidadSeguro: new Date(v.caducidadSeguro),
        gastos: []
      }));
      setVehiculos(vehiculosParseados);
    } else {
      // Datos por defecto
      const vehiculosDefault: VehiculoCompleto[] = [
        {
          id: 1,
          matricula: "1234-ABC",
          tipo: "Furgoneta",
          marca: "Ford",
          modelo: "Transit",
          caducidadITV: new Date("2024-08-15"),
          caducidadSeguro: new Date("2024-12-31"),
          kilometros: 125000,
          asignado: false,
          gastos: []
        },
        {
          id: 2,
          matricula: "5678-DEF",
          tipo: "Camión",
          marca: "Mercedes",
          modelo: "Sprinter",
          caducidadITV: new Date("2024-11-20"),
          caducidadSeguro: new Date("2025-03-15"),
          kilometros: 89000,
          asignado: false,
          gastos: []
        }
      ];
      setVehiculos(vehiculosDefault);
    }

    if (gastosGuardados) {
      const gastosParseados = JSON.parse(gastosGuardados).map((g: any) => ({
        ...g,
        fecha: new Date(g.fecha)
      }));
      setGastosVehiculos(gastosParseados);
    }
  }, []);

  // Guardar en localStorage cuando cambien los datos
  useEffect(() => {
    if (vehiculos.length > 0) {
      localStorage.setItem('vehiculos', JSON.stringify(vehiculos));
    }
  }, [vehiculos]);

  useEffect(() => {
    if (gastosVehiculos.length > 0) {
      localStorage.setItem('gastosVehiculos', JSON.stringify(gastosVehiculos));
    }
  }, [gastosVehiculos]);

  const resetearFormulario = () => {
    setNuevoVehiculo({
      matricula: "",
      tipo: "",
      marca: "",
      modelo: "",
      caducidadITV: undefined,
      caducidadSeguro: undefined,
      kilometros: 0
    });
    setVehiculoEnEdicion(null);
  };

  const abrirFormularioEdicion = (vehiculo: VehiculoCompleto) => {
    setVehiculoEnEdicion(vehiculo);
    setNuevoVehiculo({
      matricula: vehiculo.matricula,
      tipo: vehiculo.tipo,
      marca: vehiculo.marca,
      modelo: vehiculo.modelo,
      caducidadITV: vehiculo.caducidadITV,
      caducidadSeguro: vehiculo.caducidadSeguro,
      kilometros: vehiculo.kilometros
    });
    setMostrarFormulario(true);
  };

  const abrirFormularioNuevo = () => {
    resetearFormulario();
    setMostrarFormulario(true);
  };

  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    resetearFormulario();
  };

  const guardarVehiculo = () => {
    if (nuevoVehiculo.matricula && nuevoVehiculo.tipo && nuevoVehiculo.marca && 
        nuevoVehiculo.modelo && nuevoVehiculo.caducidadITV && nuevoVehiculo.caducidadSeguro) {
      if (vehiculoEnEdicion) {
        // Editar vehículo existente
        setVehiculos(prev => prev.map(v => 
          v.id === vehiculoEnEdicion.id 
            ? { 
                ...v, 
                matricula: nuevoVehiculo.matricula,
                tipo: nuevoVehiculo.tipo,
                marca: nuevoVehiculo.marca,
                modelo: nuevoVehiculo.modelo,
                caducidadITV: nuevoVehiculo.caducidadITV!,
                caducidadSeguro: nuevoVehiculo.caducidadSeguro!,
                kilometros: nuevoVehiculo.kilometros
              }
            : v
        ));
      } else {
        // Agregar nuevo vehículo
        const nuevo: VehiculoCompleto = {
          id: Date.now(),
          matricula: nuevoVehiculo.matricula,
          tipo: nuevoVehiculo.tipo,
          marca: nuevoVehiculo.marca,
          modelo: nuevoVehiculo.modelo,
          caducidadITV: nuevoVehiculo.caducidadITV,
          caducidadSeguro: nuevoVehiculo.caducidadSeguro,
          kilometros: nuevoVehiculo.kilometros,
          asignado: false,
          gastos: []
        };
        setVehiculos(prev => [...prev, nuevo]);
      }
      cerrarFormulario();
    }
  };

  const eliminarVehiculo = (id: number) => {
    setVehiculos(prev => prev.filter(v => v.id !== id));
    // También eliminar gastos asociados
    setGastosVehiculos(prev => prev.filter(g => g.vehiculoId !== id));
  };

  // Funciones para gastos
  const resetearFormularioGasto = () => {
    setNuevoGasto({
      vehiculoId: 0,
      tipo: "" as 'ITV' | 'revision' | 'reparacion' | 'otro',
      concepto: "",
      fecha: undefined,
      importe: 0,
      descripcion: "",
      factura: ""
    });
    setGastoEnEdicion(null);
  };

  const abrirFormularioGasto = (vehiculoId?: number) => {
    resetearFormularioGasto();
    if (vehiculoId) {
      setNuevoGasto(prev => ({ ...prev, vehiculoId }));
    }
    setMostrarFormularioGasto(true);
  };

  const guardarGasto = () => {
    if (nuevoGasto.vehiculoId && nuevoGasto.tipo && nuevoGasto.concepto && 
        nuevoGasto.fecha && nuevoGasto.importe > 0) {
      if (gastoEnEdicion) {
        setGastosVehiculos(prev => prev.map(g =>
          g.id === gastoEnEdicion.id ? {
            ...g,
            tipo: nuevoGasto.tipo,
            concepto: nuevoGasto.concepto,
            fecha: nuevoGasto.fecha!,
            importe: nuevoGasto.importe,
            descripcion: nuevoGasto.descripcion,
            factura: nuevoGasto.factura
          } : g
        ));
      } else {
        const nuevoGastoCompleto: GastoVehiculo = {
          id: Date.now(),
          vehiculoId: nuevoGasto.vehiculoId,
          tipo: nuevoGasto.tipo,
          concepto: nuevoGasto.concepto,
          fecha: nuevoGasto.fecha!,
          importe: nuevoGasto.importe,
          descripcion: nuevoGasto.descripcion,
          factura: nuevoGasto.factura
        };
        setGastosVehiculos(prev => [...prev, nuevoGastoCompleto]);
      }
      setMostrarFormularioGasto(false);
      resetearFormularioGasto();
    }
  };

  const eliminarGasto = (id: number) => {
    setGastosVehiculos(prev => prev.filter(g => g.id !== id));
  };

  const esPróximoAVencer = (fecha: Date) => {
    const ahora = new Date();
    const unMes = new Date();
    unMes.setMonth(unMes.getMonth() + 1);
    return fecha <= unMes && fecha >= ahora;
  };

  const getGastosVehiculo = (vehiculoId: number) => {
    return gastosVehiculos.filter(g => g.vehiculoId === vehiculoId);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Flota de Vehículos</h1>
        <div className="flex gap-2">
          <Dialog open={mostrarFormularioGasto} onOpenChange={setMostrarFormularioGasto}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={() => abrirFormularioGasto()}>
                <Receipt className="w-4 h-4 mr-2" />
                Nuevo Gasto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {gastoEnEdicion ? 'Editar Gasto' : 'Nuevo Gasto de Vehículo'}
                </DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Vehículo</Label>
                  <Select value={nuevoGasto.vehiculoId.toString()} onValueChange={(value) => setNuevoGasto(prev => ({ ...prev, vehiculoId: parseInt(value) }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar vehículo" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehiculos.map((vehiculo) => (
                        <SelectItem key={vehiculo.id} value={vehiculo.id.toString()}>
                          {vehiculo.matricula} - {vehiculo.marca} {vehiculo.modelo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Tipo de Gasto</Label>
                  <Select value={nuevoGasto.tipo} onValueChange={(value: 'ITV' | 'revision' | 'reparacion' | 'otro') => setNuevoGasto(prev => ({ ...prev, tipo: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tipo de gasto" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ITV">ITV</SelectItem>
                      <SelectItem value="revision">Revisión</SelectItem>
                      <SelectItem value="reparacion">Reparación</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Concepto</Label>
                  <Input 
                    value={nuevoGasto.concepto}
                    onChange={(e) => setNuevoGasto(prev => ({ ...prev, concepto: e.target.value }))}
                    placeholder="Descripción del gasto"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Fecha</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {nuevoGasto.fecha ? format(nuevoGasto.fecha, "dd/MM/yyyy", { locale: es }) : "Seleccionar fecha"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={nuevoGasto.fecha}
                        onSelect={(fecha) => setNuevoGasto(prev => ({ ...prev, fecha }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>Importe (€)</Label>
                  <Input 
                    type="number"
                    step="0.01"
                    value={nuevoGasto.importe}
                    onChange={(e) => setNuevoGasto(prev => ({ ...prev, importe: parseFloat(e.target.value) || 0 }))}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Factura (opcional)</Label>
                  <Input 
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setNuevoGasto(prev => ({ ...prev, factura: file.name }));
                      }
                    }}
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Descripción (opcional)</Label>
                  <Textarea 
                    value={nuevoGasto.descripcion}
                    onChange={(e) => setNuevoGasto(prev => ({ ...prev, descripcion: e.target.value }))}
                    placeholder="Detalles adicionales del gasto"
                  />
                </div>
                <div className="flex gap-2 col-span-2">
                  <Button variant="outline" onClick={() => setMostrarFormularioGasto(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={guardarGasto}>
                    {gastoEnEdicion ? 'Guardar Cambios' : 'Registrar Gasto'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog open={mostrarFormulario} onOpenChange={setMostrarFormulario}>
            <DialogTrigger asChild>
              <Button onClick={abrirFormularioNuevo}>
                <Plus className="w-4 h-4 mr-2" />
                Registrar Vehículo
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {vehiculoEnEdicion ? 'Editar Vehículo' : 'Nuevo Vehículo'}
                </DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Matrícula</Label>
                  <Input 
                    value={nuevoVehiculo.matricula}
                    onChange={(e) => setNuevoVehiculo(prev => ({ ...prev, matricula: e.target.value }))}
                    placeholder="1234-ABC"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tipo de Vehículo</Label>
                  <Input 
                    value={nuevoVehiculo.tipo}
                    onChange={(e) => setNuevoVehiculo(prev => ({ ...prev, tipo: e.target.value }))}
                    placeholder="Furgoneta, Camión, Coche..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Marca</Label>
                  <Input 
                    value={nuevoVehiculo.marca}
                    onChange={(e) => setNuevoVehiculo(prev => ({ ...prev, marca: e.target.value }))}
                    placeholder="Ford, Mercedes, Volkswagen..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Modelo</Label>
                  <Input 
                    value={nuevoVehiculo.modelo}
                    onChange={(e) => setNuevoVehiculo(prev => ({ ...prev, modelo: e.target.value }))}
                    placeholder="Transit, Sprinter, Golf..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Caducidad ITV</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {nuevoVehiculo.caducidadITV ? format(nuevoVehiculo.caducidadITV, "dd/MM/yyyy", { locale: es }) : "Seleccionar fecha"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={nuevoVehiculo.caducidadITV}
                        onSelect={(fecha) => setNuevoVehiculo(prev => ({ ...prev, caducidadITV: fecha }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>Caducidad Seguro</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {nuevoVehiculo.caducidadSeguro ? format(nuevoVehiculo.caducidadSeguro, "dd/MM/yyyy", { locale: es }) : "Seleccionar fecha"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={nuevoVehiculo.caducidadSeguro}
                        onSelect={(fecha) => setNuevoVehiculo(prev => ({ ...prev, caducidadSeguro: fecha }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Kilómetros</Label>
                  <Input 
                    type="number"
                    value={nuevoVehiculo.kilometros}
                    onChange={(e) => setNuevoVehiculo(prev => ({ ...prev, kilometros: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
                  />
                </div>
                <div className="flex gap-2 col-span-2">
                  <Button variant="outline" onClick={cerrarFormulario}>
                    Cancelar
                  </Button>
                  <Button onClick={guardarVehiculo}>
                    {vehiculoEnEdicion ? 'Guardar Cambios' : 'Registrar Vehículo'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Tabs defaultValue="vehiculos" className="w-full">
        <TabsList>
          <TabsTrigger value="vehiculos">
            <Car className="w-4 h-4 mr-2" />
            Vehículos
          </TabsTrigger>
          <TabsTrigger value="gastos">
            <Receipt className="w-4 h-4 mr-2" />
            Gastos
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="vehiculos">
          <Card>
            <CardHeader>
              <CardTitle>Lista de Vehículos</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Matrícula</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Marca/Modelo</TableHead>
                    <TableHead>ITV</TableHead>
                    <TableHead>Seguro</TableHead>
                    <TableHead>Kilómetros</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vehiculos.map((vehiculo) => (
                    <TableRow key={vehiculo.id}>
                      <TableCell className="font-medium">{vehiculo.matricula}</TableCell>
                      <TableCell>{vehiculo.tipo}</TableCell>
                      <TableCell>{vehiculo.marca} {vehiculo.modelo}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          esPróximoAVencer(vehiculo.caducidadITV) 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {format(vehiculo.caducidadITV, "dd/MM/yyyy", { locale: es })}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          esPróximoAVencer(vehiculo.caducidadSeguro) 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {format(vehiculo.caducidadSeguro, "dd/MM/yyyy", { locale: es })}
                        </span>
                      </TableCell>
                      <TableCell>{vehiculo.kilometros.toLocaleString()} km</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          vehiculo.asignado 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {vehiculo.asignado ? `Asignado a ${vehiculo.empleadoAsignado}` : 'Disponible'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => abrirFormularioGasto(vehiculo.id)}
                          >
                            <Receipt className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => abrirFormularioEdicion(vehiculo)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => eliminarVehiculo(vehiculo.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gastos">
          <Card>
            <CardHeader>
              <CardTitle>Gastos de Vehículos</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vehículo</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Concepto</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Importe</TableHead>
                    <TableHead>Factura</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gastosVehiculos.map((gasto) => {
                    const vehiculo = vehiculos.find(v => v.id === gasto.vehiculoId);
                    return (
                      <TableRow key={gasto.id}>
                        <TableCell className="font-medium">
                          {vehiculo ? `${vehiculo.matricula} - ${vehiculo.marca} ${vehiculo.modelo}` : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            gasto.tipo === 'ITV' ? 'bg-blue-100 text-blue-800' :
                            gasto.tipo === 'revision' ? 'bg-green-100 text-green-800' :
                            gasto.tipo === 'reparacion' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {gasto.tipo.toUpperCase()}
                          </span>
                        </TableCell>
                        <TableCell>{gasto.concepto}</TableCell>
                        <TableCell>{format(gasto.fecha, "dd/MM/yyyy", { locale: es })}</TableCell>
                        <TableCell>€{gasto.importe.toFixed(2)}</TableCell>
                        <TableCell>
                          {gasto.factura ? (
                            <span className="text-green-600">✓</span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setGastoEnEdicion(gasto);
                                setNuevoGasto({
                                  vehiculoId: gasto.vehiculoId,
                                  tipo: gasto.tipo,
                                  concepto: gasto.concepto,
                                  fecha: gasto.fecha,
                                  importe: gasto.importe,
                                  descripcion: gasto.descripcion || "",
                                  factura: gasto.factura || ""
                                });
                                setMostrarFormularioGasto(true);
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => eliminarGasto(gasto.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Vehiculos;
