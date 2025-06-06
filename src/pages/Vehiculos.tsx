
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, Edit, Trash2, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Vehiculo {
  id: number;
  matricula: string;
  tipo: string;
  marca: string;
  modelo: string;
  caducidadITV: Date;
  caducidadSeguro: Date;
  kilometros: number;
  asignado: boolean;
  empleadoAsignado?: string;
}

const Vehiculos = () => {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([
    {
      id: 1,
      matricula: "1234-ABC",
      tipo: "Furgoneta",
      marca: "Ford",
      modelo: "Transit",
      caducidadITV: new Date("2024-08-15"),
      caducidadSeguro: new Date("2024-12-31"),
      kilometros: 125000,
      asignado: false
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
      asignado: false
    }
  ]);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nuevoVehiculo, setNuevoVehiculo] = useState({
    matricula: "",
    tipo: "",
    marca: "",
    modelo: "",
    caducidadITV: undefined as Date | undefined,
    caducidadSeguro: undefined as Date | undefined,
    kilometros: 0
  });

  const agregarVehiculo = () => {
    if (nuevoVehiculo.matricula && nuevoVehiculo.tipo && nuevoVehiculo.marca && 
        nuevoVehiculo.modelo && nuevoVehiculo.caducidadITV && nuevoVehiculo.caducidadSeguro) {
      const nuevo: Vehiculo = {
        id: Date.now(),
        matricula: nuevoVehiculo.matricula,
        tipo: nuevoVehiculo.tipo,
        marca: nuevoVehiculo.marca,
        modelo: nuevoVehiculo.modelo,
        caducidadITV: nuevoVehiculo.caducidadITV,
        caducidadSeguro: nuevoVehiculo.caducidadSeguro,
        kilometros: nuevoVehiculo.kilometros,
        asignado: false
      };
      setVehiculos(prev => [...prev, nuevo]);
      setNuevoVehiculo({
        matricula: "",
        tipo: "",
        marca: "",
        modelo: "",
        caducidadITV: undefined,
        caducidadSeguro: undefined,
        kilometros: 0
      });
      setMostrarFormulario(false);
    }
  };

  const eliminarVehiculo = (id: number) => {
    setVehiculos(prev => prev.filter(v => v.id !== id));
  };

  const esPróximoAVencer = (fecha: Date) => {
    const ahora = new Date();
    const unMes = new Date();
    unMes.setMonth(unMes.getMonth() + 1);
    return fecha <= unMes && fecha >= ahora;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Flota de Vehículos</h1>
        <Dialog open={mostrarFormulario} onOpenChange={setMostrarFormulario}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Registrar Vehículo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Nuevo Vehículo</DialogTitle>
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
                <Button variant="outline" onClick={() => setMostrarFormulario(false)}>
                  Cancelar
                </Button>
                <Button onClick={agregarVehiculo}>
                  Registrar Vehículo
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
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
                      <Button variant="outline" size="sm">
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
    </div>
  );
};

export default Vehiculos;
