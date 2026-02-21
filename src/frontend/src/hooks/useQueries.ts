import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { Question, Attempt } from '../backend';

export function useGetAllQuestions() {
  const { actor, isFetching } = useActor();

  return useQuery<Question[]>({
    queryKey: ['questions'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllQuestions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitAnswers() {
  const { actor } = useActor();
  const { loginStatus } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ answers }: { answers: bigint[] }) => {
      if (!actor) throw new Error('Actor not initialized');
      if (loginStatus !== 'success') throw new Error('User not authenticated');
      return actor.submitAnswers(answers);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myAttempts'] });
      queryClient.invalidateQueries({ queryKey: ['allAttempts'] });
    },
  });
}

export function useMyAttempts() {
  const { actor, isFetching } = useActor();
  const { loginStatus } = useInternetIdentity();

  return useQuery<Attempt[]>({
    queryKey: ['myAttempts'],
    queryFn: async () => {
      if (!actor) return [];
      const result = await actor.getMyAttempts();
      return result || [];
    },
    enabled: !!actor && !isFetching && loginStatus === 'success',
  });
}

export function useGetAllAttempts() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['allAttempts'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllAttempts();
    },
    enabled: !!actor && !isFetching,
  });
}
