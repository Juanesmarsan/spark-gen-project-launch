
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import Dashboard from "./pages/Dashboard";
import Empleados from "./pages/Empleados";
import Proyectos from "./pages/Proyectos";
import Inventario from "./pages/Inventario";
import Vehiculos from "./pages/Vehiculos";
import GastosFijos from "./pages/GastosFijos";
import GastosVariables from "./pages/GastosVariables";
import AnalisisFinanciero from "./pages/AnalisisFinanciero";
import Reportes from "./pages/Reportes";
import NotFound from "./pages/NotFound";
import Epis from "./pages/Epis";

const queryClient = new QueryClient();

const App = () => {
  console.log("Inicializando App component");
  
  try {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/empleados" element={<Empleados />} />
                <Route path="/proyectos" element={<Proyectos />} />
                <Route path="/inventario" element={<Inventario />} />
                <Route path="/epis" element={<Epis />} />
                <Route path="/vehiculos" element={<Vehiculos />} />
                <Route path="/gastos-fijos" element={<GastosFijos />} />
                <Route path="/gastos-variables" element={<GastosVariables />} />
                <Route path="/analisis-financiero" element={<AnalisisFinanciero />} />
                <Route path="/reportes" element={<Reportes />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    );
  } catch (error) {
    console.error("Error crítico en App:", error);
    return (
      <div className="p-4 text-red-600">
        Error crítico en la aplicación. Revisa la consola para más detalles.
      </div>
    );
  }
};

export default App;
