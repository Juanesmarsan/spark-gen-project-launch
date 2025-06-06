
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Empleados = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestión de Empleados</h1>
        <Button>Añadir Empleado</Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Lista de Empleados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            Tabla de empleados - En desarrollo
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Empleados;
