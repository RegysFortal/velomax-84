
import { City } from '@/types';

export type CitiesContextType = {
  cities: City[];
  addCity: (city: Omit<City, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateCity: (id: string, city: Partial<City>) => Promise<void>;
  deleteCity: (id: string) => Promise<void>;
  getCity: (id: string) => City | undefined;
  loading: boolean;
};
