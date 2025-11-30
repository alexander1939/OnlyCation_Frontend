import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "../../styles/loading-overlay.css";

interface LoadingOverlayProps {
  open: boolean;
  onClose?: () => void;
  message?: string;
  logoSrc?: string;
  gifSrc?: string;
}

export default function LoadingOverlay({
  open,
  onClose,
  message = "Cargando...",
  logoSrc = "/logo.png",
  gifSrc = "/icons8-rhombus-loader-96.gif",
}: LoadingOverlayProps) {
  const [isVisible, setIsVisible] = useState(false);
  const prevOverflowRef = useRef<string | null>(null);

  useEffect(() => {
    if (open) {
      prevOverflowRef.current = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      setIsVisible(true);
    }
    return () => {
      if (prevOverflowRef.current !== null) {
        document.body.style.overflow = prevOverflowRef.current;
      } else {
        document.body.style.overflow = "auto";
      }
      setIsVisible(false);
    };
  }, [open]);

  if (!open) return null;

  const overlay = (
    <div
      className={`oc-overlay-backdrop ${isVisible ? 'oc-overlay--visible' : ''}`}
      role="status"
      aria-busy="true"
      aria-modal="true"
      tabIndex={-1}
    >
      {onClose && (
        <button onClick={onClose} className="oc-overlay-close">✕</button>
      )}

      <div className="oc-overlay-content">
        <img src={logoSrc} alt="Logo" className="oc-overlay-logo" />

        <div className="oc-overlay-ring">
          <div className="oc-overlay-circle">
            <img src={gifSrc} alt="Cargando" className="oc-overlay-gif" />
          </div>
        </div>

        <p className="oc-overlay-message">{message}</p>
      </div>
    </div>
  );

  return createPortal(overlay, document.body);
}
