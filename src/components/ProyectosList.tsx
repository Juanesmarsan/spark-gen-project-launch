
import { Proyecto } from "@/types/proyecto";
import { ProyectoCard } from "./ProyectoCard";

interface ProyectosListProps {
  proyectos: Proyecto[];
  onSelectProyecto: (proyecto: Proyecto) => void;
}

export const ProyectosList = ({ proyectos, onSelectProyecto }: ProyectosListProps) => {
  if (proyectos.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No hay proyectos creados todavía.</p>
        <p className="text-sm text-gray-400">Haz clic en "Añadir Proyecto" para crear el primero.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {proyectos.map((proyecto) => (
        <div key={proyecto.id} onClick={() => onSelectProyecto(proyecto)} className="cursor-pointer">
          <ProyectoCard
            proyecto={proyecto}
            onEdit={() => onSelectProyecto(proyecto)}
            onDelete={() => {}}
          />
        </div>
      ))}
    </div>
  );
};
