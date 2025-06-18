
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const IntroduccionSection = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-blue-600">1. INTRODUCCIÓN AL PROYECTO</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">1.1 Descripción General</h3>
            <p className="text-gray-700 leading-relaxed">
              Este proyecto es un Sistema de Gestión Empresarial desarrollado como una aplicación web moderna 
              utilizando React, TypeScript y Tailwind CSS. El sistema está diseñado para gestionar de manera 
              integral los recursos humanos, proyectos, vehículos, gastos y análisis financiero de una empresa.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">1.2 Objetivo del Sistema</h3>
            <p className="text-gray-700 leading-relaxed">
              Proporcionar una plataforma unificada que permita a las empresas gestionar eficientemente:
            </p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1 text-gray-700">
              <li>Personal y empleados con control de nóminas y gastos</li>
              <li>Proyectos con seguimiento financiero detallado</li>
              <li>Flota de vehículos y gastos asociados</li>
              <li>Inventario de herramientas y EPIs</li>
              <li>Análisis financiero y reportes empresariales</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">1.3 Stack Tecnológico</h3>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <h4 className="font-medium text-gray-800">Frontend:</h4>
                <ul className="list-disc list-inside ml-4 text-gray-700">
                  <li>React 18.3.1</li>
                  <li>TypeScript</li>
                  <li>Vite</li>
                  <li>Tailwind CSS</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Librerías principales:</h4>
                <ul className="list-disc list-inside ml-4 text-gray-700">
                  <li>Shadcn/ui</li>
                  <li>React Query</li>
                  <li>React Router</li>
                  <li>Lucide React</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
