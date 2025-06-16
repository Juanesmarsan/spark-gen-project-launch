
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Upload, FileText, Download, Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DocumentoEmpresa {
  id: number;
  nombre: string;
  tipo: 'PDF' | 'WORD' | 'EXCEL' | 'IMAGEN' | 'OTRO';
  tamaño: string;
  fechaSubida: Date;
  categoria: 'Contratos' | 'Politicas' | 'Manuales' | 'Certificados' | 'Legal' | 'Otros';
  url: string;
}

const DocumentacionEmpresa = () => {
  const { toast } = useToast();
  const [documentos, setDocumentos] = useState<DocumentoEmpresa[]>([
    {
      id: 1,
      nombre: "Manual de Empleados 2024",
      tipo: 'PDF',
      tamaño: "2.3 MB",
      fechaSubida: new Date('2024-01-15'),
      categoria: 'Manuales',
      url: '#'
    },
    {
      id: 2,
      nombre: "Política de Seguridad",
      tipo: 'WORD',
      tamaño: "1.8 MB",
      fechaSubida: new Date('2024-02-01'),
      categoria: 'Politicas',
      url: '#'
    }
  ]);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [archivoSeleccionado, setArchivoSeleccionado] = useState<File | null>(null);
  const [categoria, setCategoria] = useState<DocumentoEmpresa['categoria']>('Otros');
  const [nombre, setNombre] = useState('');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setArchivoSeleccionado(file);
      setNombre(file.name.split('.')[0]);
    }
  };

  const getTipoArchivo = (fileName: string): DocumentoEmpresa['tipo'] => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf': return 'PDF';
      case 'doc':
      case 'docx': return 'WORD';
      case 'xls':
      case 'xlsx': return 'EXCEL';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif': return 'IMAGEN';
      default: return 'OTRO';
    }
  };

  const formatearTamaño = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubirArchivo = () => {
    if (!archivoSeleccionado || !nombre.trim()) {
      toast({
        title: "Error",
        description: "Debe seleccionar un archivo y proporcionar un nombre",
        variant: "destructive"
      });
      return;
    }

    const nuevoDocumento: DocumentoEmpresa = {
      id: Date.now(),
      nombre: nombre.trim(),
      tipo: getTipoArchivo(archivoSeleccionado.name),
      tamaño: formatearTamaño(archivoSeleccionado.size),
      fechaSubida: new Date(),
      categoria,
      url: URL.createObjectURL(archivoSeleccionado) // En producción sería la URL real del archivo subido
    };

    setDocumentos(prev => [...prev, nuevoDocumento]);
    setMostrarFormulario(false);
    setArchivoSeleccionado(null);
    setNombre('');
    setCategoria('Otros');

    toast({
      title: "Documento subido",
      description: "El documento se ha subido correctamente",
    });
  };

  const handleEliminarDocumento = (id: number) => {
    setDocumentos(prev => prev.filter(doc => doc.id !== id));
    toast({
      title: "Documento eliminado",
      description: "El documento ha sido eliminado permanentemente",
      variant: "destructive"
    });
  };

  const getBadgeColor = (tipo: DocumentoEmpresa['tipo']) => {
    switch (tipo) {
      case 'PDF': return 'bg-red-100 text-red-800';
      case 'WORD': return 'bg-blue-100 text-blue-800';
      case 'EXCEL': return 'bg-green-100 text-green-800';
      case 'IMAGEN': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Documentación de Empresa</h1>
          <p className="text-muted-foreground">Gestión de documentos corporativos</p>
        </div>
        <Button onClick={() => setMostrarFormulario(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Subir Documento
        </Button>
      </div>

      {mostrarFormulario && (
        <Card>
          <CardHeader>
            <CardTitle>Subir Nuevo Documento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Seleccionar Archivo</label>
              <Input
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif"
                onChange={handleFileSelect}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Nombre del Documento</label>
              <Input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Nombre descriptivo del documento"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Categoría</label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value as DocumentoEmpresa['categoria'])}
                className="w-full p-2 border rounded-md"
              >
                <option value="Contratos">Contratos</option>
                <option value="Politicas">Políticas</option>
                <option value="Manuales">Manuales</option>
                <option value="Certificados">Certificados</option>
                <option value="Legal">Documentos Legales</option>
                <option value="Otros">Otros</option>
              </select>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSubirArchivo}>
                <Upload className="w-4 h-4 mr-2" />
                Subir Documento
              </Button>
              <Button variant="outline" onClick={() => setMostrarFormulario(false)}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Documentos de la Empresa</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Tamaño</TableHead>
                <TableHead>Fecha Subida</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documentos.map((documento) => (
                <TableRow key={documento.id}>
                  <TableCell className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    {documento.nombre}
                  </TableCell>
                  <TableCell>
                    <Badge className={getBadgeColor(documento.tipo)}>
                      {documento.tipo}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{documento.categoria}</Badge>
                  </TableCell>
                  <TableCell>{documento.tamaño}</TableCell>
                  <TableCell>{documento.fechaSubida.toLocaleDateString('es-ES')}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Eliminar Documento</AlertDialogTitle>
                            <AlertDialogDescription>
                              ¿Estás seguro de que quieres eliminar permanentemente el documento "{documento.nombre}"?
                              Esta acción no se puede deshacer.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleEliminarDocumento(documento.id)}>
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentacionEmpresa;
