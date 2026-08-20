import { useMutation } from '@tanstack/react-query';
import { loginUser } from '../api/loginUser';

export function useLogin() {
  return useMutation({ mutationFn: loginUser })
}