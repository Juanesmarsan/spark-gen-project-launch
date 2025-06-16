
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Clock } from "lucide-react";
import { Proyecto } from "@/types/proyecto";

interface AnalisisCertificacionesProps {
  proyecto: Proyecto;
}

export const AnalisisCertificaciones: React.FC<AnalisisCertificacionesProps> = ({ proyecto }) => {
  if (proyecto.tipo !== 'presupuesto') {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Análisis de Certificaciones</CardTitle>
      </CardHeader>
      <CardContent>
        {proyecto.certificaciones && proyecto.certificaciones.length > 0 ? (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-muted-foreground">Total Certificado</p>
                <p className="text-2xl font-bold text-blue-600">
                  €{proyecto.certificaciones.reduce((sum, cert) => sum + cert.importe, 0).toLocaleString()}
                </p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-muted-foreground">Presupuesto Total</p>
                <p className="text-2xl font-bold text-green-600">
                  €{proyecto.presupuestoTotal?.toLocaleString()}
                </p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-muted-foreground">% Ejecutado</p>
                <p className="text-2xl font-bold text-purple-600">
                  {proyecto.presupuestoTotal 
                    ? ((proyecto.certificaciones.reduce((sum, cert) => sum + cert.importe, 0) / proyecto.presupuestoTotal) * 100).toFixed(1) 
                    : 0}%
                </p>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-semibold mb-3">Certificaciones por Mes</h4>
              <div className="space-y-2">
                {proyecto.certificaciones
                  .sort((a, b) => new Date(a.anio, a.mes - 1).getTime() - new Date(b.anio, b.mes - 1).getTime())
                  .map((cert) => (
                    <div key={cert.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <div>
                        <span className="font-medium">
                          {new Date(cert.anio, cert.mes - 1).toLocaleDateString('es-ES', { 
                            month: 'long', 
                            year: 'numeric' 
                          })}
                        </span>
                        {cert.descripcion && (
                          <p className="text-sm text-muted-foreground">{cert.descripcion}</p>
                        )}
                      </div>
                      <Badge variant="outline" className="font-mono">
                        €{cert.importe.toLocaleString()}
                      </Badge>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No hay certificaciones registradas aún.</p>
            <p className="text-sm text-muted-foreground">
              Agrega certificaciones en la pestaña correspondiente para ver el análisis.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
