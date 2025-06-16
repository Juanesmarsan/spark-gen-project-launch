
import { Button } from "@/components/ui/button";
import { Plus, Calculator } from "lucide-react";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useImputacionCostesSalariales } from "@/hooks/useImputacionCostesSalariales";
import { useToast } from "@/hooks/use-toast";
import { Empleado } from "@/types/empleado";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface GastosVariablesHeaderProps {
  empleado: Empleado;
  onAgregarGasto: () => void;
}

export const GastosVariablesHeader = ({ empleado, onAgregarGasto }: GastosVariablesHeaderProps) => {
  const [mesSeleccionado, setMesSeleccionado] = useState<string>('2025-06');
  const [procesando, setProcesando] = useState(false);
  
  const { imputarCostesSalarialesEmpleado } = useImputacionCostesSalariales();
  const { toast } = useToast();

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

  const handleImputarGastosSalariales = async () => {
    setProcesando(true);
    
    try {
      const [anio, mes] = mesSeleccionado.split('-').map(Number);
      const imputaciones = imputarCostesSalarialesEmpleado(empleado, mes, anio);
      
      if (imputaciones.length > 0) {
        toast({
          title: "Gastos salariales imputados",
          description: `Se han imputado los costes salariales a ${imputaciones.length} proyecto(s) para ${format(new Date(anio, mes - 1), 'MMMM yyyy', { locale: es })}`,
        });
      } else {
        toast({
          title: "Sin imputaciones",
          description: `No se encontraron proyectos activos para el empleado en ${format(new Date(anio, mes - 1), 'MMMM yyyy', { locale: es })}`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error al imputar gastos salariales:', error);
      toast({
        title: "Error",
        description: "Hubo un error al imputar los gastos salariales.",
        variant: "destructive"
      });
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div className="flex justify-between items-center">
      <div>
        <h3 className="text-lg font-semibold">Gastos Variables</h3>
        <p className="text-sm text-muted-foreground">
          Gestiona dietas, alojamiento, transporte y otros gastos del empleado
        </p>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Select value={mesSeleccionado} onValueChange={setMesSeleccionado}>
            <SelectTrigger className="w-40">
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
            variant="outline" 
            size="sm"
            onClick={handleImputarGastosSalariales}
            disabled={procesando}
            className="bg-blue-50 hover:bg-blue-100"
          >
            <Calculator className="w-4 h-4 mr-2" />
            {procesando ? 'Procesando...' : 'Imputar Salarios'}
          </Button>
        </div>
        
        <Button onClick={onAgregarGasto}>
          <Plus className="w-4 h-4 mr-2" />
          Añadir Gasto
        </Button>
      </div>
    </div>
  );
};
