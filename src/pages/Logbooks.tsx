
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useLogbook } from '@/contexts/LogbookContext';
import { LogbookDashboard } from '@/components/logbook/dashboard/LogbookDashboard';
import { LogbookPageHeader } from '@/components/logbook/LogbookPageHeader';
import { EntryList } from '@/components/logbook/tabs/EntryList';
import { FuelList } from '@/components/logbook/tabs/FuelList';
import { format } from 'date-fns';

const Logbooks = () => {
  const { 
    entries, 
    vehicles, 
    employees, 
    fuelRecords, 
    isLoading 
  } = useLogbook();
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('entries');
  const [isNewEntryOpen, setIsNewEntryOpen] = useState(false);
  const [isNewFuelOpen, setIsNewFuelOpen] = useState(false);
  const [isNewMaintenanceOpen, setIsNewMaintenanceOpen] = useState(false);
  
  // Filter entries by date
  const filteredEntries = entries.filter(entry => 
    entry.date === format(selectedDate, 'yyyy-MM-dd')
  );
  
  // Filter fuel records by date
  const filteredFuelRecords = fuelRecords.filter(record => 
    record.date === format(selectedDate, 'yyyy-MM-dd')
  );
  
  // Handle new entry button click
  const handleNewEntry = () => {
    setIsNewEntryOpen(true);
  };
  
  // Handle new fuel button click
  const handleNewFuel = () => {
    setIsNewFuelOpen(true);
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p>Carregando dados do diário de bordo...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col gap-6">
      <LogbookPageHeader 
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        isNewEntryOpen={isNewEntryOpen}
        setIsNewEntryOpen={setIsNewEntryOpen}
        isNewFuelOpen={isNewFuelOpen}
        setIsNewFuelOpen={setIsNewFuelOpen}
        isNewMaintenanceOpen={isNewMaintenanceOpen}
        setIsNewMaintenanceOpen={setIsNewMaintenanceOpen}
      />
      
      <LogbookDashboard 
        vehicles={vehicles} 
        employees={employees}
        filteredEntries={filteredEntries}
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="entries" className="relative">
            Registros de Viagem
            {filteredEntries.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {filteredEntries.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="fuel" className="relative">
            Abastecimentos
            {filteredFuelRecords.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {filteredFuelRecords.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="entries">
          <Card>
            <CardContent className="p-0">
              <EntryList 
                entries={filteredEntries} 
                vehicles={vehicles}
                employees={employees}
                selectedDate={selectedDate}
                onNewEntry={handleNewEntry}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="fuel">
          <Card>
            <CardContent className="p-0">
              <FuelList 
                fuelRecords={filteredFuelRecords} 
                vehicles={vehicles}
                selectedDate={selectedDate}
                onNewFuel={handleNewFuel}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Logbooks;
