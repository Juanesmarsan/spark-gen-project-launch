
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const GastosVariables = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gastos Variables</h1>
        <Button>Registrar Gasto</Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Gastos Variables del Mes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            Control de gastos variables - En desarrollo
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GastosVariables;
