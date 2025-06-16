
import { Empleado } from "@/types/empleado";
import { DatosPersonalesForm } from "./DatosPersonalesForm";
import { SalarioInfo } from "./SalarioInfo";
import { AdelantosSection } from "./AdelantosSection";

interface DatosPersonalesTabProps {
  empleado: Empleado;
  onUpdateEmpleado: (empleado: Empleado) => void;
  onAgregarAdelanto: (concepto: string, cantidad: number) => void;
}

export const DatosPersonalesTab = ({ empleado, onUpdateEmpleado, onAgregarAdelanto }: DatosPersonalesTabProps) => {
  return (
    <div className="space-y-6">
      <DatosPersonalesForm 
        empleado={empleado}
        onUpdateEmpleado={onUpdateEmpleado}
      />
      
      <SalarioInfo empleado={empleado} />
      
      <AdelantosSection 
        empleado={empleado}
        onAgregarAdelanto={onAgregarAdelanto}
      />
    </div>
  );
};
