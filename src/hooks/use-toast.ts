
import {
  toast as sonnerToast,
  ToastOptions as SonnerToastOptions,
} from "sonner";

type ToastProps = SonnerToastOptions & {
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
};

const useToast = () => {
  const toast = ({ title, description, action, ...props }: ToastProps) => {
    sonnerToast(title, {
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
  };
};

export { useToast, sonnerToast as toast };
