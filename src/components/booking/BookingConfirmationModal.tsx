import React from 'react';
import '../../styles/booking-confirmation-modal.css';

export interface BookingConfirmationItem {
  dateLabel: string;
  timeLabel: string;
}

export interface BookingConfirmationData {
  teacherName: string;
  subject: string;
  items: BookingConfirmationItem[];
}

export interface BookingConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: BookingConfirmationData;
  onGoToMyBookings?: () => void;
}

export default function BookingConfirmationModal({ isOpen, onClose, data, onGoToMyBookings }: BookingConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="bcm-overlay" onClick={onClose}>
      <div className="bcm-container" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="bcm-title">
        <button className="bcm-close" onClick={onClose} aria-label="Cerrar">×</button>
        <div className="bcm-icon-wrapper">
          <div className="bcm-icon-circle">
            <span className="bcm-check">✓</span>
          </div>
        </div>
        <h2 id="bcm-title" className="bcm-title">¡Tu asesoría está confirmada!</h2>
        <p className="bcm-subtitle">Hemos enviado los detalles a tu correo electrónico.</p>

        <div className="bcm-divider" />

        <div className="bcm-details-grid">
          <div className="bcm-row">
            <span className="bcm-label">Docente</span>
            <span className="bcm-value">{data.teacherName}</span>
          </div>
          <div className="bcm-row">
            <span className="bcm-label">Materia</span>
            <span className="bcm-value">{data.subject}</span>
          </div>
        </div>

        <div className="bcm-sessions">
          <div className="bcm-sessions-header">
            <span className="bcm-label">Sesiones reservadas</span>
            <span className="bcm-count">{data.items.length}</span>
          </div>
          <div className="bcm-sessions-list">
            {data.items.map((item, idx) => (
              <div key={`${item.dateLabel}-${item.timeLabel}-${idx}`} className="bcm-session-row">
                <div className="bcm-session-date">{item.dateLabel}</div>
                <div className="bcm-session-time">{item.timeLabel}</div>
              </div>
            ))}
          </div>
        </div>

        <button
          className="bcm-primary"
          type="button"
          onClick={onGoToMyBookings || onClose}
        >
          Ir a Mis Reservas
        </button>
      </div>
    </div>
  );
}
