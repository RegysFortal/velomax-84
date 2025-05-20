
import React from 'react';
import { Check, CircleDashed, AlertTriangle, Truck, PackageCheck, TruckIcon } from "lucide-react";
import { ShipmentStatus } from "@/types/shipment";
import { useShipments } from "@/contexts/shipments";

interface StatusMenuItemsProps {
  status: ShipmentStatus;
  onStatusChange: (status: ShipmentStatus) => void;
}

export function StatusMenuItems({ status, onStatusChange }: StatusMenuItemsProps) {
  // Build the list of available status options based on current status
  const getAvailableStatusOptions = () => {
    switch (status) {
      case "in_transit":
        return [
          { 
            value: "at_carrier", 
            label: "Na Transportadora",
            icon: <TruckIcon className="mr-2 h-4 w-4" />
          },
          { 
            value: "delivered", 
            label: "Retirada",
            icon: <Truck className="mr-2 h-4 w-4" />
          },
          { 
            value: "retained", 
            label: "Retida",
            icon: <AlertTriangle className="mr-2 h-4 w-4" />
          },
          { 
            value: "delivered_final", 
            label: "Entregue",
            icon: <Check className="mr-2 h-4 w-4" />
          },
          { 
            value: "partially_delivered", 
            label: "Entregue Parcial",
            icon: <PackageCheck className="mr-2 h-4 w-4" />
          }
        ];
        
      case "at_carrier":
        return [
          { 
            value: "in_transit", 
            label: "Em Trânsito",
            icon: <CircleDashed className="mr-2 h-4 w-4" />
          },
          { 
            value: "delivered", 
            label: "Retirada",
            icon: <Truck className="mr-2 h-4 w-4" />
          },
          { 
            value: "retained", 
            label: "Retida",
            icon: <AlertTriangle className="mr-2 h-4 w-4" />
          },
          { 
            value: "delivered_final", 
            label: "Entregue",
            icon: <Check className="mr-2 h-4 w-4" />
          },
          { 
            value: "partially_delivered", 
            label: "Entregue Parcial",
            icon: <PackageCheck className="mr-2 h-4 w-4" />
          }
        ];
        
      case "retained":
        return [
          { 
            value: "in_transit", 
            label: "Em Trânsito",
            icon: <CircleDashed className="mr-2 h-4 w-4" />
          },
          { 
            value: "at_carrier", 
            label: "Na Transportadora",
            icon: <TruckIcon className="mr-2 h-4 w-4" />
          },
          { 
            value: "delivered", 
            label: "Retirada",
            icon: <Truck className="mr-2 h-4 w-4" />
          },
          { 
            value: "delivered_final", 
            label: "Entregue",
            icon: <Check className="mr-2 h-4 w-4" />
          },
          { 
            value: "partially_delivered", 
            label: "Entregue Parcial",
            icon: <PackageCheck className="mr-2 h-4 w-4" />
          }
        ];
        
      case "delivered":
        return [
          { 
            value: "in_transit", 
            label: "Em Trânsito",
            icon: <CircleDashed className="mr-2 h-4 w-4" />
          },
          { 
            value: "at_carrier", 
            label: "Na Transportadora",
            icon: <TruckIcon className="mr-2 h-4 w-4" />
          },
          { 
            value: "retained", 
            label: "Retida",
            icon: <AlertTriangle className="mr-2 h-4 w-4" />
          },
          { 
            value: "delivered_final", 
            label: "Entregue",
            icon: <Check className="mr-2 h-4 w-4" />
          },
          { 
            value: "partially_delivered", 
            label: "Entregue Parcial",
            icon: <PackageCheck className="mr-2 h-4 w-4" />
          }
        ];
        
      case "partially_delivered":
        return [
          { 
            value: "in_transit", 
            label: "Em Trânsito",
            icon: <CircleDashed className="mr-2 h-4 w-4" />
          },
          { 
            value: "at_carrier", 
            label: "Na Transportadora",
            icon: <TruckIcon className="mr-2 h-4 w-4" />
          },
          { 
            value: "retained", 
            label: "Retida",
            icon: <AlertTriangle className="mr-2 h-4 w-4" />
          },
          { 
            value: "delivered", 
            label: "Retirada",
            icon: <Truck className="mr-2 h-4 w-4" />
          },
          { 
            value: "delivered_final", 
            label: "Entregue",
            icon: <Check className="mr-2 h-4 w-4" />
          }
        ];
        
      case "delivered_final":
        return [
          { 
            value: "in_transit", 
            label: "Em Trânsito",
            icon: <CircleDashed className="mr-2 h-4 w-4" />
          },
          { 
            value: "at_carrier", 
            label: "Na Transportadora",
            icon: <TruckIcon className="mr-2 h-4 w-4" />
          },
          { 
            value: "retained", 
            label: "Retida",
            icon: <AlertTriangle className="mr-2 h-4 w-4" />
          },
          { 
            value: "delivered", 
            label: "Retirada",
            icon: <Truck className="mr-2 h-4 w-4" />
          },
          { 
            value: "partially_delivered", 
            label: "Entregue Parcial",
            icon: <PackageCheck className="mr-2 h-4 w-4" />
          }
        ];
        
      default:
        return [];
    }
  };
  
  const statusOptions = getAvailableStatusOptions();
  
  return (
    <>
      {statusOptions.map((option) => (
        <div
          key={option.value}
          className="flex items-center px-3 py-2 cursor-pointer hover:bg-accent"
          onClick={() => onStatusChange(option.value as ShipmentStatus)}
        >
          {option.icon}
          <span>{option.label}</span>
        </div>
      ))}
    </>
  );
}
