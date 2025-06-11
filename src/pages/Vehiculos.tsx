
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Receipt, Car } from "lucide-react";
import { VehiculoForm } from "@/components/vehiculos/VehiculoForm";
import { GastoVehiculoForm } from "@/components/vehiculos/GastoVehiculoForm";
import { VehiculosTable } from "@/components/vehiculos/VehiculosTable";
import { GastosVehiculosTable } from "@/components/vehiculos/GastosVehiculosTable";
import { useVehiculosGastos } from "@/hooks/useVehiculosGastos";
import { VehiculoCompleto, GastoVehiculo } from "@/types/vehiculo";

const Vehiculos = () => {
  const {
    vehiculos,
    gastosVehiculos,
    agregarVehiculo,
    editarVehiculo,
    eliminarVehiculo,
    agregarGasto,
    editarGasto,
    eliminarGasto,
    getTotalGastosPorMes
  } = useVehiculosGastos();

  const [mostrarFormularioVehiculo, setMostrarFormularioVehiculo] = useState(false);
  const [mostrarFormularioGasto, setMostrarFormularioGasto] = useState(false);
  const [vehiculoEnEdicion, setVehiculoEnEdicion] = useState<VehiculoCompleto | null>(null);
  const [gastoEnEdicion, setGastoEnEdicion] = useState<GastoVehiculo | null>(null);
  const [vehiculoParaGasto, setVehiculoParaGasto] = useState<number | undefined>(undefined);

  const abrirFormularioVehiculo = (vehiculo?: VehiculoCompleto) => {
    setVehiculoEnEdicion(vehiculo || null);
    setMostrarFormularioVehiculo(true);
  };

  const abrirFormularioGasto = (vehiculoId?: number, gasto?: GastoVehiculo) => {
    setVehiculoParaGasto(vehiculoId);
    setGastoEnEdicion(gasto || null);
    setMostrarFormularioGasto(true);
  };

  const handleGuardarVehiculo = (vehiculoData: Omit<VehiculoCompleto, 'id' | 'gastos'>) => {
    if (vehiculoEnEdicion) {
      editarVehiculo(vehiculoEnEdicion.id, vehiculoData);
    } else {
      agregarVehiculo(vehiculoData);
    }
    setMostrarFormularioVehiculo(false);
    setVehiculoEnEdicion(null);
  };

  const handleGuardarGasto = (gastoData: Omit<GastoVehiculo, 'id'>) => {
    if (gastoEnEdicion) {
      editarGasto(gastoEnEdicion.id, gastoData);
    } else {
      agregarGasto(gastoData);
    }
    setMostrarFormularioGasto(false);
    setGastoEnEdicion(null);
    setVehiculoParaGasto(undefined);
  };

  // Calcular gastos del mes actual
  const fechaActual = new Date();
  const gastosDelMes = getTotalGastosPorMes(fechaActual.getFullYear(), fechaActual.getMonth()) || 0;

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
              <GastoVehiculoForm
                vehiculos={vehiculos}
                gasto={gastoEnEdicion || undefined}
                onSave={handleGuardarGasto}
                onCancel={() => setMostrarFormularioGasto(false)}
                vehiculoPreseleccionado={vehiculoParaGasto}
              />
            </DialogContent>
          </Dialog>
          
          <Dialog open={mostrarFormularioVehiculo} onOpenChange={setMostrarFormularioVehiculo}>
            <DialogTrigger asChild>
              <Button onClick={() => abrirFormularioVehiculo()}>
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
              <VehiculoForm
                vehiculo={vehiculoEnEdicion || undefined}
                onSave={handleGuardarVehiculo}
                onCancel={() => setMostrarFormularioVehiculo(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Resumen de gastos del mes */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen Gastos del Mes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            €{gastosDelMes.toLocaleString()}
          </div>
          <p className="text-sm text-muted-foreground">
            Total gastos de vehículos de {fechaActual.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
          </p>
        </CardContent>
      </Card>
      
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
              <VehiculosTable
                vehiculos={vehiculos}
                onEdit={abrirFormularioVehiculo}
                onDelete={eliminarVehiculo}
                onAgregarGasto={abrirFormularioGasto}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gastos">
          <Card>
            <CardHeader>
              <CardTitle>Gastos de Vehículos</CardTitle>
            </CardHeader>
            <CardContent>
              <GastosVehiculosTable
                gastos={gastosVehiculos}
                vehiculos={vehiculos}
                onEdit={(gasto) => abrirFormularioGasto(undefined, gasto)}
                onDelete={eliminarGasto}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Vehiculos;
