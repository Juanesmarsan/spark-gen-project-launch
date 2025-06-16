
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ProyectoFormData } from "@/types/proyecto";

interface ProyectoFinancialInfoProps {
  formData: ProyectoFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProyectoFormData>>;
}

export const ProyectoFinancialInfo = ({ formData, setFormData }: ProyectoFinancialInfoProps) => {
  return (
    <>
      {formData.tipo === 'presupuesto' ? (
        <div>
          <Label htmlFor="presupuestoTotal">Presupuesto Total (€)</Label>
          <Input
            id="presupuestoTotal"
            type="number"
            value={formData.presupuestoTotal || ''}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              presupuestoTotal: e.target.value ? parseFloat(e.target.value) : undefined,
              precioHora: undefined
            }))}
            required
          />
        </div>
      ) : (
        <div>
          <Label htmlFor="precioHora">Precio por Hora (€)</Label>
          <Input
            id="precioHora"
            type="number"
            step="0.01"
            value={formData.precioHora || ''}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              precioHora: e.target.value ? parseFloat(e.target.value) : undefined,
              presupuestoTotal: undefined
            }))}
            required
          />
        </div>
      )}
    </>
  );
};
