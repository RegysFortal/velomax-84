
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { FileBarChart, Download, Printer } from "lucide-react";

const Reports = () => {
  const [searchParams] = useSearchParams();
  const reportId = searchParams.get('reportId');
  
  // Sample data for demonstration
  const reports = [
    { id: '1', clientName: 'Transportadora Silva', date: '15/05/2025', totalValue: 'R$ 12.500,00' },
    { id: '2', clientName: 'Logística Express', date: '14/05/2025', totalValue: 'R$ 8.750,00' },
    { id: '3', clientName: 'Cargas Rápidas', date: '13/05/2025', totalValue: 'R$ 15.200,00' },
  ];
  
  const handlePrint = () => {
    window.print();
  };
  
  const handleExport = () => {
    // Placeholder for export functionality
    console.log('Exporting report');
  };
  
  return (
    <div className="flex flex-col gap-6 px-8 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relatórios de Fechamento</h1>
          <p className="text-muted-foreground">
            Visualize e gerencie os relatórios de fechamento financeiro.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileBarChart className="mr-2 h-5 w-5" />
            {reportId ? `Detalhes do Relatório #${reportId}` : 'Relatórios Disponíveis'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {reportId ? (
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Detalhes do Relatório #{reportId}</h3>
                <p>
                  Exibindo informações completas do relatório selecionado.
                  Este é um espaço reservado para o conteúdo detalhado do relatório.
                </p>
                <Button className="mt-4" onClick={() => window.history.back()}>
                  Voltar para Lista
                </Button>
              </div>
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-300px)]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Valor Total</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>{report.id}</TableCell>
                      <TableCell>{report.clientName}</TableCell>
                      <TableCell>{report.date}</TableCell>
                      <TableCell>{report.totalValue}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => window.location.href = `/reports?reportId=${report.id}`}
                        >
                          Visualizar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
