
export interface PriceTable {
  id?: string;
  name: string;
  multiplier: number;
  // Fortaleza Normal
  fortalezaNormalMinRate: number;
  fortalezaNormalExcessRate: number;
  // Fortaleza Emergencial
  fortalezaEmergencyMinRate: number;
  fortalezaEmergencyExcessRate: number;
  // Fortaleza Sábados
  fortalezaSaturdayMinRate: number;
  fortalezaSaturdayExcessRate: number;
  // Fortaleza Exclusivo
  fortalezaExclusiveMinRate: number;
  fortalezaExclusiveExcessRate: number;
  // Fortaleza Agendado/Difícil Acesso
  fortalezaScheduledMinRate: number;
  fortalezaScheduledExcessRate: number;
  // Região Metropolitana
  metropolitanMinRate: number;
  metropolitanExcessRate: number;
  // Fortaleza Domingos/Feriados
  fortalezaHolidayMinRate: number;
  fortalezaHolidayExcessRate: number;
  // Material Biológico Normal
  biologicalNormalMinRate: number;
  biologicalNormalExcessRate: number;
  // Material Biológico Infeccioso
  biologicalInfectiousMinRate: number;
  biologicalInfectiousExcessRate: number;
  // Veículo Rastreado
  trackedVehicleMinRate: number;
  trackedVehicleExcessRate: number;
  // Redespacho
  reshipmentMinRate: number;
  reshipmentExcessRate: number;
  reshipmentInvoicePercentage: number;
  // Exclusivo Interior
  interiorExclusiveMinRate: number;
  interiorExclusiveExcessRate: number;
  interiorExclusiveKmRate: number;
  
  createdAt?: string;
  updatedAt?: string;
}
