
import { Empleado } from '@/types/empleado';

export const cargarEmpleadosDesdeStorage = (): Empleado[] | null => {
  try {
    // Verificar si se hizo un reset completo
    const wasReset = localStorage.getItem('empleados-reset');
    if (wasReset === 'true') {
      console.log('Empleados fueron reseteados, devolviendo array vacío');
      return [];
    }

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
    // Si el array está vacío, mantener la marca de reset
    if (empleados.length === 0) {
      localStorage.setItem('empleados', JSON.stringify([]));
      localStorage.setItem('empleados-reset', 'true');
      console.log('useEmpleados: Array vacío guardado con marca de reset');
      return;
    }

    // Si hay empleados, quitar la marca de reset
    localStorage.removeItem('empleados-reset');
    
    // Procesar los empleados antes de guardar para evitar problemas con las fechas
    const empleadosParaGuardar = empleados.map(empleado => ({
      ...empleado,
      fechaIngreso: empleado.fechaIngreso.toISOString(),
      historialSalarios: empleado.historialSalarios?.map(hist => ({
        ...hist,
        fechaCambio: hist.fechaCambio.toISOString()
      })) || [],
      gastosVariables: empleado.gastosVariables?.map(gasto => ({
        ...gasto,
        fecha: gasto.fecha.toISOString()
      })) || [],
    }));
    
    localStorage.setItem('empleados', JSON.stringify(empleadosParaGuardar));
    console.log('useEmpleados: Empleados guardados correctamente en localStorage');
  } catch (error) {
    console.error("Error al guardar empleados:", error);
  }
};
