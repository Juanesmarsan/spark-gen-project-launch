
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Empleado } from "@/types/empleado";

interface AdelantosSectionProps {
  empleado: Empleado;
  onAgregarAdelanto: (concepto: string, cantidad: number) => void;
}

export const AdelantosSection = ({ empleado, onAgregarAdelanto }: AdelantosSectionProps) => {
  const [showAdelantoDialog, setShowAdelantoDialog] = useState(false);
  const [adelantoData, setAdelantoData] = useState({ concepto: "", cantidad: 0 });

  const handleAgregarAdelantoSubmit = () => {
    onAgregarAdelanto(adelantoData.concepto, adelantoData.cantidad);
    setAdelantoData({ concepto: "", cantidad: 0 });
    setShowAdelantoDialog(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Adelantos</CardTitle>
          <Dialog open={showAdelantoDialog} onOpenChange={setShowAdelantoDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Añadir Adelanto
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Añadir Adelanto</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="concepto" className="text-right">
                    Concepto
                  </Label>
                  <Input
                    id="concepto"
                    value={adelantoData.concepto}
                    onChange={(e) => setAdelantoData({ ...adelantoData, concepto: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="cantidad" className="text-right">
                    Cantidad
                  </Label>
                  <Input
                    type="number"
                    id="cantidad"
                    value={adelantoData.cantidad}
                    onChange={(e) => setAdelantoData({ ...adelantoData, cantidad: parseFloat(e.target.value) })}
                    className="col-span-3"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="ghost" onClick={() => setShowAdelantoDialog(false)}>
                  Cancelar
                </Button>
                <Button type="submit" onClick={handleAgregarAdelantoSubmit}>
                  Añadir
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Concepto</TableHead>
              <TableHead>Cantidad</TableHead>
              <TableHead>Fecha</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {empleado.adelantos.map((adelanto) => (
              <TableRow key={adelanto.id}>
                <TableCell>{adelanto.concepto}</TableCell>
                <TableCell>{adelanto.cantidad} €</TableCell>
                <TableCell>{format(adelanto.fecha, "dd/MM/yyyy", { locale: es })}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
