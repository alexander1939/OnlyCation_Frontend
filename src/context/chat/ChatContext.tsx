import React, { createContext, useContext, useState, useCallback } from 'react';
import { useChatApi } from '../../hooks/chat/useChatApi';
import type { ChatSummary, Message } from '../../hooks/chat/useChatApi';

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
  deleteMessage: (messageId: number) => Promise<boolean>;
  getUnreadCount: () => number;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    createChat: createChatApi,
    getMyChats,
    getChatMessages,
    sendMessage: sendMessageApi,
    deleteMessage: deleteMessageApi
  } = useChatApi();
  const [chats, setChats] = useState<ChatSummary[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Obtener todos los chats del usuario
  const fetchChats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getMyChats();
      if (response.success && response.data) {
        setChats(response.data);
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      console.error('Error al cargar los chats:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar los chats');
    } finally {
      setLoading(false);
    }
  }, [getMyChats]);

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
  }, [getChatMessages]);

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
        return true;
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      console.error('Error al eliminar el mensaje:', err);
      setError(err instanceof Error ? err.message : 'Error al eliminar el mensaje');
      return false;
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

