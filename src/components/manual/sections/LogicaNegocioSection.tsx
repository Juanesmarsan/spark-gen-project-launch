
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const LogicaNegocioSection = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-blue-600">4. LÓGICA DE NEGOCIO</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">4.1 Cálculos Salariales</h3>
            <div className="space-y-2 text-gray-700">
              <p><strong>Hook principal:</strong> useCalculosEmpleados.ts</p>
              <p><strong>Lógica implementada:</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Cálculo de salario bruto mensual</li>
                <li>Descuentos por adelantos</li>
                <li>Gastos variables deducibles</li>
                <li>Cálculo de coste empresa (salario + SS + extras)</li>
                <li>Proyección anual de costes</li>
              </ul>
              <div className="bg-gray-50 p-3 rounded mt-3">
                <p className="text-sm"><strong>Fórmula base:</strong></p>
                <p className="text-sm font-mono">Coste Total = Salario Bruto + Seguridad Social (30%) + Gastos Adicionales</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">4.2 Análisis de Proyectos</h3>
            <div className="space-y-2 text-gray-700">
              <p><strong>Hook principal:</strong> useCalculosBeneficios.ts</p>
              <p><strong>Métricas calculadas:</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Beneficio bruto: Certificado - Costes directos</li>
                <li>Beneficio neto: Beneficio bruto - Gastos generales</li>
                <li>Margen de beneficio porcentual</li>
                <li>ROI (Return on Investment)</li>
                <li>Evolución mensual de rentabilidad</li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">4.3 Gestión de Gastos</h3>
            <div className="space-y-2 text-gray-700">
              <p><strong>Tipos de gastos manejados:</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li><strong>Gastos fijos:</strong> Alquiler, seguros, servicios</li>
                <li><strong>Gastos variables:</strong> Materiales, combustible, reparaciones</li>
                <li><strong>Gastos de personal:</strong> Nóminas, seguros sociales</li>
                <li><strong>Gastos de vehículos:</strong> Mantenimiento, combustible, seguros</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
