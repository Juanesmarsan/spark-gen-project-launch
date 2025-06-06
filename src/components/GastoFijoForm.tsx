
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { GastoFijo } from "@/types/gastosFijos";

interface GastoFijoFormProps {
  gasto?: GastoFijo;
  onSubmit: (gasto: Omit<GastoFijo, 'id'>) => void;
  onCancel: () => void;
}

export const GastoFijoForm = ({ gasto, onSubmit, onCancel }: GastoFijoFormProps) => {
  const [concepto, setConcepto] = useState(gasto?.concepto || "");
  const [totalBruto, setTotalBruto] = useState(gasto?.totalBruto?.toString() || "");
  const [tieneIva, setTieneIva] = useState(gasto?.tieneIva || false);
  const [iva, setIva] = useState(gasto?.iva?.toString() || "");

  const calcularBaseImponible = () => {
    const bruto = parseFloat(totalBruto) || 0;
    const ivaAmount = parseFloat(iva) || 0;
    return tieneIva ? bruto - ivaAmount : bruto;
  };

  const calcularIvaAutomatico = () => {
    if (tieneIva && totalBruto) {
      const bruto = parseFloat(totalBruto) || 0;
      const ivaCalculado = bruto * 0.21; // 21% IVA
      const baseCalculada = bruto - ivaCalculado;
      setIva(ivaCalculado.toFixed(2));
      return baseCalculada;
    }
    return parseFloat(totalBruto) || 0;
  };

  useEffect(() => {
    if (tieneIva && totalBruto && !iva) {
      calcularIvaAutomatico();
    }
  }, [tieneIva, totalBruto]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const baseImponible = calcularBaseImponible();
    
    onSubmit({
      concepto,
      totalBruto: parseFloat(totalBruto) || 0,
      baseImponible,
      tieneIva,
      iva: tieneIva ? parseFloat(iva) || 0 : undefined
    });
  };

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>
          {gasto ? "Editar Gasto Fijo" : "Añadir Gasto Fijo"}
        </DialogTitle>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="concepto">Concepto</Label>
          <Input
            id="concepto"
            value={concepto}
            onChange={(e) => setConcepto(e.target.value)}
            placeholder="Describe el gasto fijo"
            required
          />
        </div>

        <div>
          <Label htmlFor="totalBruto">Total Bruto (€)</Label>
          <Input
            id="totalBruto"
            type="number"
            step="0.01"
            value={totalBruto}
            onChange={(e) => setTotalBruto(e.target.value)}
            placeholder="0.00"
            required
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="tieneIva"
            checked={tieneIva}
            onCheckedChange={setTieneIva}
          />
          <Label htmlFor="tieneIva">Incluye IVA</Label>
        </div>

        {tieneIva && (
          <div>
            <Label htmlFor="iva">IVA (€)</Label>
            <Input
              id="iva"
              type="number"
              step="0.01"
              value={iva}
              onChange={(e) => setIva(e.target.value)}
              placeholder="0.00"
            />
          </div>
        )}

        <div className="bg-gray-50 p-3 rounded">
          <Label className="text-sm font-medium">Base Imponible: €{calcularBaseImponible().toFixed(2)}</Label>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" className="bg-omenar-green hover:bg-omenar-dark-green">
            {gasto ? "Actualizar" : "Añadir"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};
