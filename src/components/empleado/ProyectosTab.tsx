
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Calendar } from "lucide-react";
import { Empleado } from "@/types/empleado";

interface ProyectosTabProps {
  empleado: Empleado;
}

export const ProyectosTab = ({ empleado }: ProyectosTabProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Proyectos Asignados
          </CardTitle>
        </CardHeader>
        <CardContent>
          {empleado.proyectos && empleado.proyectos.length > 0 ? (
            <div className="grid gap-3">
              {empleado.proyectos.map((proyecto, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{proyecto}</span>
                  </div>
                  <Badge variant="outline">
                    <Calendar className="w-3 h-3 mr-1" />
                    Activo
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Building2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
              <p>No hay proyectos asignados</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
