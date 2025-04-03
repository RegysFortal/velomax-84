
import { create } from "zustand";

type ToastProps = {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
};

type ToasterStore = {
  toasts: ToastProps[];
  addToast: (toast: ToastProps) => void;
  dismissToast: (toastId: string) => void;
};

export const useToastStore = create<ToasterStore>((set) => ({
  toasts: [],
  addToast: (toast) => set((state) => ({ toasts: [...state.toasts, toast] })),
  dismissToast: (toastId) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== toastId),
    })),
}));

export type { ToastProps };

export const useToast = () => {
  const { toasts, addToast, dismissToast } = useToastStore();

  const toast = ({ title, description, action, ...props }: Omit<ToastProps, 'id'>) => {
    addToast({
      id: crypto.randomUUID(),
      title,
      description,
      action,
      ...props,
    });
  };

  return {
    toast,
    toasts,
    dismiss: dismissToast,
  };
};

export { useToastStore as toast };
