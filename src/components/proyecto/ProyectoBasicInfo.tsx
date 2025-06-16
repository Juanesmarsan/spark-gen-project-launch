
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ProyectoFormData } from "@/types/proyecto";

interface ProyectoBasicInfoProps {
  formData: ProyectoFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProyectoFormData>>;
}

export const ProyectoBasicInfo = ({ formData, setFormData }: ProyectoBasicInfoProps) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nombre">Nombre del Proyecto</Label>
          <Input
            id="nombre"
            value={formData.nombre}
            onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="ciudad">Ciudad</Label>
          <Input
            id="ciudad"
            value={formData.ciudad}
            onChange={(e) => setFormData(prev => ({ ...prev, ciudad: e.target.value }))}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="tipo">Tipo</Label>
          <Select 
            value={formData.tipo} 
            onValueChange={(value: 'presupuesto' | 'administracion') => 
              setFormData(prev => ({ ...prev, tipo: value }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="presupuesto">Por Presupuesto</SelectItem>
              <SelectItem value="administracion">Por Administración</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="estado">Estado</Label>
          <Select 
            value={formData.estado} 
            onValueChange={(value: 'activo' | 'completado' | 'pausado') => 
              setFormData(prev => ({ ...prev, estado: value }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="activo">Activo</SelectItem>
              <SelectItem value="completado">Completado</SelectItem>
              <SelectItem value="pausado">Pausado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="descripcion">Descripción</Label>
        <Textarea
          id="descripcion"
          value={formData.descripcion}
          onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
          rows={3}
        />
      </div>
    </>
  );
};
