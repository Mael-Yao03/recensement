import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { memberService, Member, CreateMemberPayload, MemberStats } from '../services';
import { useMemberFormStore } from '../stores';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { useState } from 'react';

// Clés de query pour le cache
export const memberQueryKeys = {
  all: ['members'] as const,
  lists: () => [...memberQueryKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...memberQueryKeys.lists(), filters] as const,
  details: () => [...memberQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...memberQueryKeys.details(), id] as const,
  bySlug: (slug: string) => [...memberQueryKeys.all, 'slug', slug] as const,
  stats: () => [...memberQueryKeys.all, 'stats'] as const,
};

/**
 * Hook pour récupérer la liste de tous les membres
 */
export function useMembers() {
  return useQuery({
    queryKey: memberQueryKeys.lists(),
    queryFn: async () => {
      const response = await memberService.getAll();
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook pour récupérer un membre par son ID
 */
export function useMember(id: string) {
  return useQuery({
    queryKey: memberQueryKeys.detail(id),
    queryFn: async () => {
      const response = await memberService.getById(id);
      return response.data;
    },
    enabled: !!id,
  });
}

/**
 * Hook pour récupérer un membre par son slug
 */
export function useMemberBySlug(slug: string) {
  return useQuery({
    queryKey: memberQueryKeys.bySlug(slug),
    queryFn: async () => {
      const response = await memberService.getBySlug(slug);
      return response.data;
    },
    enabled: !!slug,
  });
}

/**
 * Hook pour récupérer les statistiques des membres
 */
export function useMemberStats() {
  return useQuery({
    queryKey: memberQueryKeys.stats(),
    queryFn: async () => {
      const response = await memberService.getStats();
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook pour créer un nouveau membre
 * Utilise le store Zustand pour la gestion de l'état du formulaire
 */
export function useCreateMember() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { 
    setIsSubmitting, 
    setIsSubmitted, 
    setError, 
    setCreatedMemberId,
    setCreatedMemberReference,
    resetForm,
    getFormDataForSubmission 
  } = useMemberFormStore();

  return useMutation({
    mutationFn: async (data?: CreateMemberPayload) => {
      // Si pas de données passées, utiliser celles du store
      const payload = data || getFormDataForSubmission() as unknown as CreateMemberPayload;
      const response = await memberService.create(payload);
      return response.data;
    },
    onMutate: () => {
      setIsSubmitting(true);
      setError(null);
    },
    onSuccess: (data) => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setCreatedMemberId(data.id);
      setCreatedMemberReference(data.reference || null);
      
      // Invalider le cache des membres
      queryClient.invalidateQueries({ queryKey: memberQueryKeys.all });
      
      // Afficher un message de succès
      message.success('Enregistrement réussi !');
      
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
 * Hook pour mettre à jour un membre
 */
export function useUpdateMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateMemberPayload> }) => {
      const response = await memberService.update(id, data);
      return response.data;
    },
    onSuccess: (data) => {
      // Mettre à jour le cache
      queryClient.setQueryData(memberQueryKeys.detail(data.id), data);
      queryClient.invalidateQueries({ queryKey: memberQueryKeys.lists() });
      
      message.success('Membre mis à jour avec succès !');
    },
    onError: (error: Error) => {
      message.error(`Erreur: ${error.message}`);
    },
  });
}

/**
 * Hook pour supprimer un membre
 */
export function useDeleteMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await memberService.delete(id);
      return id;
    },
    onSuccess: (id) => {
      // Supprimer du cache
      queryClient.removeQueries({ queryKey: memberQueryKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: memberQueryKeys.lists() });
      
      message.success('Membre supprimé avec succès !');
    },
    onError: (error: Error) => {
      message.error(`Erreur: ${error.message}`);
    },
  });
}

/**
 * Hook pour vérifier l'identité d'un membre par référence et téléphone
 */
export function useVerifyMember() {
  const [verifiedMember, setVerifiedMember] = useState<Member | null>(null);

  const mutation = useMutation({
    mutationFn: async ({ reference, telephone }: { reference: string; telephone: string }) => {
      const response = await memberService.verify(reference, telephone);
      return response.data;
    },
    onSuccess: (data) => {
      setVerifiedMember(data);
      message.success('Identité vérifiée avec succès !');
    },
    onError: (error: any) => {
      setVerifiedMember(null);
      const errorMessage = error?.response?.data?.message || 'Référence ou numéro de téléphone incorrect.';
      message.error(errorMessage);
    },
  });

  return {
    ...mutation,
    verifiedMember,
    resetVerification: () => setVerifiedMember(null),
  };
}

/**
 * Hook combiné pour le formulaire de membre
 * Combine le store Zustand avec les mutations React Query
 */
export function useMemberForm() {
  const store = useMemberFormStore();
  const createMutation = useCreateMember();

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

export default useMemberForm;
