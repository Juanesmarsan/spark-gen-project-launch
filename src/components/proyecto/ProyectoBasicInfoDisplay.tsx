
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Proyecto } from "@/types/proyecto";
import { Empleado } from "@/types/empleado";

interface ProyectoBasicInfoDisplayProps {
  proyecto: Proyecto;
  empleados: Empleado[];
}

export const ProyectoBasicInfoDisplay = ({ proyecto, empleados }: ProyectoBasicInfoDisplayProps) => {
  const getTipoLabel = (tipo: string) => {
    return tipo === 'presupuesto' ? 'Por Presupuesto' : 'Por Administración';
  };

  const getTipoColor = (tipo: string) => {
    return tipo === 'presupuesto' ? 'bg-purple-100 text-purple-800' : 'bg-orange-100 text-orange-800';
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'activo': return 'bg-green-100 text-green-800';
      case 'completado': return 'bg-blue-100 text-blue-800';
      case 'pausado': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Información Básica</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Nombre</label>
            <p className="text-sm">{proyecto.nombre}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Ciudad</label>
            <p className="text-sm">{proyecto.ciudad}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Tipo</label>
            <div className="mt-1">
              <Badge className={getTipoColor(proyecto.tipo)}>
                {getTipoLabel(proyecto.tipo)}
              </Badge>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Estado</label>
            <div className="mt-1">
              <Badge className={getEstadoColor(proyecto.estado)}>
                {proyecto.estado.charAt(0).toUpperCase() + proyecto.estado.slice(1)}
              </Badge>
            </div>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-muted-foreground">Fecha de Creación</label>
          <p className="text-sm">{proyecto.fechaCreacion.toLocaleDateString()}</p>
        </div>
      </CardContent>
    </Card>
  );
};
