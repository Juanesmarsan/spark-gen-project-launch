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
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
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
  FileText,
  Shield,
  ChevronRight,
  UserCog
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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
    title: "Gastos Variables",
    url: "/gastos-variables",
    icon: TrendingUp,
  },
];

const gerenciaItems = [
  {
    title: "Análisis Financiero",
    url: "/gerencia/analisis-financiero",
    icon: BarChart3,
  },
  {
    title: "Gastos Fijos",
    url: "/gerencia/gastos-fijos",
    icon: CreditCard,
  },
  {
    title: "Personal",
    url: "/gerencia/personal",
    icon: UserCog,
  },
  {
    title: "Documentación",
    url: "/gerencia/documentacion",
    icon: FileText,
  },
  {
    title: "Reportes",
    url: "/gerencia/reportes",
    icon: FileText,
  },
];

export function AppSidebar() {
  const location = useLocation();
  const isGerenciaActive = location.pathname.startsWith('/gerencia');

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <img 
              src="/lovable-uploads/ddfe097d-bd85-4f3c-a946-114fa0d379fe.png" 
              alt="Omenar" 
              className="h-12 brightness-0 invert"
            />
            <span className="text-xs text-sidebar-foreground/70 font-medium mt-1">Sistema de Gestión</span>
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
              
              <Collapsible defaultOpen={isGerenciaActive}>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                      <Shield className="h-4 w-4" />
                      <span>Gerencia</span>
                      <ChevronRight className="ml-auto h-4 w-4 transition-transform data-[state=open]:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {gerenciaItems.map((item) => (
                        <SidebarMenuSubItem key={item.title}>
                          <SidebarMenuSubButton 
                            asChild
                            isActive={location.pathname === item.url}
                          >
                            <Link to={item.url} className="flex items-center gap-3">
                              <item.icon className="h-4 w-4" />
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
