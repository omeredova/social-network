import { useMutation } from '@tanstack/react-query';
import { registerUser } from '../api/registerUser';

export function useRegister() {
  return useMutation({ mutationFn: registerUser })
}