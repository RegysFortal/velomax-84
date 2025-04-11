
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
        role: 'user',
        createdAt: employee.created_at,
        updatedAt: employee.updated_at,
        // Additional employee fields - only add if they exist in the database
        ...(employee.department_id && { department: employee.department_id }),
        ...(employee.hire_date && { employeeSince: employee.hire_date }),
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
        is_active: true,
        department_id: employee.department,
        hire_date: employee.employeeSince,
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
      // Transform employee data to match Supabase structure
      const supabaseEmployee = {
        name: employee.name,
        position: employee.position,
        email: employee.email,
        phone: employee.phone,
        department_id: employee.department,
        hire_date: employee.employeeSince,
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
