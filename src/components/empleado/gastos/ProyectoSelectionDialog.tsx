
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Building2 } from "lucide-react";

interface ProyectoSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  proyectosDisponibles: Array<{id: number, nombre: string}>;
  onSelectProyecto: (proyectoId: number) => void;
  onNoImputar: () => void;
}

export const ProyectoSelectionDialog = ({ 
  open, 
  onOpenChange, 
  proyectosDisponibles, 
  onSelectProyecto, 
  onNoImputar 
}: ProyectoSelectionDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Seleccionar Proyecto
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            El empleado está asignado a múltiples proyectos activos. ¿A qué proyecto deseas imputar este gasto?
          </p>
          <div className="space-y-2">
            {proyectosDisponibles.map((proyecto) => (
              <Button
                key={proyecto.id}
                variant="outline"
                className="w-full justify-start"
                onClick={() => onSelectProyecto(proyecto.id)}
              >
                <Building2 className="w-4 h-4 mr-2" />
                {proyecto.nombre}
              </Button>
            ))}
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onNoImputar}>
              No imputar a proyecto
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
