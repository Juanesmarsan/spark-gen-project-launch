
import { Empleado } from '@/types/empleado';

export const cargarEmpleadosDesdeStorage = (): Empleado[] | null => {
  try {
    const empleadosGuardados = localStorage.getItem('empleados');
    
    if (empleadosGuardados) {
      const empleadosParseados = JSON.parse(empleadosGuardados);
      return empleadosParseados.map((emp: any) => ({
        ...emp,
        fechaIngreso: new Date(emp.fechaIngreso),
        departamento: emp.departamento || 'operario',
        categoria: emp.categoria || 'peon',
        precioHoraExtra: emp.precioHoraExtra || 20,
        precioHoraFestiva: emp.precioHoraFestiva || 25,
        activo: emp.activo !== undefined ? emp.activo : true,
        historialSalarios: emp.historialSalarios?.map((hist: any) => ({
          ...hist,
          fechaCambio: new Date(hist.fechaCambio)
        })) || [],
        gastosVariables: emp.gastosVariables?.map((gasto: any) => ({
          ...gasto,
          fecha: new Date(gasto.fecha)
        })) || [],
      }));
    }
    
    return null;
  } catch (error) {
    console.error("Error al cargar empleados desde localStorage:", error);
    return null;
  }
};

export const guardarEmpleadosEnStorage = (empleados: Empleado[]) => {
  try {
    localStorage.setItem('empleados', JSON.stringify(empleados));
    console.log('useEmpleados: Empleados guardados en localStorage');
  } catch (error) {
    console.error("Error al guardar empleados:", error);
  }
};
