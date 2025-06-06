
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Euro, Clock, Edit, Trash2 } from "lucide-react";
import { Proyecto } from "@/types/proyecto";

interface ProyectoCardProps {
  proyecto: Proyecto;
  onEdit: (proyecto: Proyecto) => void;
  onDelete: (id: number) => void;
}

export const ProyectoCard = ({ proyecto, onEdit, onDelete }: ProyectoCardProps) => {
  const getEstadoBadgeColor = (estado: string) => {
    switch (estado) {
      case 'activo':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'completado':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'pausado':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const getTipoBadgeColor = (tipo: string) => {
    return tipo === 'presupuesto' 
      ? 'bg-purple-100 text-purple-800 hover:bg-purple-200'
      : 'bg-orange-100 text-orange-800 hover:bg-orange-200';
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{proyecto.nombre}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={getEstadoBadgeColor(proyecto.estado)}>
                {proyecto.estado.charAt(0).toUpperCase() + proyecto.estado.slice(1)}
              </Badge>
              <Badge className={getTipoBadgeColor(proyecto.tipo)}>
                {proyecto.tipo === 'presupuesto' ? 'Por Presupuesto' : 'Por Administración'}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>{proyecto.ciudad}</span>
        </div>
        
        {proyecto.tipo === 'presupuesto' ? (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Euro className="w-4 h-4" />
            <span>Presupuesto: {proyecto.presupuestoTotal?.toLocaleString()}€</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{proyecto.precioHora}€/hora</span>
          </div>
        )}
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users className="w-4 h-4" />
          <span>{proyecto.trabajadoresAsignados.length} trabajadores asignados</span>
        </div>

        {proyecto.trabajadoresAsignados.length > 0 && (
          <div className="text-xs text-gray-500">
            <div className="font-medium mb-1">Trabajadores:</div>
            <div className="flex flex-wrap gap-1">
              {proyecto.trabajadoresAsignados.map((trabajador, index) => (
                <span key={trabajador.id} className="bg-gray-100 px-2 py-1 rounded text-xs">
                  {trabajador.nombre} {trabajador.apellidos}
                  {index < proyecto.trabajadoresAsignados.length - 1 ? ',' : ''}
                </span>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(proyecto)}
            className="flex-1"
          >
            <Edit className="w-4 h-4 mr-1" />
            Editar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(proyecto.id)}
            className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Eliminar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
