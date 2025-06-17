
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Code, Database, Users, Calculator, Building, FileText, Wrench, Car } from "lucide-react";

export const ManualDesarrollador = () => {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Manual de Desarrollador</h1>
        <p className="text-xl text-muted-foreground">
          Sistema de Gestión Empresarial - Documentación Técnica Completa
        </p>
        <Badge variant="outline" className="text-lg px-4 py-2">
          Versión 1.0 - Arquitectura React + TypeScript
        </Badge>
      </div>

      <Tabs defaultValue="arquitectura" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
          <TabsTrigger value="arquitectura">Arquitectura</TabsTrigger>
          <TabsTrigger value="tipos">Tipos</TabsTrigger>
          <TabsTrigger value="empleados">Empleados</TabsTrigger>
          <TabsTrigger value="proyectos">Proyectos</TabsTrigger>
          <TabsTrigger value="costes">Costes</TabsTrigger>
          <TabsTrigger value="calendario">Calendario</TabsTrigger>
          <TabsTrigger value="inventario">Inventario</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        </TabsList>

        <TabsContent value="arquitectura" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5" />
                Arquitectura General del Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Stack Tecnológico:</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>Frontend:</strong> React 18 + TypeScript + Vite</li>
                  <li><strong>Styling:</strong> Tailwind CSS + Shadcn/ui</li>
                  <li><strong>Estado:</strong> React Hooks + localStorage</li>
                  <li><strong>Rutas:</strong> React Router</li>
                  <li><strong>Fechas:</strong> date-fns + date-fns/locale</li>
                  <li><strong>Iconos:</strong> Lucide React</li>
                </ul>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Estructura de Carpetas:</h3>
                <pre className="text-sm">
{`src/
├── components/           # Componentes reutilizables
│   ├── ui/              # Componentes base (shadcn)
│   ├── empleado/        # Componentes específicos de empleados
│   ├── proyecto/        # Componentes específicos de proyectos
│   └── dashboard/       # Componentes del dashboard
├── hooks/               # Custom hooks
│   ├── beneficios/      # Hooks para cálculos de beneficios
│   ├── empleado/        # Hooks específicos de empleados
│   └── gastosEmpleados/ # Hooks para gestión de costes
├── pages/               # Páginas principales
├── types/               # Definiciones TypeScript
├── utils/               # Utilidades y helpers
└── lib/                 # Configuraciones`}
                </pre>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Principios de Diseño:</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>Separación de responsabilidades:</strong> Cada hook tiene una función específica</li>
                  <li><strong>Componentes pequeños:</strong> Máximo 50 líneas por componente</li>
                  <li><strong>Tipado estricto:</strong> TypeScript en toda la aplicación</li>
                  <li><strong>Persistencia local:</strong> localStorage para datos</li>
                  <li><strong>Responsive design:</strong> Diseño adaptativo con Tailwind</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tipos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Sistema de Tipos TypeScript
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Tipos Principales:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium">Empleado</h4>
                    <code className="text-xs bg-white p-2 block rounded">
{`interface Empleado {
  id: number;
  nombre: string;
  apellidos: string;
  telefono: string;
  fechaIngreso: Date;
  fechaAlta: Date;
  fechaBaja?: Date;
  salarioBruto: number;
  seguridadSocialTrabajador: number;
  seguridadSocialEmpresa: number;
  retenciones: number;
  embargo: number;
  departamento: string;
  categoria: string;
  precioHoraExtra: number;
  precioHoraFestiva: number;
  adelantos: Adelanto[];
  gastosVariables: GastoVariable[];
  activo: boolean;
}`}
                    </code>
                  </div>
                  <div>
                    <h4 className="font-medium">Proyecto</h4>
                    <code className="text-xs bg-white p-2 block rounded">
{`interface Proyecto {
  id: number;
  nombre: string;
  ciudad: string;
  tipo: 'presupuesto' | 'administracion';
  estado: 'activo' | 'completado' | 'pausado';
  presupuestoTotal?: number;
  precioHora?: number;
  trabajadoresAsignados: Trabajador[];
  fechaCreacion: Date;
  gastosVariables?: GastoVariable[];
  certificaciones?: Certificacion[];
}`}
                    </code>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Tipos de Costes:</h3>
                <code className="text-sm bg-white p-3 block rounded">
{`interface GastoEmpleadoProyecto {
  id: number;
  empleadoId: number;
  proyectoId: number;
  mes: number;
  anio: number;
  salarioBrutoProrrateo: number;
  seguridadSocialEmpresaProrrateo: number;
  diasTrabajados: number;
  diasLaboralesMes: number;
  horasExtras: number;
  horasFestivas: number;
  importeHorasExtras: number;
  importeHorasFestivas: number;
  gastos: GastoVariable[];
  fechaRegistro: Date;
}`}
                </code>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Tipos de Calendario:</h3>
                <code className="text-sm bg-white p-3 block rounded">
{`interface DiaCalendario {
  fecha: Date;
  diaSemana: number;
  horasDefecto: number;
  horasReales: number;
  horasExtras: number;
  horasFestivas: number;
  tipo: 'laborable' | 'festivo' | 'sabado' | 'domingo';
  ausencia?: {
    tipo: 'baja_medica' | 'baja_laboral' | 'baja_personal' | 'ausencia' | 'vacaciones';
    motivo?: string;
  };
}`}
                </code>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="empleados" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Módulo de Gestión de Empleados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Funcionalidades Principales:</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>CRUD Completo:</strong> Crear, leer, actualizar y eliminar empleados</li>
                  <li><strong>Gestión de Adelantos:</strong> Registro de adelantos de nómina</li>
                  <li><strong>Gastos Variables:</strong> Dietas, alojamiento, combustible, etc.</li>
                  <li><strong>Historial Salarial:</strong> Cambios de salario con fecha y motivo</li>
                  <li><strong>Inventario Personal:</strong> EPIs, herramientas, vehículos asignados</li>
                  <li><strong>Estados:</strong> Activo/Inactivo con fechas de alta/baja</li>
                </ul>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Hook Principal: useEmpleados</h3>
                <code className="text-sm bg-white p-3 block rounded">
{`// Funciones principales del hook
const {
  empleados,                    // Lista de empleados
  agregarEmpleado,             // Crear nuevo empleado
  updateEmpleado,              // Actualizar empleado existente
  eliminarEmpleado,            // Eliminar empleado
  agregarAdelanto,             // Registrar adelanto
  agregarGastoVariable,        // Agregar gasto variable
  editarGastoVariable,         // Editar gasto existente
  eliminarGastoVariable,       // Eliminar gasto
  agregarCambioSalario,        // Cambio de salario
  deshabilitarEmpleado,        // Dar de baja
  habilitarEmpleado            // Dar de alta
} = useEmpleados();`}
                </code>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Componentes Clave:</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>EmpleadoForm:</strong> Formulario de creación/edición</li>
                  <li><strong>EmpleadosList:</strong> Lista con filtros y acciones masivas</li>
                  <li><strong>EmpleadoDetails:</strong> Vista detallada con tabs</li>
                  <li><strong>GastosVariablesTab:</strong> Gestión de gastos del empleado</li>
                  <li><strong>HistorialSalarialTab:</strong> Histórico de cambios</li>
                </ul>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Lógica de Negocio:</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>Salario Total:</strong> Bruto + Seguridad Social Empresa</li>
                  <li><strong>Salario Neto:</strong> Bruto - SS Trabajador - Retenciones - Embargos</li>
                  <li><strong>Persistencia:</strong> Todos los datos se guardan en localStorage</li>
                  <li><strong>Validaciones:</strong> Campos obligatorios y formatos de fecha</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="proyectos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Módulo de Gestión de Proyectos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Tipos de Proyecto:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-purple-700">Por Presupuesto</h4>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      <li>Precio fijo acordado</li>
                      <li>Certificaciones mensuales</li>
                      <li>Control de gastos vs presupuesto</li>
                      <li>Beneficio = Certificado - Gastos</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-orange-700">Por Administración</h4>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      <li>Precio por hora trabajada</li>
                      <li>Facturación según horas</li>
                      <li>Certificación real del cliente</li>
                      <li>Beneficio = Horas×Precio - Gastos</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Asignación de Trabajadores:</h3>
                <code className="text-sm bg-white p-3 block rounded">
{`interface Trabajador {
  id: number;
  nombre: string;
  apellidos: string;
  fechaEntrada?: Date;    // Inicio en el proyecto
  fechaSalida?: Date;     // Fin en el proyecto
}

// Cálculo de días trabajados en un mes
const calcularDiasTrabajados = (trabajador, mes, anio) => {
  const primerDia = new Date(anio, mes - 1, 1);
  const ultimoDia = new Date(anio, mes, 0);
  
  const entrada = trabajador.fechaEntrada || primerDia;
  const salida = trabajador.fechaSalida || ultimoDia;
  
  // Solo días laborales (L-V) dentro del período
  return contarDiasLaborales(entrada, salida, mes);
};`}
                </code>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Tabs del Proyecto:</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>Trabajadores:</strong> Asignación y calendario mensual</li>
                  <li><strong>Gastos Variables:</strong> Materiales, transporte, etc.</li>
                  <li><strong>Certificaciones:</strong> Solo proyectos por presupuesto</li>
                  <li><strong>Imputación Costes:</strong> Costes salariales y gastos</li>
                  <li><strong>Análisis Financiero:</strong> Rentabilidad y márgenes</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="costes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Sistema de Imputación de Costes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Proceso de Imputación:</h3>
                <ol className="list-decimal list-inside space-y-2">
                  <li><strong>Cálculo Coste Empleado:</strong> Salario bruto + SS empresa / días laborales del mes</li>
                  <li><strong>Días Trabajados:</strong> Conteo de días laborales en el proyecto para el mes</li>
                  <li><strong>Prorrateo:</strong> (Coste total / días laborales mes) × días trabajados proyecto</li>
                  <li><strong>Horas Extras:</strong> Horas × precio hora extra del empleado</li>
                  <li><strong>Horas Festivas:</strong> Horas × precio hora festiva del empleado</li>
                  <li><strong>Gastos Variables:</strong> Dietas, alojamiento, combustible, etc.</li>
                </ol>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Hook: useImputacionCostesSalariales</h3>
                <code className="text-sm bg-white p-3 block rounded">
{`const imputarCostesSalarialesEmpleado = (empleado, mes, anio) => {
  // 1. Calcular coste base del empleado
  const costeEmpleado = calcularCosteEmpleado(empleado.id, mes, anio);
  
  // 2. Buscar proyectos donde está asignado
  const proyectosDelEmpleado = proyectos.filter(proyecto => 
    proyecto.trabajadoresAsignados.some(t => t.id === empleado.id)
  );
  
  // 3. Para cada proyecto, calcular días trabajados
  proyectosDelEmpleado.forEach(proyecto => {
    const diasTrabajados = calcularDiasTrabajadosEnProyecto(
      empleado.id, proyecto.id, mes, anio
    );
    
    // 4. Prorratear costes según días trabajados
    if (diasTrabajados > 0) {
      const factorProrrateo = diasTrabajados / costeEmpleado.diasLaboralesMes;
      const salarioProrrateo = costeEmpleado.salarioBrutoMes * factorProrrateo;
      
      // 5. Registrar gasto en el proyecto
      registrarGastoEmpleadoProyecto({...});
    }
  });
};`}
                </code>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Tipos de Gastos:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium">Costes Salariales (Fijos)</h4>
                    <ul className="list-disc list-inside text-sm">
                      <li>Salario bruto prorrateado</li>
                      <li>Seguridad Social empresa</li>
                      <li>Días trabajados / días laborales mes</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium">Costes Variables</h4>
                    <ul className="list-disc list-inside text-sm">
                      <li>Horas extras</li>
                      <li>Horas festivas</li>
                      <li>Gastos del empleado (dietas, etc.)</li>
                      <li>Gastos del proyecto (materiales, etc.)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendario" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Sistema de Calendario y Ausencias
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Utilidad: generarCalendarioMesPuro</h3>
                <code className="text-sm bg-white p-3 block rounded">
{`// Genera calendario mensual con días laborales y festivos
export const generarCalendarioMesPuro = (empleadoId, mes, anio) => {
  const calendario = {
    mes,
    año: anio,
    dias: []
  };
  
  const ultimoDia = new Date(anio, mes, 0).getDate();
  
  for (let dia = 1; dia <= ultimoDia; dia++) {
    const fecha = new Date(anio, mes - 1, dia);
    const diaSemana = fecha.getDay();
    
    const diaCalendario = {
      fecha,
      diaSemana,
      horasDefecto: calcularHorasDefecto(diaSemana),
      horasReales: 0,
      horasExtras: 0,
      horasFestivas: 0,
      tipo: determinarTipoDia(fecha, diaSemana),
      ausencia: buscarAusencia(empleadoId, fecha)
    };
    
    calendario.dias.push(diaCalendario);
  }
  
  return calendario;
};`}
                </code>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Tipos de Días:</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <h4 className="font-medium text-green-700">Laborable</h4>
                    <p className="text-sm">Lunes a Viernes</p>
                    <p className="text-xs">8 horas defecto</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-700">Sábado</h4>
                    <p className="text-sm">Trabajo opcional</p>
                    <p className="text-xs">0 horas defecto</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-red-700">Festivo</h4>
                    <p className="text-sm">No laborable</p>
                    <p className="text-xs">Horas = festivas</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700">Domingo</h4>
                    <p className="text-sm">No laborable</p>
                    <p className="text-xs">0 horas</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Tipos de Ausencias:</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>Vacaciones:</strong> Ausencia pagada planificada</li>
                  <li><strong>Baja Médica:</strong> Incapacidad temporal por enfermedad</li>
                  <li><strong>Baja Laboral:</strong> Accidente de trabajo</li>
                  <li><strong>Baja Personal:</strong> Asuntos personales sin retribución</li>
                  <li><strong>Ausencia:</strong> Falta puntual</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventario" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="w-5 h-5" />
                Sistema de Inventario
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Tipos de Inventario:</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-medium text-blue-700">EPIs</h4>
                    <ul className="list-disc list-inside text-sm">
                      <li>Equipos de Protección Individual</li>
                      <li>Cascos, botas, guantes, etc.</li>
                      <li>Control de entregas por empleado</li>
                      <li>Fecha de entrega y estado</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-green-700">Herramientas</h4>
                    <ul className="list-disc list-inside text-sm">
                      <li>Herramientas de trabajo</li>
                      <li>Taladros, sierras, etc.</li>
                      <li>Asignación temporal</li>
                      <li>Control de devoluciones</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-orange-700">Vehículos</h4>
                    <ul className="list-disc list-inside text-sm">
                      <li>Vehículos de empresa</li>
                      <li>Furgonetas, coches, etc.</li>
                      <li>Un vehículo por empleado</li>
                      <li>Control de asignaciones</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Lógica de Asignaciones:</h3>
                <code className="text-sm bg-white p-3 block rounded">
{`// Asignación de EPI
const asignarEpi = (empleadoId, epiId) => {
  // 1. Marcar EPI como no disponible
  updateInventarioEpi(epiId, { disponible: false });
  
  // 2. Agregar a la lista del empleado
  const empleado = empleados.find(e => e.id === empleadoId);
  const epi = inventarioEpis.find(e => e.id === epiId);
  
  const nuevaAsignacion = {
    id: epi.id,
    nombre: epi.nombre,
    precio: epi.precio,
    fechaEntrega: new Date()
  };
  
  updateEmpleado({
    ...empleado,
    episAsignados: [...empleado.episAsignados, nuevaAsignacion]
  });
};`}
                </code>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dashboard" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Dashboard y Análisis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Métricas Principales:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium">Proyectos</h4>
                    <ul className="list-disc list-inside text-sm">
                      <li>Beneficio bruto vs neto</li>
                      <li>Margen de rentabilidad</li>
                      <li>Estado actual (activo/completado)</li>
                      <li>Progreso vs presupuesto</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium">Empleados</h4>
                    <ul className="list-disc list-inside text-sm">
                      <li>Rentabilidad por trabajador</li>
                      <li>Costes vs ingresos generados</li>
                      <li>Horas trabajadas vs facturadas</li>
                      <li>Eficiencia por empleado</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Cálculo de Rentabilidad por Trabajador:</h3>
                <code className="text-sm bg-white p-3 block rounded">
{`interface RentabilidadTrabajador {
  id: number;
  nombre: string;
  salarioBruto: number;
  importeHorasExtras: number;
  importeHorasFestivas: number;
  salarioBrutoConExtras: number;
  salarioNeto: number;
  adelantosDelMes: number;
  salarioAPagar: number;
  ingresosGenerados: number;
  costoTotalEmpleado: number;
  rentabilidad: number;           // ingresosGenerados - costoTotalEmpleado
  porcentajeRentabilidad: number; // (rentabilidad / ingresosGenerados) * 100
}

// Fórmula de cálculo:
// Ingresos = Horas trabajadas × Precio hora proyecto
// Costes = Salario bruto + SS empresa + extras + gastos variables
// Rentabilidad = Ingresos - Costes
// % Rentabilidad = (Rentabilidad / Ingresos) × 100`}
                </code>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Componentes del Dashboard:</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>ProyectosOverview:</strong> Resumen de todos los proyectos</li>
                  <li><strong>RentabilidadTrabajadores:</strong> Análisis individual por empleado</li>
                  <li><strong>EstadisticasGenerales:</strong> KPIs globales de la empresa</li>
                  <li><strong>AlertasProyectos:</strong> Proyectos con problemas de rentabilidad</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="bg-gradient-to-r from-blue-50 to-green-50">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-4">Flujo de Trabajo Completo</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li><strong>Crear Empleado:</strong> Datos personales, salario, categoría</li>
            <li><strong>Crear Proyecto:</strong> Tipo, presupuesto/precio hora, ciudad</li>
            <li><strong>Asignar Trabajadores:</strong> Con fechas de entrada/salida</li>
            <li><strong>Registrar Gastos:</strong> Variables del proyecto y empleados</li>
            <li><strong>Imputar Costes:</strong> Automático por mes para cada proyecto</li>
            <li><strong>Analizar Rentabilidad:</strong> Dashboard con métricas y alertas</li>
            <li><strong>Generar Informes:</strong> Por proyecto, empleado o período</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
};
