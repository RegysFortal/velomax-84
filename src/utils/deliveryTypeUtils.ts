
export const getDeliveryTypeText = (type: string): string => {
  const typeMap: Record<string, string> = {
    'standard': 'Padrão',
    'emergency': 'Emergência',
    'exclusive': 'Exclusivo',
    'saturday': 'Sábado',
    'sundayHoliday': 'Domingo/Feriado',
    'difficultAccess': 'Acesso Difícil',
    'metropolitanRegion': 'Região Metropolitana',
    'doorToDoorInterior': 'Interior',
    'reshipment': 'Redespacho',
    'normalBiological': 'Biológico Normal',
    'infectiousBiological': 'Biológico Infeccioso',
    'tracked': 'Rastreado'
  };
  
  return typeMap[type] || type;
};
