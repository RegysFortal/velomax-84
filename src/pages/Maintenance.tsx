
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TireMaintenanceList } from '@/components/maintenance/TireMaintenanceList';
import { GeneralMaintenanceList } from '@/components/maintenance/GeneralMaintenanceList';
import { Wrench, CircleDashed } from 'lucide-react';

export default function Maintenance() {
  const [activeTab, setActiveTab] = useState('tires');

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manutenções</h1>
        <p className="text-muted-foreground">
          Gerencie manutenções da frota de veículos da sua empresa.
        </p>
      </div>

      <Tabs defaultValue="tires" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="tires" className="flex items-center gap-2">
            <CircleDashed className="h-4 w-4" />
            <span>Pneus</span>
          </TabsTrigger>
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            <span>Geral</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="tires" className="mt-6">
          <TireMaintenanceList />
        </TabsContent>
        
        <TabsContent value="general" className="mt-6">
          <GeneralMaintenanceList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
