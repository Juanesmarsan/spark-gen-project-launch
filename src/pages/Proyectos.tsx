
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { ProyectoForm } from "@/components/ProyectoForm";
import { ProyectoCard } from "@/components/ProyectoCard";
import { Proyecto, ProyectoFormData } from "@/types/proyecto";
import { Empleado } from "@/types/empleado";
import { useToast } from "@/hooks/use-toast";

const Proyectos = () => {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [proyectoEditando, setProyectoEditando] = useState<Proyecto | null>(null);
  const { toast } = useToast();

  // Cargar empleados desde localStorage o datos de ejemplo
  useEffect(() => {
    console.log("Cargando empleados...");
    const empleadosGuardados = localStorage.getItem('empleados');
    if (empleadosGuardados) {
      const empleadosParseados = JSON.parse(empleadosGuardados);
      console.log("Empleados cargados:", empleadosParseados);
      setEmpleados(empleadosParseados);
    } else {
      // Datos de ejemplo si no hay empleados
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
          adelantos: [],
          epis: [],
          herramientas: [],
          documentos: [],
          proyectos: [],
        }
      ];
      setEmpleados(empleadosEjemplo);
    }

    // Cargar proyectos desde localStorage
    const proyectosGuardados = localStorage.getItem('proyectos');
    if (proyectosGuardados) {
      const proyectosParseados = JSON.parse(proyectosGuardados);
      console.log("Proyectos cargados:", proyectosParseados);
      setProyectos(proyectosParseados.map((p: any) => ({
        ...p,
        fechaCreacion: new Date(p.fechaCreacion)
      })));
    }
  }, []);

  // Guardar proyectos en localStorage cuando cambien
  useEffect(() => {
    if (proyectos.length > 0) {
      console.log("Guardando proyectos:", proyectos);
      localStorage.setItem('proyectos', JSON.stringify(proyectos));
    }
  }, [proyectos]);

  const agregarProyecto = (proyectoData: ProyectoFormData) => {
    console.log("Agregando nuevo proyecto:", proyectoData);
    
    const trabajadoresAsignados = empleados
      .filter(emp => proyectoData.trabajadoresAsignados.includes(emp.id))
      .map(emp => ({
        id: emp.id,
        nombre: emp.nombre,
        apellidos: emp.apellidos
      }));

    const nuevoProyecto: Proyecto = {
      ...proyectoData,
      id: Date.now(),
      trabajadoresAsignados,
      fechaCreacion: new Date(),
    };

    console.log("Nuevo proyecto creado:", nuevoProyecto);
    setProyectos(prev => [...prev, nuevoProyecto]);
    setMostrarFormulario(false);
    toast({
      title: "Proyecto creado",
      description: "El proyecto se ha creado correctamente.",
    });
  };

  const editarProyecto = (proyectoData: ProyectoFormData) => {
    if (!proyectoEditando) {
      console.error("No hay proyecto en edición");
      return;
    }

    console.log("Editando proyecto:", proyectoEditando.id, proyectoData);

    const trabajadoresAsignados = empleados
      .filter(emp => proyectoData.trabajadoresAsignados.includes(emp.id))
      .map(emp => ({
        id: emp.id,
        nombre: emp.nombre,
        apellidos: emp.apellidos
      }));

    const proyectoActualizado: Proyecto = {
      ...proyectoEditando,
      ...proyectoData,
      trabajadoresAsignados,
    };

    console.log("Proyecto actualizado:", proyectoActualizado);
    setProyectos(prev => prev.map(p => 
      p.id === proyectoEditando.id ? proyectoActualizado : p
    ));
    setProyectoEditando(null);
    setMostrarFormulario(false);
    toast({
      title: "Proyecto actualizado",
      description: "El proyecto se ha actualizado correctamente.",
    });
  };

  const eliminarProyecto = (id: number) => {
    console.log("Eliminando proyecto:", id);
    setProyectos(prev => prev.filter(p => p.id !== id));
    toast({
      title: "Proyecto eliminado",
      description: "El proyecto se ha eliminado correctamente.",
    });
  };

  const iniciarEdicion = (proyecto: Proyecto) => {
    console.log("Iniciando edición del proyecto:", proyecto);
    setProyectoEditando(proyecto);
    setMostrarFormulario(true);
  };

  const cerrarFormulario = () => {
    console.log("Cerrando formulario");
    setMostrarFormulario(false);
    setProyectoEditando(null);
  };

  const iniciarNuevoProyecto = () => {
    console.log("Iniciando nuevo proyecto");
    setProyectoEditando(null);
    setMostrarFormulario(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Proyectos</h1>
          <p className="text-muted-foreground">Administra proyectos y asignaciones</p>
        </div>
        <Dialog open={mostrarFormulario} onOpenChange={setMostrarFormulario}>
          <DialogTrigger asChild>
            <Button 
              onClick={iniciarNuevoProyecto}
              className="bg-omenar-green hover:bg-omenar-dark-green"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Proyecto
            </Button>
          </DialogTrigger>
          <ProyectoForm
            onSubmit={proyectoEditando ? editarProyecto : agregarProyecto}
            onCancel={cerrarFormulario}
            empleados={empleados}
            proyecto={proyectoEditando}
            isEditing={!!proyectoEditando}
          />
        </Dialog>
      </div>

      {proyectos.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Proyectos Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center text-muted-foreground py-8">
              No hay proyectos creados. Crea tu primer proyecto usando el botón "Nuevo Proyecto".
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {proyectos.map((proyecto) => (
            <ProyectoCard
              key={proyecto.id}
              proyecto={proyecto}
              onEdit={iniciarEdicion}
              onDelete={eliminarProyecto}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Proyectos;
