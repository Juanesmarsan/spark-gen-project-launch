
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { EmpleadoForm } from "@/components/EmpleadoForm";
import { EmpleadosList } from "@/components/EmpleadosList";
import { EmpleadoDetails } from "@/components/EmpleadoDetails";
import { Empleado, Epi, Herramienta, Vehiculo } from "@/types/empleado";
import { useToast } from "@/hooks/use-toast";

const Empleados = () => {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const { toast } = useToast();

  // Cargar empleados desde localStorage al iniciar
  useEffect(() => {
    console.log("Cargando empleados desde localStorage...");
    const empleadosGuardados = localStorage.getItem('empleados');
    if (empleadosGuardados) {
      const empleadosParseados = JSON.parse(empleadosGuardados);
      console.log("Empleados cargados:", empleadosParseados);
      setEmpleados(empleadosParseados.map((emp: any) => ({
        ...emp,
        fechaIngreso: new Date(emp.fechaIngreso)
      })));
    } else {
      // Datos de ejemplo si no hay empleados
      const empleadoEjemplo: Empleado = {
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
      };
      setEmpleados([empleadoEjemplo]);
    }
  }, []);

  // Guardar empleados en localStorage cuando cambien
  useEffect(() => {
    if (empleados.length > 0) {
      console.log("Guardando empleados en localStorage:", empleados);
      localStorage.setItem('empleados', JSON.stringify(empleados));
    }
  }, [empleados]);

  // Estados para inventarios - obtenemos los datos del localStorage o valores por defecto
  const [inventarioEpis] = useState<Epi[]>(() => {
    const stored = localStorage.getItem('epis');
    return stored ? JSON.parse(stored) : [
      { id: 1, nombre: "Casco de seguridad", precio: 25, disponible: true },
      { id: 2, nombre: "Chaleco reflectante", precio: 15, disponible: true },
      { id: 3, nombre: "Botas de seguridad", precio: 85, disponible: true },
      { id: 4, nombre: "Guantes de trabajo", precio: 12, disponible: true },
    ];
  });

  const [inventarioHerramientas] = useState<Herramienta[]>(() => {
    const stored = localStorage.getItem('herramientas');
    return stored ? JSON.parse(stored) : [
      { id: 1, tipo: "Taladro", marca: "Bosch", coste: 120, disponible: true },
      { id: 2, tipo: "Martillo", marca: "Stanley", coste: 35, disponible: true },
      { id: 3, tipo: "Destornillador eléctrico", marca: "Makita", coste: 75, disponible: true },
      { id: 4, tipo: "Sierra circular", marca: "DeWalt", coste: 250, disponible: true },
    ];
  });

  const [inventarioVehiculos] = useState<Vehiculo[]>(() => {
    const stored = localStorage.getItem('vehiculos');
    return stored ? JSON.parse(stored) : [
      { id: 1, matricula: "1234-ABC", tipo: "Furgoneta", marca: "Ford", modelo: "Transit", asignado: false },
      { id: 2, matricula: "5678-DEF", tipo: "Camión", marca: "Mercedes", modelo: "Sprinter", asignado: false },
    ];
  });

  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState<Empleado | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const agregarEmpleado = (nuevoEmpleadoData: Omit<Empleado, 'id' | 'adelantos' | 'epis' | 'herramientas' | 'documentos' | 'proyectos' | 'vehiculo'>) => {
    console.log("Agregando nuevo empleado:", nuevoEmpleadoData);
    
    const nuevoEmpleado: Empleado = {
      ...nuevoEmpleadoData,
      id: Date.now(),
      adelantos: [],
      epis: [],
      herramientas: [],
      documentos: [],
      proyectos: [],
    };
    
    console.log("Empleado creado:", nuevoEmpleado);
    setEmpleados(prev => [...prev, nuevoEmpleado]);
    setMostrarFormulario(false);
    
    toast({
      title: "Empleado añadido",
      description: "El empleado se ha añadido correctamente.",
    });
  };

  const updateEmpleado = (empleadoActualizado: Empleado) => {
    console.log("Actualizando empleado:", empleadoActualizado);
    setEmpleados(prev => prev.map(emp => 
      emp.id === empleadoActualizado.id ? empleadoActualizado : emp
    ));
    setEmpleadoSeleccionado(empleadoActualizado);
  };

  const agregarAdelanto = (concepto: string, cantidad: number) => {
    if (!empleadoSeleccionado) return;

    const nuevoAdelantoObj = {
      id: Date.now(),
      concepto,
      cantidad,
      fecha: new Date()
    };

    const empleadoActualizado = {
      ...empleadoSeleccionado,
      adelantos: [...empleadoSeleccionado.adelantos, nuevoAdelantoObj]
    };

    updateEmpleado(empleadoActualizado);
  };

  const asignarEpi = (epiId: number, fecha: Date) => {
    if (!empleadoSeleccionado) return;

    const epi = inventarioEpis.find(e => e.id === epiId);
    if (epi) {
      const nuevoEpiAsignado = {
        id: Date.now(),
        nombre: epi.nombre,
        precio: epi.precio,
        fechaEntrega: fecha
      };

      const empleadoActualizado = {
        ...empleadoSeleccionado,
        epis: [...empleadoSeleccionado.epis, nuevoEpiAsignado]
      };

      updateEmpleado(empleadoActualizado);
    }
  };

  const asignarHerramienta = (herramientaId: number, fecha: Date) => {
    if (!empleadoSeleccionado) return;

    const herramienta = inventarioHerramientas.find(h => h.id === herramientaId);
    if (herramienta) {
      const nuevaHerramientaAsignada = {
        id: Date.now(),
        nombre: `${herramienta.tipo} ${herramienta.marca}`,
        precio: herramienta.coste,
        fechaEntrega: fecha
      };

      const empleadoActualizado = {
        ...empleadoSeleccionado,
        herramientas: [...empleadoSeleccionado.herramientas, nuevaHerramientaAsignada]
      };

      updateEmpleado(empleadoActualizado);
    }
  };

  const asignarVehiculo = (vehiculoId: number) => {
    if (!empleadoSeleccionado) return;

    const vehiculo = inventarioVehiculos.find(v => v.id === vehiculoId);
    if (vehiculo) {
      const empleadoActualizado = {
        ...empleadoSeleccionado,
        vehiculo: `${vehiculo.tipo} ${vehiculo.matricula}`
      };

      updateEmpleado(empleadoActualizado);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Empleados</h1>
          <p className="text-muted-foreground">Administra empleados y asignaciones</p>
        </div>
        <Dialog open={mostrarFormulario} onOpenChange={setMostrarFormulario}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => setMostrarFormulario(true)}
              className="bg-omenar-green hover:bg-omenar-dark-green"
            >
              <Plus className="w-4 h-4 mr-2" />
              Añadir Empleado
            </Button>
          </DialogTrigger>
          <EmpleadoForm
            onSubmit={agregarEmpleado}
            onCancel={() => setMostrarFormulario(false)}
          />
        </Dialog>
      </div>

      <div className="grid gap-6">
        <EmpleadosList 
          empleados={empleados}
          onSelectEmpleado={setEmpleadoSeleccionado}
        />

        {empleadoSeleccionado && (
          <EmpleadoDetails
            empleado={empleadoSeleccionado}
            inventarioEpis={inventarioEpis}
            inventarioHerramientas={inventarioHerramientas}
            inventarioVehiculos={inventarioVehiculos}
            onUpdateEmpleado={updateEmpleado}
            onAgregarAdelanto={agregarAdelanto}
            onAsignarEpi={asignarEpi}
            onAsignarHerramienta={asignarHerramienta}
            onAsignarVehiculo={asignarVehiculo}
          />
        )}
      </div>
    </div>
  );
};

export default Empleados;
