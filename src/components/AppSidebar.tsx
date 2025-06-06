
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useLocation, Link } from "react-router-dom";

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: "🏠",
  },
  {
    title: "Gestión de Empleados",
    url: "/empleados", 
    icon: "👥",
  },
  {
    title: "Gestión de Proyectos",
    url: "/proyectos",
    icon: "📋",
  },
  {
    title: "Inventario",
    url: "/inventario",
    icon: "📦",
  },
  {
    title: "Vehículos",
    url: "/vehiculos",
    icon: "🚗",
  },
  {
    title: "Gastos Fijos",
    url: "/gastos-fijos",
    icon: "💰",
  },
  {
    title: "Gastos Variables",
    url: "/gastos-variables",
    icon: "📊",
  },
  {
    title: "Análisis Financiero",
    url: "/analisis-financiero",
    icon: "📈",
  },
  {
    title: "Reportes",
    url: "/reportes",
    icon: "📑",
  },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="border-r">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.url}
                  >
                    <Link to={item.url} className="flex items-center gap-3">
                      <span className="text-lg">{item.icon}</span>
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
