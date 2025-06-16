
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface GastosVariablesHeaderProps {
  onAgregarGasto: () => void;
}

export const GastosVariablesHeader = ({ onAgregarGasto }: GastosVariablesHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h3 className="text-lg font-semibold">Gastos Variables</h3>
        <p className="text-sm text-muted-foreground">
          Gestiona dietas, alojamiento, transporte y otros gastos del empleado
        </p>
      </div>
      
      <Button onClick={onAgregarGasto}>
        <Plus className="w-4 h-4 mr-2" />
        Añadir Gasto
      </Button>
    </div>
  );
};
