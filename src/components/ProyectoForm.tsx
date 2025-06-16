
import { useState, useEffect } from "react";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ProyectoFormData, Proyecto } from "@/types/proyecto";
import { Empleado } from "@/types/empleado";
import { ProyectoBasicInfo } from "@/components/proyecto/ProyectoBasicInfo";
import { ProyectoFinancialInfo } from "@/components/proyecto/ProyectoFinancialInfo";
import { TrabajadorAssignment } from "@/components/proyecto/TrabajadorAssignment";

interface ProyectoFormProps {
  onSubmit: (data: ProyectoFormData) => void;
  onCancel: () => void;
  empleados: Empleado[];
  proyecto?: Proyecto;
  isEditing?: boolean;
}

interface TrabajadorConFechas {
  id: number;
  fechaEntrada?: Date;
  fechaSalida?: Date;
}

export const ProyectoForm = ({ onSubmit, onCancel, empleados, proyecto, isEditing = false }: ProyectoFormProps) => {
  const [formData, setFormData] = useState<ProyectoFormData>({
    nombre: "",
    ciudad: "",
    tipo: "presupuesto",
    estado: "activo",
    presupuestoTotal: undefined,
    precioHora: undefined,
    descripcion: "",
    trabajadoresAsignados: [],
  });

  const [trabajadoresConFechas, setTrabajadoresConFechas] = useState<TrabajadorConFechas[]>([]);

  // Filtrar solo empleados activos
  const empleadosActivos = empleados.filter(empleado => empleado.activo);

  // Cargar datos del proyecto cuando se está editando
  useEffect(() => {
    if (proyecto && isEditing) {
      console.log("Cargando proyecto para editar:", proyecto);
      setFormData({
        nombre: proyecto.nombre,
        ciudad: proyecto.ciudad,
        tipo: proyecto.tipo,
        estado: proyecto.estado,
        presupuestoTotal: proyecto.presupuestoTotal,
        precioHora: proyecto.precioHora,
        descripcion: proyecto.descripcion || "",
        trabajadoresAsignados: proyecto.trabajadoresAsignados.map(t => t.id),
      });
      
      // Cargar fechas de trabajadores
      setTrabajadoresConFechas(
        proyecto.trabajadoresAsignados.map(t => ({
          id: t.id,
          fechaEntrada: t.fechaEntrada,
          fechaSalida: t.fechaSalida
        }))
      );
    } else if (!isEditing) {
      // Reset form for new project
      setFormData({
        nombre: "",
        ciudad: "",
        tipo: "presupuesto",
        estado: "activo",
        presupuestoTotal: undefined,
        precioHora: undefined,
        descripcion: "",
        trabajadoresAsignados: [],
      });
      setTrabajadoresConFechas([]);
    }
  }, [proyecto, isEditing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Enviando datos del formulario:", formData);
    
    // Crear formData extendido con fechas de trabajadores
    const formDataConFechas = {
      ...formData,
      trabajadoresConFechas
    };
    
    onSubmit(formDataConFechas);
  };

  const handleTrabajadorToggle = (empleadoId: number, checked: boolean) => {
    console.log("Toggling trabajador:", empleadoId, checked);
    setFormData(prev => ({
      ...prev,
      trabajadoresAsignados: checked
        ? [...prev.trabajadoresAsignados, empleadoId]
        : prev.trabajadoresAsignados.filter(id => id !== empleadoId)
    }));

    if (checked) {
      // Agregar trabajador con fecha de entrada por defecto (hoy) y sin fecha de salida
      setTrabajadoresConFechas(prev => [
        ...prev,
        { id: empleadoId, fechaEntrada: new Date(), fechaSalida: undefined }
      ]);
    } else {
      // Remover trabajador
      setTrabajadoresConFechas(prev => prev.filter(t => t.id !== empleadoId));
    }
  };

  const updateTrabajadorFecha = (empleadoId: number, tipo: 'entrada' | 'salida', fecha: Date | undefined) => {
    setTrabajadoresConFechas(prev => 
      prev.map(t => 
        t.id === empleadoId 
          ? { ...t, [tipo === 'entrada' ? 'fechaEntrada' : 'fechaSalida']: fecha }
          : t
      )
    );
  };

  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{isEditing ? "Editar Proyecto" : "Nuevo Proyecto"}</DialogTitle>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <ProyectoBasicInfo 
          formData={formData} 
          setFormData={setFormData} 
        />

        <ProyectoFinancialInfo 
          formData={formData} 
          setFormData={setFormData} 
        />

        <TrabajadorAssignment
          empleadosActivos={empleadosActivos}
          trabajadoresAsignados={formData.trabajadoresAsignados}
          trabajadoresConFechas={trabajadoresConFechas}
          onTrabajadorToggle={handleTrabajadorToggle}
          onUpdateTrabajadorFecha={updateTrabajadorFecha}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" className="bg-omenar-green hover:bg-omenar-dark-green">
            {isEditing ? "Actualizar" : "Crear"}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};
