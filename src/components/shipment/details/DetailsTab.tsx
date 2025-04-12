
import React from "react";
import { Shipment } from "@/types/shipment";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Edit,
  Package,
  Save,
  X,
  Truck,
  Calendar,
  MapPin,
  FileText,
  User,
  Clock,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { StatusActions } from "./StatusActions";
import { DatePicker } from "@/components/ui/date-picker";
import { useShipmentDetails } from "./useShipmentDetails";
import { ClientSelection } from "../ClientSelection";
import { useStatusLabel } from "../hooks/useStatusLabel";
import { parseISO, format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface DetailsTabProps {
  shipment: Shipment;
  onClose: () => void;
}

// Export the component as default, not named export
export default function DetailsTab({ shipment, onClose }: DetailsTabProps) {
  const { getStatusLabel } = useStatusLabel();
  const {
    isEditing,
    companyId,
    setCompanyId,
    transportMode,
    setTransportMode,
    carrierName,
    setCarrierName,
    trackingNumber,
    setTrackingNumber,
    packages,
    setPackages,
    weight,
    setWeight,
    arrivalFlight,
    setArrivalFlight,
    arrivalDate,
    setArrivalDate,
    observations,
    setObservations,
    status,
    handleEditClick,
    handleCancelEdit,
    handleSave,
    handleStatusChange,
  } = useShipmentDetails(shipment, onClose);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    try {
      const date = parseISO(dateString);
      return format(date, "dd/MM/yyyy", { locale: ptBR });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-1">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-medium">Informações Básicas</h3>
              {!isEditing ? (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleEditClick}
                  title="Editar"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleCancelEdit}
                    title="Cancelar"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleSave}
                    title="Salvar"
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {isEditing ? (
                <div>
                  <Label>Cliente</Label>
                  <ClientSelection
                    companyId={companyId}
                    onCompanyChange={setCompanyId}
                  />
                </div>
              ) : (
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Cliente
                  </Label>
                  <p className="font-medium">{shipment.companyName}</p>
                </div>
              )}

              <div>
                <Label>Modo de Transporte</Label>
                {isEditing ? (
                  <div className="flex gap-2 mt-1">
                    <Button
                      type="button"
                      variant={transportMode === "air" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTransportMode("air")}
                      className="flex-1"
                    >
                      Aéreo
                    </Button>
                    <Button
                      type="button"
                      variant={transportMode === "road" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTransportMode("road")}
                      className="flex-1"
                    >
                      Rodoviário
                    </Button>
                  </div>
                ) : (
                  <Badge variant="outline">
                    {transportMode === "air" ? "Aéreo" : "Rodoviário"}
                  </Badge>
                )}
              </div>

              <div>
                <Label htmlFor="carrierName">Transportadora</Label>
                {isEditing ? (
                  <Input
                    id="carrierName"
                    value={carrierName}
                    onChange={(e) => setCarrierName(e.target.value)}
                    placeholder="Nome da transportadora"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-muted-foreground" />
                    <span>{shipment.carrierName}</span>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="trackingNumber">Número de Rastreio</Label>
                {isEditing ? (
                  <Input
                    id="trackingNumber"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Número de rastreio"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-muted-foreground" />
                    <span>{shipment.trackingNumber}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="packages">Volumes</Label>
                  {isEditing ? (
                    <Input
                      id="packages"
                      type="number"
                      min="0"
                      value={packages}
                      onChange={(e) => setPackages(e.target.value)}
                    />
                  ) : (
                    <p>{shipment.packages}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="weight">Peso (kg)</Label>
                  {isEditing ? (
                    <Input
                      id="weight"
                      type="number"
                      min="0"
                      step="0.01"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                    />
                  ) : (
                    <p>{shipment.weight}</p>
                  )}
                </div>
              </div>

              {transportMode === "air" && (
                <div>
                  <Label htmlFor="arrivalFlight">Voo</Label>
                  {isEditing ? (
                    <Input
                      id="arrivalFlight"
                      value={arrivalFlight}
                      onChange={(e) => setArrivalFlight(e.target.value)}
                      placeholder="Número do voo"
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      {shipment.arrivalFlight && (
                        <>
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span>{shipment.arrivalFlight}</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}

              <div>
                <Label htmlFor="arrivalDate">Data de Chegada</Label>
                {isEditing ? (
                  <DatePicker
                    date={arrivalDate ? new Date(arrivalDate) : undefined}
                    onSelect={(date) =>
                      setArrivalDate(
                        date ? format(date, "yyyy-MM-dd") : undefined
                      )
                    }
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    {shipment.arrivalDate && (
                      <>
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>{formatDate(shipment.arrivalDate)}</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="observations">Observações</Label>
                {isEditing ? (
                  <Textarea
                    id="observations"
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                    placeholder="Observações"
                    rows={3}
                  />
                ) : (
                  <div className="flex items-start gap-2">
                    {shipment.observations && (
                      <>
                        <FileText className="w-4 h-4 text-muted-foreground mt-1" />
                        <p className="text-sm">{shipment.observations}</p>
                      </>
                    )}
                  </div>
                )}
              </div>

              {shipment.status === "delivered_final" && (
                <div className="border rounded-md p-3 space-y-2 bg-muted/50">
                  <h4 className="font-medium">Dados da Entrega</h4>
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Recebedor
                    </Label>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span>{shipment.receiverName}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        Data
                      </Label>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>{formatDate(shipment.deliveryDate)}</span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        Hora
                      </Label>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>{shipment.deliveryTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <StatusActions 
        status={status} 
        shipmentId={shipment.id}
        onStatusChange={handleStatusChange} 
      />
    </div>
  );
}
