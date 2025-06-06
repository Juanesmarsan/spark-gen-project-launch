
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

export const DocumentosTab = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Documentos</h3>
        <Button variant="outline" size="sm">
          <Upload className="w-4 h-4 mr-2" />
          Subir Documento
        </Button>
      </div>
      <div className="text-center text-muted-foreground py-8">
        Subida de documentos - En desarrollo
      </div>
    </div>
  );
};
