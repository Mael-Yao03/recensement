import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { childService, Child, CreateChildPayload, ChildStats } from '../services';
import { useChildFormStore } from '../stores';
import { useMemberFormStore } from '../stores';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { useState } from 'react';

// Clés de query pour le cache
export const childQueryKeys = {
  all: ['children'] as const,
  lists: () => [...childQueryKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...childQueryKeys.lists(), filters] as const,
  details: () => [...childQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...childQueryKeys.details(), id] as const,
  bySlug: (slug: string) => [...childQueryKeys.all, 'slug', slug] as const,
  stats: () => [...childQueryKeys.all, 'stats'] as const,
};

/**
 * Hook pour récupérer la liste de tous les enfants
 */
export function useChildren() {
  return useQuery({
    queryKey: childQueryKeys.lists(),
    queryFn: async () => {
      const response = await childService.getAll();
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook pour récupérer un enfant par son ID
 */
export function useChild(id: string) {
  return useQuery({
    queryKey: childQueryKeys.detail(id),
    queryFn: async () => {
      const response = await childService.getById(id);
      return response.data;
    },
    enabled: !!id,
  });
}

/**
 * Hook pour récupérer un enfant par son slug
 */
export function useChildBySlug(slug: string) {
  return useQuery({
    queryKey: childQueryKeys.bySlug(slug),
    queryFn: async () => {
      const response = await childService.getBySlug(slug);
      return response.data;
    },
    enabled: !!slug,
  });
}

/**
 * Hook pour récupérer les statistiques des enfants
 */
export function useChildStats() {
  return useQuery({
    queryKey: childQueryKeys.stats(),
    queryFn: async () => {
      const response = await childService.getStats();
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook pour créer un nouvel enfant
 * Utilise le store Zustand pour la gestion de l'état du formulaire
 */
export function useCreateChild() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { 
    setIsSubmitting, 
    setError, 
    markAsSubmitted,
    getFormDataForSubmission 
  } = useChildFormStore();

  return useMutation({
    mutationFn: async (data?: CreateChildPayload) => {
      // Si pas de données passées, utiliser celles du store
      const payload = data || getFormDataForSubmission() as unknown as CreateChildPayload;
      const response = await childService.create(payload);
      return response.data;
    },
    onMutate: () => {
      setIsSubmitting(true);
      setError(null);
    },
    onSuccess: (data) => {
      // Extraire l'URL de la photo depuis la réponse
      const photoUrl = data.images?.length > 0 
        ? data.images.find((img: any) => img.imageType === 'photo_identite')?.filePath || null 
        : null;
      
      // Snapshot les données, reset le form, marquer comme soumis
      markAsSubmitted(data.id, data.reference || null, photoUrl);
      
      // Nettoyer la soumission de l'autre store pour éviter les conflits
      useMemberFormStore.getState().clearSubmission();
      
      // Invalider le cache des enfants
      queryClient.invalidateQueries({ queryKey: childQueryKeys.all });
      
      // Afficher un message de succès
      message.success('Enregistrement de l\'enfant réussi !');
      
      // Rediriger vers la page de remerciement
      navigate('/thank-you');
    },
    onError: (error: Error) => {
      setIsSubmitting(false);
      setError(error.message);
      message.error('Erreur lors de l\'enregistrement. Veuillez réessayer.');
    },
  });
}

/**
 * Hook pour mettre à jour un enfant
 */
export function useUpdateChild() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateChildPayload> }) => {
      const response = await childService.update(id, data);
      return response.data;
    },
    onSuccess: (data) => {
      // Mettre à jour le cache
      queryClient.setQueryData(childQueryKeys.detail(data.id), data);
      queryClient.invalidateQueries({ queryKey: childQueryKeys.lists() });
      
      message.success('Enfant mis à jour avec succès !');
    },
    onError: (error: Error) => {
      message.error(`Erreur: ${error.message}`);
    },
  });
}

/**
 * Hook pour supprimer un enfant
 */
export function useDeleteChild() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await childService.delete(id);
      return id;
    },
    onSuccess: (id) => {
      // Supprimer du cache
      queryClient.removeQueries({ queryKey: childQueryKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: childQueryKeys.lists() });
      
      message.success('Enfant supprimé avec succès !');
    },
    onError: (error: Error) => {
      message.error(`Erreur: ${error.message}`);
    },
  });
}

/**
 * Hook pour vérifier l'identité d'un enfant par référence et contact parental
 */
export function useVerifyChild() {
  const [verifiedChild, setVerifiedChild] = useState<Child | null>(null);

  const mutation = useMutation({
    mutationFn: async ({ reference, contactParents }: { reference: string; contactParents: string }) => {
      const response = await childService.verify(reference, contactParents);
      return response.data;
    },
    onSuccess: (data) => {
      setVerifiedChild(data);
      message.success('Identité vérifiée avec succès !');
    },
    onError: (error: any) => {
      setVerifiedChild(null);
      const errorMessage = error?.response?.data?.message || 'Référence ou contact parental incorrect.';
      message.error(errorMessage);
    },
  });

  return {
    ...mutation,
    verifiedChild,
    resetVerification: () => setVerifiedChild(null),
  };
}

/**
 * Hook combiné pour le formulaire d'enfant
 * Combine le store Zustand avec les mutations React Query
 */
export function useChildForm() {
  const store = useChildFormStore();
  const createMutation = useCreateChild();

  return {
    // État du store
    formData: store.formData,
    currentStep: store.currentStep,
    isSubmitting: store.isSubmitting,
    isSubmitted: store.isSubmitted,
    error: store.error,
    
    // Actions du store
    setFormData: store.setFormData,
    setCurrentStep: store.setCurrentStep,
    nextStep: store.nextStep,
    prevStep: store.prevStep,
    resetForm: store.resetForm,
    
    // Mutation
    submitForm: createMutation.mutate,
    submitFormAsync: createMutation.mutateAsync,
    
    // État de la mutation
    isPending: createMutation.isPending,
    isSuccess: createMutation.isSuccess,
    isError: createMutation.isError,
  };
}

export default useChildForm;
