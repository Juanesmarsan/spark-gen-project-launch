
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Proyectos = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestión de Proyectos</h1>
        <Button>Nuevo Proyecto</Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Proyectos Activos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            Lista de proyectos - En desarrollo
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Proyectos;
