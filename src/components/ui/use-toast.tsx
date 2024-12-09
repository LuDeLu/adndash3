// src/components/ui/use-toast.tsx
import { useState } from 'react';

export const useToast = () => {
  const [toasts, setToasts] = useState<string[]>([]);

  const toast = (message: string) => {
    setToasts([...toasts, message]);
    setTimeout(() => removeToast(message), 3000); // Elimina el toast después de 3 segundos
  };

  const removeToast = (message: string) => {
    setToasts((currentToasts) => currentToasts.filter((t) => t !== message));
  };

  return { toasts, toast };
};
