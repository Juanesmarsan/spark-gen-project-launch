
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const DecisionesTecnicasSection = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-blue-600">6. DECISIONES TÉCNICAS IMPORTANTES</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">6.1 Elección de Tecnologías</h3>
            <div className="space-y-3">
              <div>
                <h4 className="font-medium">React con TypeScript</h4>
                <p className="text-gray-700 text-sm">Elegido por la seguridad de tipos y mejor mantenibilidad del código.</p>
              </div>
              <div>
                <h4 className="font-medium">Shadcn/ui</h4>
                <p className="text-gray-700 text-sm">Sistema de componentes moderno que garantiza consistencia visual.</p>
              </div>
              <div>
                <h4 className="font-medium">LocalStorage</h4>
                <p className="text-gray-700 text-sm">Solución simple para persistencia sin necesidad de backend complejo.</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">6.2 Patrones de Diseño Implementados</h3>
            <div className="space-y-2 text-gray-700">
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li><strong>Container/Presentational:</strong> Separación entre lógica y presentación</li>
                <li><strong>Custom Hooks:</strong> Encapsulación de lógica de negocio reutilizable</li>
                <li><strong>Compound Components:</strong> Para formularios complejos</li>
                <li><strong>Provider Pattern:</strong> Para compartir estado global cuando necesario</li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">6.3 Optimizaciones Aplicadas</h3>
            <div className="space-y-2 text-gray-700">
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Lazy loading de componentes pesados</li>
                <li>Memoización de cálculos complejos</li>
                <li>Debounce en inputs de búsqueda</li>
                <li>Virtualización en tablas grandes</li>
                <li>Code splitting por rutas</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
