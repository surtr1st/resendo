import 'mosha-vue-toastify/dist/style.css';
import { createToast } from 'mosha-vue-toastify';

export function useToast() {
  const TIMEOUT = 3000;
  const onSuccess = (message: string, timeout = TIMEOUT) =>
    createToast(message, {
      position: 'top-right',
      showCloseButton: true,
      type: 'success',
      transition: 'slide',
      toastBackgroundColor: '#03fc9d',
      timeout,
    });

  const onError = (message: string, timeout = TIMEOUT) =>
    createToast(message, {
      position: 'top-right',
      showCloseButton: true,
      type: 'danger',
      transition: 'slide',
      toastBackgroundColor: '#ff5765',
      timeout,
    });

  return {
    onSuccess,
    onError,
  };
}
