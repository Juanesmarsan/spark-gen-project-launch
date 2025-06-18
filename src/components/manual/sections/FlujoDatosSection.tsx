
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const FlujoDatosSection = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-blue-600">5. FLUJO DE DATOS Y ALMACENAMIENTO</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">5.1 LocalStorage como Backend</h3>
            <div className="space-y-2 text-gray-700">
              <p>El sistema utiliza localStorage del navegador como sistema de persistencia:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li><strong>empleados:</strong> Datos completos de empleados</li>
                <li><strong>proyectos:</strong> Información de proyectos y certificaciones</li>
                <li><strong>vehiculos:</strong> Flota y gastos asociados</li>
                <li><strong>gastosFijos:</strong> Gastos recurrentes de la empresa</li>
                <li><strong>gastosVariables:</strong> Gastos por proyecto/empleado</li>
                <li><strong>inventario:</strong> Herramientas y EPIs</li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">5.2 Hooks de Acceso a Datos</h3>
            <div className="space-y-2 text-gray-700">
              <p>Cada módulo tiene su hook específico para gestionar los datos:</p>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm font-mono">
                  useEmpleados() → localStorage.empleados<br/>
                  useProyectos() → localStorage.proyectos<br/>
                  useVehiculosGastos() → localStorage.vehiculos<br/>
                  useGastosFijos() → localStorage.gastosFijos
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">5.3 Sincronización de Estados</h3>
            <div className="space-y-2 text-gray-700">
              <p>Los hooks implementan:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Lectura automática al montar componentes</li>
                <li>Escritura inmediata en localStorage</li>
                <li>Actualización de estado React</li>
                <li>Validación de datos con TypeScript</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
