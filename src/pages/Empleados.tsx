
import { EmpleadosHeader } from "@/components/EmpleadosHeader";
import { EmpleadosList } from "@/components/EmpleadosList";
import { EmpleadoDetails } from "@/components/EmpleadoDetails";
import { useEmpleadosActions } from "@/hooks/useEmpleadosActions";

const Empleados = () => {
  console.log('Empleados: Renderizando componente');
  
  const {
    empleados,
    empleadoSeleccionado,
    setEmpleadoSeleccionado,
    mostrarFormulario,
    setMostrarFormulario,
    inventarioEpis,
    inventarioHerramientas,
    inventarioVehiculos,
    handleAgregarEmpleado,
    handleEliminarEmpleado,
    handleDeshabilitarEmpleado,
    handleHabilitarEmpleado,
    handleUpdateEmpleado,
    agregarAdelanto,
    asignarEpi,
    asignarHerramienta,
    asignarVehiculo,
    handleAgregarGastoVariable,
    agregarCambioSalario
  } = useEmpleadosActions();

  return (
    <div className="p-6 space-y-6">
      <EmpleadosHeader
        mostrarFormulario={mostrarFormulario}
        setMostrarFormulario={setMostrarFormulario}
        onAgregarEmpleado={handleAgregarEmpleado}
      />

      <div className="grid gap-6">
        <EmpleadosList 
          empleados={empleados}
          onSelectEmpleado={setEmpleadoSeleccionado}
          onEliminarEmpleado={handleEliminarEmpleado}
          onDeshabilitarEmpleado={handleDeshabilitarEmpleado}
          onHabilitarEmpleado={handleHabilitarEmpleado}
        />

        {empleadoSeleccionado && (
          <EmpleadoDetails
            empleado={empleadoSeleccionado}
            inventarioEpis={inventarioEpis}
            inventarioHerramientas={inventarioHerramientas}
            inventarioVehiculos={inventarioVehiculos}
            onUpdateEmpleado={handleUpdateEmpleado}
            onAgregarAdelanto={agregarAdelanto}
            onAsignarEpi={asignarEpi}
            onAsignarHerramienta={asignarHerramienta}
            onAsignarVehiculo={asignarVehiculo}
            onAgregarGastoVariable={handleAgregarGastoVariable}
            onAgregarCambioSalario={agregarCambioSalario}
          />
        )}
      </div>
    </div>
  );
};

export default Empleados;
