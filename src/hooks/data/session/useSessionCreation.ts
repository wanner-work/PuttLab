import type { Session } from '@/data/entities/session'
import createSession from '@/methods/data/create/createSession'
import { useMutation } from '@tanstack/react-query'

export default function useSessionMutation(onSuccess?: (session: Session) => void) {
  return useMutation({
    mutationFn: createSession,
    onSuccess: (data) => {
      onSuccess?.(data)
    }
  })
}
