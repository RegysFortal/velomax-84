
import { Client } from '@/types';

interface UseClientLookupProps {
  clients: Client[];
}

export function useClientLookup({ clients }: UseClientLookupProps) {
  // Get client name by ID
  const getClientName = (clientId: string): string => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Cliente não encontrado';
  };

  return { getClientName };
}
