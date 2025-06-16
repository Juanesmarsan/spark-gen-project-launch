
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, startOfMonth } from "date-fns";
import { es } from "date-fns/locale";
import { Proyecto, Trabajador } from "@/types/proyecto";
import { useEmpleados } from "@/hooks/useEmpleados";
import { useCalculosEmpleados } from "@/hooks/gastosEmpleados/useCalculosEmpleados";

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
  const { empleados } = useEmpleados();
  const { calcularCosteEmpleado, calcularDiasLaborales } = useCalculosEmpleados();

  if (proyecto.tipo !== 'administracion' || proyecto.trabajadoresAsignados.length === 0) {
    return null;
  }

  const mes = mesSeleccionado.getMonth() + 1;
  const año = mesSeleccionado.getFullYear();
  const diasLaboralesMes = calcularDiasLaborales(mes, año);

  const calcularCosteTotalMes = () => {
    let totalCoste = 0;

    proyecto.trabajadoresAsignados.forEach(trabajador => {
      const empleado = empleados.find(e => e.id === trabajador.id);
      if (!empleado) return;

      const horasDelMes = calcularHorasTrabajador(trabajador, mesSeleccionado);
      const costeEmpleado = calcularCosteEmpleado(empleado.id, mes, año);
      
      if (costeEmpleado && horasDelMes > 0) {
        // Calcular coste proporcional basado en las horas trabajadas
        const horasEstandardMes = diasLaboralesMes * 8; // 8 horas por día laboral
        const factorProporcional = horasDelMes / horasEstandardMes;
        const costeProporcional = costeEmpleado.costeTotalMensual * factorProporcional;
        totalCoste += costeProporcional;
      }
    });

    return totalCoste;
  };

  const totalHoras = proyecto.trabajadoresAsignados.reduce((total, trabajador) => 
    total + calcularHorasTrabajador(trabajador, mesSeleccionado), 0
  );

  const totalCoste = calcularCosteTotalMes();

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
              {totalHoras}h
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-900">Total Coste</h3>
            <p className="text-2xl font-bold text-green-700">
              €{totalCoste.toFixed(2)}
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
