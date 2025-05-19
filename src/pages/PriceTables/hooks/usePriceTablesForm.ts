import { usePriceTablesCRUD } from './usePriceTablesCRUD';
import { usePriceTableFormState } from './usePriceTableFormState';
import { usePriceTableFormHandlers } from './usePriceTableFormHandlers';
import { useMetropolitanCities } from './useMetropolitanCities';
import { useCustomServices } from './useCustomServices';
import { usePriceTableSubmit } from './usePriceTableSubmit';
import { useCities } from '@/contexts/cities';

export function usePriceTablesForm() {
  const { 
    priceTables,
    isDialogOpen,
    setIsDialogOpen,
    editingPriceTable,
    setEditingPriceTable,
    handleEdit,
    handleDelete
  } = usePriceTablesCRUD();

  const { formData, setFormData } = usePriceTableFormState(editingPriceTable);
  const { handleChange } = usePriceTableFormHandlers(setFormData);
  const { cities } = useCities();

  const {
    selectedCities,
    setSelectedCities,
    handleToggleMetropolitanCity,
    handleCreateNewCity
  } = useMetropolitanCities(setFormData);

  const {
    customServiceDialogOpen,
    setCustomServiceDialogOpen,
    currentCustomService,
    customServiceFormData,
    handleCustomServiceChange,
    openCustomServiceDialog,
    saveCustomService,
    deleteCustomService
  } = useCustomServices(formData, setFormData);

  const { handleSubmit } = usePriceTableSubmit(
    formData, 
    selectedCities, 
    editingPriceTable, 
    setEditingPriceTable, 
    setIsDialogOpen
  );

  return {
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
    setSelectedCities,
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
  };
}
