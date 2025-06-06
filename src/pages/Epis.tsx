
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2 } from "lucide-react";

interface Epi {
  id: number;
  nombre: string;
  tipo: string;
  marca: string;
  precio: number;
  disponible: boolean;
}

const Epis = () => {
  const [epis, setEpis] = useState<Epi[]>([
    { id: 1, nombre: "Casco de seguridad", tipo: "Protección craneal", marca: "3M", precio: 25, disponible: true },
    { id: 2, nombre: "Chaleco reflectante", tipo: "Visibilidad", marca: "Portwest", precio: 15, disponible: true },
    { id: 3, nombre: "Botas de seguridad", tipo: "Protección pies", marca: "Cofra", precio: 85, disponible: true },
    { id: 4, nombre: "Guantes de trabajo", tipo: "Protección manos", marca: "Ansell", precio: 12, disponible: true },
    { id: 5, nombre: "Gafas de protección", tipo: "Protección ocular", marca: "Uvex", precio: 18, disponible: true },
    { id: 6, nombre: "Mascarilla FFP2", tipo: "Protección respiratoria", marca: "Moldex", precio: 8, disponible: true },
  ]);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [epiEnEdicion, setEpiEnEdicion] = useState<Epi | null>(null);
  const [nuevoEpi, setNuevoEpi] = useState({
    nombre: "",
    tipo: "",
    marca: "",
    precio: 0
  });

  const resetearFormulario = () => {
    setNuevoEpi({ nombre: "", tipo: "", marca: "", precio: 0 });
    setEpiEnEdicion(null);
  };

  const abrirFormularioEdicion = (epi: Epi) => {
    setEpiEnEdicion(epi);
    setNuevoEpi({
      nombre: epi.nombre,
      tipo: epi.tipo,
      marca: epi.marca,
      precio: epi.precio
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

  const guardarEpi = () => {
    if (nuevoEpi.nombre && nuevoEpi.tipo && nuevoEpi.marca && nuevoEpi.precio > 0) {
      if (epiEnEdicion) {
        // Editar EPI existente
        setEpis(prev => prev.map(e => 
          e.id === epiEnEdicion.id 
            ? { ...e, nombre: nuevoEpi.nombre, tipo: nuevoEpi.tipo, marca: nuevoEpi.marca, precio: nuevoEpi.precio }
            : e
        ));
      } else {
        // Agregar nuevo EPI
        const nuevo: Epi = {
          id: Date.now(),
          nombre: nuevoEpi.nombre,
          tipo: nuevoEpi.tipo,
          marca: nuevoEpi.marca,
          precio: nuevoEpi.precio,
          disponible: true
        };
        setEpis(prev => [...prev, nuevo]);
      }
      cerrarFormulario();
    }
  };

  const eliminarEpi = (id: number) => {
    setEpis(prev => prev.filter(e => e.id !== id));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Equipos de Protección Individual (EPIs)</h1>
        <Dialog open={mostrarFormulario} onOpenChange={setMostrarFormulario}>
          <DialogTrigger asChild>
            <Button onClick={abrirFormularioNuevo}>
              <Plus className="w-4 h-4 mr-2" />
              Añadir EPI
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {epiEnEdicion ? 'Editar EPI' : 'Nuevo EPI'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nombre del EPI</Label>
                <Input 
                  value={nuevoEpi.nombre}
                  onChange={(e) => setNuevoEpi(prev => ({ ...prev, nombre: e.target.value }))}
                  placeholder="Ej: Casco de seguridad, Botas de trabajo..."
                />
              </div>
              <div className="space-y-2">
                <Label>Tipo de Protección</Label>
                <Input 
                  value={nuevoEpi.tipo}
                  onChange={(e) => setNuevoEpi(prev => ({ ...prev, tipo: e.target.value }))}
                  placeholder="Ej: Protección craneal, Protección pies..."
                />
              </div>
              <div className="space-y-2">
                <Label>Marca</Label>
                <Input 
                  value={nuevoEpi.marca}
                  onChange={(e) => setNuevoEpi(prev => ({ ...prev, marca: e.target.value }))}
                  placeholder="Ej: 3M, Portwest, Cofra..."
                />
              </div>
              <div className="space-y-2">
                <Label>Precio (€)</Label>
                <Input 
                  type="number"
                  value={nuevoEpi.precio}
                  onChange={(e) => setNuevoEpi(prev => ({ ...prev, precio: parseFloat(e.target.value) || 0 }))}
                  placeholder="0.00"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={cerrarFormulario}>
                  Cancelar
                </Button>
                <Button onClick={guardarEpi}>
                  {epiEnEdicion ? 'Guardar Cambios' : 'Añadir EPI'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Lista de EPIs</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Tipo de Protección</TableHead>
                <TableHead>Marca</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {epis.map((epi) => (
                <TableRow key={epi.id}>
                  <TableCell className="font-medium">{epi.nombre}</TableCell>
                  <TableCell>{epi.tipo}</TableCell>
                  <TableCell>{epi.marca}</TableCell>
                  <TableCell>€{epi.precio}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      epi.disponible 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {epi.disponible ? 'Disponible' : 'Asignado'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => abrirFormularioEdicion(epi)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => eliminarEpi(epi.id)}
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

export default Epis;
