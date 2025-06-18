
import React from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { IntroduccionSection } from './sections/IntroduccionSection';
import { ArquitecturaSection } from './sections/ArquitecturaSection';
import { ModulosSection } from './sections/ModulosSection';
import { LogicaNegocioSection } from './sections/LogicaNegocioSection';
import { FlujoDatosSection } from './sections/FlujoDatosSection';
import { DecisionesTecnicasSection } from './sections/DecisionesTecnicasSection';

export const ManualDesarrollador = () => {
  const generatePDF = async () => {
    const element = document.getElementById('manual-content');
    if (!element) return;

    try {
      // Crear PDF con múltiples páginas
      const pdf = new jsPDF('p', 'mm', 'a4');
      const sections = element.children;
      
      for (let i = 0; i < sections.length; i++) {
        if (i > 0) pdf.addPage();
        
        const canvas = await html2canvas(sections[i] as HTMLElement, {
          scale: 1.5,
          useCORS: true,
          allowTaint: true
        });
        
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 210;
        const pageHeight = 295;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
      }

      pdf.save('Manual-Desarrollador-Sistema-Gestion.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manual del Desarrollador</h1>
          <p className="text-gray-600 mt-2">Sistema de Gestión Empresarial - Documentación Técnica Completa</p>
        </div>
        <Button onClick={generatePDF} className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Descargar PDF
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-200px)]">
        <div id="manual-content" className="space-y-8">
          <IntroduccionSection />
          <ArquitecturaSection />
          <ModulosSection />
          <LogicaNegocioSection />
          <FlujoDatosSection />
          <DecisionesTecnicasSection />
          
          {/* Información adicional */}
          <div className="bg-blue-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-blue-800 mb-3">Notas Finales</h2>
            <p className="text-blue-700">
              Este manual ha sido generado automáticamente basándose en la estructura actual del proyecto.
              Para actualizaciones o modificaciones, contacte con el equipo de desarrollo.
            </p>
            <p className="text-sm text-blue-600 mt-2">
              Fecha de generación: {new Date().toLocaleDateString('es-ES')}
            </p>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
