
import { useCallback } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useProyectos } from './useProyectos';
import { useEmpleados } from './useEmpleados';
import { useCalculosBeneficios } from './useCalculosBeneficios';
import { useCalendario } from './useCalendario';
import { toast } from 'sonner';

export const usePdfGenerator = () => {
  const { proyectos } = useProyectos();
  const { empleados } = useEmpleados();
  const { calcularAnalisisMensual } = useCalculosBeneficios();

  const generarReporteMensualTrabajadores = useCallback(async () => {
    try {
      toast.info('Generando reporte mensual de trabajadores...');
      
      const doc = new jsPDF();
      const fechaActual = new Date();
      const mes = fechaActual.getMonth() + 1;
      const año = fechaActual.getFullYear();
      const nombreMes = fechaActual.toLocaleDateString('es-ES', { month: 'long' });
      
      // Título
      doc.setFontSize(20);
      doc.text(`Reporte Mensual de Trabajadores: ${nombreMes.toUpperCase()} ${año}`, 105, 20, { align: 'center' });
      
      // Fecha del reporte
      doc.setFontSize(10);
      doc.text(`Generado el ${fechaActual.toLocaleDateString('es-ES')}`, 105, 30, { align: 'center' });
      
      doc.setLineWidth(0.5);
      doc.line(20, 35, 190, 35);
      
      let y = 45;
      
      const empleadosActivos = empleados.filter(e => e.activo);
      
      if (empleadosActivos.length === 0) {
        doc.setFontSize(12);
        doc.text('No hay empleados activos registrados', 20, y);
      } else {
        empleadosActivos.forEach((empleado, index) => {
          if (y > 250) { // Comprobación de salto de página
            doc.addPage();
            y = 20;
          }
          
          // Nombre del empleado
          doc.setFontSize(14);
          doc.text(`${index + 1}. ${empleado.nombre} ${empleado.apellidos}`, 20, y);
          y += 10;
          
          // Información básica
          doc.setFontSize(10);
          doc.text(`Departamento: ${empleado.departamento} | Categoría: ${empleado.categoria}`, 25, y);
          y += 7;
          
          // Proyectos asignados en el mes
          const proyectosAsignados = proyectos.filter(p => 
            p.trabajadoresAsignados.some(t => t.id === empleado.id)
          );
          
          if (proyectosAsignados.length > 0) {
            doc.text('Proyectos asignados:', 25, y);
            y += 5;
            proyectosAsignados.forEach(proyecto => {
              doc.text(`- ${proyecto.nombre} (${proyecto.tipo})`, 30, y);
              y += 5;
            });
            y += 3;
          } else {
            doc.text('Sin proyectos asignados este mes', 25, y);
            y += 7;
          }
          
          // Resumen de horas y días
          doc.text('Resumen del mes:', 25, y);
          y += 5;
          doc.text('- Días trabajados: [Pendiente de calcular]', 30, y);
          y += 5;
          doc.text('- Días de vacaciones: [Pendiente de calcular]', 30, y);
          y += 5;
          doc.text('- Días de baja/ausencia: [Pendiente de calcular]', 30, y);
          y += 5;
          doc.text('- Total horas trabajadas: [Pendiente de calcular]', 30, y);
          y += 15;
        });
      }
      
      // Guardar PDF
      doc.save(`Reporte_Mensual_Trabajadores_${nombreMes}_${año}.pdf`);
      toast.success('Reporte mensual de trabajadores generado correctamente');
    } catch (error) {
      console.error('Error al generar el reporte:', error);
      toast.error('Error al generar el reporte mensual de trabajadores');
    }
  }, [empleados, proyectos]);

  const generarReporteMensual = useCallback(async () => {
    try {
      toast.info('Generando reporte mensual...');
      
      const doc = new jsPDF();
      const fechaActual = new Date();
      const mes = fechaActual.toLocaleDateString('es-ES', { month: 'long' });
      const año = fechaActual.getFullYear();
      
      // Título
      doc.setFontSize(22);
      doc.text(`Reporte Mensual: ${mes.toUpperCase()} ${año}`, 105, 20, { align: 'center' });
      
      // Fecha del reporte
      doc.setFontSize(10);
      doc.text(`Generado el ${fechaActual.toLocaleDateString('es-ES')}`, 105, 30, { align: 'center' });
      
      doc.setLineWidth(0.5);
      doc.line(20, 35, 190, 35);
      
      // Resumen de proyectos
      doc.setFontSize(16);
      doc.text('Resumen de Proyectos', 20, 45);
      
      doc.setFontSize(12);
      let y = 55;
      
      if (proyectos.length === 0) {
        doc.text('No hay proyectos registrados', 20, y);
      } else {
        const analisisMensual = calcularAnalisisMensual(proyectos, año);
        const mesActual = analisisMensual[fechaActual.getMonth()];
        
        doc.text(`Total Proyectos Activos: ${proyectos.length}`, 20, y);
        y += 10;
        
        doc.text(`Beneficio Bruto Total: ${mesActual.beneficioBruto.toLocaleString()}€`, 20, y);
        y += 10;
        
        doc.text(`Gastos Totales: ${mesActual.gastos.toLocaleString()}€`, 20, y);
        y += 10;
        
        doc.text(`Beneficio Neto: ${mesActual.beneficioNeto.toLocaleString()}€`, 20, y);
        y += 10;
        
        doc.text(`Margen: ${mesActual.margen.toFixed(2)}%`, 20, y);
        y += 20;
        
        // Lista de proyectos
        doc.setFontSize(14);
        doc.text('Proyectos Activos', 20, y);
        y += 10;
        
        proyectos.forEach((proyecto, index) => {
          if (y > 270) { // Comprobación de salto de página
            doc.addPage();
            y = 20;
          }
          
          doc.setFontSize(12);
          doc.text(`${index + 1}. ${proyecto.nombre} (${proyecto.tipo})`, 20, y);
          y += 7;
          
          doc.setFontSize(10);
          doc.text(`Ciudad: ${proyecto.ciudad}`, 25, y);
          y += 7;
          
          doc.text(`Trabajadores asignados: ${proyecto.trabajadoresAsignados.length}`, 25, y);
          y += 7;
          
          doc.text(`Estado: ${proyecto.estado}`, 25, y);
          y += 15;
        });
      }
      
      // Resumen de empleados
      if (y > 230) { // Comprobación de salto de página
        doc.addPage();
        y = 20;
      } else {
        y += 10;
      }
      
      doc.setFontSize(16);
      doc.text('Resumen de Empleados', 20, y);
      y += 10;
      
      doc.setFontSize(12);
      const empleadosActivos = empleados.filter(e => e.activo);
      doc.text(`Total Empleados Activos: ${empleadosActivos.length}`, 20, y);
      y += 20;
      
      // Guardar PDF
      doc.save(`Reporte_Mensual_${mes}_${año}.pdf`);
      toast.success('Reporte mensual generado correctamente');
    } catch (error) {
      console.error('Error al generar el reporte:', error);
      toast.error('Error al generar el reporte mensual');
    }
  }, [proyectos, empleados, calcularAnalisisMensual]);

  const generarReporteEmpleados = useCallback(async () => {
    try {
      toast.info('Generando reporte de empleados...');
      
      const doc = new jsPDF();
      const fechaActual = new Date();
      
      // Título
      doc.setFontSize(22);
      doc.text('Reporte de Empleados', 105, 20, { align: 'center' });
      
      // Fecha del reporte
      doc.setFontSize(10);
      doc.text(`Generado el ${fechaActual.toLocaleDateString('es-ES')}`, 105, 30, { align: 'center' });
      
      doc.setLineWidth(0.5);
      doc.line(20, 35, 190, 35);
      
      // Información de empleados
      doc.setFontSize(16);
      doc.text('Listado de Empleados', 20, 45);
      
      const empleadosActivos = empleados.filter(e => e.activo);
      
      if (empleadosActivos.length === 0) {
        doc.setFontSize(12);
        doc.text('No hay empleados activos registrados', 20, 55);
      } else {
        let y = 55;
        
        empleadosActivos.forEach((empleado, index) => {
          if (y > 270) { // Comprobación de salto de página
            doc.addPage();
            y = 20;
          }
          
          doc.setFontSize(12);
          doc.text(`${index + 1}. ${empleado.nombre} ${empleado.apellidos}`, 20, y);
          y += 7;
          
          doc.setFontSize(10);
          doc.text(`Teléfono: ${empleado.telefono || 'No registrado'}`, 25, y);
          y += 7;
          
          doc.text(`Departamento: ${empleado.departamento}`, 25, y);
          y += 7;
          
          doc.text(`Categoría: ${empleado.categoria}`, 25, y);
          y += 7;
          
          doc.text(`Salario Bruto: ${empleado.salarioBruto?.toLocaleString() || 0}€`, 25, y);
          y += 7;
          
          const proyectosAsignados = proyectos.filter(p => 
            p.trabajadoresAsignados.some(t => t.id === empleado.id)
          );
          
          doc.text(`Proyectos asignados: ${proyectosAsignados.length}`, 25, y);
          if (proyectosAsignados.length > 0) {
            y += 7;
            proyectosAsignados.forEach(proyecto => {
              doc.text(`- ${proyecto.nombre}`, 30, y);
              y += 7;
            });
          }
          
          y += 10;
        });
      }
      
      // Guardar PDF
      doc.save(`Reporte_Empleados_${fechaActual.toLocaleDateString('es-ES').replace(/\//g, '-')}.pdf`);
      toast.success('Reporte de empleados generado correctamente');
    } catch (error) {
      console.error('Error al generar el reporte:', error);
      toast.error('Error al generar el reporte de empleados');
    }
  }, [empleados, proyectos]);

  const generarReporteFinanciero = useCallback(async () => {
    try {
      toast.info('Generando informe financiero...');
      
      const doc = new jsPDF();
      const fechaActual = new Date();
      const año = fechaActual.getFullYear();
      
      // Título
      doc.setFontSize(22);
      doc.text('Análisis Financiero', 105, 20, { align: 'center' });
      
      // Fecha del reporte
      doc.setFontSize(10);
      doc.text(`Generado el ${fechaActual.toLocaleDateString('es-ES')}`, 105, 30, { align: 'center' });
      
      doc.setLineWidth(0.5);
      doc.line(20, 35, 190, 35);
      
      // Análisis mensual
      doc.setFontSize(16);
      doc.text('Análisis Mensual del Año', 20, 45);
      
      const analisisMensual = calcularAnalisisMensual(proyectos, año);
      
      if (analisisMensual.length === 0) {
        doc.setFontSize(12);
        doc.text('No hay datos disponibles para el análisis', 20, 55);
      } else {
        let y = 55;
        
        // Tabla de cabecera
        doc.setFontSize(10);
        doc.text('Mes', 20, y);
        doc.text('Beneficio Bruto', 60, y);
        doc.text('Gastos', 100, y);
        doc.text('Beneficio Neto', 140, y);
        doc.text('Margen', 180, y);
        
        y += 5;
        doc.line(20, y, 190, y);
        y += 10;
        
        // Datos de cada mes
        analisisMensual.forEach(mes => {
          if (y > 270) { // Comprobación de salto de página
            doc.addPage();
            y = 20;
          }
          
          doc.text(mes.nombreMes, 20, y);
          doc.text(`${mes.beneficioBruto.toLocaleString()}€`, 60, y);
          doc.text(`${mes.gastos.toLocaleString()}€`, 100, y);
          doc.text(`${mes.beneficioNeto.toLocaleString()}€`, 140, y);
          doc.text(`${mes.margen.toFixed(2)}%`, 180, y);
          
          y += 10;
        });
      }
      
      // Guardar PDF
      doc.save(`Analisis_Financiero_${fechaActual.toLocaleDateString('es-ES').replace(/\//g, '-')}.pdf`);
      toast.success('Informe financiero generado correctamente');
    } catch (error) {
      console.error('Error al generar el reporte:', error);
      toast.error('Error al generar el informe financiero');
    }
  }, [proyectos, calcularAnalisisMensual]);

  return {
    generarReporteMensualTrabajadores,
    generarReporteMensual,
    generarReporteEmpleados,
    generarReporteFinanciero
  };
};
