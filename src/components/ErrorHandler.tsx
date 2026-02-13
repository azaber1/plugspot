import { useEffect } from 'react';
import { useToast } from './ToastContext';

interface ErrorHandlerProps {
  error: Error | null;
  onReset?: () => void;
}

export const ErrorHandler: React.FC<ErrorHandlerProps> = ({ error, onReset }) => {
  const { showToast } = useToast();

  useEffect(() => {
    if (error) {
      console.error('Error:', error);
      showToast(error.message || 'An error occurred. Please try again.', 'error');
      if (onReset) {
        setTimeout(() => onReset(), 3000);
      }
    }
  }, [error, showToast, onReset]);

  return null;
};
