
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Proyecto } from "@/types/proyecto";
import { CheckCircle, Circle, Clock, AlertCircle, Edit, Save, X } from "lucide-react";

interface TimelinePresupuestoProps {
  proyecto: Proyecto;
  onUpdateProyecto: (proyecto: Proyecto) => void;
}

interface PasoTimeline {
  id: number;
  titulo: string;
  descripcion: string;
  completado: boolean;
  fecha?: Date;
  color: string;
  icono: any;
  porcentajeRequerido?: number;
}

export const TimelinePresupuesto: React.FC<TimelinePresupuestoProps> = ({ 
  proyecto, 
  onUpdateProyecto 
}) => {
  if (proyecto.tipo !== 'presupuesto') {
    return null;
  }

  const [editingPaso, setEditingPaso] = useState<number | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const certificacionesOrdenadas = proyecto.certificaciones?.sort((a, b) => {
    const fechaA = new Date(a.anio, a.mes - 1);
    const fechaB = new Date(b.anio, b.mes - 1);
    return fechaA.getTime() - fechaB.getTime();
  }) || [];

  const totalCertificado = certificacionesOrdenadas.reduce((sum, cert) => sum + cert.importe, 0);
  const porcentajeCompletado = proyecto.presupuestoTotal ? (totalCertificado / proyecto.presupuestoTotal) * 100 : 0;

  const [pasos, setPasos] = useState<PasoTimeline[]>([
    {
      id: 1,
      titulo: "Proyecto Iniciado",
      descripcion: "Proyecto creado y configurado",
      completado: true,
      fecha: proyecto.fechaCreacion,
      color: "bg-green-500",
      icono: CheckCircle
    },
    {
      id: 2,
      titulo: "Primera Certificación",
      descripcion: "Primera facturación del proyecto",
      completado: certificacionesOrdenadas.length > 0,
      fecha: certificacionesOrdenadas[0]?.fechaRegistro,
      color: certificacionesOrdenadas.length > 0 ? "bg-blue-500" : "bg-gray-300",
      icono: certificacionesOrdenadas.length > 0 ? CheckCircle : Circle,
      porcentajeRequerido: 0
    },
    {
      id: 3,
      titulo: "50% Completado",
      descripcion: "Mitad del presupuesto certificado",
      completado: porcentajeCompletado >= 50,
      fecha: porcentajeCompletado >= 50 ? new Date() : undefined,
      color: porcentajeCompletado >= 50 ? "bg-yellow-500" : "bg-gray-300",
      icono: porcentajeCompletado >= 50 ? CheckCircle : Clock,
      porcentajeRequerido: 50
    },
    {
      id: 4,
      titulo: "80% Completado",
      descripcion: "Cerca de la finalización",
      completado: porcentajeCompletado >= 80,
      fecha: porcentajeCompletado >= 80 ? new Date() : undefined,
      color: porcentajeCompletado >= 80 ? "bg-orange-500" : "bg-gray-300",
      icono: porcentajeCompletado >= 80 ? CheckCircle : Clock,
      porcentajeRequerido: 80
    },
    {
      id: 5,
      titulo: "Proyecto Finalizado",
      descripcion: "100% del presupuesto certificado",
      completado: porcentajeCompletado >= 100 || proyecto.estado === 'completado',
      fecha: proyecto.estado === 'completado' ? new Date() : undefined,
      color: (porcentajeCompletado >= 100 || proyecto.estado === 'completado') ? "bg-green-600" : "bg-gray-300",
      icono: (porcentajeCompletado >= 100 || proyecto.estado === 'completado') ? CheckCircle : AlertCircle,
      porcentajeRequerido: 100
    }
  ]);

  const handleEditPaso = (pasoId: number, updates: Partial<PasoTimeline>) => {
    setPasos(prev => prev.map(paso => 
      paso.id === pasoId ? { ...paso, ...updates } : paso
    ));
  };

  const handleToggleCompletado = (pasoId: number) => {
    const paso = pasos.find(p => p.id === pasoId);
    if (paso) {
      const nuevoEstado = !paso.completado;
      handleEditPaso(pasoId, {
        completado: nuevoEstado,
        fecha: nuevoEstado ? new Date() : undefined,
        color: nuevoEstado ? paso.color.replace('gray-300', 'green-500') : 'bg-gray-300',
        icono: nuevoEstado ? CheckCircle : Clock
      });
    }
  };

  const EditPasoForm = ({ paso }: { paso: PasoTimeline }) => {
    const [titulo, setTitulo] = useState(paso.titulo);
    const [descripcion, setDescripcion] = useState(paso.descripcion);
    const [completado, setCompletado] = useState(paso.completado);

    const handleSave = () => {
      handleEditPaso(paso.id, {
        titulo,
        descripcion,
        completado,
        fecha: completado ? new Date() : undefined
      });
      setEditingPaso(null);
      setShowEditDialog(false);
    };

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Título</label>
          <Input
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Título del paso"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Descripción</label>
          <Textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Descripción del paso"
            rows={3}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Estado</label>
          <Select value={completado ? "completado" : "pendiente"} onValueChange={(value) => setCompletado(value === "completado")}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="completado">Completado</SelectItem>
              <SelectItem value="pendiente">Pendiente</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSave} size="sm">
            <Save className="w-4 h-4 mr-1" />
            Guardar
          </Button>
          <Button variant="outline" onClick={() => {
            setEditingPaso(null);
            setShowEditDialog(false);
          }} size="sm">
            <X className="w-4 h-4 mr-1" />
            Cancelar
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Timeline del Proyecto
          <Button 
            variant="outline" 
            size="sm" 
            className="ml-auto"
            onClick={() => setShowEditDialog(true)}
          >
            <Edit className="w-4 h-4 mr-1" />
            Editar Timeline
          </Button>
        </CardTitle>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progreso del presupuesto</span>
            <span className="font-medium">{porcentajeCompletado.toFixed(1)}%</span>
          </div>
          <Progress value={porcentajeCompletado} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>€{totalCertificado.toLocaleString()}</span>
            <span>€{proyecto.presupuestoTotal?.toLocaleString()}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {pasos.map((paso, index) => {
            const Icono = paso.icono;
            const siguientePaso = pasos[index + 1];
            
            return (
              <div key={paso.id} className="relative">
                {/* Línea conectora */}
                {siguientePaso && (
                  <div 
                    className={`absolute left-4 top-8 w-0.5 h-12 ${
                      paso.completado ? 'bg-green-300' : 'bg-gray-200'
                    }`}
                  />
                )}
                
                {/* Contenido del paso */}
                <div className="flex items-start gap-4">
                  {/* Icono del paso con toggle */}
                  <button
                    onClick={() => handleToggleCompletado(paso.id)}
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${paso.color} hover:opacity-80 transition-opacity`}
                  >
                    <Icono className={`w-4 h-4 ${paso.completado ? 'text-white' : 'text-gray-500'}`} />
                  </button>
                  
                  {/* Información del paso */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={`font-medium ${paso.completado ? 'text-gray-900' : 'text-gray-500'}`}>
                        {paso.titulo}
                      </h4>
                      <Badge variant={paso.completado ? 'default' : 'secondary'} className="text-xs">
                        {paso.completado ? 'Completado' : 'Pendiente'}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingPaso(paso.id);
                          setShowEditDialog(true);
                        }}
                        className="h-6 w-6 p-0 ml-auto"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                    </div>
                    <p className={`text-sm ${paso.completado ? 'text-gray-600' : 'text-gray-400'}`}>
                      {paso.descripcion}
                    </p>
                    {paso.fecha && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {paso.fecha.toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Resumen estadístico */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h5 className="font-medium mb-3">Resumen del Timeline</h5>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Pasos completados:</span>
              <span className="ml-2 font-medium">
                {pasos.filter(p => p.completado).length} / {pasos.length}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Estado actual:</span>
              <span className="ml-2 font-medium capitalize">
                {proyecto.estado}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Certificaciones:</span>
              <span className="ml-2 font-medium">
                {certificacionesOrdenadas.length}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Importe restante:</span>
              <span className="ml-2 font-medium">
                €{((proyecto.presupuestoTotal || 0) - totalCertificado).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Dialog de edición */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingPaso ? `Editar Paso ${editingPaso}` : 'Editar Timeline'}
              </DialogTitle>
            </DialogHeader>
            {editingPaso && (
              <EditPasoForm paso={pasos.find(p => p.id === editingPaso)!} />
            )}
            {!editingPaso && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Haz clic en el icono de edición junto a cada paso para modificarlo individualmente, 
                  o haz clic en los iconos de estado para marcar pasos como completados/pendientes.
                </p>
                <Button onClick={() => setShowEditDialog(false)}>
                  Cerrar
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
