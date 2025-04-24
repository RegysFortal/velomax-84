
import React, { useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDeliveries } from "@/contexts/deliveries/useDeliveries";
import { useShipments } from "@/contexts/shipments";
import { useClients } from "@/contexts";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Safely get data from contexts with fallbacks
  let deliveries = [];
  let shipments = [];
  let clients = [];
  
  try {
    const deliveriesContext = useDeliveries();
    deliveries = deliveriesContext?.deliveries || [];
  } catch (error) {
    console.warn("DeliveriesProvider not available, using empty deliveries array");
  }
  
  try {
    const shipmentsContext = useShipments();
    shipments = shipmentsContext?.shipments || [];
  } catch (error) {
    console.warn("ShipmentsProvider not available, using empty shipments array");
  }
  
  try {
    const clientsContext = useClients();
    clients = clientsContext?.clients || [];
  } catch (error) {
    console.warn("ClientsProvider not available, using empty clients array");
  }
  
  const navigate = useNavigate();

  // Função para obter o nome do cliente
  const getClientName = (clientId: string) => {
    const client = clients.find((c: any) => c.id === clientId);
    return client ? (client.tradingName || client.name) : "Cliente não encontrado";
  };

  // Filtrar entregas
  const filteredDeliveries = deliveries.filter((delivery: any) => {
    const clientName = getClientName(delivery.clientId).toLowerCase();
    const searchFields = [
      delivery.minuteNumber.toLowerCase(),
      clientName,
      delivery.receiver.toLowerCase(),
      delivery.notes?.toLowerCase() || ""
    ].join(" ");
    
    return searchFields.includes(searchTerm.toLowerCase());
  }).slice(0, 5); // Limitar a 5 resultados

  // Filtrar embarques
  const filteredShipments = shipments.filter((shipment: any) => {
    const searchFields = [
      shipment.companyName?.toLowerCase() || "",
      shipment.trackingNumber?.toLowerCase() || "",
      shipment.carrierName?.toLowerCase() || "",
      shipment.observations?.toLowerCase() || ""
    ].join(" ");
    
    return searchFields.includes(searchTerm.toLowerCase());
  }).slice(0, 5); // Limitar a 5 resultados

  const handleNavigateToDelivery = () => {
    setIsOpen(false);
    navigate("/deliveries");
  };

  const handleNavigateToShipment = () => {
    setIsOpen(false);
    navigate("/shipments");
  };

  return (
    <>
      <Button 
        variant="outline" 
        size="icon" 
        className="rounded-full"
        onClick={() => setIsOpen(true)}
      >
        <Search className="h-4 w-4" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Busca Global</DialogTitle>
          </DialogHeader>
          
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar entregas, embarques..."
              className="pl-8 pr-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1.5 h-7 w-7 rounded-full"
                onClick={() => setSearchTerm("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <div className="space-y-4 mt-2">
            {searchTerm && (
              <>
                <div>
                  <h3 className="font-medium text-sm mb-2 flex justify-between">
                    <span>Entregas</span>
                    <Button variant="link" size="sm" onClick={handleNavigateToDelivery}>
                      Ver todas
                    </Button>
                  </h3>
                  
                  {filteredDeliveries.length > 0 ? (
                    <div className="space-y-2">
                      {filteredDeliveries.map((delivery: any) => (
                        <div
                          key={delivery.id}
                          className="flex justify-between p-2 rounded-md border hover:bg-muted cursor-pointer"
                          onClick={() => {
                            navigate("/deliveries");
                            setIsOpen(false);
                          }}
                        >
                          <div>
                            <div className="font-medium">{getClientName(delivery.clientId)}</div>
                            <div className="text-sm text-muted-foreground">
                              Minuta: {delivery.minuteNumber} | Destinatário: {delivery.receiver}
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {format(new Date(delivery.deliveryDate), 'dd/MM/yyyy', { locale: ptBR })}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground py-2">
                      Nenhuma entrega encontrada
                    </div>
                  )}
                </div>
                
                <div>
                  <h3 className="font-medium text-sm mb-2 flex justify-between">
                    <span>Embarques</span>
                    <Button variant="link" size="sm" onClick={handleNavigateToShipment}>
                      Ver todos
                    </Button>
                  </h3>
                  
                  {filteredShipments.length > 0 ? (
                    <div className="space-y-2">
                      {filteredShipments.map((shipment: any) => (
                        <div
                          key={shipment.id}
                          className="flex justify-between p-2 rounded-md border hover:bg-muted cursor-pointer"
                          onClick={() => {
                            navigate("/shipments");
                            setIsOpen(false);
                          }}
                        >
                          <div>
                            <div className="font-medium">{shipment.companyName || "Sem nome"}</div>
                            <div className="text-sm text-muted-foreground">
                              Conhecimento: {shipment.trackingNumber || "N/A"} | {shipment.carrierName || "N/A"}
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {shipment.arrivalDate && format(new Date(shipment.arrivalDate), 'dd/MM/yyyy', { locale: ptBR })}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground py-2">
                      Nenhum embarque encontrado
                    </div>
                  )}
                </div>
              </>
            )}
            
            {!searchTerm && (
              <div className="text-center text-muted-foreground py-4">
                Digite algo para buscar por entregas e embarques
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
