
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Empleado, Epi, Herramienta, Vehiculo } from "@/types/empleado";
import { CalendarioMensual } from "./CalendarioMensual";
import { DatosPersonalesTab } from "./empleado/DatosPersonalesTab";
import { EpisTab } from "./empleado/EpisTab";
import { HerramientasTab } from "./empleado/HerramientasTab";
import { DocumentosTab } from "./empleado/DocumentosTab";
import { ProyectosTab } from "./empleado/ProyectosTab";
import { VehiculoTab } from "./empleado/VehiculoTab";

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
  onAsignarVehiculo
}: EmpleadoDetailsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {empleado.nombre} {empleado.apellidos}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="datos" className="w-full">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="datos">Datos Personales</TabsTrigger>
            <TabsTrigger value="calendario">Calendario</TabsTrigger>
            <TabsTrigger value="epis">EPIs</TabsTrigger>
            <TabsTrigger value="herramientas">Herramientas</TabsTrigger>
            <TabsTrigger value="documentos">Documentos</TabsTrigger>
            <TabsTrigger value="proyectos">Proyectos</TabsTrigger>
            <TabsTrigger value="vehiculo">Vehículo</TabsTrigger>
          </TabsList>

          <TabsContent value="datos">
            <DatosPersonalesTab
              empleado={empleado}
              onUpdateEmpleado={onUpdateEmpleado}
              onAgregarAdelanto={onAgregarAdelanto}
            />
          </TabsContent>

          <TabsContent value="calendario">
            <CalendarioMensual empleadoId={empleado.id} />
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
            <ProyectosTab />
          </TabsContent>

          <TabsContent value="vehiculo">
            <VehiculoTab
              empleado={empleado}
              inventarioVehiculos={inventarioVehiculos}
              onAsignarVehiculo={onAsignarVehiculo}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
