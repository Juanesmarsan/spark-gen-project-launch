
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const ArquitecturaSection = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-blue-600">2. ARQUITECTURA DEL SISTEMA</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">2.1 Estructura de Directorios</h3>
            <div className="bg-gray-100 p-4 rounded-lg font-mono text-sm">
              <div>src/</div>
              <div>├── components/</div>
              <div>│   ├── ui/ (componentes base shadcn/ui)</div>
              <div>│   ├── empleado/ (componentes específicos de empleados)</div>
              <div>│   ├── proyecto/ (componentes de gestión de proyectos)</div>
              <div>│   ├── vehiculos/ (gestión de vehículos)</div>
              <div>│   └── dashboard/ (componentes del panel principal)</div>
              <div>├── pages/ (páginas principales)</div>
              <div>├── hooks/ (lógica de negocio reutilizable)</div>
              <div>├── types/ (definiciones TypeScript)</div>
              <div>├── utils/ (utilidades y helpers)</div>
              <div>└── data/ (datos de ejemplo)</div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">2.2 Patrón de Arquitectura</h3>
            <p className="text-gray-700 leading-relaxed">
              El sistema sigue una arquitectura de componentes basada en:
            </p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-2 text-gray-700">
              <li><strong>Separación de responsabilidades:</strong> Cada componente tiene una responsabilidad específica</li>
              <li><strong>Hooks personalizados:</strong> La lógica de negocio está encapsulada en hooks reutilizables</li>
              <li><strong>Gestión de estado local:</strong> Uso de useState y useQuery para manejo de datos</li>
              <li><strong>Componentes presentacionales:</strong> Componentes que solo se encargan de la presentación</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">2.3 Flujo de Datos</h3>
            <p className="text-gray-700 leading-relaxed">
              Los datos fluyen desde localStorage hacia los hooks personalizados, que exponen la información 
              a los componentes mediante interfaces tipadas con TypeScript.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
