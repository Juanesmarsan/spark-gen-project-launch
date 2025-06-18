import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Code, Database, Users, Calculator, Building, FileText, Wrench, Car, Calendar, Download, Zap, Globe, Layers, Settings, BarChart3, Clock, Euro, Briefcase, Map } from "lucide-react";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { toast } from 'sonner';

export const ManualDesarrollador = () => {
  const descargarManualPDF = async () => {
    try {
      toast.info('Generando manual técnico completo en PDF...');
      
      const elemento = document.getElementById('manual-desarrollador');
      if (!elemento) {
        toast.error('Error al encontrar el contenido del manual');
        return;
      }

      // Configurar el elemento para la captura con alta resolución
      const canvas = await html2canvas(elemento, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        height: elemento.scrollHeight,
        width: elemento.scrollWidth,
        logging: false,
        onclone: (clonedDoc) => {
          // Asegurar que el contenido se vea bien en el PDF
          const clonedElement = clonedDoc.getElementById('manual-desarrollador');
          if (clonedElement) {
            clonedElement.style.width = '1200px';
            clonedElement.style.minHeight = 'auto';
          }
        }
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      
      // Calcular número de páginas necesarias
      const totalPages = Math.ceil((imgHeight * ratio) / pdfHeight);
      
      for (let i = 0; i < totalPages; i++) {
        if (i > 0) {
          pdf.addPage();
        }
        
        const sourceY = (i * pdfHeight) / ratio;
        const sourceHeight = Math.min(imgHeight - sourceY, pdfHeight / ratio);
        
        // Crear un canvas temporal para esta página
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = imgWidth;
        pageCanvas.height = sourceHeight;
        const pageCtx = pageCanvas.getContext('2d');
        
        if (pageCtx) {
          pageCtx.drawImage(canvas, 0, sourceY, imgWidth, sourceHeight, 0, 0, imgWidth, sourceHeight);
          const pageImgData = pageCanvas.toDataURL('image/png');
          
          pdf.addImage(pageImgData, 'PNG', imgX, 0, imgWidth * ratio, sourceHeight * ratio);
        }
      }
      
      const fechaActual = new Date();
      const nombreArchivo = `Manual_Tecnico_Completo_${fechaActual.toLocaleDateString('es-ES').replace(/\//g, '-')}.pdf`;
      
      pdf.save(nombreArchivo);
      toast.success('Manual técnico completo descargado correctamente');
    } catch (error) {
      console.error('Error al generar el PDF:', error);
      toast.error('Error al generar el PDF del manual');
    }
  };

  return (
    <div id="manual-desarrollador" className="p-8 space-y-8 max-w-none mx-auto bg-white">
      <div className="text-center space-y-6 border-b pb-8">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
          Manual Técnico Completo
        </h1>
        <h2 className="text-3xl font-semibold text-gray-700">
          Sistema de Gestión Empresarial Integral
        </h2>
        <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
          Documentación técnica exhaustiva para desarrolladores. Incluye arquitectura, lógica de negocio, 
          decisiones técnicas y flujos completos del sistema desarrollado con React + TypeScript.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Badge variant="outline" className="text-lg px-6 py-3">
            <Code className="w-5 h-5 mr-2" />
            Versión 2.0 - Documentación Completa
          </Badge>
          <Badge variant="outline" className="text-lg px-6 py-3">
            <Calendar className="w-5 h-5 mr-2" />
            {new Date().toLocaleDateString('es-ES')}
          </Badge>
          <Button onClick={descargarManualPDF} className="flex items-center gap-2 text-lg px-6 py-3">
            <Download className="w-5 h-5" />
            Descargar PDF Completo
          </Button>
        </div>
      </div>

      <Tabs defaultValue="introduccion" className="w-full">
        <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10 mb-8">
          <TabsTrigger value="introduccion">Introducción</TabsTrigger>
          <TabsTrigger value="arquitectura">Arquitectura</TabsTrigger>
          <TabsTrigger value="evolucion">Evolución</TabsTrigger>
          <TabsTrigger value="empleados">Empleados</TabsTrigger>
          <TabsTrigger value="proyectos">Proyectos</TabsTrigger>
          <TabsTrigger value="costes">Costes</TabsTrigger>
          <TabsTrigger value="calendario">Calendario</TabsTrigger>
          <TabsTrigger value="inventario">Inventario</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="implementacion">Implementación</TabsTrigger>
        </TabsList>

        <TabsContent value="introduccion" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Globe className="w-7 h-7" />
                Visión General del Proyecto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg border">
                <h3 className="text-xl font-semibold mb-4">Objetivo del Sistema</h3>
                <p className="text-lg leading-relaxed">
                  El sistema desarrollado es una <strong>aplicación integral de gestión empresarial</strong> diseñada 
                  específicamente para empresas del sector de la construcción. Permite gestionar de manera completa 
                  y eficiente todos los aspectos operativos y financieros de la empresa.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-blue-800 mb-3">Módulos Principales</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span>Gestión de Empleados y Personal</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-blue-600" />
                      <span>Administración de Proyectos</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Calculator className="w-4 h-4 text-blue-600" />
                      <span>Control de Costes y Beneficios</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span>Sistema de Calendario y Ausencias</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Wrench className="w-4 h-4 text-blue-600" />
                      <span>Inventario (EPIs, Herramientas, Vehículos)</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-green-50 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-green-800 mb-3">Características Técnicas</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-green-600" />
                      <span>SPA (Single Page Application)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-green-600" />
                      <span>Persistencia en localStorage</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-green-600" />
                      <span>Arquitectura modular y escalable</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Settings className="w-4 h-4 text-green-600" />
                      <span>Tipado estricto con TypeScript</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-green-600" />
                      <span>Dashboard con análisis en tiempo real</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-yellow-50 p-6 rounded-lg border">
                <h4 className="text-lg font-semibold text-yellow-800 mb-3">Flujo Principal de Trabajo</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-yellow-200 rounded-full w-8 h-8 flex items-center justify-center font-semibold">1</div>
                    <span><strong>Gestión de Personal:</strong> Registro de empleados con datos salariales y contractuales</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-yellow-200 rounded-full w-8 h-8 flex items-center justify-center font-semibold">2</div>
                    <span><strong>Creación de Proyectos:</strong> Definición de proyectos por presupuesto o administración</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-yellow-200 rounded-full w-8 h-8 flex items-center justify-center font-semibold">3</div>
                    <span><strong>Asignación de Recursos:</strong> Empleados, fechas, y recursos a proyectos</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-yellow-200 rounded-full w-8 h-8 flex items-center justify-center font-semibold">4</div>
                    <span><strong>Imputación de Costes:</strong> Cálculo automático de costes salariales y variables</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-yellow-200 rounded-full w-8 h-8 flex items-center justify-center font-semibold">5</div>
                    <span><strong>Análisis de Rentabilidad:</strong> Dashboard con métricas financieras y de rendimiento</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="arquitectura" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Layers className="w-7 h-7" />
                Arquitectura Técnica del Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Stack Tecnológico Completo</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold text-blue-700 mb-2">Frontend Core</h4>
                    <ul className="text-sm space-y-1">
                      <li>• React 18.3.1 (Hooks, Context)</li>
                      <li>• TypeScript (Tipado estricto)</li>
                      <li>• Vite (Build tool optimizado)</li>
                      <li>• React Router DOM 6.26.2</li>
                    </ul>
                  </div>
                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold text-green-700 mb-2">UI/UX</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Tailwind CSS (Styling)</li>
                      <li>• Shadcn/ui (Componentes)</li>
                      <li>• Lucide React (Iconografía)</li>
                      <li>• Responsive Design</li>
                    </ul>
                  </div>
                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold text-purple-700 mb-2">Estado y Datos</h4>
                    <ul className="text-sm space-y-1">
                      <li>• React Hooks (useState, useEffect)</li>
                      <li>• Custom Hooks (Lógica reutilizable)</li>
                      <li>• localStorage (Persistencia)</li>
                      <li>• TanStack Query (Futura extensión)</li>
                    </ul>
                  </div>
                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold text-orange-700 mb-2">Utilidades</h4>
                    <ul className="text-sm space-y-1">
                      <li>• date-fns (Manipulación fechas)</li>
                      <li>• React Hook Form (Formularios)</li>
                      <li>• Zod (Validaciones)</li>
                      <li>• Recharts (Gráficos)</li>
                    </ul>
                  </div>
                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold text-red-700 mb-2">Documentación</h4>
                    <ul className="text-sm space-y-1">
                      <li>• jsPDF (Generación PDF)</li>
                      <li>• html2canvas (Captura HTML)</li>
                      <li>• Sonner (Notificaciones)</li>
                    </ul>
                  </div>
                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold text-gray-700 mb-2">Desarrollo</h4>
                    <ul className="text-sm space-y-1">
                      <li>• ESLint (Linting)</li>
                      <li>• Hot Module Replacement</li>
                      <li>• Source Maps</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Estructura de Directorios Detallada</h3>
                <div className="bg-white p-4 rounded border font-mono text-sm">
                  <pre>{`src/
├── components/                    # Componentes React reutilizables
│   ├── ui/                       # Componentes base de shadcn/ui
│   │   ├── button.tsx            # Componente Button personalizado
│   │   ├── card.tsx              # Cards con variants
│   │   ├── table.tsx             # Tablas con sorting y paginación
│   │   ├── dialog.tsx            # Modales y diálogos
│   │   ├── form.tsx              # Formularios con validación
│   │   └── ...                   # Más de 30 componentes UI
│   ├── empleado/                 # Componentes específicos de empleados
│   │   ├── DatosPersonalesTab.tsx    # Tab de información personal
│   │   ├── GastosVariablesTab.tsx    # Tab de gastos del empleado
│   │   ├── HistorialSalariosTab.tsx  # Tab de historial salarial
│   │   ├── ProyectosTab.tsx          # Tab de proyectos asignados
│   │   └── gastos/                   # Subcomponentes de gastos
│   ├── proyecto/                 # Componentes específicos de proyectos
│   │   ├── TrabajadoresTab.tsx       # Gestión de trabajadores
│   │   ├── GastosVariablesProyectoTab.tsx # Gastos del proyecto
│   │   ├── ImputacionCostesTab.tsx   # Imputación de costes
│   │   ├── AnalisisFinancieroTab.tsx # Análisis financiero
│   │   ├── trabajadores/             # Subcomponentes trabajadores
│   │   ├── imputacion/               # Subcomponentes imputación
│   │   └── analisis/                 # Subcomponentes análisis
│   ├── dashboard/                # Componentes del dashboard
│   │   ├── RentabilidadTrabajadores.tsx # Análisis por empleado
│   │   └── HorasProyecto.tsx         # Horas por proyecto
│   ├── vehiculos/                # Componentes de vehículos
│   ├── manual/                   # Componentes del manual
│   └── ...                       # Otros componentes generales
├── hooks/                        # Custom Hooks para lógica de negocio
│   ├── useEmpleados.ts          # Hook principal de empleados
│   ├── useProyectos.ts          # Hook principal de proyectos
│   ├── useGastosEmpleados.ts    # Hook para costes de empleados
│   ├── useCalendario.ts         # Hook para gestión de calendario
│   ├── usePdfGenerator.ts       # Hook para generación de PDFs
│   ├── useCalculosBeneficios.ts # Hook para cálculos financieros
│   ├── empleado/                # Hooks específicos de empleados
│   ├── gastosEmpleados/         # Hooks para gestión de costes
│   ├── beneficios/              # Hooks para análisis financiero
│   └── common/                  # Hooks reutilizables
├── pages/                       # Páginas principales de la aplicación
│   ├── Dashboard.tsx            # Página principal con métricas
│   ├── Empleados.tsx            # Gestión de empleados
│   ├── Proyectos.tsx            # Gestión de proyectos
│   ├── Inventario.tsx           # Gestión de inventario
│   ├── Vehiculos.tsx            # Gestión de vehículos
│   ├── GastosVariables.tsx      # Gestión de gastos variables
│   ├── Epis.tsx                 # Gestión de EPIs
│   ├── Gerencia.tsx             # Módulo de gerencia
│   ├── Manual.tsx               # Manual técnico
│   └── NotFound.tsx             # Página 404
├── types/                       # Definiciones de tipos TypeScript
│   ├── empleado.ts              # Tipos relacionados con empleados
│   ├── proyecto.ts              # Tipos relacionados con proyectos
│   ├── gastoEmpleado.ts         # Tipos para costes de empleados
│   ├── gastoVariable.ts         # Tipos para gastos variables
│   ├── gastosFijos.ts           # Tipos para gastos fijos
│   ├── vehiculo.ts              # Tipos para vehículos
│   └── calendario.ts            # Tipos para calendario
├── utils/                       # Utilidades y helpers
│   ├── calendarioUtils.ts       # Utilidades para calendario español
│   └── ...                      # Otras utilidades
├── lib/                         # Configuraciones de librerías
│   └── utils.ts                 # Utilidades de UI
└── App.tsx                      # Componente raíz con rutas`}</pre>
                </div>
              </div>

              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Principios Arquitectónicos Aplicados</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-green-800">Separación de Responsabilidades</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• <strong>Hooks:</strong> Lógica de negocio y estado</li>
                      <li>• <strong>Componentes:</strong> Solo UI y presentación</li>
                      <li>• <strong>Types:</strong> Definiciones de datos centralizadas</li>
                      <li>• <strong>Utils:</strong> Funciones puras reutilizables</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-green-800">Modularidad y Escalabilidad</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• <strong>Componentes pequeños:</strong> Máximo 50 líneas</li>
                      <li>• <strong>Hooks especializados:</strong> Una responsabilidad</li>
                      <li>• <strong>Lazy loading:</strong> Carga bajo demanda</li>
                      <li>• <strong>Composition:</strong> Componentes componibles</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Flujo de Datos y Estado</h3>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold mb-2">1. Gestión de Estado Local</h4>
                    <p className="text-sm">Cada hook mantiene su propio estado usando <code>useState</code> y se sincroniza con localStorage automáticamente.</p>
                  </div>
                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold mb-2">2. Persistencia Automática</h4>
                    <p className="text-sm">Los cambios se guardan inmediatamente en localStorage con callback <code>saveToLocalStorage</code>.</p>
                  </div>
                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold mb-2">3. Sincronización Entre Módulos</h4>
                    <p className="text-sm">Los hooks se comunican a través de funciones que actualizan múltiples stores cuando es necesario.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evolucion" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Clock className="w-7 h-7" />
                Evolución y Desarrollo del Proyecto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border">
                <h3 className="text-xl font-semibold mb-4">Historial de Funcionalidades Implementadas</h3>
                <p className="text-lg mb-4">
                  El proyecto ha evolucionado de manera iterativa, agregando funcionalidades según las necesidades del negocio.
                  Cada implementación se basó en feedback real y requisitos específicos del sector construcción.
                </p>
              </div>

              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-6">
                  <h4 className="text-lg font-semibold text-blue-700 mb-2">Fase 1: Fundamentos (Gestión Básica)</h4>
                  <div className="bg-blue-50 p-4 rounded">
                    <h5 className="font-semibold mb-2">Empleados - Módulo Base</h5>
                    <ul className="space-y-1 text-sm">
                      <li>• <strong>CRUD básico:</strong> Crear, listar, editar y eliminar empleados</li>
                      <li>• <strong>Datos personales:</strong> Nombre, apellidos, teléfono, fechas de ingreso</li>
                      <li>• <strong>Información salarial:</strong> Salario bruto, seguridad social, retenciones</li>
                      <li>• <strong>Categorización:</strong> Departamentos (operario, técnico, administración, gerencia)</li>
                      <li>• <strong>Categorías laborales:</strong> Peón, oficial 1ª/2ª/3ª, encargado, técnico</li>
                      <li>• <strong>Estados:</strong> Activo/Inactivo con fechas de alta y baja</li>
                    </ul>
                    <div className="mt-3 p-3 bg-white rounded border">
                      <strong>Decisión técnica:</strong> Se optó por localStorage en lugar de base de datos externa 
                      para simplicidad de despliegue y porque los datos son específicos por empresa.
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-green-500 pl-6">
                  <h4 className="text-lg font-semibold text-green-700 mb-2">Fase 2: Gestión Financiera Avanzada</h4>
                  <div className="bg-green-50 p-4 rounded">
                    <h5 className="font-semibold mb-2">Sistema de Adelantos y Gastos Variables</h5>
                    <ul className="space-y-1 text-sm">
                      <li>• <strong>Adelantos de nómina:</strong> Registro con concepto, cantidad y fecha</li>
                      <li>• <strong>Gastos variables:</strong> Dietas, alojamiento, combustible, transporte</li>
                      <li>• <strong>Historial salarial:</strong> Cambios de salario con fechas y motivos</li>
                      <li>• <strong>Precios horas extra:</strong> Configuración individual por empleado</li>
                      <li>• <strong>Precios horas festivas:</strong> Tarifas especiales para festivos</li>
                    </ul>
                    <div className="mt-3 p-3 bg-white rounded border">
                      <strong>Lógica implementada:</strong> Los gastos variables se vinculan automáticamente 
                      a proyectos para cálculo de rentabilidad por proyecto.
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-orange-500 pl-6">
                  <h4 className="text-lg font-semibold text-orange-700 mb-2">Fase 3: Gestión de Proyectos</h4>
                  <div className="bg-orange-50 p-4 rounded">
                    <h5 className="font-semibold mb-2">Proyectos por Presupuesto y Administración</h5>
                    <ul className="space-y-1 text-sm">
                      <li>• <strong>Tipos de proyecto:</strong> Por presupuesto fijo vs por administración (horas)</li>
                      <li>• <strong>Asignación de trabajadores:</strong> Con fechas de entrada y salida</li>
                      <li>• <strong>Certificaciones mensuales:</strong> Para proyectos por presupuesto</li>
                      <li>• <strong>Gastos del proyecto:</strong> Materiales, transporte, herramientas</li>
                      <li>• <strong>Estados:</strong> Activo, completado, pausado</li>
                    </ul>
                    <div className="mt-3 p-3 bg-white rounded border">
                      <strong>Lógica diferenciada:</strong> Proyectos por presupuesto usan certificaciones para 
                      calcular beneficios, mientras que administración usa horas × precio hora.
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-purple-500 pl-6">
                  <h4 className="text-lg font-semibold text-purple-700 mb-2">Fase 4: Sistema de Imputación de Costes</h4>
                  <div className="bg-purple-50 p-4 rounded">
                    <h5 className="font-semibold mb-2">Cálculo Automático de Costes Salariales</h5>
                    <ul className="space-y-1 text-sm">
                      <li>• <strong>Prorrateo automático:</strong> Salarios según días trabajados en cada proyecto</li>
                      <li>• <strong>Días laborales:</strong> Cálculo automático excluyendo festivos y fines de semana</li>
                      <li>• <strong>Horas extras y festivas:</strong> Cálculo separado con tarifas especiales</li>
                      <li>• <strong>Gastos variables vinculados:</strong> Asignación automática a proyectos</li>
                      <li>• <strong>Histórico mensual:</strong> Registro de imputaciones por mes/año</li>
                    </ul>
                    <div className="mt-3 p-3 bg-white rounded border">
                      <strong>Algoritmo clave:</strong> (Salario Total / Días Laborables Mes) × Días Trabajados Proyecto = Coste Imputado
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-red-500 pl-6">
                  <h4 className="text-lg font-semibold text-red-700 mb-2">Fase 5: Calendario y Ausencias</h4>
                  <div className="bg-red-50 p-4 rounded">
                    <h5 className="font-semibold mb-2">Sistema de Calendario Español Completo</h5>
                    <ul className="space-y-1 text-sm">
                      <li>• <strong>Festivos nacionales:</strong> Calendario oficial español integrado</li>
                      <li>• <strong>Festivos autonómicos:</strong> Específicos de la Comunidad Valenciana</li>
                      <li>• <strong>Tipos de ausencia:</strong> Vacaciones, baja médica, baja laboral, ausencias</li>
                      <li>• <strong>Horas por día:</strong> Configuración automática (8h laborables, 0h festivos)</li>
                      <li>• <strong>Calendario visual:</strong> Vista mensual con codificación por colores</li>
                    </ul>
                    <div className="mt-3 p-3 bg-white rounded border">
                      <strong>Implementación técnica:</strong> Uso de date-fns con locale español y 
                      arrays predefinidos de festivos por año.
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-teal-500 pl-6">
                  <h4 className="text-lg font-semibold text-teal-700 mb-2">Fase 6: Inventario y Recursos</h4>
                  <div className="bg-teal-50 p-4 rounded">
                    <h5 className="font-semibold mb-2">Gestión Completa de Recursos Empresariales</h5>
                    <ul className="space-y-1 text-sm">
                      <li>• <strong>EPIs (Equipos de Protección):</strong> Cascos, botas, guantes, arneses</li>
                      <li>• <strong>Herramientas:</strong> Taladros, sierras, herramientas manuales</li>
                      <li>• <strong>Vehículos:</strong> Furgonetas, coches de empresa, motos</li>
                      <li>• <strong>Asignaciones:</strong> Control de qué empleado tiene qué recursos</li>
                      <li>• <strong>Estados:</strong> Disponible/Asignado con fechas de entrega</li>
                      <li>• <strong>Costes:</strong> Precio de adquisición por elemento</li>
                    </ul>
                    <div className="mt-3 p-3 bg-white rounded border">
                      <strong>Lógica de control:</strong> Un EPI/herramienta solo puede estar asignado a un empleado. 
                      Vehículos tienen control especial (uno por empleado máximo).
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-indigo-500 pl-6">
                  <h4 className="text-lg font-semibold text-indigo-700 mb-2">Fase 7: Dashboard y Análisis</h4>
                  <div className="bg-indigo-50 p-4 rounded">
                    <h5 className="font-semibold mb-2">Análisis de Rentabilidad y KPIs</h5>
                    <ul className="space-y-1 text-sm">
                      <li>• <strong>Rentabilidad por empleado:</strong> Ingresos generados vs costes salariales</li>
                      <li>• <strong>Rentabilidad por proyecto:</strong> Beneficio bruto y neto mensual</li>
                      <li>• <strong>Métricas globales:</strong> Margen empresa, beneficio total, gastos totales</li>
                      <li>• <strong>Gráficos interactivos:</strong> Evolución mensual con Recharts</li>
                      <li>• <strong>Alertas automáticas:</strong> Proyectos con rentabilidad negativa</li>
                    </ul>
                    <div className="mt-3 p-3 bg-white rounded border">
                      <strong>Cálculos complejos:</strong> El dashboard calcula rentabilidad cruzando datos de 
                      proyectos, empleados, gastos y certificaciones en tiempo real.
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-gray-500 pl-6">
                  <h4 className="text-lg font-semibold text-gray-700 mb-2">Fase 8: Módulo de Gerencia</h4>
                  <div className="bg-gray-50 p-4 rounded">
                    <h5 className="font-semibold mb-2">Gestión Separada del Personal Directivo</h5>
                    <ul className="space-y-1 text-sm">
                      <li>• <strong>Personal de gerencia:</strong> Separación del personal operativo</li>
                      <li>• <strong>Gastos fijos:</strong> Sincronización automática con salarios de gerencia</li>
                      <li>• <strong>Coeficientes empresa:</strong> Cálculo de gastos fijos distribuidos</li>
                      <li>• <strong>Análisis separado:</strong> Costes directivos vs operativos</li>
                    </ul>
                    <div className="mt-3 p-3 bg-white rounded border">
                      <strong>Decisión organizativa:</strong> Se separó la gestión de gerencia para tener 
                      control específico sobre costes directivos y operativos.
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-pink-500 pl-6">
                  <h4 className="text-lg font-semibold text-pink-700 mb-2">Fase 9: Documentación y Reportes</h4>
                  <div className="bg-pink-50 p-4 rounded">
                    <h5 className="font-semibold mb-2">Sistema de Generación de Documentos</h5>
                    <ul className="space-y-1 text-sm">
                      <li>• <strong>Reportes en PDF:</strong> Empleados, proyectos, financiero, vacaciones</li>
                      <li>• <strong>Manual técnico:</strong> Documentación completa para desarrolladores</li>
                      <li>• <strong>Exportación de datos:</strong> Información estructurada para auditorías</li>
                      <li>• <strong>Generación automática:</strong> PDFs con datos actualizados en tiempo real</li>
                    </ul>
                    <div className="mt-3 p-3 bg-white rounded border">
                      <strong>Tecnología usada:</strong> jsPDF + html2canvas para convertir componentes React 
                      en documentos PDF manteniendo el styling.
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="empleados" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Users className="w-7 h-7" />
                Módulo de Gestión de Empleados - Análisis Técnico Completo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 p-6 rounded-lg border">
                <h3 className="text-xl font-semibold mb-4">Arquitectura del Módulo de Empleados</h3>
                <p className="text-lg mb-4">
                  El módulo de empleados es el núcleo del sistema, diseñado para gestionar todo el ciclo de vida 
                  del personal, desde su contratación hasta la baja, incluyendo todos los aspectos salariales y operativos.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg border">
                  <h4 className="text-lg font-semibold text-blue-700 mb-3">Hook Principal: useEmpleados</h4>
                  <div className="bg-gray-50 p-4 rounded text-sm">
                    <strong>Ubicación:</strong> <code>src/hooks/useEmpleados.ts</code><br/>
                    <strong>Responsabilidad:</strong> Gestión completa del estado de empleados<br/>
                    <strong>Persistencia:</strong> localStorage automática<br/>
                    <strong>Funciones principales:</strong>
                    <ul className="mt-2 space-y-1">
                      <li>• <code>agregarEmpleado()</code> - Crear empleado</li>
                      <li>• <code>updateEmpleado()</code> - Actualizar datos</li>
                      <li>• <code>eliminarEmpleado()</code> - Eliminar empleado</li>
                      <li>• <code>agregarAdelanto()</code> - Adelantos nómina</li>
                      <li>• <code>agregarGastoVariable()</code> - Gastos del empleado</li>
                      <li>• <code>agregarCambioSalario()</code> - Historial salarial</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg border">
                  <h4 className="text-lg font-semibold text-green-700 mb-3">Hook de Acciones: useEmpleadosActions</h4>
                  <div className="bg-gray-50 p-4 rounded text-sm">
                    <strong>Ubicación:</strong> <code>src/hooks/useEmpleadosActions.ts</code><br/>
                    <strong>Responsabilidad:</strong> Lógica de UI y acciones de usuario<br/>
                    <strong>Funciones principales:</strong>
                    <ul className="mt-2 space-y-1">
                      <li>• <code>handleAgregarEmpleado()</code> - Con validaciones</li>
                      <li>• <code>handleBulkEliminar()</code> - Eliminación masiva</li>
                      <li>• <code>handleBulkDeshabilitar()</code> - Baja masiva</li>
                      <li>• Gestión de formularios y modales</li>
                      <li>• Notificaciones (toast) automáticas</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Estructura de Datos del Empleado</h3>
                <div className="bg-white p-4 rounded border font-mono text-sm">
                  <pre>{`interface Empleado {
  // Identificación y datos personales
  id: number;                          // ID único autogenerado
  nombre: string;                      // Nombre del empleado
  apellidos: string;                   // Apellidos completos
  telefono: string;                    // Teléfono de contacto
  fechaIngreso: Date;                  // Fecha de ingreso en la empresa
  fechaAlta: Date;                     // Fecha de alta en el sistema
  fechaBaja?: Date;                    // Fecha de baja (opcional)
  activo: boolean;                     // Estado activo/inactivo

  // Información salarial base
  salarioBruto: number;                // Salario bruto mensual
  seguridadSocialTrabajador: number;   // Cotización del trabajador
  seguridadSocialEmpresa: number;      // Cotización de la empresa
  retenciones: number;                 // Retenciones IRPF
  embargo: number;                     // Embargos judiciales

  // Categorización laboral
  departamento: 'operario' | 'tecnico' | 'administracion' | 'gerencia';
  categoria: 'peon' | 'oficial_3' | 'oficial_2' | 'oficial_1' | 
             'encargado' | 'tecnico' | 'gerencia';

  // Tarifas especiales
  precioHoraExtra: number;             // Precio por hora extra
  precioHoraFestiva: number;           // Precio por hora festiva

  // Colecciones relacionadas
  adelantos: Adelanto[];               // Adelantos de nómina
  gastosVariables: GastoVariableEmpleado[]; // Gastos del empleado
  historialSalarios: HistorialSalario[]; // Cambios salariales
  episAsignados: EpiAsignado[];        // EPIs entregados
  herramientasAsignadas: HerramientaAsignada[]; // Herramientas
  vehiculosAsignados: VehiculoAsignado[]; // Vehículos asignados
  documentos: Documento[];             // Documentos legales
  proyectos: string[];                 // Proyectos asignados
}`}</pre>
                </div>
              </div>

              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Componentes Clave del Módulo</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold text-green-700 mb-2">EmpleadoForm.tsx</h4>
                    <p className="text-sm mb-2">Formulario principal de creación/edición</p>
                    <ul className="text-xs space-y-1">
                      <li>• Validación con react-hook-form + zod</li>
                      <li>• Cálculo automático de salario neto</li>
                      <li>• Selección de departamento y categoría</li>
                      <li>• Fechas con date-picker</li>
                    </ul>
                  </div>
                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold text-green-700 mb-2">EmpleadosList.tsx</h4>
                    <p className="text-sm mb-2">Lista con filtros y acciones masivas</p>
                    <ul className="text-xs space-y-1">
                      <li>• Filtro por departamento y estado</li>
                      <li>• Búsqueda por nombre</li>
                      <li>• Selección múltiple para acciones masivas</li>
                      <li>• Ordenación por columnas</li>
                    </ul>
                  </div>
                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold text-green-700 mb-2">EmpleadoDetails.tsx</h4>
                    <p className="text-sm mb-2">Vista detallada con tabs especializados</p>
                    <ul className="text-xs space-y-1">
                      <li>• Tab de datos personales</li>
                      <li>• Tab de gastos variables</li>
                      <li>• Tab de historial salarial</li>
                      <li>• Tab de proyectos asignados</li>
                      <li>• Tabs de inventario (EPIs, herramientas, vehículos)</li>
                    </ul>
                  </div>
                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold text-green-700 mb-2">GastosVariablesTab.tsx</h4>
                    <p className="text-sm mb-2">Gestión específica de gastos del empleado</p>
                    <ul className="text-xs space-y-1">
                      <li>• Formulario de nuevo gasto</li>
                      <li>• Lista de gastos con edición inline</li>
                      <li>• Categorización automática</li>
                      <li>• Vinculación opcional a proyectos</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Lógica de Negocio Específica</h3>
                
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold text-purple-700 mb-2">Cálculo de Salario Neto</h4>
                    <div className="bg-gray-50 p-3 rounded font-mono text-sm">
                      <code>{`const calcularSalarioNeto = (empleado) => {
  const descuentos = empleado.seguridadSocialTrabajador + 
                    empleado.retenciones + 
                    empleado.embargo;
  
  return empleado.salarioBruto - descuentos;
};`}</code>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold text-purple-700 mb-2">Coste Total para la Empresa</h4>
                    <div className="bg-gray-50 p-3 rounded font-mono text-sm">
                      <code>{`const calcularCosteTotalEmpleado = (empleado) => {
  return empleado.salarioBruto + empleado.seguridadSocialEmpresa;
};`}</code>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold text-purple-700 mb-2">Gestión de Estados</h4>
                    <div className="text-sm space-y-2">
                      <p><strong>Activo:</strong> Empleado trabajando normalmente</p>
                      <p><strong>Inactivo:</strong> Empleado dado de baja pero mantenido en histórico</p>
                      <p><strong>Fechas:</strong> fechaAlta automática al crear, fechaBaja manual al deshabilitar</p>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold text-purple-700 mb-2">Validaciones Implementadas</h4>
                    <ul className="text-sm space-y-1">
                      <li>• <strong>Campos obligatorios:</strong> Nombre, apellidos, salario bruto</li>
                      <li>• <strong>Formatos numéricos:</strong> Salarios y porcentajes positivos</li>
                      <li>• <strong>Fechas lógicas:</strong> FechaIngreso <= FechaAlta <= FechaBaja</li>
                      <li>• <strong>Teléfono:</strong> Formato español opcional</li>
                      <li>• <strong>Departamento/Categoría:</strong> Combinaciones válidas</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Integración con Otros Módulos</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold text-red-700 mb-2">Conexión con Proyectos</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Los empleados se asignan a proyectos con fechas</li>
                      <li>• El coste salarial se imputa automáticamente</li>
                      <li>• Los gastos variables se pueden vincular a proyectos</li>
                      <li>• El calendario determina días trabajados por proyecto</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold text-red-700 mb-2">Conexión con Inventario</h4>
                    <ul className="text-sm space-y-1">
                      <li>• EPIs se asignan y controlan por empleado</li>
                      <li>• Herramientas tienen asignación temporal</li>
                      <li>• Vehículos: máximo uno por empleado</li>
                      <li>• Control de disponibilidad automático</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold text-red-700 mb-2">Conexión con Dashboard</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Cálculo de rentabilidad individual</li>
                      <li>• Métricas de productividad</li>
                      <li>• Comparativa entre empleados</li>
                      <li>• Alertas de rendimiento</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold text-red-700 mb-2">Conexión con Calendario</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Calendario individual por empleado/mes</li>
                      <li>• Control de ausencias y vacaciones</li>
                      <li>• Cálculo de horas extras y festivas</li>
                      <li>• Días laborales para prorrateo de costes</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="proyectos" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Building className="w-7 h-7" />
                Módulo de Gestión de Proyectos - Análisis Técnico Detallado
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-orange-50 p-6 rounded-lg border">
                <h3 className="text-xl font-semibold mb-4">Filosofía del Módulo de Proyectos</h3>
                <p className="text-lg mb-4">
                  El módulo de proyectos está diseñado para gestionar dos tipos fundamentalmente diferentes de proyectos 
                  que se dan en el sector de la construcción, cada uno con su propia lógica financiera y de seguimiento.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-purple-50 p-6 rounded-lg border">
                  <h4 className="text-xl font-semibold text-purple-700 mb-3">Proyectos por Presupuesto</h4>
                  <div className="space-y-3">
                    <p className="text-sm">
                      <strong>Definición:</strong> Proyectos con un precio fijo acordado previamente con el cliente.
                    </p>
                    <div className="bg-white p-4 rounded border">
                      <h5 className="font-semibold mb-2">Características:</h5>
                      <ul className="text-sm space-y-1">
                        <li>• <strong>Presupuesto fijo:</strong> Cantidad total acordada</li>
                        <li>• <strong>Certificaciones mensuales:</strong> Facturación por hitos</li>
                        <li>• <strong>Riesgo empresarial:</strong> Costes reales vs presupuesto</li>
                        <li>• <strong>Rentabilidad:</strong> Certificado - Gastos Reales</li>
                      </ul>
                    </div>
                    <div className="bg-purple-100 p-3 rounded">
                      <strong>Fórmula financiera:</strong><br/>
                      <code>Beneficio = Σ Certificaciones - Σ Costes Reales</code>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 p-6 rounded-lg border">
                  <h4 className="text-xl font-semibold text-orange-700 mb-3">Proyectos por Administración</h4>
                  <div className="space-y-3">
                    <p className="text-sm">
                      <strong>Definición:</strong> Proyectos facturados por horas trabajadas a precio pactado.
                    </p>
                    <div className="bg-white p-4 rounded border">
                      <h5 className="font-semibold mb-2">Características:</h5>
                      <ul className="text-sm space-y-1">
                        <li>• <strong>Precio por hora:</strong> Tarifa fija por hora trabajada</li>
                        <li>• <strong>Facturación real:</strong> Según horas efectivas</li>
                        <li>• <strong>Certificación cliente:</strong> Lo que realmente paga el cliente</li>
                        <li>• <strong>Rentabilidad:</strong> Facturado - Costes por Hora</li>
                      </ul>
                    </div>
                    <div className="bg-orange-100 p-3 rounded">
                      <strong>Fórmula financiera:</strong><br/>
                      <code>Beneficio = (Horas × Precio/Hora) - Costes</code>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Estructura de Datos del Proyecto</h3>
                <div className="bg-white p-4 rounded border font-mono text-xs">
                  <pre>{`interface Proyecto {
  // Identificación básica
  id: number;                          // ID único autogenerado
  nombre: string;                      // Nombre descriptivo del proyecto
  ciudad: string;                      // Ubicación geográfica
  descripcion?: string;                // Descripción detallada opcional
  fechaCreacion: Date;                 // Fecha de creación en el sistema

  // Tipo y configuración financiera
  tipo: 'presupuesto' | 'administracion';  // Tipo fundamental del proyecto
  estado: 'activo' | 'completado' | 'pausado';  // Estado actual

  // Configuración por presupuesto
  presupuestoTotal?: number;           // Presupuesto total acordado
  certificaciones?: CertificacionMensual[];  // Facturaciones mensuales

  // Configuración por administración  
  precioHora?: number;                 // Precio por hora de trabajo
  certificacionReal?: number;          // Lo que realmente paga el cliente

  // Recursos y costes
  trabajadoresAsignados: Trabajador[]; // Empleados asignados con fechas
  gastosVariables?: GastoVariableProyecto[];  // Gastos específicos del proyecto
}

interface Trabajador {
  id: number;                          // ID del empleado
  nombre: string;                      // Nombre del empleado
  apellidos: string;                   // Apellidos del empleado
  fechaEntrada?: Date;                 // Inicio trabajo en el proyecto
  fechaSalida?: Date;                  // Fin trabajo en el proyecto
}

interface CertificacionMensual {
  id: number;                          // ID de la certificación
  mes: number;                         // Mes (1-12)
  anio: number;                        // Año
  importe: number;                     // Cantidad certificada
  descripcion?: string;                // Descripción del hito
  fechaRegistro: Date;                 // Fecha de registro en sistema
}

interface GastoVariableProyecto {
  id: number;                          // ID del gasto
  concepto: string;                    // Descripción del gasto
  importe: number;                     // Cantidad gastada
  fecha: Date;                         // Fecha del gasto
  categoria: 'material' | 'transporte' | 'herramienta' | 'otro';
  descripcion?: string;                // Descripción detallada
  factura?: string;                    // Referencia a factura
}`}</pre>
                </div>
              </div>

              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Hooks Especializados</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold text-green-700 mb-2">useProyectos.ts</h4>
                    <p className="text-sm mb-2">Hook principal de gestión de proyectos</p>
                    <div className="bg-gray-50 p-3 rounded text-xs">
                      <strong>Funciones principales:</strong>
                      <ul className="mt-1 space-y-1">
                        <li>• <code>agregarProyecto()</code> - Crear nuevo proyecto</li>
                        <li>• <code>updateProyecto()</code> - Actualizar proyecto existente</li>
                        <li>• <code>eliminarProyecto()</code> - Eliminar proyecto</li>
                        <li>• <code>agregarGastoProyecto()</code> - Añadir gasto variable</li>
                        <li>• <code>agregarCertificacion()</code> - Añadir certificación</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold text-green-700 mb-2">useProyectosActions.ts</h4>
                    <p className="text-sm mb-2">Hook de acciones de UI para proyectos</p>
                    <div className="bg-gray-50 p-3 rounded text-xs">
                      <strong>Responsabilidades:</strong>
                      <ul className="mt-1 space-y-1">
                        <li>• Gestión de formularios de proyecto</li>
                        <li>• Validaciones de datos de entrada</li>
                        <li>• Manejo de estados de UI (modales, tabs)</li>
                        <li>• Notificaciones de éxito/error</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Componentes Especializados por Tabs</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold text-yellow-700 mb-2">TrabajadoresTab.tsx</h4>
                    <p className="text-xs mb-2">Gestión de asignaciones de empleados</p>
                    <ul className="text-xs space-y-1">
                      <li>• Lista de empleados asignados</li>
                      <li>• Fechas de entrada/salida por empleado</li>
                      <li>• Calendario mensual de trabajadores</li>
                      <li>• Resumen de días trabajados</li>
                    </ul>
                  </div>

                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold text-yellow-700 mb-2">GastosVariablesProyectoTab.tsx</h4>
                    <p className="text-xs mb-2">Control de gastos específicos del proyecto</p>
                    <ul className="text-xs space-y-1">
                      <li>• Formulario de nuevo gasto</li>
                      <li>• Lista de gastos con categorías</li>
                      <li>• Totales por categoría</li>
                      <li>• Vinculación con facturas</li>
                    </ul>
                  </div>

                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold text-yellow-700 mb-2">CertificacionesTab.tsx</h4>
                    <p className="text-xs mb-2">Solo para proyectos por presupuesto</p>
                    <ul className="text-xs space-y-1">
                      <li>• Registro de certificaciones mensuales</li>
                      <li>• Timeline de facturación</li>
                      <li>• Progreso vs presupuesto total</li>
                      <li>• Proyección de finalización</li>
                    </ul>
                  </div>

                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold text-yellow-700 mb-2">ImputacionCostesTab.tsx</h4>
                    <p className="text-xs mb-2">Asignación automática de costes salariales</p>
                    <ul className="text-xs space-y-1">
                      <li>• Imputación por empleado/mes</li>
                      <li>• Cálculo de días trabajados</li>
                      <li>• Prorrateo de salarios</li>
                      <li>• Horas extras y festivas</li>
                    </ul>
                  </div>

                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold text-yellow-700 mb-2">AnalisisFinancieroTab.tsx</h4>
                    <p className="text-xs mb-2">Métricas financieras del proyecto</p>
                    <ul className="text-xs space-y-1">
                      <li>• Beneficio bruto y neto</li>
                      <li>• Margen de rentabilidad</li>
                      <li>• Evolución mensual</li>
                      <li>• Proyección de beneficios</li>
                    </ul>
                  </div>

                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold text-yellow-700 mb-2">ProyectoBasicInfo.tsx</h4>
                    <p className="text-xs mb-2">Información básica y edición</p>
                    <ul className="text-xs space-y-1">
                      <li>• Datos generales del proyecto</li>
                      <li>• Edición inline de campos</li>
                      <li>• Cambio de estado</li>
                      <li>• Configuración tipo proyecto</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Lógicas de Negocio Específicas</h3>
                
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold text-red-700 mb-2">Cálculo de Días Trabajados por Empleado</h4>
                    <div className="bg-gray-50 p-3 rounded font-mono text-xs">
                      <pre>{`const calcularDiasTrabajados = (empleado, proyecto, mes, anio) => {
  const primerDiaMes = new Date(anio, mes - 1, 1);
  const ultimoDiaMes = new Date(anio, mes, 0);
  
  // Determinar período efectivo de trabajo
  const fechaInicio = empleado.fechaEntrada || primerDiaMes;
  const fechaFin = empleado.fechaSalida || ultimoDiaMes;
  
  let diasTrabajados = 0;
  let fechaActual = new Date(Math.max(fechaInicio, primerDiaMes));
  
  while (fechaActual <= Math.min(fechaFin, ultimoDiaMes)) {
    const diaSemana = fechaActual.getDay();
    
    // Solo contar días laborales (L-V) y no festivos
    if (diaSemana >= 1 && diaSemana <= 5 && !esFestivo(fechaActual)) {
      diasTrabajados++;
    }
    
    fechaActual.setDate(fechaActual.getDate() + 1);
  }
  
  return diasTrabajados;
};`}</pre>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold text-red-700 mb-2">Cálculo de Rentabilidad por Tipo de Proyecto</h4>
                    <div className="space-y-3">
                      <div className="bg-purple-100 p-3 rounded">
                        <strong>Proyectos por Presupuesto:</strong>
                        <div className="font-mono text-xs mt-1">
                          <code>rentabilidad = Σ certificaciones - Σ costesImputados - Σ gastosVariables</code>
                        </div>
                      </div>
                      <div className="bg-orange-100 p-3 rounded">
                        <strong>Proyectos por Administración:</strong>
                        <div className="font-mono text-xs mt-1">
                          <code>rentabilidad = (horasTrabajas × precioHora) - Σ costesImputados - Σ gastosVariables</code>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold text-red-700 mb-2">Validaciones de Consistencia</h4>
                    <ul className="text-sm space-y-1">
                      <li>• <strong>Fechas lógicas:</strong> fechaEntrada ≤ fechaSalida</li>
                      <li>• <strong>Empleados únicos:</strong> No duplicar empleados en el mismo proyecto</li>
                      <li>• <strong>Presupuesto:</strong> Certificaciones no pueden superar presupuesto total</li>
                      <li>• <strong>Precio hora:</strong> Obligatorio para proyectos por administración</li>
                      <li>• <strong>Estado coherente:</strong> Proyectos completados no se pueden modificar</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="costes" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Euro className="w-7 h-7" />
                Sistema de Imputación de Costes - Arquitectura Financiera
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border">
                <h3 className="text-xl font-semibold mb-4">Filosofía del Sistema de Costes</h3>
                <p className="text-lg mb-4">
                  El sistema de imputación de costes es el corazón financiero de la aplicación. Su objetivo es 
                  <strong> distribuir automáticamente todos los costes salariales entre los proyectos </strong>
                  según los días reales trabajados por cada empleado, permitiendo conocer la rentabilidad real de cada proyecto.
                </p>
                <div className="bg-white p-4 rounded border">
                  <p className="text-sm">
                    <strong>Principio clave:</strong> Todo coste salarial debe ser imputado a algún proyecto para 
                    conocer el coste real de cada uno y poder calcular beneficios precisos.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-blue-700 mb-3">Tipos de Costes Gestionados</h4>
                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded border">
                      <h5 className="font-semibold text-blue-600 mb-1">Costes Salariales Fijos</h5>
                      <ul className="text-xs space-y-1">
                        <li>• Salario bruto mensual</li>
                        <li>• Seguridad Social empresa</li>
                        <li>• Prorrateados por días trabajados</li>
                      </ul>
                    </div>
                    <div className="bg-white p-3 rounded border">
                      <h5 className="font-semibold text-blue-600 mb-1">Costes Variables por Horas</h5>
                      <ul className="text-xs space-y-1">
                        <li>• Horas extras (precio individual)</li>
                        <li>• Horas festivas (precio individual)</li>
                        <li>• Calculadas por proyecto</li>
                      </ul>
                    </div>
                    <div className="bg-white p-3 rounded border">
                      <h5 className="font-semibold text-blue-600 mb-1">Gastos Variables Empleado</h5>
                      <ul className="text-xs space-y-1">
                        <li>• Dietas y alojamiento</li>
                        <li>• Combustible y transporte</li>
                        <li>• Vinculados a proyectos específicos</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-green-700 mb-3">Hooks Especializados</h4>
                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded border">
                      <h5 className="font-semibold text-green-600 mb-1">useGastosEmpleados.ts</h5>
                      <p className="text-xs mb-1">Hook principal de gestión de costes</p>
                      <ul className="text-xs space-y-1">
                        <li>• <code>calcularCosteEmpleado()</code></li>
                        <li>• <code>registrarGastoEmpleadoProyecto()</code></li>
                        <li>• <code>calcularDiasLaborales()</code></li>
                      </ul>
                    </div>
                    <div className="bg-white p-3 rounded border">
                      <h5 className="font-semibold text-green-600 mb-1">useImputacionCostesSalariales.ts</h5>
                      <p className="text-xs mb-1">Lógica de imputación automática</p>
                      <ul className="text-xs space-y-1">
                        <li>• <code>imputarCostesSalariales()</code></li>
                        <li>• <code>calcularProrrateo()</code></li>
                        <li>• <code>distribuirCostesEntrePoyectos()</code></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Algoritmo de Imputación Paso a Paso</h3>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded border">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
                      <h4 className="font-semibold">Cálculo del Coste Base del Empleado</h4>
                    </div>
                    <div className="bg-gray-50 p-3 rounded font-mono text-xs">
                      <pre>{`const calcularCosteEmpleado = (empleadoId, mes, anio) => {
  const empleado = obtenerEmpleado(empleadoId);
  
  const costeBase = {
    salarioBrutoMes: empleado.salarioBruto,
    seguridadSocialEmpresaMes: empleado.seguridadSocialEmpresa,
    costeTotalMensual: empleado.salarioBruto + empleado.seguridadSocialEmpresa,
    diasLaboralesMes: calcularDiasLaboralesDelMes(mes, anio),
  };
  
  costeBase.costePorDiaLaboral = costeBase.costeTotalMensual / costeBase.diasLaboralesMes;
  
  return costeBase;
};`}</pre>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded border">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
                      <h4 className="font-semibold">Identificación de Proyectos Asignados</h4>
                    </div>
                    <div className="bg-gray-50 p-3 rounded font-mono text-xs">
                      <pre>{`const obtenerProyectosEmpleado = (empleadoId, mes, anio) => {
  return proyectos.filter(proyecto => {
    return proyecto.trabajadoresAsignados.some(trabajador => {
      if (trabajador.id !== empleadoId) return false;
      
      // Verificar si trabajó en el proyecto durante el mes
      const primerDiaMes = new Date(anio, mes - 1, 1);
      const ultimoDiaMes = new Date(anio, mes, 0);
      
      const entrada = trabajador.fechaEntrada || primerDiaMes;
      const salida = trabajador.fechaSalida || ultimoDiaMes;
      
      return entrada <= ultimoDiaMes && salida >= primerDiaMes;
    });
  });
};`}</pre>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded border">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
                      <h4 className="font-semibold">Cálculo de Días Trabajados por Proyecto</h4>
                    </div>
                    <div className="bg-gray-50 p-3 rounded font-mono text-xs">
                      <pre>{`const calcularDiasTrabajadosEnProyecto = (empleadoId, proyectoId, mes, anio) => {
  const proyecto = obtenerProyecto(proyectoId);
  const trabajador = proyecto.trabajadoresAsignados.find(t => t.id === empleadoId);
  
  if (!trabajador) return 0;
  
  const primerDiaMes = new Date(anio, mes - 1, 1);
  const ultimoDiaMes = new Date(anio, mes, 0);
  
  let fechaInicio = trabajador.fechaEntrada || primerDiaMes;
  let fechaFin = trabajador.fechaSalida || ultimoDiaMes;
  
  // Ajustar al rango del mes
  fechaInicio = new Date(Math.max(fechaInicio, primerDiaMes));
  fechaFin = new Date(Math.min(fechaFin, ultimoDiaMes));
  
  return contarDiasLaborales(fechaInicio, fechaFin);
};`}</pre>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded border">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">4</div>
                      <h4 className="font-semibold">Prorrateo de Costes Salariales</h4>
                    </div>
                    <div className="bg-gray-50 p-3 rounded font-mono text-xs">
                      <pre>{`const calcularProrrateoSalarial = (costeEmpleado, diasTrabajados) => {
  const factorProrrateo = diasTrabajados / costeEmpleado.diasLaboralesMes;
  
  return {
    salarioBrutoProrrateo: costeEmpleado.salarioBrutoMes * factorProrrateo,
    seguridadSocialEmpresaProrrateo: costeEmpleado.seguridadSocialEmpresaMes * factorProrrateo,
    costeTotalProyecto: costeEmpleado.costeTotalMensual * factorProrrateo,
    diasTrabajados,
    diasLaboralesMes: costeEmpleado.diasLaboralesMes
  };
};`}</pre>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded border">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">5</div>
                      <h4 className="font-semibold">Registro de Imputación en el Proyecto</h4>
                    </div>
                    <div className="bg-gray-50 p-3 rounded font-mono text-xs">
                      <pre>{`const registrarGastoEmpleadoProyecto = (datosImputacion) => {
  const gastoEmpleado = {
    id: Date.now(),
    empleadoId: datosImputacion.empleadoId,
    proyectoId: datosImputacion.proyectoId,
    mes: datosImputacion.mes,
    anio: datosImputacion.anio,
    salarioBrutoProrrateo: datosImputacion.salarioBrutoProrrateo,
    seguridadSocialEmpresaProrrateo: datosImputacion.seguridadSocialEmpresaProrrateo,
    diasTrabajados: datosImputacion.diasTrabajados,
    diasLaboralesMes: datosImputacion.diasLaboralesMes,
    horasExtras: 0,  // Se calculará separadamente
    horasFestivas: 0,  // Se calculará separadamente
    gastos: [],  // Gastos variables específicos
    fechaRegistro: new Date()
  };
  
  // Guardar en el storage de gastos de empleados por proyecto
  agregarGastoEmpleadoProyecto(gastoEmpleado);
};`}</pre>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Gestión de Horas Extras y Festivas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold text-purple-700 mb-2">Lógica de Horas Extras</h4>
                    <div className="bg-gray-50 p-3 rounded text-xs">
                      <p className="mb-2"><strong>Definición:</strong> Horas trabajadas por encima de las 8 horas estándar en días laborables.</p>
                      <div className="font-mono">
                        <code>horasExtras = max(0, horasTrabajadasDia - 8)</code><br/>
                        <code>importeExtras = horasExtras × empleado.precioHoraExtra</code>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold text-purple-700 mb-2">Lógica de Horas Festivas</h4>
                    <div className="bg-gray-50 p-3 rounded text-xs">
                      <p className="mb-2"><strong>Definición:</strong> Cualquier hora trabajada en días festivos o domingos.</p>
                      <div className="font-mono">
                        <code>horasFestivas = totalHorasTrabajadasEnFestivo</code><br/>
                        <code>importeFestivas = horasFestivas × empleado.precioHoraFestiva</code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Integración con el Módulo de Calendario</h3>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold text-red-700 mb-2">Dependencia del Sistema de Calendario</h4>
                    <p className="text-sm mb-3">
                      El cálculo de costes depende completamente del sistema de calendario para determinar 
                      días laborables, festivos y ausencias.
                    </p>
                    <div className="bg-gray-50 p-3 rounded font-mono text-xs">
                      <pre>{`const contarDiasLaborales = (fechaInicio, fechaFin) => {
  let diasLaborales = 0;
  let fechaActual = new Date(fechaInicio);
  
  while (fechaActual <= fechaFin) {
    const diaSemana = fechaActual.getDay();
    
    // Lunes a Viernes (1-5) y no festivo
    if (diaSemana >= 1 && diaSemana <= 5 && !esFestivo(fechaActual)) {
      // Verificar si el empleado no estaba ausente
      const ausencia = obtenerAusenciaEmpleado(empleadoId, fechaActual);
      if (!ausencia) {
        diasLaborales++;
      }
    }
    
    fechaActual.setDate(fechaActual.getDate() + 1);
  }
  
  return diasLaborales;
};`}</pre>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold text-red-700 mb-2">Tipos de Ausencias que Afectan al Cálculo</h4>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <strong>Ausencias NO pagadas:</strong>
                        <ul className="mt-1 space-y-1">
                          <li>• Baja personal</li>
                          <li>• Ausencias injustificadas</li>
                          <li>• Días sin contrato (entre fechaEntrada/fechaSalida)</li>
                        </ul>
                      </div>
                      <div>
                        <strong>Ausencias pagadas:</strong>
                        <ul className="mt-1 space-y-1">
                          <li>• Vacaciones</li>
                          <li>• Baja médica</li>
                          <li>• Baja laboral (accidente trabajo)</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Persistencia y Sincronización</h3>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold text-yellow-700 mb-2">Sistema de Almacenamiento</h4>
                    <div className="bg-gray-50 p-3 rounded text-sm">
                      <p className="mb-2"><strong>Clave de localStorage:</strong> <code>calendarios_empleado_{empleadoId}</code></p>
                      <p className="mb-2"><strong>Estructura:</strong> Objeto con claves <code>{empleadoId}-{año}-{mes}</code></p>
                      <p><strong>Persistencia automática:</strong> Cada cambio se guarda inmediatamente</p>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold text-yellow-700 mb-2">Función de Carga desde Storage</h4>
                    <div className="bg-gray-50 p-3 rounded font-mono text-xs">
                      <pre>{`const cargarCalendarioDesdeStorage = (empleadoId, mes, año) => {
  try {
    const calendarioKey = \`calendarios_empleado_\${empleadoId}\`;
    const calendariosGuardados = localStorage.getItem(calendarioKey);
    
    if (calendariosGuardados) {
      const calendariosParseados = JSON.parse(calendariosGuardados);
      const claveCalendario = \`\${empleadoId}-\${año}-\${mes}\`;
      const calendario = calendariosParseados[claveCalendario];
      
      if (calendario) {
        // Reconvertir strings de fecha a objetos Date
        return {
          ...calendario,
          dias: calendario.dias.map(dia => ({
            ...dia,
            fecha: new Date(dia.fecha)
          }))
        };
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error al cargar calendario:', error);
    return null;
  }
};`}</pre>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-indigo-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Integración con Otros Módulos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold text-indigo-700 mb-2">Módulo de Costes</h4>
                    <ul className="text-sm space-y-1">
                      <li>• <strong>Días laborables:</strong> Base para prorrateo salarial</li>
                      <li>• <strong>Días trabajados:</strong> Cálculo por empleado/proyecto</li>
                      <li>• <strong>Horas extras:</strong> Identificación automática</li>
                      <li>• <strong>Horas festivas:</strong> Cálculo de sobrecostes</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold text-indigo-700 mb-2">Módulo de Empleados</h4>
                    <ul className="text-sm space-y-1">
                      <li>• <strong>Calendario individual:</strong> Vista por empleado/mes</li>
                      <li>• <strong>Registro de ausencias:</strong> Desde ficha empleado</li>
                      <li>• <strong>Control vacaciones:</strong> Días disponibles/consumidos</li>
                      <li>• <strong>Historial:</strong> Ausencias por período</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold text-indigo-700 mb-2">Módulo de Proyectos</h4>
                    <ul className="text-sm space-y-1">
                      <li>• <strong>Fechas asignación:</strong> Validación con calendario</li>
                      <li>• <strong>Días efectivos:</strong> Solo días laborables trabajados</li>
                      <li>• <strong>Productividad:</strong> Horas reales vs planificadas</li>
                      <li>• <strong>Costes reales:</strong> Impacto de ausencias</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold text-indigo-700 mb-2">Dashboard</h4>
                    <ul className="text-sm space-y-1">
                      <li>• <strong>KPIs temporales:</strong> Métricas por período</li>
                      <li>• <strong>Alertas:</strong> Exceso de ausencias</li>
                      <li>• <strong>Tendencias:</strong> Patrones de trabajo</li>
                      <li>• <strong>Planificación:</strong> Capacidad disponible</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Consideraciones Técnicas y Mejoras Futuras</h3>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold text-gray-700 mb-2">Limitaciones Actuales</h4>
                    <ul className="text-sm space-y-1">
                      <li>• <strong>Años hardcodeados:</strong> Solo 2024-2025 implementados</li>
                      <li>• <strong>Festivos locales:</strong> Solo Valencia, faltan otras comunidades</li>
                      <li>• <strong>Semana Santa:</strong> Fechas variables no implementadas automáticamente</li>
                      <li>• <strong>Convenios:</strong> No considera convenios específicos de construcción</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold text-gray-700 mb-2">Mejoras Propuestas</h4>
                    <ul className="text-sm space-y-1">
                      <li>• <strong>API de festivos:</strong> Conexión con servicio externo de festivos</li>
                      <li>• <strong>Múltiples sedes:</strong> Festivos por ubicación de proyecto</li>
                      <li>• <strong>Plantillas:</strong> Calendarios tipo para diferentes categorías</li>
                      <li>• <strong>Importación:</strong> Carga masiva desde archivos externos</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventario" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Wrench className="w-5 h-5" />
                Sistema de Inventario - Gestión de Recursos Empresariales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg border">
                <h3 className="text-xl font-semibold mb-4">Tipos de Inventario</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold text-blue-700 mb-2">EPIs</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Equipos de Protección Individual</li>
                      <li>• Cascos, botas, guantes, etc.</li>
                      <li>• Control de entregas por empleado</li>
                      <li>• Fecha de entrega y estado</li>
                    </ul>
                  </div>
                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold text-green-700 mb-2">Herramientas</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Herramientas de trabajo</li>
                      <li>• Taladros, sierras, etc.</li>
                      <li>• Asignación temporal</li>
                      <li>• Control de devoluciones</li>
                    </ul>
                  </div>
                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold text-orange-700 mb-2">Vehículos</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Vehículos de empresa</li>
                      <li>• Furgonetas, coches, etc.</li>
                      <li>• Un vehículo por empleado</li>
                      <li>• Control de asignaciones</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Lógica de Asignaciones</h3>
                <div className="bg-white p-4 rounded border font-mono text-xs">
                  <pre>{`// Asignación de EPI
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
};`}</pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dashboard" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <BarChart3 className="w-7 h-7" />
                Dashboard y Sistema de Análisis - Inteligencia de Negocio
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg border">
                <h3 className="text-xl font-semibold mb-4">Métricas Principales</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold mb-2">Proyectos</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Beneficio bruto vs neto</li>
                      <li>• Margen de rentabilidad</li>
                      <li>• Estado actual (activo/completado)</li>
                      <li>• Progreso vs presupuesto</li>
                    </ul>
                  </div>
                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold mb-2">Empleados</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Rentabilidad por trabajador</li>
                      <li>• Costes vs ingresos generados</li>
                      <li>• Horas trabajadas vs facturadas</li>
                      <li>• Eficiencia por empleado</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Componentes Clave del Dashboard</h3>
                <ul className="text-sm space-y-2">
                  <li>• <strong>ProyectosOverview:</strong> Resumen de todos los proyectos</li>
                  <li>• <strong>RentabilidadTrabajadores:</strong> Análisis individual por empleado</li>
                  <li>• <strong>EstadisticasGenerales:</strong> KPIs globales de la empresa</li>
                  <li>• <strong>AlertasProyectos:</strong> Proyectos con problemas de rentabilidad</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="implementacion" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Settings className="w-7 h-7" />
                Guía de Implementación y Extensión del Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg border">
                <h3 className="text-xl font-semibold mb-4">Cómo Extender el Sistema</h3>
                <p className="text-lg mb-4">
                  Esta sección proporciona una guía completa para desarrolladores que necesiten añadir nuevas 
                  funcionalidades, modificar las existentes o adaptar el sistema a necesidades específicas.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-blue-700 mb-3">Añadir Nuevo Módulo</h4>
                  <div className="space-y-3 text-sm">
                    <div className="bg-white p-3 rounded border">
                      <strong>1. Crear tipos TypeScript</strong>
                      <div className="mt-1 font-mono text-xs">
                        <code>src/types/nuevoModulo.ts</code>
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded border">
                      <strong>2. Implementar hook principal</strong>
                      <div className="mt-1 font-mono text-xs">
                        <code>src/hooks/useNuevoModulo.ts</code>
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded border">
                      <strong>3. Crear componentes UI</strong>
                      <div className="mt-1 font-mono text-xs">
                        <code>src/components/nuevoModulo/</code>
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded border">
                      <strong>4. Añadir página principal</strong>
                      <div className="mt-1 font-mono text-xs">
                        <code>src/pages/NuevoModulo.tsx</code>
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded border">
                      <strong>5. Configurar ruta en App.tsx</strong>
                      <div className="mt-1 font-mono text-xs">
                        <code>{'<Route path="/nuevo" element={<NuevoModulo />} />'}</code>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-green-700 mb-3">Modificar Módulo Existente</h4>
                  <div className="space-y-3 text-sm">
                    <div className="bg-white p-3 rounded border">
                      <strong>1. Actualizar tipos si es necesario</strong>
                      <div className="mt-1 text-xs">Añadir propiedades a interfaces existentes</div>
                    </div>
                    <div className="bg-white p-3 rounded border">
                      <strong>2. Extender hook principal</strong>
                      <div className="mt-1 text-xs">Añadir nuevas funciones manteniendo compatibilidad</div>
                    </div>
                    <div className="bg-white p-3 rounded border">
                      <strong>3. Crear componentes específicos</strong>
                      <div className="mt-1 text-xs">Componentes pequeños y enfocados</div>
                    </div>
                    <div className="bg-white p-3 rounded border">
                      <strong>4. Actualizar persistencia</strong>
                      <div className="mt-1 text-xs">Migración de datos en localStorage si es necesario</div>
                    </div>
                    <div className="bg-white p-3 rounded border">
                      <strong>5. Testear integraciones</strong>
                      <div className="mt-1 text-xs">Verificar que otros módulos siguen funcionando</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Patrones de Implementación Recomendados</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold text-yellow-700 mb-2">Hook Pattern</h4>
                    <div className="bg-gray-50 p-3 rounded font-mono text-xs">
                      <pre>{`// Estructura estándar de hook
export const useNuevoModulo = () => {
  const [items, setItems] = useState([]);
  
  const cargarDatos = useCallback(() => {
    // Lógica de carga desde localStorage
  }, []);
  
  const guardarDatos = useCallback((nuevosItems) => {
    setItems(nuevosItems);
    localStorage.setItem('clave', JSON.stringify(nuevosItems));
  }, []);
  
  const agregarItem = useCallback((nuevoItem) => {
    const item = { ...nuevoItem, id: Date.now() };
    guardarDatos([...items, item]);
  }, [items, guardarDatos]);
  
  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);
  
  return {
    items,
    agregarItem,
    // ... más funciones
  };
};`}</pre>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold text-yellow-700 mb-2">Component Pattern</h4>
                    <div className="bg-gray-50 p-3 rounded font-mono text-xs">
                      <pre>{`// Componente pequeño y enfocado
interface Props {
  item: TipoItem;
  onEdit: (item: TipoItem) => void;
  onDelete: (id: number) => void;
}

export const ItemCard = ({ item, onEdit, onDelete }: Props) => {
  return (
    <Card>
      <CardContent>
        <h3>{item.nombre}</h3>
        <p>{item.descripcion}</p>
        <div className="flex gap-2">
          <Button onClick={() => onEdit(item)}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button onClick={() => onDelete(item.id)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};`}</pre>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Consideraciones de Performance</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold text-red-700 mb-2">Optimizaciones Aplicadas</h4>
                    <ul className="text-sm space-y-1">
                      <li>• <strong>useCallback:</strong> Para funciones que se pasan como props</li>
                      <li>• <strong>useMemo:</strong> Para cálculos costosos</li>
                      <li>• <strong>React.memo:</strong> Para componentes que rerenderan frecuentemente</li>
                      <li>• <strong>Componentes pequeños:</strong> Para facilitar la optimización</li>
                      <li>• <strong>localStorage batch:</strong> Evitar writes excesivos</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold text-red-700 mb-2">Límites del Sistema</h4>
                    <ul className="text-sm space-y-1">
                      <li>• <strong>localStorage:</strong> Máximo 5-10MB por dominio</li>
                      <li>• <strong>Empleados:</strong> Recomendado máximo 100 empleados</li>
                      <li>• <strong>Proyectos:</strong> Recomendado máximo 50 proyectos activos</li>
                      <li>• <strong>Histórico:</strong> Considerar archivado después de 2 años</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Migraciones y Versionado de Datos</h3>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold text-purple-700 mb-2">Estrategia de Migración</h4>
                    <div className="bg-gray-50 p-3 rounded font-mono text-xs">
                      <pre>{`// Ejemplo de migración de datos
const migrarDatosV1aV2 = () => {
  const datosV1 = localStorage.getItem('empleados');
  if (datosV1) {
    const empleados = JSON.parse(datosV1);
    
    // Añadir nuevos campos con valores por defecto
    const empleadosV2 = empleados.map(emp => ({
      ...emp,
      nuevoCampo: valorPorDefecto,
      version: 2
    }));
    
    localStorage.setItem('empleados', JSON.stringify(empleadosV2));
    localStorage.setItem('version_empleados', '2');
  }
};

// Verificar en la carga
const verificarVersion = () => {
  const version = localStorage.getItem('version_empleados');
  if (!version || version < '2') {
    migrarDatosV1aV2();
  }
};`}</pre>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold text-purple-700 mb-2">Backup y Restauración</h4>
                    <div className="text-sm space-y-2">
                      <p><strong>Backup automático:</strong> El sistema permite exportar todos los datos a JSON</p>
                      <p><strong>Restauración:</strong> Los datos se pueden importar desde archivo JSON</p>
                      <p><strong>Validación:</strong> Se verifica la integridad de los datos al importar</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-indigo-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Roadmap de Funcionalidades Futuras</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold text-indigo-700 mb-2">Mejoras Técnicas</h4>
                    <ul className="text-sm space-y-1">
                      <li>• <strong>Base de datos real:</strong> Migración a Supabase o similar</li>
                      <li>• <strong>Autenticación:</strong> Sistema de usuarios y roles</li>
                      <li>• <strong>API REST:</strong> Backend independiente</li>
                      <li>• <strong>PWA:</strong> Funcionamiento offline</li>
                      <li>• <strong>Sincronización:</strong> Múltiples dispositivos</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold text-indigo-700 mb-2">Funcionalidades de Negocio</h4>
                    <ul className="text-sm space-y-1">
                      <li>• <strong>Facturación:</strong> Generación automática de facturas</li>
                      <li>• <strong>Contabilidad:</strong> Integración con sistemas contables</li>
                      <li>• <strong>Móvil:</strong> App para registro de horas en obra</li>
                      <li>• <strong>BI avanzado:</strong> Más métricas y predicciones</li>
                      <li>• <strong>Integraciónes:</strong> ERP, CRM, herramientas externas</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="bg-gradient-to-r from-blue-50 via-green-50 to-purple-50 border-2">
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Resumen Ejecutivo del Sistema</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Gestión Integral</h3>
              <p className="text-sm">Personal, proyectos, inventario y recursos empresariales</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <Calculator className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Control Financiero</h3>
              <p className="text-sm">Imputación automática de costes y análisis de rentabilidad</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Inteligencia de Negocio</h3>
              <p className="text-sm">Dashboard con métricas y análisis en tiempo real</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-xl font-semibold mb-4">Logros Técnicos Destacados</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span><strong>Arquitectura modular</strong> con +40 componentes especializados</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span><strong>Sistema de tipos TypeScript</strong> completo y consistente</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span><strong>Persistencia automática</strong> en localStorage</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span><strong>Calendario español completo</strong> con festivos nacionales</span>
                </li>
              </ul>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span><strong>Imputación automática de costes</strong> por proyectos</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span><strong>Dashboard financiero</strong> con análisis de rentabilidad</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span><strong>Generación de PDFs</strong> para reportes ejecutivos</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span><strong>Diseño responsive</strong> para cualquier dispositivo</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-lg font-semibold">
              Sistema completo y funcional desarrollado con <span className="text-blue-600">React + TypeScript</span> 
              para gestión empresarial integral del sector construcción.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
