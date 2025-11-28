import React, { useState, useRef, useEffect } from "react";
import { useAuthContext } from "../../context/auth";
import { useChatContext } from "../../context/chat";
import Header from "../ui/Header";
import Footer from "../ui/Footer";

// --- Local Hooks & Components ---

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 900);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
};

const CardWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="bg-white rounded-2xl shadow-sm overflow-hidden w-full max-w-7xl mx-auto">
    {children}
  </div>
);

const FullscreenWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "#FAF9F5",
      display: "flex",
      alignItems: "stretch",
      justifyContent: "stretch",
      boxSizing: "border-box",
      fontFamily:
        "'Roboto', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Helvetica, Arial, 'Apple Color Emoji', 'Segoe UI Emoji'",
    }}
  >
    {children}
  </div>
);

// Helper para obtener iniciales
const getInitials = (name: string): string => {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return parts[0].substring(0, 2).toUpperCase();
};

// --- Main Component ---

interface ChatLayoutProps {
  fullScreen?: boolean;
}

const Chat: React.FC<ChatLayoutProps> = ({ fullScreen = false }) => {
  const { user } = useAuthContext();
  const {
    chats,
    messages,
    selectedChatId,
    loading,
    loadingMessages,
    sendingMessage,
    fetchChats,
    selectChat,
    sendMessage,
    deleteMessage
  } = useChatContext();

  const isMobile = useIsMobile();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const hasFetchedChats = useRef(false);
  const [hoveredMessageId, setHoveredMessageId] = useState<number | null>(null);

  // Cargar chats al montar (solo una vez)
  useEffect(() => {
    if (user && !hasFetchedChats.current) {
      hasFetchedChats.current = true;
      fetchChats();
    }
  }, [user]); // Solo depende de user, no de fetchChats

  // Scroll al final cuando llegan mensajes nuevos
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Manejar envío de mensaje
  const handleSendMessage = async () => {
    const raw = inputRef.current?.value ?? "";
    const trimmed = raw.trim();
    if (!trimmed || !selectedChatId) return;

    const success = await sendMessage(trimmed);
    if (success && inputRef.current) {
      inputRef.current.value = "";
    }
  };

  // Manejar eliminación de mensaje
  const handleDeleteMessage = async (messageId: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este mensaje?')) {
      await deleteMessage(messageId);
    }
  };

  // Helper para obtener nombre del participante
  const getParticipantName = (chat: any) => {
    // El backend envía participant.full_name con el nombre del otro usuario
    if (chat.participant?.full_name) return chat.participant.full_name;

    // Fallback si el backend no envía participant
    if (user?.role === 'student' && chat.teacher_id) {
      return `Profesor ${chat.teacher_id}`;
    }

    if (user?.role === 'teacher' && chat.student_id) {
      return `Estudiante ${chat.student_id}`;
    }

    return "Usuario";
  };

  // Filtrar chats por búsqueda
  const filteredChats = chats.filter(chat => {
    const participantName = getParticipantName(chat);
    return participantName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Obtener el chat seleccionado
  const selectedChat = chats.find(c => (c.chat_id || c.id) === selectedChatId);

  // Contenido del chat
  const ChatContent = (
    <div
      className="chat-layout-wrapper"
      style={{ display: "flex", flex: 1, minHeight: 0, height: isMobile ? "100vh" : "600px" }}
    >
      {/* Lista de conversaciones (izquierda) */}
      <div
        style={{
          width: isMobile ? "100%" : 320,
          borderRight: isMobile ? "none" : "1px solid #E2E8F0",
          display: "flex",
          flexDirection: "column",
          background: "#FFFFFF",
        }}
      >
        {/* Header de conversaciones */}
        <div style={{ padding: "1.2rem 1rem", borderBottom: "1px solid #E2E8F0" }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#294954", marginBottom: "0.8rem" }}>
            Conversaciones Activas
          </h2>
          <input
            type="text"
            placeholder="Buscar chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "0.5rem 0.75rem",
              border: "1px solid #E2E8F0",
              borderRadius: 8,
              fontSize: 13,
              outline: "none",
            }}
          />
        </div>

        {/* Lista de chats */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {loading ? (
            <div style={{ padding: "2rem", textAlign: "center", color: "#94A3B8" }}>
              Cargando chats...
            </div>
          ) : filteredChats.length === 0 ? (
            <div style={{ padding: "2rem", textAlign: "center", color: "#94A3B8" }}>
              No hay conversaciones
            </div>
          ) : (
            filteredChats.map((chat) => {
              const chatId = chat.chat_id || chat.id;
              const isSelected = chatId === selectedChatId;
              const participantName = getParticipantName(chat);
              const initials = getInitials(participantName);
              const lastMessage = chat.last_message?.content || "Sin mensajes";
              // Solo mostrar badge si NO está seleccionado y hay mensajes sin leer
              const hasUnread = !isSelected && (chat.unread_count || 0) > 0;

              return (
                <div
                  key={chatId}
                  onClick={() => {
                    if (chatId) {
                      selectChat(chatId);
                    }
                  }}
                  style={{
                    padding: "0.9rem 1rem",
                    borderBottom: "1px solid #F1F5F9",
                    cursor: "pointer",
                    background: isSelected ? "#294954" : "transparent",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.background = "#F8FAFC";
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.background = "transparent";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    {/* Avatar */}
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: "50%",
                        background: isSelected ? "#8ED4BE" : "#E2E8F0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 14,
                        fontWeight: 600,
                        color: isSelected ? "#FFFFFF" : "#64748B",
                        flexShrink: 0,
                      }}
                    >
                      {chat.participant?.avatar_url ? (
                        <img
                          src={chat.participant.avatar_url}
                          alt={participantName}
                          style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
                        />
                      ) : (
                        initials
                      )}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 600,
                            color: isSelected ? "#FFFFFF" : "#294954",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {participantName}
                        </div>
                        {hasUnread && (
                          <div
                            style={{
                              background: "#F59E0B",
                              color: "#FFFFFF",
                              fontSize: 11,
                              fontWeight: 700,
                              borderRadius: 999,
                              padding: "2px 6px",
                              minWidth: 18,
                              textAlign: "center",
                            }}
                          >
                            {chat.unread_count}
                          </div>
                        )}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: isSelected ? "#E2E8F0" : "#64748B",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {lastMessage}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Panel de mensajes (derecha) */}
      <div
        style={{
          flex: 1,
          display: isMobile && !selectedChatId ? "none" : "flex",
          flexDirection: "column",
          background: "#FAF9F5",
        }}
      >
        {!selectedChatId ? (
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#94A3B8",
              fontSize: 14,
            }}
          >
            Selecciona una conversación para comenzar
          </div>
        ) : (
          <>
            {/* Header del chat */}
            <div
              style={{
                padding: "0.9rem 1.3rem",
                borderBottom: "1px solid #E2E8F0",
                background: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: "#8ED4BE",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#FFFFFF",
                }}
              >
                {selectedChat?.participant?.avatar_url ? (
                  <img
                    src={selectedChat.participant.avatar_url}
                    alt={getParticipantName(selectedChat)}
                    style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
                  />
                ) : (
                  getInitials(getParticipantName(selectedChat))
                )}
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#294954" }}>
                {getParticipantName(selectedChat)}
              </div>
            </div>

            {/* Área de mensajes */}
            <div
              ref={messagesContainerRef}
              style={{
                flex: 1,
                padding: "1.2rem 1.0rem 0.9rem",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              {loadingMessages ? (
                <div className="text-center text-gray-500 text-sm mt-4">
                  Cargando mensajes...
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center text-gray-500 text-sm mt-4">
                  No hay mensajes. ¡Inicia la conversación!
                </div>
              ) : (
                messages.map((msg) => {
                  const userId = user?.id ? Number(user.id) : null;
                  const senderId = Number(msg.sender_id);
                  const isMe = userId !== null && senderId === userId;
                  const senderName = isMe ? "Tú" : getParticipantName(selectedChat);

                  return (
                    <div
                      key={msg.id}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: isMe ? "flex-end" : "flex-start",
                        marginBottom: "0.75rem",
                      }}
                      onMouseEnter={() => setHoveredMessageId(msg.id)}
                      onMouseLeave={() => setHoveredMessageId(null)}
                    >
                      {/* Nombre del remitente */}
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: isMe ? "#8ED4BE" : "#64748B",
                          marginBottom: 4,
                          paddingLeft: isMe ? 0 : "0.5rem",
                          paddingRight: isMe ? "0.5rem" : 0,
                        }}
                      >
                        {senderName}
                      </div>

                      {/* Burbuja del mensaje con botón de eliminar */}
                      <div style={{ position: "relative", maxWidth: "70%" }}>
                        <div
                          style={{
                            background: isMe ? "#8ED4BE" : "#FFFFFF",
                            color: "#294954",
                            borderRadius: isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                            padding: "0.65rem 1rem",
                            boxShadow: isMe
                              ? "0 2px 6px rgba(142, 212, 190, 0.3)"
                              : "0 1px 4px rgba(15,23,42,0.15)",
                          }}
                        >
                          <div
                            style={{
                              fontSize: 14,
                              lineHeight: 1.5,
                              wordBreak: "break-word",
                            }}
                          >
                            {msg.content}
                          </div>
                        </div>

                        {/* Botón de eliminar (solo para mensajes propios) */}
                        {isMe && hoveredMessageId === msg.id && (
                          <button
                            onClick={() => handleDeleteMessage(msg.id)}
                            style={{
                              position: "absolute",
                              top: -8,
                              right: -8,
                              width: 24,
                              height: 24,
                              borderRadius: "50%",
                              background: "#EF4444",
                              color: "#FFFFFF",
                              border: "2px solid #FFFFFF",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 12,
                              fontWeight: 600,
                              boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                            }}
                            title="Eliminar mensaje"
                          >
                            ×
                          </button>
                        )}
                      </div>

                      {/* Timestamp */}
                      <div
                        style={{
                          fontSize: 10,
                          color: "#94A3B8",
                          marginTop: 4,
                          paddingLeft: isMe ? 0 : "0.5rem",
                          paddingRight: isMe ? "0.5rem" : 0,
                        }}
                      >
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Input de mensaje */}
            <div
              style={{
                padding: "0.8rem 1.0rem 1.0rem",
                borderTop: "1px solid #E2E8F0",
                background: "#FFFFFF",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  background: "#F8FAFC",
                  borderRadius: 999,
                  padding: "0.4rem 0.5rem 0.4rem 1rem",
                  border: "1px solid #E2E8F0",
                }}
              >
                <input
                  placeholder="Escribe un mensaje..."
                  ref={inputRef}
                  disabled={sendingMessage}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  style={{
                    flex: 1,
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    fontSize: 13,
                    color: "#294954",
                  }}
                />
                <button
                  type="button"
                  onClick={handleSendMessage}
                  disabled={sendingMessage}
                  style={{
                    border: "none",
                    outline: "none",
                    width: 36,
                    height: 36,
                    borderRadius: 999,
                    background: sendingMessage ? "#E2E8F0" : "#8ED4BE",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: sendingMessage ? "not-allowed" : "pointer",
                    boxShadow: sendingMessage ? "none" : "0 4px 10px rgba(142,212,190,0.45)",
                  }}
                >
                  <span
                    style={{
                      borderLeft: `10px solid ${sendingMessage ? "#94A3B8" : "#ffffff"}`,
                      borderTop: "6px solid transparent",
                      borderBottom: "6px solid transparent",
                      marginLeft: 3,
                    }}
                  />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .chat-layout-wrapper {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );

  if (fullScreen) {
    return <FullscreenWrapper>{ChatContent}</FullscreenWrapper>;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background: "#FAF9F5",
      }}
    >
      <Header />

      <div
        style={{
          flex: 1,
          display: "flex",
          padding: "6rem 0 1rem",
          boxSizing: "border-box",
          width: "100%",
        }}
      >
        <CardWrapper>{ChatContent}</CardWrapper>
      </div>

      <Footer />
    </div>
  );
};

export default Chat;
