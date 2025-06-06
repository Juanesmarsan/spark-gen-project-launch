import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar as CalendarIcon, Upload, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { EmpleadoForm } from "@/components/EmpleadoForm";

interface Empleado {
  id: number;
  nombre: string;
  apellidos: string;
  dni: string;
  telefono: string;
  email: string;
  direccion: string;
  fechaIngreso: Date;
  salarioBruto: number;
  seguridadSocialTrabajador: number;
  seguridadSocialEmpresa: number;
  retenciones: number;
  embargo: number;
  adelantos: Adelanto[];
  epis: EpiAsignado[];
  herramientas: HerramientaAsignada[];
  documentos: Documento[];
  proyectos: string[];
  vehiculo?: string;
}

interface Adelanto {
  id: number;
  concepto: string;
  cantidad: number;
  fecha: Date;
}

interface EpiAsignado {
  id: number;
  nombre: string;
  precio: number;
  fechaEntrega: Date;
}

interface HerramientaAsignada {
  id: number;
  nombre: string;
  precio: number;
  fechaEntrega: Date;
}

interface Documento {
  id: number;
  tipo: string;
  nombre: string;
  fechaCaducidad?: Date;
  archivo: string;
}

const Empleados = () => {
  const [empleados, setEmpleados] = useState<Empleado[]>([
    {
      id: 1,
      nombre: "Juan",
      apellidos: "García López",
      dni: "12345678A",
      telefono: "666123456",
      email: "juan.garcia@empresa.com",
      direccion: "Calle Principal 123, Madrid",
      fechaIngreso: new Date("2023-01-15"),
      salarioBruto: 2500,
      seguridadSocialTrabajador: 150,
      seguridadSocialEmpresa: 750,
      retenciones: 375,
      embargo: 0,
      adelantos: [],
      epis: [],
      herramientas: [],
      documentos: [],
      proyectos: [],
    }
  ]);

  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState<Empleado | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nuevoAdelanto, setNuevoAdelanto] = useState({ concepto: "", cantidad: 0 });
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date>();
  const [dialogoAdelantoAbierto, setDialogoAdelantoAbierto] = useState(false);
  const [dialogoEpiAbierto, setDialogoEpiAbierto] = useState(false);
  const [dialogoHerramientaAbierto, setDialogoHerramientaAbierto] = useState(false);
  const [epiSeleccionado, setEpiSeleccionado] = useState("");
  const [herramientaSeleccionada, setHerramientaSeleccionada] = useState("");

  const epis = [
    { id: 1, nombre: "Casco de seguridad", precio: 25 },
    { id: 2, nombre: "Chaleco reflectante", precio: 15 },
    { id: 3, nombre: "Botas de seguridad", precio: 85 },
    { id: 4, nombre: "Guantes de trabajo", precio: 12 },
  ];

  const herramientas = [
    { id: 1, nombre: "Taladro", precio: 120 },
    { id: 2, nombre: "Martillo", precio: 35 },
    { id: 3, nombre: "Destornillador eléctrico", precio: 75 },
    { id: 4, nombre: "Sierra circular", precio: 250 },
  ];

  const proyectos = ["Proyecto Alpha", "Proyecto Beta", "Proyecto Gamma"];
  const vehiculos = ["Furgoneta 1234-ABC", "Camión 5678-DEF", "Coche 9012-GHI"];

  const agregarEmpleado = (nuevoEmpleadoData: Omit<Empleado, 'id' | 'adelantos' | 'epis' | 'herramientas' | 'documentos' | 'proyectos' | 'vehiculo'>) => {
    const nuevoEmpleado: Empleado = {
      ...nuevoEmpleadoData,
      id: Date.now(),
      adelantos: [],
      epis: [],
      herramientas: [],
      documentos: [],
      proyectos: [],
    };
    setEmpleados(prev => [...prev, nuevoEmpleado]);
    setMostrarFormulario(false);
  };

  const agregarAdelanto = (empleadoId: number) => {
    if (nuevoAdelanto.concepto && nuevoAdelanto.cantidad > 0) {
      setEmpleados(prev => prev.map(emp => 
        emp.id === empleadoId 
          ? {
              ...emp,
              adelantos: [...emp.adelantos, {
                id: Date.now(),
                concepto: nuevoAdelanto.concepto,
                cantidad: nuevoAdelanto.cantidad,
                fecha: new Date()
              }]
            }
          : emp
      ));
      setNuevoAdelanto({ concepto: "", cantidad: 0 });
      setDialogoAdelantoAbierto(false);
      // Actualizar el empleado seleccionado
      if (empleadoSeleccionado && empleadoSeleccionado.id === empleadoId) {
        const empleadoActualizado = empleados.find(emp => emp.id === empleadoId);
        if (empleadoActualizado) {
          setEmpleadoSeleccionado({
            ...empleadoActualizado,
            adelantos: [...empleadoActualizado.adelantos, {
              id: Date.now(),
              concepto: nuevoAdelanto.concepto,
              cantidad: nuevoAdelanto.cantidad,
              fecha: new Date()
            }]
          });
        }
      }
    }
  };

  const asignarEpi = (empleadoId: number, epiId: number, fecha: Date) => {
    const epi = epis.find(e => e.id === epiId);
    if (epi) {
      setEmpleados(prev => prev.map(emp => 
        emp.id === empleadoId 
          ? {
              ...emp,
              epis: [...emp.epis, {
                id: Date.now(),
                nombre: epi.nombre,
                precio: epi.precio,
                fechaEntrega: fecha
              }]
            }
          : emp
      ));
      setEpiSeleccionado("");
      setFechaSeleccionada(undefined);
      setDialogoEpiAbierto(false);
    }
  };

  const asignarHerramienta = (empleadoId: number, herramientaId: number, fecha: Date) => {
    const herramienta = herramientas.find(h => h.id === herramientaId);
    if (herramienta) {
      setEmpleados(prev => prev.map(emp => 
        emp.id === empleadoId 
          ? {
              ...emp,
              herramientas: [...emp.herramientas, {
                id: Date.now(),
                nombre: herramienta.nombre,
                precio: herramienta.precio,
                fechaEntrega: fecha
              }]
            }
          : emp
      ));
      setHerramientaSeleccionada("");
      setFechaSeleccionada(undefined);
      setDialogoHerramientaAbierto(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestión de Empleados</h1>
        <Dialog open={mostrarFormulario} onOpenChange={setMostrarFormulario}>
          <DialogTrigger asChild>
            <Button onClick={() => setMostrarFormulario(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Añadir Empleado
            </Button>
          </DialogTrigger>
          <EmpleadoForm
            onSubmit={agregarEmpleado}
            onCancel={() => setMostrarFormulario(false)}
          />
        </Dialog>
      </div>

      <div className="grid gap-6">
        {/* Lista de empleados */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Empleados</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>DNI</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Salario Bruto</TableHead>
                  <TableHead>Vehículo</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {empleados.map((empleado) => (
                  <TableRow key={empleado.id}>
                    <TableCell>{empleado.nombre} {empleado.apellidos}</TableCell>
                    <TableCell>{empleado.dni}</TableCell>
                    <TableCell>{empleado.telefono}</TableCell>
                    <TableCell>{empleado.email}</TableCell>
                    <TableCell>€{empleado.salarioBruto}</TableCell>
                    <TableCell>
                      {empleado.vehiculo ? (
                        <Badge variant="secondary">{empleado.vehiculo}</Badge>
                      ) : (
                        <span className="text-muted-foreground">Sin asignar</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setEmpleadoSeleccionado(empleado)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Detalle del empleado seleccionado */}
        {empleadoSeleccionado && (
          <Card>
            <CardHeader>
              <CardTitle>
                {empleadoSeleccionado.nombre} {empleadoSeleccionado.apellidos}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="datos" className="w-full">
                <TabsList className="grid w-full grid-cols-6">
                  <TabsTrigger value="datos">Datos Personales</TabsTrigger>
                  <TabsTrigger value="epis">EPIs</TabsTrigger>
                  <TabsTrigger value="herramientas">Herramientas</TabsTrigger>
                  <TabsTrigger value="documentos">Documentos</TabsTrigger>
                  <TabsTrigger value="proyectos">Proyectos</TabsTrigger>
                  <TabsTrigger value="vehiculo">Vehículo</TabsTrigger>
                </TabsList>

                <TabsContent value="datos" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Salario Bruto</Label>
                      <Input 
                        type="number" 
                        value={empleadoSeleccionado.salarioBruto}
                        onChange={(e) => {
                          const valor = parseFloat(e.target.value);
                          setEmpleados(prev => prev.map(emp => 
                            emp.id === empleadoSeleccionado.id 
                              ? { ...emp, salarioBruto: valor }
                              : emp
                          ));
                          setEmpleadoSeleccionado(prev => prev ? { ...prev, salarioBruto: valor } : null);
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Seguridad Social Trabajador</Label>
                      <Input 
                        type="number" 
                        value={empleadoSeleccionado.seguridadSocialTrabajador}
                        onChange={(e) => {
                          const valor = parseFloat(e.target.value);
                          setEmpleados(prev => prev.map(emp => 
                            emp.id === empleadoSeleccionado.id 
                              ? { ...emp, seguridadSocialTrabajador: valor }
                              : emp
                          ));
                          setEmpleadoSeleccionado(prev => prev ? { ...prev, seguridadSocialTrabajador: valor } : null);
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Seguridad Social Empresa</Label>
                      <Input 
                        type="number" 
                        value={empleadoSeleccionado.seguridadSocialEmpresa}
                        onChange={(e) => {
                          const valor = parseFloat(e.target.value);
                          setEmpleados(prev => prev.map(emp => 
                            emp.id === empleadoSeleccionado.id 
                              ? { ...emp, seguridadSocialEmpresa: valor }
                              : emp
                          ));
                          setEmpleadoSeleccionado(prev => prev ? { ...prev, seguridadSocialEmpresa: valor } : null);
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Retenciones</Label>
                      <Input 
                        type="number" 
                        value={empleadoSeleccionado.retenciones}
                        onChange={(e) => {
                          const valor = parseFloat(e.target.value);
                          setEmpleados(prev => prev.map(emp => 
                            emp.id === empleadoSeleccionado.id 
                              ? { ...emp, retenciones: valor }
                              : emp
                          ));
                          setEmpleadoSeleccionado(prev => prev ? { ...prev, retenciones: valor } : null);
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Embargo</Label>
                      <Input 
                        type="number" 
                        value={empleadoSeleccionado.embargo}
                        onChange={(e) => {
                          const valor = parseFloat(e.target.value);
                          setEmpleados(prev => prev.map(emp => 
                            emp.id === empleadoSeleccionado.id 
                              ? { ...emp, embargo: valor }
                              : emp
                          ));
                          setEmpleadoSeleccionado(prev => prev ? { ...prev, embargo: valor } : null);
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Adelantos</h3>
                      <Dialog open={dialogoAdelantoAbierto} onOpenChange={setDialogoAdelantoAbierto}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Plus className="w-4 h-4 mr-2" />
                            Añadir Adelanto
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Nuevo Adelanto</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label>Concepto</Label>
                              <Input 
                                value={nuevoAdelanto.concepto}
                                onChange={(e) => setNuevoAdelanto(prev => ({ ...prev, concepto: e.target.value }))}
                                placeholder="Descripción del adelanto"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Cantidad</Label>
                              <Input 
                                type="number"
                                value={nuevoAdelanto.cantidad}
                                onChange={(e) => setNuevoAdelanto(prev => ({ ...prev, cantidad: parseFloat(e.target.value) || 0 }))}
                                placeholder="0.00"
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" onClick={() => setDialogoAdelantoAbierto(false)}>
                                Cancelar
                              </Button>
                              <Button onClick={() => agregarAdelanto(empleadoSeleccionado.id)}>
                                Añadir Adelanto
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                    
                    {empleadoSeleccionado.adelantos.length > 0 && (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Concepto</TableHead>
                            <TableHead>Cantidad</TableHead>
                            <TableHead>Fecha</TableHead>
                            <TableHead>Acciones</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {empleadoSeleccionado.adelantos.map((adelanto) => (
                            <TableRow key={adelanto.id}>
                              <TableCell>{adelanto.concepto}</TableCell>
                              <TableCell>€{adelanto.cantidad}</TableCell>
                              <TableCell>{format(adelanto.fecha, "dd/MM/yyyy", { locale: es })}</TableCell>
                              <TableCell>
                                <Button variant="outline" size="sm">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="epis" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">EPIs Asignados</h3>
                    <Dialog open={dialogoEpiAbierto} onOpenChange={setDialogoEpiAbierto}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Plus className="w-4 h-4 mr-2" />
                          Asignar EPI
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Asignar EPI</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>EPI</Label>
                            <Select value={epiSeleccionado} onValueChange={setEpiSeleccionado}>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar EPI" />
                              </SelectTrigger>
                              <SelectContent>
                                {epis.map((epi) => (
                                  <SelectItem key={epi.id} value={epi.id.toString()}>
                                    {epi.nombre} - €{epi.precio}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Fecha de Entrega</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full justify-start text-left font-normal">
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {fechaSeleccionada ? format(fechaSeleccionada, "dd/MM/yyyy", { locale: es }) : "Seleccionar fecha"}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={fechaSeleccionada}
                                  onSelect={setFechaSeleccionada}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" onClick={() => setDialogoEpiAbierto(false)}>
                              Cancelar
                            </Button>
                            <Button 
                              onClick={() => {
                                if (epiSeleccionado && fechaSeleccionada) {
                                  asignarEpi(empleadoSeleccionado.id, parseInt(epiSeleccionado), fechaSeleccionada);
                                }
                              }}
                              disabled={!epiSeleccionado || !fechaSeleccionada}
                            >
                              Asignar EPI
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  {empleadoSeleccionado.epis.length > 0 && (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>EPI</TableHead>
                          <TableHead>Precio</TableHead>
                          <TableHead>Fecha Entrega</TableHead>
                          <TableHead>Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {empleadoSeleccionado.epis.map((epi) => (
                          <TableRow key={epi.id}>
                            <TableCell>{epi.nombre}</TableCell>
                            <TableCell>€{epi.precio}</TableCell>
                            <TableCell>{format(epi.fechaEntrega, "dd/MM/yyyy", { locale: es })}</TableCell>
                            <TableCell>
                              <Button variant="outline" size="sm">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </TabsContent>

                <TabsContent value="herramientas" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Herramientas Asignadas</h3>
                    <Dialog open={dialogoHerramientaAbierto} onOpenChange={setDialogoHerramientaAbierto}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Plus className="w-4 h-4 mr-2" />
                          Asignar Herramienta
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Asignar Herramienta</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Herramienta</Label>
                            <Select value={herramientaSeleccionada} onValueChange={setHerramientaSeleccionada}>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar herramienta" />
                              </SelectTrigger>
                              <SelectContent>
                                {herramientas.map((herramienta) => (
                                  <SelectItem key={herramienta.id} value={herramienta.id.toString()}>
                                    {herramienta.nombre} - €{herramienta.precio}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Fecha de Entrega</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full justify-start text-left font-normal">
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {fechaSeleccionada ? format(fechaSeleccionada, "dd/MM/yyyy", { locale: es }) : "Seleccionar fecha"}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={fechaSeleccionada}
                                  onSelect={setFechaSeleccionada}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" onClick={() => setDialogoHerramientaAbierto(false)}>
                              Cancelar
                            </Button>
                            <Button 
                              onClick={() => {
                                if (herramientaSeleccionada && fechaSeleccionada) {
                                  asignarHerramienta(empleadoSeleccionado.id, parseInt(herramientaSeleccionada), fechaSeleccionada);
                                }
                              }}
                              disabled={!herramientaSeleccionada || !fechaSeleccionada}
                            >
                              Asignar Herramienta
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  {empleadoSeleccionado.herramientas.length > 0 && (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Herramienta</TableHead>
                          <TableHead>Precio</TableHead>
                          <TableHead>Fecha Entrega</TableHead>
                          <TableHead>Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {empleadoSeleccionado.herramientas.map((herramienta) => (
                          <TableRow key={herramienta.id}>
                            <TableCell>{herramienta.nombre}</TableCell>
                            <TableCell>€{herramienta.precio}</TableCell>
                            <TableCell>{format(herramienta.fechaEntrega, "dd/MM/yyyy", { locale: es })}</TableCell>
                            <TableCell>
                              <Button variant="outline" size="sm">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </TabsContent>

                <TabsContent value="documentos" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Documentos</h3>
                    <Button variant="outline" size="sm">
                      <Upload className="w-4 h-4 mr-2" />
                      Subir Documento
                    </Button>
                  </div>
                  <div className="text-center text-muted-foreground py-8">
                    Subida de documentos - En desarrollo
                  </div>
                </TabsContent>

                <TabsContent value="proyectos" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Proyectos Asignados</h3>
                    <Select>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Asignar proyecto" />
                      </SelectTrigger>
                      <SelectContent>
                        {proyectos.map((proyecto) => (
                          <SelectItem key={proyecto} value={proyecto}>
                            {proyecto}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="text-center text-muted-foreground py-8">
                    Gestión de proyectos - En desarrollo
                  </div>
                </TabsContent>

                <TabsContent value="vehiculo" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Vehículo Asignado</h3>
                    <Select>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Asignar vehículo" />
                      </SelectTrigger>
                      <SelectContent>
                        {vehiculos.map((vehiculo) => (
                          <SelectItem key={vehiculo} value={vehiculo}>
                            {vehiculo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="text-center text-muted-foreground py-8">
                    Gestión de vehículos - En desarrollo
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Empleados;
