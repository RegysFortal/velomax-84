
import React from 'react';
import { Check, CircleDashed, AlertTriangle, Truck, PackageCheck } from "lucide-react";
import { ShipmentStatus } from "@/types/shipment";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

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
        <DropdownMenuItem
          key={option.value}
          onClick={() => onStatusChange(option.value as ShipmentStatus)}
        >
          <div className="flex items-center">
            {option.icon}
            <span>{option.label}</span>
          </div>
        </DropdownMenuItem>
      ))}
    </>
  );
}
