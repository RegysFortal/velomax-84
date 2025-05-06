
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useDeleteUser = () => {
  const [loading, setLoading] = useState(false);

  const deleteUser = async (userId: string) => {
    try {
      setLoading(true);
      console.log("Excluindo usuário do Supabase:", userId);

      // Excluir usuário (as permissões serão excluídas automaticamente por causa do CASCADE)
      const { error } = await supabase
        .from('users' as any)
        .delete()
        .eq('id', userId);

      if (error) throw error;
      
      toast.success("Usuário excluído com sucesso");
      return true;
    } catch (err) {
      console.error("Erro ao excluir usuário:", err);
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido ao excluir usuário";
      toast.error("Erro ao excluir usuário", {
        description: errorMessage
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteUser, loading };
};
