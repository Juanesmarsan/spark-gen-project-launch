
import { EmpleadosHeader } from "@/components/EmpleadosHeader";
import { EmpleadosList } from "@/components/EmpleadosList";
import { EmpleadoDetails } from "@/components/EmpleadoDetails";
import { usePersonalActions } from "@/hooks/usePersonalActions";

const Personal = () => {
  console.log('Personal: Renderizando componente');
  
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
    handleEliminarTodosEmpleados,
    handleBulkEliminar,
    handleBulkDeshabilitar,
    handleDeshabilitarEmpleado,
    handleHabilitarEmpleado,
    handleUpdateEmpleado,
    agregarAdelanto,
    asignarEpi,
    asignarHerramienta,
    asignarVehiculo,
    handleAgregarGastoVariable,
    handleEditarGastoVariable,
    handleEliminarGastoVariable,
    agregarCambioSalario
  } = usePersonalActions();

  return (
    <div className="p-6 space-y-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Personal de Gerencia</h1>
        <p className="text-muted-foreground">Gestión del personal administrativo y de gerencia</p>
      </div>

      <EmpleadosHeader
        mostrarFormulario={mostrarFormulario}
        setMostrarFormulario={setMostrarFormulario}
        onAgregarEmpleado={handleAgregarEmpleado}
        onEliminarTodos={handleEliminarTodosEmpleados}
      />

      <div className="grid gap-6">
        <EmpleadosList 
          empleados={empleados}
          onSelectEmpleado={setEmpleadoSeleccionado}
          onEliminarEmpleado={handleEliminarEmpleado}
          onBulkEliminar={handleBulkEliminar}
          onBulkDeshabilitar={handleBulkDeshabilitar}
          onDeshabilitarEmpleado={handleDeshabilitarEmpleado}
          onHabilitarEmpleado={handleHabilitarEmpleado}
          allowPermanentDelete={true}
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
            onEditarGastoVariable={handleEditarGastoVariable}
            onEliminarGastoVariable={handleEliminarGastoVariable}
            onAgregarCambioSalario={agregarCambioSalario}
          />
        )}
      </div>
    </div>
  );
};

export default Personal;
