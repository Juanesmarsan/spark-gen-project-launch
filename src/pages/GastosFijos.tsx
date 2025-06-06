
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { GastoFijoForm } from "@/components/GastoFijoForm";
import { GastosFijosTable } from "@/components/GastosFijosTable";
import { useGastosFijos } from "@/hooks/useGastosFijos";
import { useToast } from "@/hooks/use-toast";
import { GastoFijo } from "@/types/gastosFijos";

const GastosFijos = () => {
  const { gastosFijos, agregarGasto, actualizarGasto, eliminarGasto, calcularResumen } = useGastosFijos();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [gastoEditando, setGastoEditando] = useState<GastoFijo | undefined>();

  const resumen = calcularResumen();

  const handleSubmitGasto = (gastoData: Omit<GastoFijo, 'id'>) => {
    if (gastoEditando) {
      actualizarGasto({ ...gastoData, id: gastoEditando.id });
      toast({
        title: "Gasto actualizado",
        description: "El gasto fijo se ha actualizado correctamente.",
      });
    } else {
      agregarGasto(gastoData);
      toast({
        title: "Gasto añadido",
        description: "El gasto fijo se ha añadido correctamente.",
      });
    }
    setShowForm(false);
    setGastoEditando(undefined);
  };

  const handleEditGasto = (gasto: GastoFijo) => {
    setGastoEditando(gasto);
    setShowForm(true);
  };

  const handleDeleteGasto = (id: number) => {
    eliminarGasto(id);
    toast({
      title: "Gasto eliminado",
      description: "El gasto fijo se ha eliminado correctamente.",
    });
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setGastoEditando(undefined);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gastos Fijos</h1>
          <p className="text-muted-foreground">Gestiona los gastos fijos mensuales de la empresa</p>
        </div>
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-omenar-green hover:bg-omenar-dark-green"
            >
              <Plus className="w-4 h-4 mr-2" />
              Añadir Gasto
            </Button>
          </DialogTrigger>
          <GastoFijoForm
            gasto={gastoEditando}
            onSubmit={handleSubmitGasto}
            onCancel={handleCloseForm}
          />
        </Dialog>
      </div>

      {/* Resumen */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bruto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{resumen.totalBruto.toFixed(2)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Base Imponible</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{resumen.totalBaseImponible.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Operarios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resumen.numeroOperarios}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Coeficiente Mensual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-omenar-green">€{resumen.coeficienteEmpresa.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">por operario/mes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Coeficiente Diario</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">€{resumen.coeficienteEmpresaDiario.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">por operario/día</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Gastos Mensuales Fijos</CardTitle>
        </CardHeader>
        <CardContent>
          {gastosFijos.length > 0 ? (
            <GastosFijosTable
              gastos={gastosFijos}
              onEdit={handleEditGasto}
              onDelete={handleDeleteGasto}
            />
          ) : (
            <div className="text-center text-muted-foreground py-8">
              <p>No hay gastos fijos registrados</p>
              <p className="text-sm">Haz clic en "Añadir Gasto" para crear el primero</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GastosFijos;
