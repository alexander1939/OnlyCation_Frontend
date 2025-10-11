import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Handshake } from "lucide-react"; // Usa lucide-react para el ícono

interface WelcomeAlertProps {
  name: string;
}

const WelcomeAlert: React.FC<WelcomeAlertProps> = ({ name }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => setVisible(false);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -40, scale: 0.9 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          style={{
            position: "fixed",
            top: "6.5rem",
            left: 0,
            right: 0,
            margin: "0 auto",
            width: "fit-content",
            backgroundColor: "#294954",
            color: "white",
            padding: "2rem 3rem",
            borderRadius: "1rem",
            boxShadow: "0 6px 20px rgba(0, 0, 0, 0.25)",
            zIndex: 2000,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Círculo del ícono */}
          <div
            style={{
              backgroundColor: "#FFDE97",
              borderRadius: "50%",
              width: "60px",
              height: "60px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "1rem",
            }}
          >
            <Handshake size={32} color="#294646" />
          </div>

          {/* Texto principal */}
          <h2
            style={{
              fontSize: "1.6rem",
              fontWeight: "bold",
              marginBottom: "0.3rem",
            }}
          >
            ¡Bienvenido/a de vuelta!
          </h2>

          {/* Subtexto con nombre */}
          <p
            style={{
              fontSize: "1.2rem",
              color: "#8ED4BE",
              margin: 0,
            }}
          >
            {name}
          </p>

          {/* Botón cerrar */}
          <button
            onClick={handleClose}
            style={{
              position: "absolute",
              top: "0.6rem",
              right: "1rem",
              background: "transparent",
              border: "none",
              color: "white",
              fontSize: "1.4rem",
              cursor: "pointer",
              transition: "transform 0.2s ease, color 0.2s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.color = "#f1c40f";
              e.currentTarget.style.transform = "scale(1.2)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = "white";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            ×
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeAlert;
