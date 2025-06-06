
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProtectedGerenciaProps {
  children: React.ReactNode;
}

export const ProtectedGerencia = ({ children }: ProtectedGerenciaProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  // Contraseña de gerencia - en un entorno real debería estar en variables de entorno
  const GERENCIA_PASSWORD = 'gerencia2024';

  useEffect(() => {
    // Verificar si ya está autenticado en esta sesión
    const isAuth = sessionStorage.getItem('gerencia_authenticated');
    if (isAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setLoading(true);
    
    setTimeout(() => {
      if (password === GERENCIA_PASSWORD) {
        setIsAuthenticated(true);
        sessionStorage.setItem('gerencia_authenticated', 'true');
        toast({
          title: "Acceso concedido",
          description: "Bienvenido al área de gerencia",
        });
      } else {
        toast({
          title: "Contraseña incorrecta",
          description: "La contraseña ingresada no es válida",
          variant: "destructive",
        });
      }
      setLoading(false);
      setPassword('');
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Área de Gerencia</CardTitle>
            <p className="text-muted-foreground">
              Esta sección requiere autorización especial
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="Contraseña de gerencia"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
              />
            </div>
            <Button 
              className="w-full" 
              onClick={handleLogin}
              disabled={loading || !password}
            >
              {loading ? "Verificando..." : "Acceder"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};
