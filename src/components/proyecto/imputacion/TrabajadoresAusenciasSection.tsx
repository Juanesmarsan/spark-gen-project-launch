
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { Proyecto } from "@/types/proyecto";
import { Empleado } from "@/types/empleado";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { TrabajadoresTable } from "./trabajadores/TrabajadoresTable";

interface TrabajadoresAusenciasSectionProps {
  proyecto: Proyecto;
  empleados: Empleado[];
  mes: number;
  anio: number;
}

export const TrabajadoresAusenciasSection = ({
  proyecto,
  empleados,
  mes,
  anio
}: TrabajadoresAusenciasSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Detalle de Trabajadores - {format(new Date(anio, mes - 1), 'MMMM yyyy', { locale: es })}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <TrabajadoresTable
          proyecto={proyecto}
          empleados={empleados}
          mes={mes}
          anio={anio}
        />
      </CardContent>
    </Card>
  );
};
