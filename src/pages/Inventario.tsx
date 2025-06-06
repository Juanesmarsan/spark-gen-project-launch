
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Inventario = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Inventario</h1>
        <Button>Añadir Producto</Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Control de Stock</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            Gestión de inventario - En desarrollo
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Inventario;
