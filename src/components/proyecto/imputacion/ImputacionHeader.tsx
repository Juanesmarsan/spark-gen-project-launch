
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator } from "lucide-react";

interface ImputacionHeaderProps {
  mesSeleccionado: string;
  onMesChange: (mes: string) => void;
  onImputarCostes: () => void;
  procesando: boolean;
}

export const ImputacionHeader = ({ 
  mesSeleccionado, 
  onMesChange, 
  onImputarCostes, 
  procesando 
}: ImputacionHeaderProps) => {
  const mesesDisponibles = [
    { value: '2025-01', label: 'Enero 2025' },
    { value: '2025-02', label: 'Febrero 2025' },
    { value: '2025-03', label: 'Marzo 2025' },
    { value: '2025-04', label: 'Abril 2025' },
    { value: '2025-05', label: 'Mayo 2025' },
    { value: '2025-06', label: 'Junio 2025' },
    { value: '2025-07', label: 'Julio 2025' },
    { value: '2025-08', label: 'Agosto 2025' },
    { value: '2025-09', label: 'Septiembre 2025' },
    { value: '2025-10', label: 'Octubre 2025' },
    { value: '2025-11', label: 'Noviembre 2025' },
    { value: '2025-12', label: 'Diciembre 2025' },
  ];

  return (
    <div className="flex justify-between items-center">
      <div>
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Calculator className="w-5 h-5" />
          Imputación de Costes
        </h3>
        <p className="text-sm text-muted-foreground">
          Gestiona la imputación automática de costes salariales y gastos variables al proyecto
        </p>
      </div>

      <div className="flex items-center gap-4">
        <Select value={mesSeleccionado} onValueChange={onMesChange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Seleccionar mes" />
          </SelectTrigger>
          <SelectContent>
            {mesesDisponibles.map((mes) => (
              <SelectItem key={mes.value} value={mes.value}>
                {mes.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button 
          onClick={onImputarCostes}
          disabled={procesando}
          className="bg-green-600 hover:bg-green-700"
        >
          <Calculator className="w-4 h-4 mr-2" />
          {procesando ? 'Procesando...' : 'Imputar Costes'}
        </Button>
      </div>
    </div>
  );
};
