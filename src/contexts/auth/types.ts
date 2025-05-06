
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { User, PermissionLevel } from '@/types/user';

export interface AuthContextType {
  user: User | null;
  users: User[];
  currentUser: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUserProfile: (userData: Partial<User>) => Promise<boolean>;
  updateUser: (userId: string, userData: Partial<User>) => Promise<boolean>;
  createUser: (userData: Omit<User, 'id' | 'createdAt' | 'lastLogin'>) => Promise<User>;
  deleteUser: (userId: string) => Promise<boolean>;
  resetUserPassword: (userId: string, newPassword: string) => Promise<boolean>;
  updateUserPassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  hasPermission: (feature: string, level?: keyof PermissionLevel) => boolean;
  supabaseUser: SupabaseUser | null;
  session: Session | null;
  refreshUsers: () => Promise<User[]>;
}
