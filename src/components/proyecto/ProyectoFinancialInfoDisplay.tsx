
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Euro } from "lucide-react";
import { Proyecto } from "@/types/proyecto";

interface ProyectoFinancialInfoDisplayProps {
  proyecto: Proyecto;
}

export const ProyectoFinancialInfoDisplay = ({ proyecto }: ProyectoFinancialInfoDisplayProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Euro className="w-4 h-4" />
          Información Financiera
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {proyecto.tipo === 'presupuesto' ? (
          <div>
            <label className="text-sm font-medium text-muted-foreground">Presupuesto Total</label>
            <p className="text-lg font-semibold">
              {proyecto.presupuestoTotal ? `${proyecto.presupuestoTotal.toLocaleString()}€` : 'No definido'}
            </p>
          </div>
        ) : (
          <div>
            <label className="text-sm font-medium text-muted-foreground">Precio por Hora</label>
            <p className="text-lg font-semibold">
              {proyecto.precioHora ? `${proyecto.precioHora}€/hora` : 'No definido'}
            </p>
          </div>
        )}
        
        {proyecto.tipo === 'administracion' && proyecto.certificacionReal && (
          <div>
            <label className="text-sm font-medium text-muted-foreground">Certificación Real</label>
            <p className="text-lg font-semibold text-green-600">
              {proyecto.certificacionReal.toLocaleString()}€
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
