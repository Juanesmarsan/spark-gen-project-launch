
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Euro, Calendar, FileText } from "lucide-react";
import { Proyecto, CertificacionMensual } from "@/types/proyecto";

interface CertificacionesTabProps {
  proyecto: Proyecto;
  onAgregarCertificacion: (certificacion: Omit<CertificacionMensual, 'id' | 'fechaRegistro'>) => void;
}

const meses = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export const CertificacionesTab = ({ proyecto, onAgregarCertificacion }: CertificacionesTabProps) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    mes: new Date().getMonth() + 1,
    anio: new Date().getFullYear(),
    importe: 0,
    descripcion: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAgregarCertificacion(formData);
    setShowForm(false);
    setFormData({
      mes: new Date().getMonth() + 1,
      anio: new Date().getFullYear(),
      importe: 0,
      descripcion: ''
    });
  };

  const certificaciones = proyecto.certificaciones || [];
  const totalCertificado = certificaciones.reduce((sum, cert) => sum + cert.importe, 0);
  const porcentajeEjecutado = proyecto.presupuestoTotal ? 
    ((totalCertificado / proyecto.presupuestoTotal) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Certificaciones Mensuales</h3>
          <p className="text-sm text-gray-600">
            Registra las certificaciones mensuales del proyecto
          </p>
        </div>
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button className="bg-omenar-green hover:bg-omenar-dark-green">
              <Plus className="w-4 h-4 mr-2" />
              Nueva Certificación
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nueva Certificación</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="mes">Mes</Label>
                  <Select 
                    value={formData.mes.toString()} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, mes: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {meses.map((mes, index) => (
                        <SelectItem key={index} value={(index + 1).toString()}>
                          {mes}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="anio">Año</Label>
                  <Input
                    id="anio"
                    type="number"
                    value={formData.anio}
                    onChange={(e) => setFormData(prev => ({ ...prev, anio: parseInt(e.target.value) }))}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="importe">Importe (€)</Label>
                <Input
                  id="importe"
                  type="number"
                  step="0.01"
                  value={formData.importe || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, importe: parseFloat(e.target.value) || 0 }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
                  placeholder="Descripción de la certificación..."
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-omenar-green hover:bg-omenar-dark-green">
                  Guardar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Resumen */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Euro className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Total Certificado</p>
                <p className="text-lg font-semibold">{totalCertificado.toLocaleString()}€</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Presupuesto Total</p>
                <p className="text-lg font-semibold">{proyecto.presupuestoTotal?.toLocaleString() || 0}€</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">% Ejecutado</p>
                <p className="text-lg font-semibold">{porcentajeEjecutado}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de certificaciones */}
      <div className="space-y-3">
        {certificaciones.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No hay certificaciones registradas</p>
              <p className="text-sm text-gray-400">Agrega la primera certificación del proyecto</p>
            </CardContent>
          </Card>
        ) : (
          certificaciones
            .sort((a, b) => (b.anio - a.anio) || (b.mes - a.mes))
            .map((certificacion) => (
              <Card key={certificacion.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">
                          {meses[certificacion.mes - 1]} {certificacion.anio}
                        </Badge>
                        <Badge className="bg-green-100 text-green-800">
                          {certificacion.importe.toLocaleString()}€
                        </Badge>
                      </div>
                      {certificacion.descripcion && (
                        <p className="text-sm text-gray-600">{certificacion.descripcion}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        Registrado: {certificacion.fechaRegistro.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
        )}
      </div>
    </div>
  );
};
