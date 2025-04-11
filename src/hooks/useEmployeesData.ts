
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types';
import { toast } from 'sonner';

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
      const formattedEmployees: User[] = data.map(employee => ({
        id: employee.id,
        name: employee.name,
        position: employee.position,
        email: employee.email || '',
        phone: employee.phone || '',
        rg: employee.rg || '',
        cpf: employee.cpf || '',
        birthDate: employee.birth_date || undefined,
        driverLicense: employee.driver_license || undefined,
        driverLicenseExpiry: employee.driver_license_expiry || undefined,
        driverLicenseCategory: employee.driver_license_category || undefined,
        fatherName: employee.father_name || undefined,
        motherName: employee.mother_name || undefined,
        address: employee.address || undefined,
        city: employee.city || undefined,
        state: employee.state || undefined,
        zipCode: employee.zip_code || undefined,
        employeeSince: employee.employee_since || undefined,
        role: 'user',
        createdAt: employee.created_at,
        updatedAt: employee.updated_at
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
      // Transform employee data to match Supabase structure
      const supabaseEmployee = {
        id: employee.id,
        name: employee.name,
        position: employee.position,
        email: employee.email,
        phone: employee.phone,
        rg: employee.rg,
        cpf: employee.cpf,
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
        employee_since: employee.employeeSince,
        is_active: true,
        user_id: supabase.auth.getUser().then(({ data }) => data.user?.id)
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
      // Transform employee data to match Supabase structure
      const supabaseEmployee = {
        name: employee.name,
        position: employee.position,
        email: employee.email,
        phone: employee.phone,
        rg: employee.rg,
        cpf: employee.cpf,
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
        employee_since: employee.employeeSince,
        updated_at: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from('employees')
        .update(supabaseEmployee)
        .eq('id', employee.id);
        
      if (error) {
        console.error('Error updating employee:', error);
        throw error;
      }
      
      // Update local state
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
