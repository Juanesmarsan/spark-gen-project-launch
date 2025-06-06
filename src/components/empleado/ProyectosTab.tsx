
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const proyectos = ["Proyecto Alpha", "Proyecto Beta", "Proyecto Gamma"];

export const ProyectosTab = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Proyectos Asignados</h3>
        <Select>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Asignar proyecto" />
          </SelectTrigger>
          <SelectContent>
            {proyectos.map((proyecto) => (
              <SelectItem key={proyecto} value={proyecto}>
                {proyecto}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="text-center text-muted-foreground py-8">
        Gestión de proyectos - En desarrollo
      </div>
    </div>
  );
};
