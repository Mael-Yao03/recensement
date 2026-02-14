import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

// Configuration de base de l'API
const API_BASE_URL = import.meta.env.VITE_ENV == 'production' ? import.meta.env.VITE_API_URL : 'http://localhost:3000';

// Création de l'instance axios
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 secondes (pour les uploads d'images)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur de requêtes
api.interceptors.request.use(
  (config) => {
    // Ajouter le token d'authentification si présent
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur de réponses
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    // Gestion centralisée des erreurs
    if (error.response) {
      // Erreur retournée par le serveur
      const status = error.response.status;
      
      switch (status) {
        case 400:
          console.error('Erreur de validation:', error.response.data);
          break;
        case 401:
          // Token invalide ou expiré - déconnexion
          console.error('Non autorisé - déconnexion');
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth-storage');
          // Ne pas rediriger automatiquement si on est déjà sur la page login ou sur une page publique
          if (!window.location.pathname.includes('/admin/login') && !window.location.pathname.includes('/update-member')) {
            window.location.href = '/admin/login';
          }
          break;
        case 403:
          console.error('Accès refusé');
          break;
        case 404:
          console.error('Ressource non trouvée');
          break;
        case 500:
          console.error('Erreur serveur');
          break;
        default:
          console.error('Erreur:', error.response.data);
      }
    } else if (error.request) {
      // Pas de réponse du serveur
      console.error('Le serveur ne répond pas');
    } else {
      // Erreur de configuration
      console.error('Erreur de configuration:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Types génériques pour les réponses API
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  count?: number;
  error?: string;
}

// Fonction utilitaire pour les requêtes GET
export async function apiGet<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
  const response = await api.get<ApiResponse<T>>(url, config);
  return response.data;
}

// Fonction utilitaire pour les requêtes POST
export async function apiPost<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
  const response = await api.post<ApiResponse<T>>(url, data, config);
  return response.data;
}

// Fonction utilitaire pour les requêtes PUT
export async function apiPut<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
  const response = await api.put<ApiResponse<T>>(url, data, config);
  return response.data;
}

// Fonction utilitaire pour les requêtes DELETE
export async function apiDelete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
  const response = await api.delete<ApiResponse<T>>(url, config);
  return response.data;
}

export default api;
