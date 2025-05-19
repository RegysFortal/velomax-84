
import React from 'react';
import { useState } from 'react';
import { useShipments } from '@/contexts/shipments';
import { ShipmentsHeader } from './ShipmentsHeader';
import { ShipmentsTable } from './ShipmentsTable';
import { ShipmentDetails } from '@/components/shipment/ShipmentDetails';
import { ShipmentDialog } from '@/components/shipment/ShipmentDialog';
import { ShipmentEditDialog } from '@/components/shipment/ShipmentEditDialog';
import { Shipment } from '@/types/shipment';

export default function ShipmentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [shipmentToEdit, setShipmentToEdit] = useState<Shipment | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleShipmentDetailClose = () => {
    setSelectedShipment(null);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleStatusChange = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleCreateDialogClose = (open: boolean) => {
    if (!open) {
      setIsCreateDialogOpen(false);
      setRefreshTrigger(prev => prev + 1);
    }
  };

  const handleEditClick = (shipment: Shipment) => {
    setShipmentToEdit(shipment);
    setIsEditDialogOpen(true);
  };

  const handleEditDialogClose = (open: boolean) => {
    if (!open) {
      setIsEditDialogOpen(false);
      setShipmentToEdit(null);
      setRefreshTrigger(prev => prev + 1);
    }
  };

  return (
    <div className="flex flex-col space-y-6 h-full">
      <ShipmentsHeader 
        onCreateClick={() => setIsCreateDialogOpen(true)}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
      
      <ShipmentsTable
        searchTerm={searchTerm}
        refreshTrigger={refreshTrigger}
        onRowClick={setSelectedShipment}
        onStatusChange={handleStatusChange}
        onEditClick={handleEditClick}
      />
      
      {/* Shipment details dialog */}
      {selectedShipment && (
        <ShipmentDetails
          shipment={selectedShipment}
          open={!!selectedShipment}
          onClose={handleShipmentDetailClose}
        />
      )}
      
      {/* Create shipment dialog */}
      <ShipmentDialog
        open={isCreateDialogOpen}
        onOpenChange={handleCreateDialogClose}
      />

      {/* Edit shipment dialog */}
      <ShipmentEditDialog
        open={isEditDialogOpen}
        onOpenChange={handleEditDialogClose}
        shipment={shipmentToEdit}
      />
    </div>
  );
}
