
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Proyecto } from "@/types/proyecto";

interface AnalisisAdministracionProps {
  proyecto: Proyecto;
}

export const AnalisisAdministracion: React.FC<AnalisisAdministracionProps> = ({ proyecto }) => {
  if (proyecto.tipo !== 'administracion') {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Análisis por Administración</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <p className="text-sm text-muted-foreground">Precio por Hora</p>
              <p className="text-2xl font-bold text-orange-600">
                €{proyecto.precioHora}/h
              </p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-muted-foreground">Trabajadores Asignados</p>
              <p className="text-2xl font-bold text-blue-600">
                {proyecto.trabajadoresAsignados.length}
              </p>
            </div>
          </div>

          {proyecto.certificacionReal && (
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-muted-foreground">Certificación Real</p>
              <p className="text-2xl font-bold text-green-600">
                €{proyecto.certificacionReal.toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
