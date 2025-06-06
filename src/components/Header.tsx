
import { SidebarTrigger } from "@/components/ui/sidebar";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/bf43a6d9-7197-4554-a13f-6d1494fd3041.png" 
              alt="Omenar Logo" 
              className="h-8 w-8"
            />
            <div className="flex items-center gap-2">
              <img 
                src="/lovable-uploads/ddfe097d-bd85-4f3c-a946-114fa0d379fe.png" 
                alt="Omenar" 
                className="h-6"
              />
              <span className="text-sm text-muted-foreground font-medium">Sistema de Gestión</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
