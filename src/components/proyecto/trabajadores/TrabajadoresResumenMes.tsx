
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, startOfMonth } from "date-fns";
import { es } from "date-fns/locale";
import { Proyecto, Trabajador } from "@/types/proyecto";

interface TrabajadoresResumenMesProps {
  proyecto: Proyecto;
  mesSeleccionado: Date;
  calcularHorasTrabajador: (trabajador: Trabajador, mesSeleccionado: Date) => number;
}

export const TrabajadoresResumenMes = ({
  proyecto,
  mesSeleccionado,
  calcularHorasTrabajador
}: TrabajadoresResumenMesProps) => {
  if (proyecto.tipo !== 'administracion' || proyecto.trabajadoresAsignados.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumen del Mes - {format(mesSeleccionado, 'MMMM yyyy', { locale: es })}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900">Total Horas</h3>
            <p className="text-2xl font-bold text-blue-700">
              {proyecto.trabajadoresAsignados.reduce((total, trabajador) => 
                total + calcularHorasTrabajador(trabajador, mesSeleccionado), 0
              )}h
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-900">Total Coste</h3>
            <p className="text-2xl font-bold text-green-700">
              €{proyecto.trabajadoresAsignados.reduce((total, trabajador) => {
                const horas = calcularHorasTrabajador(trabajador, mesSeleccionado);
                return total + (trabajador.precioHora ? horas * trabajador.precioHora : 0);
              }, 0).toFixed(2)}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold text-purple-900">Trabajadores Activos</h3>
            <p className="text-2xl font-bold text-purple-700">
              {proyecto.trabajadoresAsignados.filter(t => !t.fechaSalida || t.fechaSalida >= startOfMonth(mesSeleccionado)).length}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
