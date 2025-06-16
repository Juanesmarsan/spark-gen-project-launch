
import React from 'react';
import { Proyecto } from "@/types/proyecto";
import { useCalculosBeneficios } from "@/hooks/useCalculosBeneficios";
import { TimelinePresupuesto } from "./TimelinePresupuesto";
import { MetricasFinancieras } from "./analisis/MetricasFinancieras";
import { AnalisisCertificaciones } from "./analisis/AnalisisCertificaciones";
import { AnalisisAdministracion } from "./analisis/AnalisisAdministracion";
import { EvolucionMensual } from "./analisis/EvolucionMensual";

interface AnalisisFinancieroTabProps {
  proyecto: Proyecto;
  onUpdateProyecto: (proyecto: Proyecto) => void;
}

export const AnalisisFinancieroTab: React.FC<AnalisisFinancieroTabProps> = ({ 
  proyecto,
  onUpdateProyecto 
}) => {
  const { 
    calcularBeneficioBrutoAdministracion,
    calcularBeneficioBrutoPresupuesto,
    calcularGastosTotales,
    calcularBeneficioNeto,
    calcularMargenProyecto,
    calcularBeneficioMensualAdministracion,
    calcularBeneficioMensualPresupuesto,
    calcularGastosMensuales
  } = useCalculosBeneficios();

  const beneficioBruto = proyecto.tipo === 'administracion' 
    ? calcularBeneficioBrutoAdministracion(proyecto)
    : calcularBeneficioBrutoPresupuesto(proyecto);

  const gastosTotales = calcularGastosTotales(proyecto);
  const beneficioNeto = calcularBeneficioNeto(proyecto);
  const margenProyecto = calcularMargenProyecto(proyecto);

  // Calcular análisis mensual para el proyecto individual
  const calcularAnalisisMensualProyecto = (año: number = new Date().getFullYear()) => {
    const meses = Array.from({ length: 12 }, (_, i) => i + 1);
    
    return meses.map(mes => {
      const beneficioBrutoMes = proyecto.tipo === 'administracion' 
        ? calcularBeneficioMensualAdministracion(proyecto, mes, año)
        : calcularBeneficioMensualPresupuesto(proyecto, mes, año);
      
      const gastosMes = calcularGastosMensuales(proyecto, mes, año);
      const beneficioNeto = beneficioBrutoMes - gastosMes;

      return {
        mes,
        nombreMes: new Date(año, mes - 1).toLocaleDateString('es-ES', { month: 'long' }),
        beneficioBruto: beneficioBrutoMes,
        gastos: gastosMes,
        beneficioNeto,
        margen: beneficioBrutoMes > 0 ? (beneficioNeto / beneficioBrutoMes) * 100 : 0
      };
    });
  };

  const analisisMensual = calcularAnalisisMensualProyecto();

  return (
    <div className="space-y-6">
      {/* Timeline específico para proyectos de presupuesto */}
      {proyecto.tipo === 'presupuesto' && (
        <TimelinePresupuesto proyecto={proyecto} onUpdateProyecto={onUpdateProyecto} />
      )}

      {/* Métricas principales */}
      <MetricasFinancieras
        beneficioBruto={beneficioBruto}
        gastosTotales={gastosTotales}
        beneficioNeto={beneficioNeto}
        margenProyecto={margenProyecto}
      />

      {/* Detalles específicos por tipo de proyecto */}
      <AnalisisCertificaciones proyecto={proyecto} />
      <AnalisisAdministracion proyecto={proyecto} />

      {/* Análisis mensual si está disponible */}
      <EvolucionMensual analisisMensual={analisisMensual} />
    </div>
  );
};
