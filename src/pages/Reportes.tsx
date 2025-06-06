
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePdfGenerator } from "@/hooks/usePdfGenerator";
import { FileText, Users, TrendingUp, Download } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";

const Reportes = () => {
  const { generarReporteMensual, generarReporteEmpleados, generarReporteFinanciero } = usePdfGenerator();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reporteSeleccionado, setReporteSeleccionado] = useState<string | null>(null);

  const handleGenerarReporte = () => {
    setDialogOpen(true);
  };

  const generarReporte = () => {
    if (reporteSeleccionado === 'mensual') {
      generarReporteMensual();
    } else if (reporteSeleccionado === 'empleados') {
      generarReporteEmpleados();
    } else if (reporteSeleccionado === 'financiero') {
      generarReporteFinanciero();
    }
    setDialogOpen(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Reportes</h1>
        <Button onClick={handleGenerarReporte} className="bg-omenar-green hover:bg-omenar-dark-green">
          <FileText className="w-4 h-4 mr-2" />
          Generar Reporte
        </Button>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Seleccionar tipo de reporte</DialogTitle>
              <DialogDescription>
                Elige el tipo de reporte que deseas generar
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Button
                  variant={reporteSeleccionado === 'mensual' ? 'default' : 'outline'}
                  className="w-full justify-start"
                  onClick={() => setReporteSeleccionado('mensual')}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Reporte Mensual
                </Button>
                <Button
                  variant={reporteSeleccionado === 'empleados' ? 'default' : 'outline'}
                  className="w-full justify-start"
                  onClick={() => setReporteSeleccionado('empleados')}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Reporte de Empleados
                </Button>
                <Button
                  variant={reporteSeleccionado === 'financiero' ? 'default' : 'outline'}
                  className="w-full justify-start"
                  onClick={() => setReporteSeleccionado('financiero')}
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Análisis Financiero
                </Button>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button onClick={generarReporte} disabled={!reporteSeleccionado}>
                Generar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Reporte Mensual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Resumen completo del mes actual con datos de proyectos y beneficios
            </p>
            <Button variant="outline" className="w-full" onClick={generarReporteMensual}>
              <Download className="w-4 h-4 mr-2" />
              Descargar PDF
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Reporte de Empleados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Listado detallado de empleados activos y sus asignaciones
            </p>
            <Button variant="outline" className="w-full" onClick={generarReporteEmpleados}>
              <Download className="w-4 h-4 mr-2" />
              Descargar PDF
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Análisis Financiero
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Análisis mensual detallado de ingresos, gastos y márgenes
            </p>
            <Button variant="outline" className="w-full" onClick={generarReporteFinanciero}>
              <Download className="w-4 h-4 mr-2" />
              Descargar PDF
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reportes;
