import React from 'react';
import '../../styles/booking-error-modal.css';

export interface BookingErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingErrorModal({ isOpen, onClose }: BookingErrorModalProps) {
  if (!isOpen) return null;

  return (
    <div className="bem-overlay" onClick={onClose}>
      <div
        className="bem-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="bem-title"
      >
        <button className="bem-close" onClick={onClose} aria-label="Cerrar">×</button>
        <div className="bem-icon-wrapper">
          <div className="bem-icon-circle">
            <span className="bem-icon">!</span>
          </div>
        </div>
        <h2 id="bem-title" className="bem-title">Ocurrió un problema con tu reserva</h2>
        <p className="bem-subtitle">
          No pudimos procesar la operación en este momento. Por favor intenta de nuevo más tarde
          o verifica tus datos.
        </p>
        <button
          type="button"
          className="bem-primary"
          onClick={onClose}
        >
          Entendido
        </button>
      </div>
    </div>
  );
}
