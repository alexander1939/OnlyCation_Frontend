import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../ui/Header';
import Footer from '../ui/Footer';
import type { NextClass } from '../../context/booking';
import '../../styles/docente-general.css';
import BookingDetailModal from './BookingDetailModal';
import '../../styles/booking-view.css';

type BookingViewProps = {
  user: {
    first_name?: string;
    last_name?: string;
    email?: string;
    role?: string;
  } | null;
  loading: boolean;
  error: string | null;
  classes: NextClass[];
  onCardClick: (bookingId: number) => void;
  modalOpen: boolean;
  onModalClose: () => void;
  bookingDetail: any;
  detailLoading: boolean;
  detailError: string | null;
  hasMore: boolean;
  onLoadMore: () => void;
  pageTitle?: string;
  showViewAllButton?: boolean;
};

export default function BookingView({ 
  user, 
  loading, 
  error, 
  classes, 
  onCardClick,
  modalOpen,
  onModalClose,
  bookingDetail,
  detailLoading,
  detailError,
  hasMore,
  onLoadMore,
  pageTitle = "Próximas Clases",
  showViewAllButton = true
}: BookingViewProps) {
  const fullName = user ? `${user.first_name} ${user.last_name}`.trim() : '-';
  const initials = user ? `${user.first_name?.[0] ?? ''}${user.last_name?.[0] ?? ''}`.toUpperCase() || '-' : '-';
  const getRoleLabel = (role?: string) => {
    if (role === 'teacher') return 'Docente';
    if (role === 'student') return 'Estudiante';
    return 'Usuario';
  };

  const roleLabel = getRoleLabel(user?.role);
  const allBookingsPath = user?.role === 'teacher' ? '/teacher/all-bookings' : '/student/all-bookings';

  const formatDateTime = (dateTimeStr: string) => {
    const date = new Date(dateTimeStr);
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const dayName = days[date.getDay()];
    const time = date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true });
    return `${dayName}, ${time}`;
  };

  const formatDateTimeRange = (startTimeStr: string, endTimeStr: string) => {
    const startDate = new Date(startTimeStr);
    const endDate = new Date(endTimeStr);
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    
    const startDay = days[startDate.getDay()];
    const endDay = days[endDate.getDay()];
    
    const startTime = startDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true });
    const endTime = endDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true });
    
    return `${startDay}, ${startTime} - ${endDay}, ${endTime}`;
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
    <div className="min-h-screen flex flex-col page-container">
      <Header />
      <main className="flex-1 main-spacing">
        <section className="docente-container">
          <div className="perfil-row">
            <div className="perfil-avatar">
              <div className="perfil-avatar-initials">{initials}</div>
            </div>
            <div className="perfil-info">
              <h1 className="perfil-nombre">{fullName}</h1>
              <div className="perfil-email">{user?.email || '-'}</div>
              <div className="perfil-rol">{roleLabel}</div>
            </div>
          </div>

          <div className="clases-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h2 className="clases-title">{pageTitle}</h2>
              {classes.length > 0 && (
                <span className="text-sm text-gray-600">({classes.length})</span>
              )}
            </div>
            {!loading && classes.length > 0 && showViewAllButton && (
              <Link to={allBookingsPath} className="view-all-btn-header">
                📋 Ver todas las reservas
              </Link>
            )}
          </div>

          {loading && (
            <div className="text-center py-8">
              <p className="text-gray-600">Cargando clases...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {!loading && !error && classes.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No tienes clases programadas próximamente</p>
            </div>
          )}

          {!loading && classes.length > 0 && (
            <div className="clases-grid">
              {classes.map((clase) => (
                <article 
                  key={clase.booking_id} 
                  className="clase-card transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:scale-105 cursor-pointer"
                  style={{
                    transition: 'all 0.3s ease-in-out'
                  }}
                  onClick={() => onCardClick(clase.booking_id)}
                >
                  <div className="clase-top">
                    <span className="clase-fecha">{formatDateTimeRange(clase.start_time, clase.end_time)}</span>
                    <span 
                      className="px-2 py-1 rounded-full text-xs font-medium"
                      style={{ 
                        backgroundColor: `${getStatusColor(clase.status)}20`,
                        color: getStatusColor(clase.status)
                      }}
                    >
                      {getStatusLabel(clase.status)}
                    </span>
                  </div>
                  <h3 className="clase-titulo">{clase.materia}</h3>
                  <div className="clase-footer">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        {clase.modality === 'In-person' ? '📍 Presencial' : '💻 Virtual'}
                      </span>
                    </div>
                    <span className="flecha" aria-hidden>→</span>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Botón Cargar más */}
          {!loading && classes.length > 0 && hasMore && (
            <div className="load-more-container">
              <button 
                onClick={onLoadMore}
                className="load-more-btn"
              >
                Cargar más clases
              </button>
            </div>
          )}
        </section>
      </main>
      <Footer />
      
      {/* Modal de detalle */}
      <BookingDetailModal
        isOpen={modalOpen}
        onClose={onModalClose}
        bookingDetail={bookingDetail}
        loading={detailLoading}
        error={detailError}
      />
    </div>
  );
}