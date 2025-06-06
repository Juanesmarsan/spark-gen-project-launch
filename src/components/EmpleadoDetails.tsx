
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Empleado, Epi, Herramienta, Vehiculo } from "@/types/empleado";
import { AdelantoDialog } from "./AdelantoDialog";
import { EpiDialog } from "./EpiDialog";
import { HerramientaDialog } from "./HerramientaDialog";
import { VehiculoDialog } from "./VehiculoDialog";

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
  const proyectos = ["Proyecto Alpha", "Proyecto Beta", "Proyecto Gamma"];

  const updateField = (field: keyof Empleado, value: any) => {
    onUpdateEmpleado({ ...empleado, [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {empleado.nombre} {empleado.apellidos}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="datos" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="datos">Datos Personales</TabsTrigger>
            <TabsTrigger value="epis">EPIs</TabsTrigger>
            <TabsTrigger value="herramientas">Herramientas</TabsTrigger>
            <TabsTrigger value="documentos">Documentos</TabsTrigger>
            <TabsTrigger value="proyectos">Proyectos</TabsTrigger>
            <TabsTrigger value="vehiculo">Vehículo</TabsTrigger>
          </TabsList>

          <TabsContent value="datos" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Salario Bruto</Label>
                <Input 
                  type="number" 
                  value={empleado.salarioBruto}
                  onChange={(e) => updateField('salarioBruto', parseFloat(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label>Seguridad Social Trabajador</Label>
                <Input 
                  type="number" 
                  value={empleado.seguridadSocialTrabajador}
                  onChange={(e) => updateField('seguridadSocialTrabajador', parseFloat(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label>Seguridad Social Empresa</Label>
                <Input 
                  type="number" 
                  value={empleado.seguridadSocialEmpresa}
                  onChange={(e) => updateField('seguridadSocialEmpresa', parseFloat(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label>Retenciones</Label>
                <Input 
                  type="number" 
                  value={empleado.retenciones}
                  onChange={(e) => updateField('retenciones', parseFloat(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label>Embargo</Label>
                <Input 
                  type="number" 
                  value={empleado.embargo}
                  onChange={(e) => updateField('embargo', parseFloat(e.target.value))}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Adelantos</h3>
                <AdelantoDialog onAgregarAdelanto={onAgregarAdelanto} />
              </div>
              
              {empleado.adelantos.length > 0 && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Concepto</TableHead>
                      <TableHead>Cantidad</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {empleado.adelantos.map((adelanto) => (
                      <TableRow key={adelanto.id}>
                        <TableCell>{adelanto.concepto}</TableCell>
                        <TableCell>€{adelanto.cantidad}</TableCell>
                        <TableCell>{format(adelanto.fecha, "dd/MM/yyyy", { locale: es })}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </TabsContent>

          <TabsContent value="epis" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">EPIs Asignados</h3>
              <EpiDialog 
                inventarioEpis={inventarioEpis}
                onAsignarEpi={onAsignarEpi}
              />
            </div>

            {empleado.epis.length > 0 && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>EPI</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Fecha Entrega</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {empleado.epis.map((epi) => (
                    <TableRow key={epi.id}>
                      <TableCell>{epi.nombre}</TableCell>
                      <TableCell>€{epi.precio}</TableCell>
                      <TableCell>{format(epi.fechaEntrega, "dd/MM/yyyy", { locale: es })}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TabsContent>

          <TabsContent value="herramientas" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Herramientas Asignadas</h3>
              <HerramientaDialog 
                inventarioHerramientas={inventarioHerramientas}
                onAsignarHerramienta={onAsignarHerramienta}
              />
            </div>

            {empleado.herramientas.length > 0 && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Herramienta</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Fecha Entrega</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {empleado.herramientas.map((herramienta) => (
                    <TableRow key={herramienta.id}>
                      <TableCell>{herramienta.nombre}</TableCell>
                      <TableCell>€{herramienta.precio}</TableCell>
                      <TableCell>{format(herramienta.fechaEntrega, "dd/MM/yyyy", { locale: es })}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TabsContent>

          <TabsContent value="documentos" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Documentos</h3>
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Subir Documento
              </Button>
            </div>
            <div className="text-center text-muted-foreground py-8">
              Subida de documentos - En desarrollo
            </div>
          </TabsContent>

          <TabsContent value="proyectos" className="space-y-4">
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
          </TabsContent>

          <TabsContent value="vehiculo" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Vehículo Asignado</h3>
              <VehiculoDialog 
                inventarioVehiculos={inventarioVehiculos}
                onAsignarVehiculo={onAsignarVehiculo}
              />
            </div>
            
            {empleado.vehiculo && (
              <div className="p-4 border rounded-lg">
                <p className="font-medium">Vehículo asignado:</p>
                <Badge variant="secondary" className="mt-2">{empleado.vehiculo}</Badge>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
