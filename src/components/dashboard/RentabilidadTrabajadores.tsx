
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface RentabilidadTrabajador {
  id: number;
  nombre: string;
  salarioBruto: number;
  importeHorasExtras: number;
  importeHorasFestivas: number;
  salarioBrutoConExtras: number;
  salarioNeto: number;
  adelantosDelMes: number;
  salarioAPagar: number;
  ingresosGenerados: number;
  costoTotalEmpleado: number;
  rentabilidad: number;
  porcentajeRentabilidad: number;
}

interface RentabilidadTrabajadoresProps {
  trabajadores: RentabilidadTrabajador[];
}

export const RentabilidadTrabajadores: React.FC<RentabilidadTrabajadoresProps> = ({ trabajadores }) => {
  const trabajadoresOrdenados = [...trabajadores].sort((a, b) => b.rentabilidad - a.rentabilidad);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rentabilidad por Trabajador</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {trabajadoresOrdenados.map((trabajador) => (
            <div key={trabajador.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold text-lg">{trabajador.nombre}</h4>
                <Badge 
                  variant={trabajador.rentabilidad >= 0 ? "default" : "destructive"}
                  className="text-sm"
                >
                  {trabajador.porcentajeRentabilidad.toFixed(1)}% rentabilidad
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <h5 className="font-medium text-blue-700">Cálculo Salario:</h5>
                  <div className="pl-2 space-y-1">
                    <div className="flex justify-between">
                      <span>Salario Bruto Base:</span>
                      <span>€{trabajador.salarioBruto.toFixed(2)}</span>
                    </div>
                    {trabajador.importeHorasExtras > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>+ Horas Extras:</span>
                        <span>€{trabajador.importeHorasExtras.toFixed(2)}</span>
                      </div>
                    )}
                    {trabajador.importeHorasFestivas > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>+ Horas Festivas:</span>
                        <span>€{trabajador.importeHorasFestivas.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-medium border-t pt-1">
                      <span>Salario Bruto Total:</span>
                      <span>€{trabajador.salarioBrutoConExtras.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Salario Neto:</span>
                      <span>€{trabajador.salarioNeto.toFixed(2)}</span>
                    </div>
                    {trabajador.adelantosDelMes > 0 && (
                      <div className="flex justify-between text-red-600">
                        <span>- Adelantos Mes:</span>
                        <span>€{trabajador.adelantosDelMes.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold border-t pt-1">
                      <span>A Pagar:</span>
                      <span className="text-green-700">€{trabajador.salarioAPagar.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h5 className="font-medium text-green-700">Rentabilidad:</h5>
                  <div className="pl-2 space-y-1">
                    <div className="flex justify-between">
                      <span>Ingresos Generados:</span>
                      <span className="text-green-600">€{trabajador.ingresosGenerados.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Costo Total:</span>
                      <span className="text-red-600">€{trabajador.costoTotalEmpleado.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold border-t pt-1">
                      <span>Rentabilidad:</span>
                      <span className={trabajador.rentabilidad >= 0 ? "text-green-700" : "text-red-700"}>
                        €{trabajador.rentabilidad.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded p-2">
                <div className="flex justify-between text-sm">
                  <span>Eficiencia:</span>
                  <span className={trabajador.porcentajeRentabilidad >= 20 ? "text-green-600 font-semibold" : 
                                  trabajador.porcentajeRentabilidad >= 0 ? "text-yellow-600" : "text-red-600 font-semibold"}>
                    {trabajador.porcentajeRentabilidad > 0 ? "+" : ""}{trabajador.porcentajeRentabilidad.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
