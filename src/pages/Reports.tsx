
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { useFinancial } from '@/contexts/FinancialContext';
import { useDeliveries } from '@/contexts/DeliveriesContext';
import { useClients } from '@/contexts';
import { ReportTable } from '@/components/report/ReportTable';
import { ReportSummary } from '@/components/report/ReportSummary';
import { FinancialReport } from '@/types';

const Reports = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { financialReports, createReport } = useFinancial();
  const { deliveries } = useDeliveries();
  const { clients } = useClients();
  const [selectedClient, setSelectedClient] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [reportId, setReportId] = useState<string | null>(null);
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const reportIdParam = params.get('reportId');
    setReportId(reportIdParam);
  }, [location.search]);

  const handleGenerateReport = async () => {
    if (!selectedClient || !startDate || !endDate) {
      alert('Por favor, selecione um cliente e um período para gerar o relatório.');
      return;
    }

    // Filter deliveries for the selected client and date range
    const filteredDeliveries = deliveries.filter(delivery => {
      if (delivery.clientId !== selectedClient) return false;
      const deliveryDate = new Date(delivery.deliveryDate);
      return deliveryDate >= startDate && deliveryDate <= endDate;
    });

    // Calculate total freight
    const totalFreight = filteredDeliveries.reduce((sum, delivery) => sum + delivery.totalFreight, 0);

    // Create the report with explicitly typed status
    const newReport: Omit<FinancialReport, 'id' | 'createdAt' | 'updatedAt'> = {
      clientId: selectedClient,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      totalDeliveries: filteredDeliveries.length,
      totalFreight: totalFreight,
      status: 'open', // Explicitly using the union type value
    };
    
    const createdReport = await createReport(newReport);
    
    if (createdReport) {
      // Navigate to the new report
      navigate(`/reports?reportId=${createdReport.id}`);
    }
  };
  
  const currentReport = financialReports.find(report => report.id === reportId);
  
  const filteredDeliveries = deliveries.filter(delivery => {
    if (!currentReport) return false;
    if (delivery.clientId !== currentReport.clientId) return false;
    
    const deliveryDate = new Date(delivery.deliveryDate);
    const startDate = new Date(currentReport.startDate);
    const endDate = new Date(currentReport.endDate);
    
    return deliveryDate >= startDate && deliveryDate <= endDate;
  });

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
          <p className="text-muted-foreground">
            Gere relatórios financeiros detalhados.
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Gerar Novo Relatório</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="client">Cliente</Label>
                <Select onValueChange={setSelectedClient}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Período</Label>
                <div className="flex gap-2">
                  <DatePicker onSelect={setStartDate} />
                  <DatePicker onSelect={setEndDate} />
                </div>
              </div>
            </div>
            <Button onClick={handleGenerateReport}>Gerar Relatório</Button>
          </CardContent>
        </Card>
        
        {currentReport && (
          <>
            <ReportSummary report={currentReport} />
            <Card>
              <CardHeader>
                <CardTitle>Detalhes do Relatório</CardTitle>
              </CardHeader>
              <CardContent>
                <ReportTable deliveries={filteredDeliveries} />
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default Reports;
