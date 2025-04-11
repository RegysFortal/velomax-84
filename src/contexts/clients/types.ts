
import { Client } from "@/types/client";
import { User } from "@/types/user";

export type ClientsContextType = {
  clients: Client[];
  addClient: (client: Omit<Client, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  updateClient: (id: string, client: Partial<Client>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  getClient: (id: string) => Client | undefined;
  loading: boolean;
};

export type UseFetchClientsReturnType = {
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
  loading: boolean;
};

export type UseClientsOperationsReturnType = {
  addClient: (client: Omit<Client, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  updateClient: (id: string, client: Partial<Client>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  getClient: (id: string) => Client | undefined;
};
