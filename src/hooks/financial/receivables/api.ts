
import { supabase } from '@/integrations/supabase/client';
import { ReceivableAccountData, ReceivableAccountUpdate } from './types';

/**
 * Fetches all receivable accounts from the database
 */
export const fetchReceivableAccounts = async () => {
  const { data, error } = await supabase
    .from('receivable_accounts')
    .select('*')
    .order('due_date', { ascending: true });
  
  if (error) throw error;
  
  // Transform database fields to match our interface
  return data.map((account: any) => ({
    id: account.id,
    clientId: account.client_id,
    clientName: account.client_name,
    description: account.description,
    amount: Number(account.amount),
    dueDate: account.due_date,
    receivedDate: account.received_date,
    receivedAmount: account.received_amount ? Number(account.received_amount) : undefined,
    remainingAmount: account.remaining_amount ? Number(account.remaining_amount) : undefined,
    status: account.status,
    categoryId: account.category_id,
    categoryName: account.category_name,
    notes: account.notes,
    paymentMethod: account.payment_method,
    createdAt: account.created_at,
    updatedAt: account.updated_at
  }));
};

/**
 * Checks if a receivable account already exists for a given report
 */
export const checkReceivableAccountExists = async (reportId: string) => {
  try {
    const { data, error } = await supabase
      .from('receivable_accounts')
      .select('id')
      .eq('report_id', reportId)
      .maybeSingle();
    
    if (error) throw error;
    
    return !!data;
  } catch (error) {
    console.error("Error checking if receivable account exists:", error);
    return false;
  }
};

/**
 * Creates a new receivable account in the database
 */
export const createReceivableAccount = async (data: ReceivableAccountData) => {
  const now = new Date().toISOString();
  const newAccountData = {
    client_id: data.clientId,
    client_name: data.clientName,
    description: data.description,
    amount: data.amount,
    due_date: data.dueDate,
    status: data.status,
    category_id: data.categoryId,
    category_name: data.categoryName,
    report_id: data.reportId,
    payment_method: data.paymentMethod,
    notes: data.notes,
    created_at: now,
    updated_at: now
  };
  
  // Check if an account for this report already exists
  const { data: existingAccount } = await supabase
    .from('receivable_accounts')
    .select('*')
    .eq('report_id', data.reportId)
    .maybeSingle();
  
  if (existingAccount) {
    // Update existing account
    const { data: updatedData, error } = await supabase
      .from('receivable_accounts')
      .update(newAccountData)
      .eq('report_id', data.reportId)
      .select();
    
    if (error) throw error;
    return updatedData;
  }
  
  // Insert new account
  const { data: insertedData, error } = await supabase
    .from('receivable_accounts')
    .insert(newAccountData)
    .select();
  
  if (error) throw error;
  return insertedData;
};

/**
 * Deletes a receivable account for a given report
 */
export const deleteReceivableAccount = async (reportId: string) => {
  const { error } = await supabase
    .from('receivable_accounts')
    .delete()
    .eq('report_id', reportId);
  
  if (error) {
    console.error("Error deleting receivable account:", error);
    return false;
  }
  
  return true;
};

/**
 * Updates a receivable account with new payment details
 */
export const updateReceivableAccount = async (reportId: string, data: ReceivableAccountUpdate) => {
  const updateData: any = {};
  if (data.paymentMethod !== undefined) updateData.payment_method = data.paymentMethod;
  if (data.dueDate !== undefined) updateData.due_date = data.dueDate;
  
  const { error } = await supabase
    .from('receivable_accounts')
    .update(updateData)
    .eq('report_id', reportId);
  
  if (error) {
    console.error("Error updating receivable account:", error);
    return false;
  }
  
  return true;
};
