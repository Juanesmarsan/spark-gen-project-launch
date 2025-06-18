
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const ModulosSection = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-blue-600">3. MÓDULOS PRINCIPALES</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">3.1 Gestión de Empleados</h3>
            <div className="space-y-2 text-gray-700">
              <p><strong>Archivos principales:</strong></p>
              <ul className="list-disc list-inside ml-4">
                <li>pages/Empleados.tsx - Vista principal</li>
                <li>components/empleado/ - Componentes específicos</li>
                <li>hooks/useEmpleados.ts - Lógica de negocio</li>
              </ul>
              <p className="mt-3"><strong>Funcionalidades:</strong></p>
              <ul className="list-disc list-inside ml-4">
                <li>CRUD completo de empleados</li>
                <li>Gestión de nóminas y salarios</li>
                <li>Control de adelantos y gastos variables</li>
                <li>Asignación de herramientas y EPIs</li>
                <li>Gestión de documentos personales</li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">3.2 Gestión de Proyectos</h3>
            <div className="space-y-2 text-gray-700">
              <p><strong>Archivos principales:</strong></p>
              <ul className="list-disc list-inside ml-4">
                <li>pages/Proyectos.tsx - Vista principal</li>
                <li>components/proyecto/ - Componentes específicos</li>
                <li>hooks/useProyectos.ts - Lógica de negocio</li>
              </ul>
              <p className="mt-3"><strong>Funcionalidades:</strong></p>
              <ul className="list-disc list-inside ml-4">
                <li>Creación y seguimiento de proyectos</li>
                <li>Asignación de trabajadores</li>
                <li>Control de presupuestos y certificaciones</li>
                <li>Análisis de rentabilidad</li>
                <li>Imputación de costes</li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">3.3 Gestión de Vehículos</h3>
            <div className="space-y-2 text-gray-700">
              <p><strong>Archivos principales:</strong></p>
              <ul className="list-disc list-inside ml-4">
                <li>pages/Vehiculos.tsx - Vista principal</li>
                <li>components/vehiculos/ - Componentes específicos</li>
                <li>hooks/useVehiculosGastos.ts - Lógica de negocio</li>
              </ul>
              <p className="mt-3"><strong>Funcionalidades:</strong></p>
              <ul className="list-disc list-inside ml-4">
                <li>Registro de vehículos y mantenimiento</li>
                <li>Control de ITV y seguros</li>
                <li>Gestión de gastos por vehículo</li>
                <li>Asignación a empleados</li>
                <li>Seguimiento de kilómetros</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
