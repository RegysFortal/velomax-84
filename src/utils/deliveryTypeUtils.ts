
export const getDeliveryTypeText = (type: string): string => {
  const typeMap: Record<string, string> = {
    'standard': 'Normal',
    'emergency': 'Emergencial',
    'exclusive': 'Veículo Exclusivo',
    'saturday': 'Sábado',
    'sundayHoliday': 'Domingo/Feriado',
    'difficultAccess': 'Difícil Acesso',
    'metropolitanRegion': 'Região Metropolitana',
    'doorToDoorInterior': 'Porta a Porta Interior',
    'reshipment': 'Redespacho',
    'normalBiological': 'Biológico Normal',
    'infectiousBiological': 'Biológico Infeccioso',
    'tracked': 'Veículo Rastreado'
  };
  
  return typeMap[type] || type;
};
