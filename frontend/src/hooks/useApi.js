import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getErrorMessage } from '../utils/helpers';

export const useApi = (queryKey, apiFunction, options = {}) => {
  return useQuery({
    queryKey,
    queryFn: apiFunction,
    ...options,
  });
};

export const useApiMutation = (mutationFunction, options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mutationFunction,
    onError: (error) => {
      console.error('Mutation error:', error);
      if (options.onError) {
        options.onError(error);
      }
    },
    onSuccess: (data, variables, context) => {
      if (options.invalidateQueries) {
        queryClient.invalidateQueries({ queryKey: options.invalidateQueries });
      }
      if (options.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    ...options,
  });
};

