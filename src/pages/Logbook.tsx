
import { useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useLogbook } from '@/contexts/LogbookContext';

// Import refactored components
import { LogbookPageHeader } from '@/components/logbook/LogbookPageHeader';
import { EntryList } from '@/components/logbook/tabs/EntryList';
import { FuelList } from '@/components/logbook/tabs/FuelList';
import { MaintenanceList } from '@/components/logbook/tabs/MaintenanceList';
import { LogbookDashboard } from '@/components/logbook/dashboard/LogbookDashboard';

const Logbook = () => {
  const { entries, vehicles, employees, loading } = useLogbook();
  const [isNewEntryOpen, setIsNewEntryOpen] = useState(false);
  const [isNewFuelOpen, setIsNewFuelOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const filteredEntries = entries.filter(entry => {
    const entryDate = new Date(entry.date);
    return (
      entryDate.getDate() === selectedDate.getDate() &&
      entryDate.getMonth() === selectedDate.getMonth() &&
      entryDate.getFullYear() === selectedDate.getFullYear()
    );
  });

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <LogbookPageHeader 
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          isNewEntryOpen={isNewEntryOpen}
          setIsNewEntryOpen={setIsNewEntryOpen}
          isNewFuelOpen={isNewFuelOpen}
          setIsNewFuelOpen={setIsNewFuelOpen}
        />

        <Tabs defaultValue="entries">
          <TabsList>
            <TabsTrigger value="entries">Registros do dia</TabsTrigger>
            <TabsTrigger value="fuel">Abastecimentos</TabsTrigger>
            <TabsTrigger value="maintenance">Manutenções</TabsTrigger>
          </TabsList>
          
          <TabsContent value="entries" className="mt-4">
            <EntryList 
              entries={entries}
              vehicles={vehicles}
              employees={employees}
              selectedDate={selectedDate}
              onNewEntry={() => setIsNewEntryOpen(true)}
            />
          </TabsContent>
          
          <TabsContent value="fuel" className="mt-4">
            <FuelList />
          </TabsContent>
          
          <TabsContent value="maintenance" className="mt-4">
            <MaintenanceList />
          </TabsContent>
        </Tabs>

        <LogbookDashboard 
          vehicles={vehicles}
          employees={employees}
          filteredEntries={filteredEntries}
        />
      </div>
    </AppLayout>
  );
};

export default Logbook;
