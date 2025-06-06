
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { useLocation, Link } from "react-router-dom";
import { 
  Home, 
  Users, 
  FolderOpen, 
  Package, 
  HardHat, 
  Car, 
  CreditCard, 
  TrendingUp, 
  BarChart3, 
  FileText 
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Gestión de Empleados",
    url: "/empleados", 
    icon: Users,
  },
  {
    title: "Gestión de Proyectos",
    url: "/proyectos",
    icon: FolderOpen,
  },
  {
    title: "Inventario",
    url: "/inventario",
    icon: Package,
  },
  {
    title: "EPIs",
    url: "/epis",
    icon: HardHat,
  },
  {
    title: "Vehículos",
    url: "/vehiculos",
    icon: Car,
  },
  {
    title: "Gastos Fijos",
    url: "/gastos-fijos",
    icon: CreditCard,
  },
  {
    title: "Gastos Variables",
    url: "/gastos-variables",
    icon: TrendingUp,
  },
  {
    title: "Análisis Financiero",
    url: "/analisis-financiero",
    icon: BarChart3,
  },
  {
    title: "Reportes",
    url: "/reportes",
    icon: FileText,
  },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <img 
            src="/lovable-uploads/bf43a6d9-7197-4554-a13f-6d1494fd3041.png" 
            alt="Omenar Logo" 
            className="h-10 w-10"
          />
          <div className="flex flex-col">
            <img 
              src="/lovable-uploads/ddfe097d-bd85-4f3c-a946-114fa0d379fe.png" 
              alt="Omenar" 
              className="h-8 brightness-0 invert"
            />
            <span className="text-xs text-sidebar-foreground/70 font-medium">Sistema de Gestión</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70">Menú Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.url}
                    className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground"
                  >
                    <Link to={item.url} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
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
