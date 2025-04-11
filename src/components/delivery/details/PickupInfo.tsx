
import React from 'react';
import { Delivery } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface PickupInfoProps {
  delivery: Delivery;
}

// This component is kept for backward compatibility, but won't be displayed anymore
export function PickupInfo({ delivery }: PickupInfoProps) {
  return null;
}
