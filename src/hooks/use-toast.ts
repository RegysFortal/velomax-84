
import { Toast as SonnerToast } from "sonner";
import { create } from "zustand";

type ToasterStore = {
  toasts: SonnerToast[];
  addToast: (toast: SonnerToast) => void;
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

export type ToastProps = {
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  variant?: "default" | "destructive";
};

export const useToast = () => {
  const { toasts, addToast, dismissToast } = useToastStore();

  const toast = ({ title, description, action, ...props }: ToastProps) => {
    addToast({
      id: crypto.randomUUID(),
      title,
      description,
      action: action
        ? {
            label: action.label,
            onClick: action.onClick,
          }
        : undefined,
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
