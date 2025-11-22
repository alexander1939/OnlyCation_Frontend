import React, { useEffect, useState, useRef } from "react";
import Header from "../ui/Header";
import Footer from "../ui/Footer";

interface ChatLayoutProps {
  fullScreen?: boolean;
  backgroundColor?: string;
}

const Chat: React.FC<ChatLayoutProps> = ({
  fullScreen = false,
  backgroundColor = "#FFFFFF",
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState<number | null>(null);

  useEffect(() => {
    const updateIsMobile = () => {
      if (typeof window === "undefined") return;
      const mobile = window.innerWidth <= 900;
      setIsMobile(mobile);

      if (!mobile && activeConversationId === null) {
        setActiveConversationId(4);
      }
    };

    updateIsMobile();
    if (typeof window !== "undefined") {
      window.addEventListener("resize", updateIsMobile);
      return () => window.removeEventListener("resize", updateIsMobile);
    }
  }, [activeConversationId]);

  const CardWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div
      style={{
        backgroundColor,
        borderRadius: "0.75rem", // un poco más cuadrado
        padding: "1rem",         // menos padding para que el contenido se vea más grande
        boxShadow: "0 8px 20px rgba(41,73,84,0.12)",
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        fontFamily:
          "'Roboto', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Helvetica, Arial, 'Apple Color Emoji', 'Segoe UI Emoji'",
      }}
    >
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

  const conversations = [
    {
      id: 1,
      initials: "JG",
      name: "Javier Gomez",
      lastMessage: "Perfecto, nos vemos entonces.",
      unread: 0,
      active: false,
    },
    {
      id: 2,
      initials: "LF",
      name: "Laura Fernández",
      lastMessage: "He subido la tarea de la semana 3.",
      unread: 0,
      active: false,
    },
    {
      id: 3,
      initials: "CR",
      name: "Carlos Rodríguez",
      lastMessage: "¿Podrías revisar mi última entrega?",
      unread: 0,
      active: false,
    },
    {
      id: 4,
      initials: "AG",
      name: "Ana García",
      lastMessage: "Hola, ¿podemos revisar el horario...",
      unread: 1,
      active: true,
    },
  ];

  const initialMessages = [
    {
      id: 1,
      author: "Ana Garcia",
      sender: "other" as const,
      time: "10:31 AM",
      text: "Hola, ¿podemos revisar el horario de la próxima semana?",
    },
    {
      id: 2,
      author: "Tú",
      sender: "me" as const,
      time: "10:31 AM",
      text: "Claro, Ana. Lo revisamos ahora mismo.",
    },
    {
      id: 3,
      author: "Ana Garcia",
      sender: "other" as const,
      time: "10:32 AM",
      text: "Genial. Tengo una duda sobre la clase del miércoles. ¿Podríamos moverla al jueves?",
    },
  ];

  const inputRef = useRef<HTMLInputElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const [chatMessages, setChatMessages] = useState(initialMessages);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [chatMessages, activeConversationId]);

  const handleSendMessage = () => {
    const raw = inputRef.current?.value ?? "";
    const trimmed = raw.trim();
    if (!trimmed) return;

    const nextId = chatMessages.length > 0 ? chatMessages[chatMessages.length - 1].id + 1 : 1;
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const userMessage = {
      id: nextId,
      author: "Tú",
      sender: "me" as const,
      time,
      text: trimmed,
    };

    const autoReply = {
      id: nextId + 1,
      author: "Ana Garcia",
      sender: "other" as const,
      time,
      text: "Hola, ¿cómo está?",
    };

    setChatMessages((prev) => [...prev, userMessage, autoReply]);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const showOnlyListOnMobile = isMobile && activeConversationId === null;
  const showOnlyChatOnMobile = isMobile && activeConversationId !== null;

  const ChatContent = (
    <div
      className="chat-layout-wrapper"
      style={{ display: "flex", flex: 1, minHeight: 0 }}
    >
      {/* Columna izquierda: lista de conversaciones */}
      {!showOnlyChatOnMobile && (
        <div
          style={{
            width: isMobile ? "100%" : 290,
            borderRight: isMobile ? "none" : "1px solid rgba(41,73,84,0.12)",
            background: "#FFFFFF",
            display: "flex",
            flexDirection: "column",
            // en móvil llenamos la pantalla, en escritorio ocupamos solo el alto disponible del contenedor
            height: isMobile ? "100vh" : "100%",
          }}
        >
        <div
          style={{
            padding: "1rem 1.2rem 0.75rem",
            borderBottom: "1px solid rgba(41,73,84,0.08)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 14,
            color: "#294954",
            fontWeight: 600,
          }}
        >
          <span>Conversaciones Activas</span>
        </div>

        <div style={{ padding: "0.75rem 0.9rem 0.4rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "0.4rem 0.55rem",
              background: "#FAF9F5",
              borderRadius: 999,
            }}
          >
            <span
              style={{
                fontSize: 13,
                color: "#294954",
                flex: 1,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Buscar chats...
            </span>
          </div>
        </div>

        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "0 0.4rem 0.6rem 0.4rem",
          }}
        >
          {conversations.map((conv) => {
            const isActive = activeConversationId === conv.id;
            return (
              <div
                key={conv.id}
                onClick={() => setActiveConversationId(conv.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "0.55rem 0.65rem",
                  margin: "0.15rem 0.25rem",
                  borderRadius: 12,
                  background: isActive ? "#294954" : "transparent",
                  color: isActive ? "#FAF9F5" : "#294954",
                  cursor: "pointer",
                }}
              >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 999,
                  background: isActive ? "#8ED4BE" : "#FAF9F5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 10,
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                {conv.initials}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {conv.name}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: isActive ? "#FFDE97" : "#64748B",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {conv.lastMessage}
                </div>
              </div>
              {conv.unread > 0 && (
                <div
                  style={{
                    minWidth: 22,
                    height: 22,
                    borderRadius: 999,
                    background: "#FFDE97",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    color: "#294954",
                    fontWeight: 600,
                  }}
                >
                  {conv.unread}
                </div>
              )}
            </div>
          );
          })}
        </div>

      </div>
      )}

      {/* Panel derecho: conversación */}
      {!showOnlyListOnMobile && (
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            background: "#FAF9F5",
            // en móvil pantalla completa, en escritorio solo el alto disponible del contenedor
            height: isMobile ? "100vh" : "100%",
          }}
        >
        {/* Encabezado */}
        <div
          style={{
            padding: "0.9rem 1.3rem",
            borderBottom: "1px solid rgba(41,73,84,0.08)",
            background: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {isMobile && (
              <button
                type="button"
                onClick={() => setActiveConversationId(null)}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  marginRight: 6,
                  fontSize: 20,
                }}
              >
                ←
              </button>
            )}
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 999,
                background: "#294954",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FAF9F5",
                fontWeight: 700,
                fontSize: 15,
              }}
            >
              AG
            </div>
            <div>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: "#294954",
                }}
              >
                Ana Garcia
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "#8ED4BE",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: 999,
                    background: "#8ED4BE",
                  }}
                />
                Online
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              color: "#64748B",
            }}
          >
            <span style={{ fontSize: 22, lineHeight: 1 }}>···</span>
          </div>
        </div>

        {/* Mensajes */}
        <div
          ref={messagesContainerRef}
          style={{
            flex: 1,
            padding: "1.2rem 1.0rem 0.9rem",
            overflowY: "auto",      // scroll solo en la conversación
            maxHeight:  "420px",     // altura máxima del área de mensajes
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {chatMessages.map((msg) => {
            const isMe = msg.sender === "me";
            return (
              <div key={msg.id} style={{ display: "flex", flexDirection: "column" }}>
                {!isMe && (
                  <div
                    style={{
                      fontSize: 11,
                      color: "#94A3B8",
                      marginBottom: 4,
                    }}
                  >
                    {msg.author}
                  </div>
                )}
                <div
                  style={{
                    display: "flex",
                    justifyContent: isMe ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "70%",
                      background: isMe ? "#8ED4BE" : "#FFFFFF",
                      color: isMe ? "#294954" : "#294954",
                      borderRadius: 18,
                      padding: "0.55rem 0.9rem",
                      boxShadow: isMe
                        ? "0 2px 6px rgba(0,0,0,0.12)"
                        : "0 1px 3px rgba(15,23,42,0.12)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 13,
                        lineHeight: 1.45,
                      }}
                    >
                      {msg.text}
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: "#94A3B8",
                    marginTop: 3,
                    alignSelf: isMe ? "flex-end" : "flex-start",
                  }}
                >
                  {msg.time} {isMe ? "Tú" : ""}
                </div>
              </div>
            );
          })}
        </div>

        {/* Input de mensaje */}
        <div
          style={{
            padding: "0.8rem 1.0rem 1.0rem",
            borderTop: "1px solid rgba(41,73,84,0.08)",
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
              style={{
                border: "none",
                outline: "none",
                width: 36,
                height: 36,
                borderRadius: 999,
                background: "#8ED4BE",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0 4px 10px rgba(56,189,248,0.45)",
              }}
            >
              <span
                style={{
                  borderLeft: "10px solid #ffffff",
                  borderTop: "6px solid transparent",
                  borderBottom: "6px solid transparent",
                  marginLeft: 3,
                }}
              />
            </button>
          </div>
        </div>
      </div>
      )}

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
        minHeight: "100vh",   // permite que la página crezca y se pueda scrollear hasta el footer
        background: "#FAF9F5",
      }}
    >
      <Header />

      <div
        style={{
          flex: 1,
          display: "flex",
          // espacio justo debajo del header y un pequeño espacio antes del footer
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
