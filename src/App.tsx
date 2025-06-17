
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
import GastosVariables from "./pages/GastosVariables";
import NotFound from "./pages/NotFound";
import Epis from "./pages/Epis";
import Gerencia from "./pages/Gerencia";
import Manual from "./pages/Manual";

const queryClient = new QueryClient();

const App = () => {
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
              <Route path="/gastos-variables" element={<GastosVariables />} />
              <Route path="/gerencia/*" element={<Gerencia />} />
              <Route path="/manual" element={<Manual />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
