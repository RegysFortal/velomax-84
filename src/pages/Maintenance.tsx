
import { useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TireMaintenanceList } from '@/components/maintenance/TireMaintenanceList';

export default function Maintenance() {
  const [activeTab, setActiveTab] = useState('tires');

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manutenções</h1>
          <p className="text-muted-foreground">
            Gerencie manutenções da frota de veículos da sua empresa.
          </p>
        </div>

        <Tabs defaultValue="tires" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="tires">Pneus</TabsTrigger>
            <TabsTrigger value="general">Geral</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tires" className="mt-6">
            <TireMaintenanceList />
          </TabsContent>
          
          <TabsContent value="general" className="mt-6">
            <div className="text-center p-8 text-muted-foreground">
              Funcionalidade de manutenção geral em desenvolvimento.
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
