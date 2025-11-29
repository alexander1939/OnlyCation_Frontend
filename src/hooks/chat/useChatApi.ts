import { useCallback, useMemo } from 'react';
import axios from 'axios';
import { useAuthToken } from '../auth/useAuthToken';

const API_URL = import.meta.env.VITE_API_URL;

export interface Message {
  id: number;
  chat_id: number;
  sender_id: number;
  content: string;
  is_read: boolean;
  is_deleted: boolean;
  is_encrypted: boolean;
  encryption_version?: string;
  created_at: string;
  updated_at: string;
}

export interface ChatSummary {
  id?: number;
  chat_id?: number;
  student_id?: number;
  teacher_id?: number;
  participant?: {
    id: number;
    full_name: string;
    avatar_url?: string;
  };
  last_message?: {
    content: string;
    created_at: string;
    read: boolean;
  };
  unread_count: number;
  created_at: string;
}

export interface ChatPreview {
  chat_id: number;
  participant: { id: number; full_name: string; avatar_url?: string };
  last_message_preview: string | null;
  last_message_at: string | null;
  unread_count: number;
}

export const useChatApi = () => {
  const { getAccessToken } = useAuthToken();

  const client = useMemo(() => {
    return axios.create({
      baseURL: API_URL,
      headers: { 'Content-Type': 'application/json' },
    });
  }, []);

  // Crear un nuevo chat
  const createChat = useCallback(async (teacherId: number) => {
    try {
      const token = getAccessToken();
      if (!token) throw new Error('No hay token de acceso. Inicia sesión nuevamente.');

      const response = await client.post(
        '/chat/chats/create',
        { teacher_id: teacherId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return {
        success: true,
        data: response.data,
        message: 'Chat creado exitosamente'
      };
    } catch (error: any) {
      console.error('Error al crear el chat:', error);
      return {
        success: false,
        message: error.response?.data?.detail || 'Error al crear el chat'
      };
    }
  }, [client, getAccessToken]);

  // Obtener mis chats (completo)
  const getMyChats = useCallback(async () => {
    try {
      const token = getAccessToken();
      if (!token) throw new Error('No hay token de acceso. Inicia sesión nuevamente.');

      const response = await client.get('/chat/chats/my', {
        headers: { Authorization: `Bearer ${token}` }
      });

      return {
        success: true,
        data: response.data.data || [],
        message: 'Chats obtenidos exitosamente'
      };
    } catch (error: any) {
      console.error('Error al obtener los chats:', error);
      return {
        success: false,
        data: [],
        message: 'Error al obtener los chats'
      };
    }
  }, [client, getAccessToken]);

  // Obtener previews ligeros (auto-asegura chats activos)
  const getChatPreviews = useCallback(async () => {
    try {
      const token = getAccessToken();
      if (!token) throw new Error('No hay token de acceso. Inicia sesión nuevamente.');

      const response = await client.get('/chat/chats/previews', {
        headers: { Authorization: `Bearer ${token}` }
      });

      return {
        success: !!response.data?.success,
        data: (response.data?.data || []) as ChatPreview[],
        total: Number(response.data?.total || 0),
        message: response.data?.message || 'OK',
      };
    } catch (error: any) {
      console.error('Error al obtener previews de chats:', error);
      return {
        success: false,
        data: [] as ChatPreview[],
        total: 0,
        message: error.response?.data?.detail || 'Error al obtener previews de chats',
      };
    }
  }, [client, getAccessToken]);

  // Obtener mensajes de un chat específico
  const getChatMessages = useCallback(async (chatId: number) => {
    try {
      const token = getAccessToken();
      if (!token) throw new Error('No hay token de acceso. Inicia sesión nuevamente.');

      console.log('[useChatApi] getChatMessages chatId:', chatId);

      const response = await client.get(`/chat/messages/${chatId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('[useChatApi] getChatMessages response:', response.data);

      return {
        success: true,
        data: response.data.data || [],
        total: response.data.total || 0,
        message: 'Mensajes obtenidos exitosamente'
      };
    } catch (error: any) {
      console.error('[useChatApi] Error al obtener los mensajes:', error);
      console.error('[useChatApi] Error response:', error.response?.data);
      console.error('[useChatApi] Error status:', error.response?.status);
      return {
        success: false,
        data: [],
        total: 0,
        message: error.response?.data?.detail || 'Error al obtener los mensajes'
      };
    }
  }, [client, getAccessToken]);

  // Enviar un mensaje
  const sendMessage = useCallback(async (chatId: number, content: string) => {
    try {
      const token = getAccessToken();
      if (!token) throw new Error('No hay token de acceso. Inicia sesión nuevamente.');

      const response = await client.post(
        '/chat/messages/send',
        { chat_id: chatId, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return {
        success: true,
        data: response.data,
        message: 'Mensaje enviado exitosamente'
      };
    } catch (error: any) {
      console.error('Error al enviar el mensaje:', error);
      return {
        success: false,
        message: error.response?.data?.detail || 'Error al enviar el mensaje'
      };
    }
  }, [client, getAccessToken]);

  // Marcar mensajes como leídos
  const markMessagesAsRead = useCallback(async (messageIds: number[]) => {
    try {
      const token = getAccessToken();
      if (!token) throw new Error('No hay token de acceso. Inicia sesión nuevamente.');

      const response = await client.post(
        '/chat/messages/mark-read',
        { message_ids: messageIds },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return {
        success: true,
        data: response.data,
        message: 'Mensajes marcados como leídos'
      };
    } catch (error: any) {
      console.error('Error al marcar mensajes como leídos:', error);
      return {
        success: false,
        message: error.response?.data?.detail || 'Error al marcar mensajes como leídos'
      };
    }
  }, [client, getAccessToken]);

  // Eliminar un mensaje
  const deleteMessage = useCallback(async (messageId: number) => {
    try {
      const token = getAccessToken();
      if (!token) throw new Error('No hay token de acceso. Inicia sesión nuevamente.');

      const response = await client.delete(
        `/chat/messages/${messageId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return {
        success: true,
        data: response.data,
        message: 'Mensaje eliminado exitosamente'
      };
    } catch (error: any) {
      console.error('Error al eliminar mensaje:', error);
      return {
        success: false,
        message: error.response?.data?.detail || 'Error al eliminar mensaje'
      };
    }
  }, [client, getAccessToken]);

  // Obtener contador de mensajes no leídos
  const getUnreadCount = useCallback(async (chatId: number) => {
    try {
      const token = getAccessToken();
      if (!token) throw new Error('No hay token de acceso. Inicia sesión nuevamente.');

      const response = await client.get(
        `/chat/messages/${chatId}/unread-count`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return {
        success: true,
        data: response.data.data?.unread_count || 0,
        message: 'Contador obtenido exitosamente'
      };
    } catch (error: any) {
      console.error('Error al obtener contador de no leídos:', error);
      return {
        success: false,
        data: 0,
        message: error.response?.data?.detail || 'Error al obtener contador'
      };
    }
  }, [client, getAccessToken]);

  return {
    createChat,
    getMyChats,
    getChatPreviews,
    getChatMessages,
    sendMessage,
    markMessagesAsRead,
    deleteMessage,
    getUnreadCount
  };
};
