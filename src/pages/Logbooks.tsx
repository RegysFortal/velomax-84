
import { useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useLogbook } from '@/contexts/LogbookContext';
import { LogbookDashboard } from '@/components/logbook/dashboard/LogbookDashboard';
import { LogbookPageHeader } from '@/components/logbook/LogbookPageHeader';
import { EntryList } from '@/components/logbook/tabs/EntryList';
import { FuelList } from '@/components/logbook/tabs/FuelList';
import { MaintenanceList } from '@/components/logbook/tabs/MaintenanceList';
import { format, subDays } from 'date-fns';

const Logbooks = () => {
  const { 
    entries, 
    vehicles, 
    employees, 
    fuelRecords, 
    maintenanceRecords, 
    isLoading 
  } = useLogbook();
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('entries');
  const [isNewEntryOpen, setIsNewEntryOpen] = useState(false);
  const [isNewFuelOpen, setIsNewFuelOpen] = useState(false);
  
  // Filter entries by date
  const filteredEntries = entries.filter(entry => 
    entry.date === format(selectedDate, 'yyyy-MM-dd')
  );
  
  // Filter fuel records by date
  const filteredFuelRecords = fuelRecords.filter(record => 
    record.date === format(selectedDate, 'yyyy-MM-dd')
  );
  
  // Filter maintenance records by date
  const filteredMaintenanceRecords = maintenanceRecords.filter(record => 
    record.date === format(selectedDate, 'yyyy-MM-dd')
  );
  
  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <p>Carregando dados do diário de bordo...</p>
          </div>
        </div>
      </AppLayout>
    );
  }
  
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
            <TabsTrigger value="maintenance" className="relative">
              Manutenções
              {filteredMaintenanceRecords.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {filteredMaintenanceRecords.length}
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
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="maintenance">
            <Card>
              <CardContent className="p-0">
                <MaintenanceList 
                  maintenanceRecords={filteredMaintenanceRecords}
                  vehicles={vehicles}
                  selectedDate={selectedDate}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Logbooks;
