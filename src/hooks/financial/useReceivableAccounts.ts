
import { useFetchReceivableAccounts } from './receivable/useFetchReceivableAccounts';
import { useCreateReceivableAccount } from './receivable/useCreateReceivableAccount';
import { useDeleteReceivableAccount } from './receivable/useDeleteReceivableAccount';
import { useUpdateReceivableAccount } from './receivable/useUpdateReceivableAccount';
import { ReceivableAccountData } from './receivable/types';

export { type ReceivableAccountData } from './receivable/types';

export function useReceivableAccounts() {
  const { fetchReceivableAccounts } = useFetchReceivableAccounts();
  const { createReceivableAccount } = useCreateReceivableAccount();
  const { deleteReceivableAccount } = useDeleteReceivableAccount();
  const { updateReceivableAccount } = useUpdateReceivableAccount();

  return {
    fetchReceivableAccounts,
    createReceivableAccount,
    deleteReceivableAccount,
    updateReceivableAccount
  };
}
