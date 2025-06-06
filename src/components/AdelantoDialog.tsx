
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

interface AdelantoDialogProps {
  onAgregarAdelanto: (concepto: string, cantidad: number) => void;
}

export const AdelantoDialog = ({ onAgregarAdelanto }: AdelantoDialogProps) => {
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [nuevoAdelanto, setNuevoAdelanto] = useState({ concepto: "", cantidad: 0 });

  const handleSubmit = () => {
    if (nuevoAdelanto.concepto && nuevoAdelanto.cantidad > 0) {
      onAgregarAdelanto(nuevoAdelanto.concepto, nuevoAdelanto.cantidad);
      setNuevoAdelanto({ concepto: "", cantidad: 0 });
      setDialogoAbierto(false);
    }
  };

  return (
    <Dialog open={dialogoAbierto} onOpenChange={setDialogoAbierto}>
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
            <Button variant="outline" onClick={() => setDialogoAbierto(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>
              Añadir Adelanto
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
