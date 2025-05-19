
import { City } from '@/types';

// Initial cities data for demo purposes - will be used only if fetching fails
export const INITIAL_CITIES: City[] = [
  {
    id: 'city-1',
    name: 'São Paulo',
    state: 'SP',
    distance: 15,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'city-2',
    name: 'Rio de Janeiro',
    state: 'RJ',
    distance: 45,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'city-3',
    name: 'Belo Horizonte',
    state: 'MG',
    distance: 60,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'city-4',
    name: 'Brasília',
    state: 'DF',
    distance: 120,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
