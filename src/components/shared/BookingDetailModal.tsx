import React, { useEffect } from 'react';
import type { BookingDetailData } from '../../context/booking';

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

  return (
    <div 
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px'
      }}
    >
      {/* Modal centrado */}
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '900px',
          maxHeight: '90vh',
          overflow: 'hidden',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
          position: 'relative'
        }}
      >
        {/* Header */}
        <div 
          style={{
            background: 'linear-gradient(135deg, #294954 0%, #3d6b7a 100%)',
            padding: '24px 32px',
            borderBottom: '1px solid #e5e7eb'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: 'white', margin: '0 0 8px 0' }}>
                Detalle de Reserva
              </h2>
              {bookingDetail && (
                <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', margin: 0 }}>
                  ID: #{bookingDetail.booking_id}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                cursor: 'pointer',
                fontSize: '32px',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
            >
              ×
            </button>
          </div>
        </div>

        {/* Content scrollable */}
        <div style={{ maxHeight: 'calc(90vh - 120px)', overflowY: 'auto', padding: '32px' }}>
          {loading && (
            <div style={{ textAlign: 'center', padding: '64px 0' }}>
              <div style={{
                width: '64px',
                height: '64px',
                border: '4px solid #68B2C9',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 24px'
              }}></div>
              <p style={{ color: '#6b7280', fontSize: '18px', fontWeight: '500' }}>Cargando información...</p>
            </div>
          )}

          {error && (
            <div style={{
              backgroundColor: '#fef2f2',
              borderLeft: '4px solid #ef4444',
              borderRadius: '8px',
              padding: '24px',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '28px', marginRight: '12px' }}>⚠️</span>
                <div>
                  <h4 style={{ color: '#991b1b', fontWeight: '600', marginBottom: '4px' }}>Error</h4>
                  <p style={{ color: '#dc2626', margin: 0 }}>{error}</p>
                </div>
              </div>
            </div>
          )}

          {!loading && !error && bookingDetail && (
            <div>
              {/* Materia y Status */}
              <div style={{
                background: 'linear-gradient(to right, #FAF9F5, white)',
                padding: '24px',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                marginBottom: '24px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#294954', margin: '0 0 8px 0' }}>
                      {bookingDetail.materia}
                    </h3>
                    <p style={{ color: '#6b7280', margin: 0 }}>
                      {bookingDetail.modality === 'In-person' ? '📍 Presencial' : '💻 Virtual'}
                    </p>
                  </div>
                  <span style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: '600',
                    backgroundColor: getStatusColor(bookingDetail.status),
                    color: 'white'
                  }}>
                    {getStatusLabel(bookingDetail.status)}
                  </span>
                </div>
              </div>

              {/* Horario */}
              <div style={{
                backgroundColor: 'white',
                padding: '24px',
                borderRadius: '12px',
                border: '2px solid rgba(104, 178, 201, 0.2)',
                marginBottom: '24px'
              }}>
                <h4 style={{ fontSize: '18px', fontWeight: 'bold', color: '#294954', marginBottom: '16px' }}>
                  📅 Horario de Clase
                </h4>
                <div style={{ marginBottom: '12px', padding: '12px', backgroundColor: '#f0fdf4', borderRadius: '8px' }}>
                  <span style={{ color: '#059669', fontWeight: '600' }}>Inicio: </span>
                  <span style={{ color: '#374151' }}>{formatDateTime(bookingDetail.start_time)}</span>
                </div>
                <div style={{ padding: '12px', backgroundColor: '#fef2f2', borderRadius: '8px' }}>
                  <span style={{ color: '#dc2626', fontWeight: '600' }}>Fin: </span>
                  <span style={{ color: '#374151' }}>{formatDateTime(bookingDetail.end_time)}</span>
                </div>
              </div>

              {/* Participantes */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                {/* Profesor */}
                <div style={{
                  background: 'linear-gradient(to bottom right, #eff6ff, white)',
                  padding: '24px',
                  borderRadius: '12px',
                  border: '1px solid #bfdbfe'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      backgroundColor: '#3b82f6',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px'
                    }}>
                      👨‍🏫
                    </div>
                    <h4 style={{ fontWeight: 'bold', color: '#294954', margin: 0 }}>Profesor</h4>
                  </div>
                  <p style={{ color: '#1f2937', fontWeight: '500', marginBottom: '12px' }}>
                    {bookingDetail.teacher.first_name} {bookingDetail.teacher.last_name}
                  </p>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    backgroundColor: bookingDetail.confirmation_teacher ? '#d1fae5' : '#fef3c7',
                    color: bookingDetail.confirmation_teacher ? '#065f46' : '#92400e'
                  }}>
                    {bookingDetail.confirmation_teacher ? '✅ Confirmado' : '⏳ Pendiente'}
                  </span>
                </div>

                {/* Estudiante */}
                <div style={{
                  background: 'linear-gradient(to bottom right, #faf5ff, white)',
                  padding: '24px',
                  borderRadius: '12px',
                  border: '1px solid #e9d5ff'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      backgroundColor: '#a855f7',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px'
                    }}>
                      👨‍🎓
                    </div>
                    <h4 style={{ fontWeight: 'bold', color: '#294954', margin: 0 }}>Estudiante</h4>
                  </div>
                  <p style={{ color: '#1f2937', fontWeight: '500', marginBottom: '12px' }}>
                    {bookingDetail.student.first_name} {bookingDetail.student.last_name}
                  </p>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    backgroundColor: bookingDetail.confirmation_student ? '#d1fae5' : '#fef3c7',
                    color: bookingDetail.confirmation_student ? '#065f46' : '#92400e'
                  }}>
                    {bookingDetail.confirmation_student ? '✅ Confirmado' : '⏳ Pendiente'}
                  </span>
                </div>
              </div>

              {/* Link */}
              {bookingDetail.class_link && (
                <div style={{
                  background: 'linear-gradient(to right, rgba(104, 178, 201, 0.1), white)',
                  padding: '24px',
                  borderRadius: '12px',
                  border: '1px solid rgba(104, 178, 201, 0.3)',
                  marginBottom: '16px'
                }}>
                  <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: '#294954', marginBottom: '12px' }}>
                    🔗 Link de Clase
                  </h4>
                  <a 
                    href={bookingDetail.class_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: '#68B2C9',
                      fontWeight: '500',
                      textDecoration: 'underline',
                      wordBreak: 'break-all'
                    }}
                  >
                    {bookingDetail.class_link}
                  </a>
                </div>
              )}

              {/* Total */}
              <div style={{
                background: 'linear-gradient(to right, #f0fdf4, white)',
                padding: '24px',
                borderRadius: '12px',
                border: '2px solid #86efac',
                marginBottom: '24px'
              }}>
                <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: '#294954', marginBottom: '12px' }}>
                  💰 Total Pagado
                </h4>
                <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#059669', margin: 0 }}>
                  ${bookingDetail.total_paid.toFixed(2)} <span style={{ fontSize: '18px', color: '#6b7280' }}>MXN</span>
                </p>
              </div>

              {/* Footer */}
              <div style={{
                textAlign: 'center',
                fontSize: '14px',
                color: '#6b7280',
                paddingTop: '24px',
                borderTop: '1px solid #e5e7eb'
              }}>
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

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
