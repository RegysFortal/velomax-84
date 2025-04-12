
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ContractorForm } from './ContractorForm';
import { DriverLicenseForm } from './DriverLicenseForm';
import { VehicleInfoForm } from './VehicleInfoForm';

interface ContractorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contractor?: any;
}

export function ContractorDialog({ open, onOpenChange, contractor }: ContractorDialogProps) {
  const [activeTab, setActiveTab] = useState('personal');
  const [contractorData, setContractorData] = useState<any>({});
  const [contractorType, setContractorType] = useState<'driver' | 'helper'>('helper');
  
  useEffect(() => {
    if (contractor) {
      setContractorData(contractor);
      setContractorType(contractor.role === 'driver' ? 'driver' : 'helper');
    } else {
      setContractorData({});
      setContractorType('helper');
    }
  }, [contractor, open]);
  
  const handleContractorTypeChange = (type: 'driver' | 'helper') => {
    setContractorType(type);
  };
  
  const handlePersonalInfoSave = (data: any) => {
    setContractorData(prev => ({ ...prev, ...data }));
    if (contractorType === 'driver') {
      setActiveTab('license');
    }
  };
  
  const handleLicenseSave = (data: any) => {
    setContractorData(prev => ({ ...prev, ...data }));
    setActiveTab('vehicle');
  };
  
  const handleVehicleSave = (data: any) => {
    setContractorData(prev => ({ ...prev, ...data }));
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[725px]">
        <DialogHeader>
          <DialogTitle>
            {contractor ? 'Editar Terceiro' : 'Novo Terceiro'}
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="personal">Informações Pessoais</TabsTrigger>
            <TabsTrigger 
              value="license" 
              disabled={contractorType !== 'driver'}
            >
              CNH
            </TabsTrigger>
            <TabsTrigger 
              value="vehicle" 
              disabled={contractorType !== 'driver'}
            >
              Veículo
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="personal">
            <ContractorForm 
              contractor={contractor} 
              onContractorTypeChange={handleContractorTypeChange}
              onComplete={handlePersonalInfoSave}
            />
          </TabsContent>
          
          <TabsContent value="license">
            <DriverLicenseForm 
              data={contractor?.license || {}} 
              onComplete={handleLicenseSave}
            />
          </TabsContent>
          
          <TabsContent value="vehicle">
            <VehicleInfoForm 
              data={contractor?.vehicle || {}} 
              onComplete={handleVehicleSave}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
