import React, { useEffect } from 'react';
import type { BookingDetailData } from '../../context/booking';
import '../../styles/booking-modal.css';

type BookingDetailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  bookingDetail: BookingDetailData | null;
  loading: boolean;
  error: string | null;
};

export default function BookingDetailModal({ isOpen, onClose, bookingDetail, loading, error }: BookingDetailModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const formatDateTime = (dateTimeStr: string) => {
    const date = new Date(dateTimeStr);
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const dayName = days[date.getDay()];
    const time = date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true });
    const dateStr = date.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });
    return `${dayName}, ${dateStr} - ${time}`;
  };

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      'approved': 'Aprobada',
      'pending': 'Pendiente',
      'cancelled': 'Cancelada',
      'completed': 'Completada'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      'approved': '#0f9d68',
      'pending': '#f59e0b',
      'cancelled': '#ef4444',
      'completed': '#6b7280'
    };
    return colorMap[status] || '#6b7280';
  };

  const canReschedule = (startTime: string): boolean => {
    const now = new Date();
    const classStart = new Date(startTime);
    const diffInMinutes = (classStart.getTime() - now.getTime()) / (1000 * 60);
    return diffInMinutes > 30;
  };

  const handleReschedule = () => {
    // TODO: Implementar lógica de reagendamiento
    alert('Funcionalidad de reagendar en desarrollo');
  };

  return (
    <div className="booking-modal-overlay" onClick={onClose}>
      <div className="booking-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="booking-modal-header">
          <div>
            <h2 className="booking-modal-title">Detalle de Reserva</h2>
          </div>
          <button className="booking-modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        {/* Content */}
        <div className="booking-modal-content">
          {loading && (
            <div className="booking-modal-loading">
              <div className="booking-modal-spinner"></div>
              <p className="booking-modal-loading-text">Cargando información</p>
            </div>
          )}

          {error && (
            <div className="booking-modal-error">
              <span className="booking-modal-error-icon">⚠️</span>
              <div>
                <h4 className="booking-modal-error-title">Error</h4>
                <p className="booking-modal-error-message">{error}</p>
              </div>
            </div>
          )}

          {!loading && !error && bookingDetail && (
            <div>
              {/* Materia y Status */}
              <div className="booking-detail-materia booking-modal-section">
                <div>
                  <h3>{bookingDetail.materia}</h3>
                  <p>
                    {bookingDetail.modality === 'In-person' ? '📍 Presencial' : '💻 Virtual'}
                  </p>
                </div>
                <span 
                  className="booking-detail-status"
                  style={{ backgroundColor: getStatusColor(bookingDetail.status) }}
                >
                  {getStatusLabel(bookingDetail.status)}
                </span>
              </div>

              {/* Horario */}
              <div className="booking-detail-horario booking-modal-section">
                <h4>📅 Horario de Clase</h4>
                <div className="booking-detail-time booking-detail-time-start">
                  <span className="booking-detail-time-label">Inicio: </span>
                  <span className="booking-detail-time-value">{formatDateTime(bookingDetail.start_time)}</span>
                </div>
                <div className="booking-detail-time booking-detail-time-end">
                  <span className="booking-detail-time-label">Fin: </span>
                  <span className="booking-detail-time-value">{formatDateTime(bookingDetail.end_time)}</span>
                </div>
              </div>

              {/* Participantes */}
              <div className="booking-detail-participants booking-modal-section">
                {/* Profesor */}
                <div className="booking-detail-participant booking-detail-teacher">
                  <div className="booking-detail-participant-header">
                    <div className="booking-detail-participant-avatar">
                      <img src="/mascota-maestro.png" alt="Profesor" className="booking-detail-avatar-img" />
                    </div>
                    <h4 className="booking-detail-participant-title">Profesor</h4>
                  </div>
                  <p className="booking-detail-participant-name">
                    {bookingDetail.teacher.first_name} {bookingDetail.teacher.last_name}
                  </p>
                  <span className={`booking-detail-confirmation ${bookingDetail.confirmation_teacher ? 'booking-detail-confirmation-confirmed' : 'booking-detail-confirmation-pending'}`}>
                    {bookingDetail.confirmation_teacher ? '✅ Confirmado' : '⏳ Pendiente'}
                  </span>
                </div>

                {/* Estudiante */}
                <div className="booking-detail-participant booking-detail-student">
                  <div className="booking-detail-participant-header">
                    <div className="booking-detail-participant-avatar">
                      <img src="/mascota-estudiante.png" alt="Estudiante" className="booking-detail-avatar-img" />
                    </div>
                    <h4 className="booking-detail-participant-title">Estudiante</h4>
                  </div>
                  <p className="booking-detail-participant-name">
                    {bookingDetail.student.first_name} {bookingDetail.student.last_name}
                  </p>
                  <span className={`booking-detail-confirmation ${bookingDetail.confirmation_student ? 'booking-detail-confirmation-confirmed' : 'booking-detail-confirmation-pending'}`}>
                    {bookingDetail.confirmation_student ? '✅ Confirmado' : '⏳ Pendiente'}
                  </span>
                </div>
              </div>

              {/* Link */}
              {bookingDetail.class_link && (
                <div className="booking-detail-link booking-modal-section">
                  <h4>🔗 Link de Clase</h4>
                  <a 
                    href={bookingDetail.class_link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {bookingDetail.class_link}
                  </a>
                </div>
              )}

              {/* Total */}
              <div className="booking-detail-payment booking-modal-section">
                <h4>💰 Total Pagado</h4>
                <p className="booking-detail-payment-amount">
                  ${bookingDetail.total_paid.toFixed(2)} <span className="booking-detail-payment-currency">MXN</span>
                </p>
              </div>

              {/* Botón de Reagendar - Solo si falta más de 30 min */}
              {canReschedule(bookingDetail.start_time) && bookingDetail.status === 'approved' && (
                <div className="booking-detail-reschedule booking-modal-section">
                  <div className="booking-reschedule-content">
                    <div className="booking-reschedule-info">
                      <span className="booking-reschedule-icon">🔄</span>
                      <div>
                        <h4 className="booking-reschedule-title">¿Necesitas cambiar la fecha?</h4>
                        <p className="booking-reschedule-description">Puedes reagendar hasta 30 minutos antes del inicio</p>
                      </div>
                    </div>
                    <button className="booking-reschedule-btn" onClick={handleReschedule}>
                      Reagendar Clase
                    </button>
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="booking-modal-footer">
                📆 Reserva creada el {new Date(bookingDetail.created_at).toLocaleDateString('es-ES', { 
                  day: '2-digit', 
                  month: 'long', 
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
