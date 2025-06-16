
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Trash2, MapPin, Users, Calendar, Euro } from "lucide-react";
import { Proyecto } from "@/types/proyecto";
import { Empleado } from "@/types/empleado";
import { ProyectoBasicInfo } from "./proyecto/ProyectoBasicInfo";
import { ProyectoFinancialInfo } from "./proyecto/ProyectoFinancialInfo";
import { TrabajadoresTab } from "./proyecto/TrabajadoresTab";
import { GastosVariablesProyectoTab } from "./proyecto/GastosVariablesProyectoTab";
import { CertificacionesTab } from "./proyecto/CertificacionesTab";
import { AnalisisFinancieroTab } from "./proyecto/AnalisisFinancieroTab";
import { ImputacionCostesTab } from "./proyecto/ImputacionCostesTab";

interface ProyectoDetailsProps {
  proyecto: Proyecto;
  empleados: Empleado[];
  onUpdateProyecto: (proyecto: Proyecto) => void;
  onEliminarProyecto: (id: number) => void;
  onAgregarGasto: (proyectoId: number, gasto: any) => void;
  onAgregarCertificacion: (proyectoId: number, certificacion: any) => void;
}

export const ProyectoDetails = ({
  proyecto,
  empleados,
  onUpdateProyecto,
  onEliminarProyecto,
  onAgregarGasto,
  onAgregarCertificacion
}: ProyectoDetailsProps) => {
  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'activo': return 'bg-green-100 text-green-800';
      case 'completado': return 'bg-blue-100 text-blue-800';
      case 'pausado': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTipoLabel = (tipo: string) => {
    return tipo === 'presupuesto' ? 'Por Presupuesto' : 'Por Administración';
  };

  const getTipoColor = (tipo: string) => {
    return tipo === 'presupuesto' ? 'bg-purple-100 text-purple-800' : 'bg-orange-100 text-orange-800';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <CardTitle className="text-xl">{proyecto.nombre}</CardTitle>
              <Badge className={getEstadoColor(proyecto.estado)}>
                {proyecto.estado.charAt(0).toUpperCase() + proyecto.estado.slice(1)}
              </Badge>
              <Badge className={getTipoColor(proyecto.tipo)}>
                {getTipoLabel(proyecto.tipo)}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {proyecto.ciudad}
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {proyecto.trabajadoresAsignados.length} trabajadores
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {proyecto.fechaCreacion.toLocaleDateString()}
              </div>
            </div>
          </div>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                <Trash2 className="w-4 h-4 mr-2" />
                Eliminar
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Eliminar proyecto?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. Se eliminará permanentemente el proyecto
                  "{proyecto.nombre}" y todos sus datos asociados.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onEliminarProyecto(proyecto.id)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Eliminar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="trabajadores">Trabajadores</TabsTrigger>
            <TabsTrigger value="gastos">Gastos Variables</TabsTrigger>
            <TabsTrigger value="costes">Imputación Costes</TabsTrigger>
            <TabsTrigger value="certificaciones">Certificaciones</TabsTrigger>
            <TabsTrigger value="analisis">Análisis</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6 mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <ProyectoBasicInfo 
                proyecto={proyecto} 
                onUpdateProyecto={onUpdateProyecto}
                empleados={empleados}
              />
              <ProyectoFinancialInfo proyecto={proyecto} />
            </div>
            
            {proyecto.descripcion && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Descripción</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{proyecto.descripcion}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="trabajadores" className="mt-6">
            <TrabajadoresTab 
              proyecto={proyecto} 
              empleados={empleados}
              onUpdateProyecto={onUpdateProyecto}
            />
          </TabsContent>

          <TabsContent value="gastos" className="mt-6">
            <GastosVariablesProyectoTab 
              proyecto={proyecto}
              onAgregarGasto={(gasto) => onAgregarGasto(proyecto.id, gasto)}
            />
          </TabsContent>

          <TabsContent value="costes" className="mt-6">
            <ImputacionCostesTab 
              proyecto={proyecto}
              empleados={empleados}
            />
          </TabsContent>

          <TabsContent value="certificaciones" className="mt-6">
            <CertificacionesTab 
              proyecto={proyecto}
              onAgregarCertificacion={(certificacion) => onAgregarCertificacion(proyecto.id, certificacion)}
            />
          </TabsContent>

          <TabsContent value="analisis" className="mt-6">
            <AnalisisFinancieroTab proyecto={proyecto} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
