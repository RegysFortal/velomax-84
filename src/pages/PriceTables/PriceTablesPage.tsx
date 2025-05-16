
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { PriceTableList } from '@/components/price-tables/PriceTableList';
import { PriceTableDialog } from '@/components/price-tables/PriceTableDialog';
import { CustomServiceDialog } from '@/components/price-tables/CustomServiceDialog';
import { CustomServiceManagement } from './components/CustomServiceManagement';
import { usePriceTablesForm } from './hooks/usePriceTablesForm';

export default function PriceTablesPage() {
  const {
    priceTables,
    cities,
    isDialogOpen,
    setIsDialogOpen,
    editingPriceTable,
    setEditingPriceTable,
    formData,
    setFormData,
    handleChange,
    handleSubmit,
    handleEdit,
    handleDelete,
    selectedCities,
    handleToggleMetropolitanCity,
    handleCreateNewCity,
    customServiceDialogOpen,
    setCustomServiceDialogOpen,
    openCustomServiceDialog,
    currentCustomService,
    customServiceFormData,
    handleCustomServiceChange,
    saveCustomService,
    deleteCustomService,
  } = usePriceTablesForm();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tabelas de Preços</h1>
          <p className="text-muted-foreground">
            Gerencie as tabelas de preços para diferentes tipos de serviço.
          </p>
        </div>
        <Button onClick={() => { setIsDialogOpen(true); setEditingPriceTable(null); }}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Tabela
        </Button>
      </div>

      <PriceTableList 
        priceTables={priceTables}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <PriceTableDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        editingPriceTable={editingPriceTable}
        selectedCities={selectedCities}
        cities={cities}
        onCityToggle={handleToggleMetropolitanCity}
        onCreateNewCity={handleCreateNewCity}
        onCheckboxChange={(checked) => {
          setFormData(prev => ({
            ...prev,
            allowCustomPricing: checked,
          }));
        }}
      />

      <CustomServiceDialog
        open={customServiceDialogOpen}
        onOpenChange={setCustomServiceDialogOpen}
        currentService={currentCustomService}
        formData={customServiceFormData}
        onChange={handleCustomServiceChange}
        onSave={saveCustomService}
      />

      <CustomServiceManagement
        customServices={formData.customServices}
        openCustomServiceDialog={openCustomServiceDialog}
        deleteCustomService={deleteCustomService}
      />
    </div>
  );
}
