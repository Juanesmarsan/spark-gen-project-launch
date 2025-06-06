
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2 } from "lucide-react";

interface Herramienta {
  id: number;
  tipo: string;
  marca: string;
  coste: number;
  disponible: boolean;
}

const Inventario = () => {
  const [herramientas, setHerramientas] = useState<Herramienta[]>([
    { id: 1, tipo: "Taladro", marca: "Bosch", coste: 120, disponible: true },
    { id: 2, tipo: "Martillo", marca: "Stanley", coste: 35, disponible: true },
    { id: 3, tipo: "Destornillador eléctrico", marca: "Makita", coste: 75, disponible: true },
    { id: 4, tipo: "Sierra circular", marca: "DeWalt", coste: 250, disponible: true },
  ]);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nuevaHerramienta, setNuevaHerramienta] = useState({
    tipo: "",
    marca: "",
    coste: 0
  });

  const agregarHerramienta = () => {
    if (nuevaHerramienta.tipo && nuevaHerramienta.marca && nuevaHerramienta.coste > 0) {
      const nueva: Herramienta = {
        id: Date.now(),
        tipo: nuevaHerramienta.tipo,
        marca: nuevaHerramienta.marca,
        coste: nuevaHerramienta.coste,
        disponible: true
      };
      setHerramientas(prev => [...prev, nueva]);
      setNuevaHerramienta({ tipo: "", marca: "", coste: 0 });
      setMostrarFormulario(false);
    }
  };

  const eliminarHerramienta = (id: number) => {
    setHerramientas(prev => prev.filter(h => h.id !== id));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Inventario de Herramientas</h1>
        <Dialog open={mostrarFormulario} onOpenChange={setMostrarFormulario}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Añadir Herramienta
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nueva Herramienta</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Tipo de Herramienta</Label>
                <Input 
                  value={nuevaHerramienta.tipo}
                  onChange={(e) => setNuevaHerramienta(prev => ({ ...prev, tipo: e.target.value }))}
                  placeholder="Ej: Taladro, Martillo, Sierra..."
                />
              </div>
              <div className="space-y-2">
                <Label>Marca</Label>
                <Input 
                  value={nuevaHerramienta.marca}
                  onChange={(e) => setNuevaHerramienta(prev => ({ ...prev, marca: e.target.value }))}
                  placeholder="Ej: Bosch, Makita, DeWalt..."
                />
              </div>
              <div className="space-y-2">
                <Label>Coste (€)</Label>
                <Input 
                  type="number"
                  value={nuevaHerramienta.coste}
                  onChange={(e) => setNuevaHerramienta(prev => ({ ...prev, coste: parseFloat(e.target.value) || 0 }))}
                  placeholder="0.00"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setMostrarFormulario(false)}>
                  Cancelar
                </Button>
                <Button onClick={agregarHerramienta}>
                  Añadir Herramienta
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Lista de Herramientas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo</TableHead>
                <TableHead>Marca</TableHead>
                <TableHead>Coste</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {herramientas.map((herramienta) => (
                <TableRow key={herramienta.id}>
                  <TableCell>{herramienta.tipo}</TableCell>
                  <TableCell>{herramienta.marca}</TableCell>
                  <TableCell>€{herramienta.coste}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      herramienta.disponible 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {herramienta.disponible ? 'Disponible' : 'Asignada'}
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
                        onClick={() => eliminarHerramienta(herramienta.id)}
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

export default Inventario;
