import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, Trash2, MapPin, Users, Euro, Clock, Calendar } from "lucide-react";
import { Proyecto } from "@/types/proyecto";
import { Empleado } from "@/types/empleado";
import { ProyectoForm } from "./ProyectoForm";
import { GastosVariablesProyectoTab } from "./proyecto/GastosVariablesProyectoTab";
import { CertificacionesTab } from "./proyecto/CertificacionesTab";
import { AnalisisFinancieroTab } from "./proyecto/AnalisisFinancieroTab";
import { TrabajadoresTab } from "./proyecto/TrabajadoresTab";

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
  const [showEditForm, setShowEditForm] = useState(false);

  const getEstadoBadgeColor = (estado: string) => {
    switch (estado) {
      case 'activo':
        return 'bg-green-100 text-green-800';
      case 'completado':
        return 'bg-blue-100 text-blue-800';
      case 'pausado':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTipoBadgeColor = (tipo: string) => {
    return tipo === 'presupuesto' 
      ? 'bg-purple-100 text-purple-800'
      : 'bg-orange-100 text-orange-800';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl">{proyecto.nombre}</CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge className={getEstadoBadgeColor(proyecto.estado)}>
                {proyecto.estado.charAt(0).toUpperCase() + proyecto.estado.slice(1)}
              </Badge>
              <Badge className={getTipoBadgeColor(proyecto.tipo)}>
                {proyecto.tipo === 'presupuesto' ? 'Por Presupuesto' : 'Por Administración'}
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Dialog open={showEditForm} onOpenChange={setShowEditForm}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-1" />
                  Editar
                </Button>
              </DialogTrigger>
              <ProyectoForm
                onSubmit={(data) => {
                  const updatedProyecto: Proyecto = {
                    ...proyecto,
                    ...data,
                    trabajadoresAsignados: data.trabajadoresAsignados.map(id => {
                      const empleado = empleados.find(e => e.id === id);
                      const fechasTrabajador = data.trabajadoresConFechas?.find(t => t.id === id);
                      
                      return empleado ? {
                        id: empleado.id,
                        nombre: empleado.nombre,
                        apellidos: empleado.apellidos,
                        precioHora: data.tipo === 'administracion' ? data.precioHora : undefined,
                        fechaEntrada: fechasTrabajador?.fechaEntrada,
                        fechaSalida: fechasTrabajador?.fechaSalida
                      } : { 
                        id, 
                        nombre: '', 
                        apellidos: '',
                        fechaEntrada: fechasTrabajador?.fechaEntrada,
                        fechaSalida: fechasTrabajador?.fechaSalida
                      };
                    })
                  };
                  onUpdateProyecto(updatedProyecto);
                  setShowEditForm(false);
                }}
                onCancel={() => setShowEditForm(false)}
                empleados={empleados}
                proyecto={proyecto}
                isEditing={true}
              />
            </Dialog>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onEliminarProyecto(proyecto.id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Eliminar
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="detalles" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="detalles">Detalles</TabsTrigger>
            <TabsTrigger value="trabajadores">Trabajadores</TabsTrigger>
            <TabsTrigger value="gastos">Gastos</TabsTrigger>
            <TabsTrigger value="certificaciones">
              {proyecto.tipo === 'presupuesto' ? 'Certificaciones' : 'Facturación'}
            </TabsTrigger>
            <TabsTrigger value="financiero">Análisis</TabsTrigger>
          </TabsList>

          <TabsContent value="detalles" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gray-500" />
                <span><strong>Ciudad:</strong> {proyecto.ciudad}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-500" />
                <span><strong>Creado:</strong> {proyecto.fechaCreacion.toLocaleDateString()}</span>
              </div>
              
              {proyecto.tipo === 'presupuesto' ? (
                <div className="flex items-center gap-2">
                  <Euro className="w-5 h-5 text-gray-500" />
                  <span><strong>Presupuesto:</strong> {proyecto.presupuestoTotal?.toLocaleString()}€</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <span><strong>Precio/hora:</strong> {proyecto.precioHora}€</span>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-gray-500" />
                <span><strong>Trabajadores:</strong> {proyecto.trabajadoresAsignados.length}</span>
              </div>
            </div>

            {proyecto.descripcion && (
              <div>
                <h4 className="font-semibold mb-2">Descripción</h4>
                <p className="text-gray-600">{proyecto.descripcion}</p>
              </div>
            )}

            {proyecto.trabajadoresAsignados.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Trabajadores Asignados</h4>
                <div className="grid gap-2">
                  {proyecto.trabajadoresAsignados.map((trabajador) => (
                    <div key={trabajador.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>{trabajador.nombre} {trabajador.apellidos}</span>
                      {trabajador.precioHora && (
                        <Badge variant="outline">{trabajador.precioHora}€/hora</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="trabajadores">
            <TrabajadoresTab
              proyecto={proyecto}
              onUpdateProyecto={onUpdateProyecto}
            />
          </TabsContent>

          <TabsContent value="gastos">
            <GastosVariablesProyectoTab
              proyecto={proyecto}
              onAgregarGasto={(gasto) => onAgregarGasto(proyecto.id, gasto)}
            />
          </TabsContent>

          <TabsContent value="certificaciones">
            {proyecto.tipo === 'presupuesto' ? (
              <CertificacionesTab
                proyecto={proyecto}
                onAgregarCertificacion={(certificacion) => onAgregarCertificacion(proyecto.id, certificacion)}
              />
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Funcionalidad de facturación por administración próximamente...</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="financiero">
            <AnalisisFinancieroTab proyecto={proyecto} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
