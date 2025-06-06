
import { useState, useEffect } from 'react';
import { Epi, Herramienta, Vehiculo } from '@/types/empleado';

export const useInventarios = () => {
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

  const [inventarioVehiculos, setInventarioVehiculos] = useState<Vehiculo[]>(() => {
    const stored = localStorage.getItem('vehiculos');
    return stored ? JSON.parse(stored) : [
      { id: 1, matricula: "1234-ABC", tipo: "Furgoneta", marca: "Ford", modelo: "Transit", asignado: false },
      { id: 2, matricula: "5678-DEF", tipo: "Camión", marca: "Mercedes", modelo: "Sprinter", asignado: false },
    ];
  });

  // Sincronizar con localStorage cuando cambien los vehículos
  useEffect(() => {
    localStorage.setItem('vehiculos', JSON.stringify(inventarioVehiculos));
  }, [inventarioVehiculos]);

  // Función para obtener vehículos actualizados desde localStorage
  const getVehiculosActualizados = () => {
    const stored = localStorage.getItem('vehiculos');
    const vehiculos = stored ? JSON.parse(stored) : inventarioVehiculos;
    setInventarioVehiculos(vehiculos);
    return vehiculos;
  };

  return {
    inventarioEpis,
    inventarioHerramientas,
    inventarioVehiculos: getVehiculosActualizados(),
    refreshVehiculos: getVehiculosActualizados
  };
};
