
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types';
import { toast } from 'sonner';

// Define a type for the Supabase employee data format
type SupabaseEmployee = {
  id: string;
  name: string;
  position: string;
  email: string | null;
  phone: string | null;
  is_active: boolean;
  department_id: string | null;
  hire_date: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
  // Additional fields that were added to the database
  rg: string | null;
  cpf: string | null;
  document: string | null;
  birth_date: string | null;
  driver_license: string | null;
  driver_license_expiry: string | null;
  driver_license_category: string | null;
  father_name: string | null;
  mother_name: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  type: 'employee' | 'contractor' | null;
  role: string | null;
  vehicle: any | null;
  license: any | null;
};

export const useEmployeesData = () => {
  const [employees, setEmployees] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch employees from Supabase
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('name', { ascending: true });
        
      if (error) {
        console.error('Error fetching employees:', error);
        throw error;
      }
      
      // Convert Supabase data to User type
      const formattedEmployees: User[] = data.map((employee: SupabaseEmployee) => ({
        id: employee.id,
        name: employee.name,
        position: employee.position,
        email: employee.email || '',
        phone: employee.phone || '',
        role: employee.role as User['role'] || 'user',
        createdAt: employee.created_at,
        updatedAt: employee.updated_at,
        // Additional employee fields - only add if they exist in the database
        ...(employee.department_id && { department: employee.department_id }),
        ...(employee.hire_date && { employeeSince: employee.hire_date }),
        
        // Map additional employee fields from the database if they exist
        ...(employee.rg && { rg: employee.rg }),
        ...(employee.cpf && { cpf: employee.cpf }),
        ...(employee.document && { document: employee.document }),
        ...(employee.birth_date && { birthDate: employee.birth_date }),
        ...(employee.driver_license && { driverLicense: employee.driver_license }),
        ...(employee.driver_license_expiry && { driverLicenseExpiry: employee.driver_license_expiry }),
        ...(employee.driver_license_category && { driverLicenseCategory: employee.driver_license_category }),
        ...(employee.father_name && { fatherName: employee.father_name }),
        ...(employee.mother_name && { motherName: employee.mother_name }),
        ...(employee.address && { address: employee.address }),
        ...(employee.city && { city: employee.city }),
        ...(employee.state && { state: employee.state }),
        ...(employee.zip_code && { zipCode: employee.zip_code }),
        ...(employee.type && { type: employee.type }),
        ...(employee.vehicle && { vehicle: employee.vehicle }),
        ...(employee.license && { license: employee.license }),
      }));
      
      setEmployees(formattedEmployees);
      
      // Also save to localStorage as backup
      localStorage.setItem('velomax_employees', JSON.stringify(formattedEmployees));
      
      return formattedEmployees;
    } catch (error) {
      console.error('Error in fetchEmployees:', error);
      toast.error('Erro ao buscar funcionários do servidor');
      
      // Try to load from localStorage as fallback
      const storedEmployees = localStorage.getItem('velomax_employees');
      if (storedEmployees) {
        try {
          const parsedEmployees = JSON.parse(storedEmployees);
          setEmployees(parsedEmployees);
          return parsedEmployees;
        } catch (e) {
          console.error('Error parsing stored employees:', e);
        }
      }
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Add employee to Supabase
  const addEmployee = async (employee: User) => {
    try {
      console.log("Adding employee to database:", employee);
      
      // Transform employee data to match Supabase structure
      const supabaseEmployee = {
        id: employee.id || undefined,
        name: employee.name,
        position: employee.position || '',
        email: employee.email,
        phone: employee.phone,
        is_active: true,
        department_id: employee.department,
        hire_date: employee.employeeSince,
        // Additional employee fields for the database
        rg: employee.rg,
        cpf: employee.cpf,
        document: employee.document,
        birth_date: employee.birthDate,
        driver_license: employee.driverLicense,
        driver_license_expiry: employee.driverLicenseExpiry,
        driver_license_category: employee.driverLicenseCategory,
        father_name: employee.fatherName,
        mother_name: employee.motherName,
        address: employee.address,
        city: employee.city,
        state: employee.state,
        zip_code: employee.zipCode,
        type: employee.type,
        role: employee.role,
        vehicle: employee.vehicle,
        license: employee.license,
        // Get the current user's id
        user_id: (await supabase.auth.getUser()).data.user?.id
      };
      
      const { data, error } = await supabase
        .from('employees')
        .insert(supabaseEmployee)
        .select()
        .single();
        
      if (error) {
        console.error('Error adding employee:', error);
        throw error;
      }
      
      // Update local state
      await fetchEmployees();
      
      return data;
    } catch (error) {
      console.error('Error in addEmployee:', error);
      toast.error('Erro ao adicionar funcionário');
      throw error;
    }
  };

  // Update employee in Supabase
  const updateEmployee = async (employee: User) => {
    try {
      console.log("Updating employee in database:", employee);
      
      // Transform employee data to match Supabase structure
      const supabaseEmployee = {
        name: employee.name,
        position: employee.position || '',
        email: employee.email,
        phone: employee.phone,
        department_id: employee.department,
        hire_date: employee.employeeSince,
        // Additional employee fields for the database
        rg: employee.rg,
        cpf: employee.cpf,
        document: employee.document,
        birth_date: employee.birthDate,
        driver_license: employee.driverLicense,
        driver_license_expiry: employee.driverLicenseExpiry,
        driver_license_category: employee.driverLicenseCategory,
        father_name: employee.fatherName,
        mother_name: employee.motherName,
        address: employee.address,
        city: employee.city,
        state: employee.state,
        zip_code: employee.zipCode,
        type: employee.type,
        role: employee.role,
        vehicle: employee.vehicle,
        license: employee.license,
        updated_at: new Date().toISOString()
      };
      
      console.log("Supabase employee data for update:", supabaseEmployee);
      
      const { error } = await supabase
        .from('employees')
        .update(supabaseEmployee)
        .eq('id', employee.id);
        
      if (error) {
        console.error('Error updating employee:', error);
        throw error;
      }
      
      // Update local state with fresh data
      await fetchEmployees();
      
      return true;
    } catch (error) {
      console.error('Error in updateEmployee:', error);
      toast.error('Erro ao atualizar funcionário');
      throw error;
    }
  };

  // Delete employee from Supabase
  const deleteEmployee = async (id: string) => {
    try {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', id);
        
      if (error) {
        console.error('Error deleting employee:', error);
        throw error;
      }
      
      // Update local state
      await fetchEmployees();
      
      return true;
    } catch (error) {
      console.error('Error in deleteEmployee:', error);
      toast.error('Erro ao excluir funcionário');
      throw error;
    }
  };

  // Load initial data
  useEffect(() => {
    fetchEmployees();
  }, []);

  return {
    employees,
    loading,
    fetchEmployees,
    addEmployee,
    updateEmployee,
    deleteEmployee
  };
};
