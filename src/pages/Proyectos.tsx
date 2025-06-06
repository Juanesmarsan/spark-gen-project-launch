import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { ProyectoForm } from "@/components/ProyectoForm";
import { ProyectosList } from "@/components/ProyectosList";
import { ProyectoDetails } from "@/components/ProyectoDetails";
import { Proyecto, ProyectoFormData } from "@/types/proyecto";
import { useToast } from "@/hooks/use-toast";
import { Empleado } from "@/types/empleado";

const Proyectos = () => {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [selectedProyecto, setSelectedProyecto] = useState<Proyecto | null>(null);
  const [showForm, setShowForm] = useState(false);

  const empleadosEjemplo: Empleado[] = [
    {
      id: 1,
      nombre: "Juan",
      apellidos: "García López",
      dni: "12345678A",
      telefono: "666123456",
      email: "juan.garcia@empresa.com",
      direccion: "Calle Principal 123, Madrid",
      fechaIngreso: new Date("2023-01-15"),
      salarioBruto: 2500,
      seguridadSocialTrabajador: 150,
      seguridadSocialEmpresa: 750,
      retenciones: 375,
      embargo: 0,
      departamento: 'operario',
      categoria: 'oficial_2',
      precioHoraExtra: 20,
      precioHoraFestiva: 25,
      adelantos: [],
      epis: [],
      herramientas: [],
      documentos: [],
      proyectos: [],
      gastosVariables: [],
    }
  ];

  const { toast } = useToast();

  const handleAgregarProyecto = (data: ProyectoFormData) => {
    const nuevoProyecto: Proyecto = {
      ...data,
      id: Date.now(), // Simple ID generation
      fechaCreacion: new Date(),
      trabajadoresAsignados: data.trabajadoresAsignados.map(empleadoId => {
        const empleado = empleadosEjemplo.find(e => e.id === empleadoId);
        return empleado ? {
          id: empleado.id,
          nombre: empleado.nombre,
          apellidos: empleado.apellidos,
          precioHora: data.tipo === 'administracion' ? data.precioHora : undefined
        } : { id: empleadoId, nombre: '', apellidos: '' };
      }),
      gastosVariables: []
    };

    setProyectos([...proyectos, nuevoProyecto]);
    setShowForm(false);
    toast({
      title: "Proyecto añadido",
      description: "El proyecto se ha añadido correctamente.",
    });
  };

  const handleUpdateProyecto = (proyectoActualizado: Proyecto) => {
    setProyectos(proyectos.map(proyecto =>
      proyecto.id === proyectoActualizado.id ? proyectoActualizado : proyecto
    ));
    setSelectedProyecto(proyectoActualizado);
    toast({
      title: "Proyecto actualizado",
      description: "El proyecto se ha actualizado correctamente.",
    });
  };

  const handleEliminarProyecto = (id: number) => {
    setProyectos(proyectos.filter(proyecto => proyecto.id !== id));
    setSelectedProyecto(null);
    toast({
      title: "Proyecto eliminado",
      description: "El proyecto se ha eliminado correctamente.",
    });
  };

  const handleAgregarGastoProyecto = (proyectoId: number, gasto: any) => {
    setProyectos(proyectos.map(proyecto => {
      if (proyecto.id === proyectoId) {
        return {
          ...proyecto,
          gastosVariables: [...(proyecto.gastosVariables || []), { ...gasto, id: Date.now() }]
        };
      }
      return proyecto;
    }));
    
    // Actualizar proyecto seleccionado si es el mismo
    if (selectedProyecto && selectedProyecto.id === proyectoId) {
      const proyectoActualizado = proyectos.find(p => p.id === proyectoId);
      if (proyectoActualizado) {
        setSelectedProyecto({
          ...proyectoActualizado,
          gastosVariables: [...(proyectoActualizado.gastosVariables || []), { ...gasto, id: Date.now() }]
        });
      }
    }

    toast({
      title: "Gasto añadido",
      description: "El gasto se ha añadido al proyecto correctamente.",
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Proyectos</h1>
          <p className="text-muted-foreground">Administra los proyectos de la empresa</p>
        </div>
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-omenar-green hover:bg-omenar-dark-green"
            >
              <Plus className="w-4 h-4 mr-2" />
              Añadir Proyecto
            </Button>
          </DialogTrigger>
          <ProyectoForm
            onSubmit={handleAgregarProyecto}
            onCancel={() => setShowForm(false)}
            empleados={empleadosEjemplo}
          />
        </Dialog>
      </div>

      <div className="grid gap-6">
        <ProyectosList
          proyectos={proyectos}
          onSelectProyecto={setSelectedProyecto}
        />

        {selectedProyecto && (
          <ProyectoDetails
            proyecto={selectedProyecto}
            empleados={empleadosEjemplo}
            onUpdateProyecto={handleUpdateProyecto}
            onEliminarProyecto={handleEliminarProyecto}
            onAgregarGasto={handleAgregarGastoProyecto}
          />
        )}
      </div>
    </div>
  );
};

export default Proyectos;
