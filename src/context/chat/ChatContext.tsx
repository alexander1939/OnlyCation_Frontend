import React, { createContext, useContext, useState, useCallback } from 'react';
import { useChatApi } from '../../hooks/chat/useChatApi';
import type { ChatSummary, Message } from '../../hooks/chat/useChatApi';
import { useAuthContext } from '../auth';

interface ChatContextType {
  chats: ChatSummary[];
  messages: Message[];
  selectedChatId: number | null;
  loading: boolean;
  loadingMessages: boolean;
  sendingMessage: boolean;
  error: string | null;
  createChat: (teacherId: number) => Promise<{ success: boolean; message: string }>;
  fetchChats: () => Promise<void>;
  selectChat: (chatId: number) => Promise<void>;
  sendMessage: (content: string) => Promise<boolean>;
  deleteMessage: (messageId: number) => Promise<{ success: boolean; message?: string }>;
  getUnreadCount: () => number;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuthContext();
  const {
    createChat: createChatApi,
    getMyChats,
    getChatPreviews,
    getChatMessages,
    sendMessage: sendMessageApi,
    deleteMessage: deleteMessageApi,
    markMessagesAsRead,
  } = useChatApi();
  const [chats, setChats] = useState<ChatSummary[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Obtener chats (previews ligeros, auto-asegura según reservas activas)
  const fetchChats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getChatPreviews();
      if (response.success && response.data) {
        const mapped: ChatSummary[] = response.data.map((p) => ({
          chat_id: p.chat_id,
          participant: p.participant,
          last_message: (p.last_message_preview != null || p.last_message_at != null)
            ? { content: p.last_message_preview ?? '', created_at: p.last_message_at ?? '', read: (p.unread_count || 0) === 0 }
            : undefined,
          unread_count: p.unread_count || 0,
          created_at: p.last_message_at ?? new Date().toISOString(),
        }));
        setChats(mapped);
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      console.error('Error al cargar los chats:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar los chats');
    } finally {
      setLoading(false);
    }
  }, [getChatPreviews]);

  // Seleccionar un chat y cargar sus mensajes
  const selectChat = useCallback(async (chatId: number) => {
    console.log('[ChatContext] selectChat called with chatId:', chatId);
    setSelectedChatId(chatId);
    setLoadingMessages(true);
    setError(null);
    try {
      console.log('[ChatContext] Fetching messages for chat:', chatId);
      const response = await getChatMessages(chatId);
      console.log('[ChatContext] getChatMessages response:', response);

      if (response.success && response.data) {
        console.log('[ChatContext] Messages loaded:', response.data.length, 'messages');
        setMessages(response.data);

        // Marcar como leídos los mensajes no leídos de otros (no marcar los propios)
        const currentUserId = user?.id != null ? Number(user.id) : null;
        const unreadIds = response.data
          .filter((m) => !m.is_read && (currentUserId == null || Number(m.sender_id) !== currentUserId))
          .map((m) => m.id);

        if (unreadIds.length > 0) {
          const markRes = await markMessagesAsRead(unreadIds);
          if (markRes.success) {
            // Actualizar estado local: mensajes y contador de no leídos del chat seleccionado
            setMessages((prev) => prev.map((m) => (unreadIds.includes(m.id) ? { ...m, is_read: true } : m)));
            setChats((prev) => prev.map((c) => {
              const id = c.chat_id || (c as any).id;
              if (id === chatId) {
                return {
                  ...c,
                  unread_count: 0,
                  last_message: c.last_message ? { ...c.last_message, read: true } : c.last_message,
                };
              }
              return c;
            }));
          }
        }
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      console.error('[ChatContext] Error loading messages:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar los mensajes');
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  }, [getChatMessages, markMessagesAsRead, user?.id]);

  // Enviar un mensaje
  const sendMessage = useCallback(async (content: string) => {
    if (!selectedChatId) {
      setError('No hay chat seleccionado');
      return false;
    }

    setSendingMessage(true);
    setError(null);
    try {
      const response = await sendMessageApi(selectedChatId, content);
      if (response.success && response.data) {
        setMessages(prev => [...prev, response.data]);
        // Actualizar la lista de chats para reflejar el último mensaje
        await fetchChats();
        return true;
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      console.error('Error al enviar el mensaje:', err);
      setError(err instanceof Error ? err.message : 'Error al enviar el mensaje');
      return false;
    } finally {
      setSendingMessage(false);
    }
  }, [selectedChatId, sendMessageApi, fetchChats]);

  // Eliminar un mensaje
  const deleteMessage = useCallback(async (messageId: number) => {
    setError(null);
    try {
      const response = await deleteMessageApi(messageId);
      if (response.success) {
        // Remover el mensaje de la lista local
        setMessages(prev => prev.filter(msg => msg.id !== messageId));
        return { success: true, message: response.message };
      } else {
        throw new Error(response.message);
      }
    } catch (err: any) {
      console.error('Error al eliminar el mensaje:', err);
      const msg = err?.message || 'Error al eliminar el mensaje';
      setError(msg);
      return { success: false, message: msg };
    }
  }, [deleteMessageApi]);

  // Crear un nuevo chat
  const createChat = useCallback(async (teacherId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await createChatApi(teacherId);
      if (response.success) {
        // No actualizamos la lista de chats porque está deshabilitada
        return { success: true, message: response.message || 'Chat creado exitosamente' };
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      console.error('Error al crear el chat:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al crear el chat';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [createChatApi]);

  // Contar mensajes no leídos
  const getUnreadCount = useCallback(() => {
    return chats.reduce((total, chat) => total + (chat.unread_count || 0), 0);
  }, [chats]);

  const value = {
    chats,
    messages,
    selectedChatId,
    loading,
    loadingMessages,
    sendingMessage,
    error,
    createChat,
    fetchChats,
    selectChat,
    sendMessage,
    deleteMessage,
    getUnreadCount
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatContext debe usarse dentro de un ChatProvider');
  }
  return context;
};
