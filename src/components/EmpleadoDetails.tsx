import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Empleado, Epi, Herramienta, Vehiculo, GastoVariableEmpleado, HistorialSalario } from "@/types/empleado";
import { CalendarioMensual } from "./CalendarioMensual";
import { DatosPersonalesTab } from "./empleado/DatosPersonalesTab";
import { EpisTab } from "./empleado/EpisTab";
import { HerramientasTab } from "./empleado/HerramientasTab";
import { DocumentosTab } from "./empleado/DocumentosTab";
import { ProyectosTab } from "./empleado/ProyectosTab";
import { VehiculoTab } from "./empleado/VehiculoTab";
import { GastosVariablesTab } from "./empleado/GastosVariablesTab";
import { HistorialSalariosTab } from "./empleado/HistorialSalariosTab";

interface EmpleadoDetailsProps {
  empleado: Empleado;
  inventarioEpis: Epi[];
  inventarioHerramientas: Herramienta[];
  inventarioVehiculos: Vehiculo[];
  onUpdateEmpleado: (empleado: Empleado) => void;
  onAgregarAdelanto: (concepto: string, cantidad: number) => void;
  onAsignarEpi: (epiId: number, fecha: Date) => void;
  onAsignarHerramienta: (herramientaId: number, fecha: Date) => void;
  onAsignarVehiculo: (vehiculoId: number) => void;
  onAgregarGastoVariable: (gasto: Omit<GastoVariableEmpleado, 'id'>) => void;
  onEditarGastoVariable?: (gastoId: number, gastoActualizado: Omit<GastoVariableEmpleado, 'id'>) => void;
  onEliminarGastoVariable?: (gastoId: number) => void;
  onAgregarCambioSalario: (empleadoId: number, nuevosSalarios: Omit<HistorialSalario, 'id' | 'fechaCambio'>) => void;
}

export const EmpleadoDetails = ({
  empleado,
  inventarioEpis,
  inventarioHerramientas,
  inventarioVehiculos,
  onUpdateEmpleado,
  onAgregarAdelanto,
  onAsignarEpi,
  onAsignarHerramienta,
  onAsignarVehiculo,
  onAgregarGastoVariable,
  onEditarGastoVariable,
  onEliminarGastoVariable,
  onAgregarCambioSalario
}: EmpleadoDetailsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {empleado.nombre} {empleado.apellidos}
          {!empleado.activo && <span className="text-muted-foreground ml-2">(Inactivo)</span>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="datos" className="w-full">
          <TabsList className="grid w-full grid-cols-9">
            <TabsTrigger value="datos">Datos Personales</TabsTrigger>
            <TabsTrigger value="calendario">Calendario</TabsTrigger>
            <TabsTrigger value="salarios">Historial Salarios</TabsTrigger>
            <TabsTrigger value="epis">EPIs</TabsTrigger>
            <TabsTrigger value="herramientas">Herramientas</TabsTrigger>
            <TabsTrigger value="documentos">Documentos</TabsTrigger>
            <TabsTrigger value="proyectos">Proyectos</TabsTrigger>
            <TabsTrigger value="vehiculo">Vehículo</TabsTrigger>
            <TabsTrigger value="gastos">Gastos Variables</TabsTrigger>
          </TabsList>

          <TabsContent value="datos">
            <DatosPersonalesTab
              empleado={empleado}
              onUpdateEmpleado={onUpdateEmpleado}
              onAgregarAdelanto={onAgregarAdelanto}
            />
          </TabsContent>

          <TabsContent value="calendario">
            <CalendarioMensual empleado={empleado} />
          </TabsContent>

          <TabsContent value="salarios">
            <HistorialSalariosTab
              empleado={empleado}
              onAgregarCambioSalario={onAgregarCambioSalario}
            />
          </TabsContent>

          <TabsContent value="epis">
            <EpisTab
              empleado={empleado}
              inventarioEpis={inventarioEpis}
              onAsignarEpi={onAsignarEpi}
            />
          </TabsContent>

          <TabsContent value="herramientas">
            <HerramientasTab
              empleado={empleado}
              inventarioHerramientas={inventarioHerramientas}
              onAsignarHerramienta={onAsignarHerramienta}
            />
          </TabsContent>

          <TabsContent value="documentos">
            <DocumentosTab />
          </TabsContent>

          <TabsContent value="proyectos">
            <ProyectosTab empleado={empleado} />
          </TabsContent>

          <TabsContent value="vehiculo">
            <VehiculoTab
              empleado={empleado}
              inventarioVehiculos={inventarioVehiculos}
              onAsignarVehiculo={onAsignarVehiculo}
            />
          </TabsContent>

          <TabsContent value="gastos">
            <GastosVariablesTab
              empleado={empleado}
              onAgregarGasto={onAgregarGastoVariable}
              onEditarGasto={onEditarGastoVariable}
              onEliminarGasto={onEliminarGastoVariable}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
