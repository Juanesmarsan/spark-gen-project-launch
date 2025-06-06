
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Vehiculos = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Vehículos</h1>
        <Button>Registrar Vehículo</Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Flota de Vehículos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            Gestión de vehículos - En desarrollo
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Vehiculos;
