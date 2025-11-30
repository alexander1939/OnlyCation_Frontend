import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../ui/Header';
import Footer from '../ui/Footer';
import type { NextClass } from '../../context/booking';
import '../../styles/docente-general.css';
import BookingDetailModal from './BookingDetailModal';
import '../../styles/booking-view.css';
import LoadingOverlay from './LoadingOverlay';

type AllBookingsViewProps = {
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
  onSearch: (params: { status?: string; date_from?: string; min_price?: number }) => void;
  pageTitle?: string;
  showViewAllButton?: boolean;
};

export default function AllBookingsView({ 
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
  onSearch,
  pageTitle,
  showViewAllButton
}: AllBookingsViewProps) {
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [minPriceFilter, setMinPriceFilter] = useState<string>('');

  const handleSearch = () => {
    const searchParams: { status?: string; date_from?: string; min_price?: number } = {};
    
    if (statusFilter && statusFilter !== 'all') {
      searchParams.status = statusFilter;
    }
    
    if (dateFilter) {
      // Convertir fecha a formato ISO con hora
      searchParams.date_from = `${dateFilter}T00:00:00`;
    }
    
    if (minPriceFilter) {
      searchParams.min_price = parseFloat(minPriceFilter);
    }
    
    onSearch(searchParams);
  };

  const handleClearFilters = () => {
    setStatusFilter('');
    setDateFilter('');
    setMinPriceFilter('');
    onSearch({});
  };

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
          <div className="clases-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h2 className="clases-title">{pageTitle || 'Mis Reservas'}</h2>
              {classes.length > 0 && (
                <span className="text-sm text-gray-600">({classes.length})</span>
              )}
            </div>
          </div>

          {/* Filtros */}
          <div className="filters-container" style={{
            display: 'flex',
            gap: '16px',
            marginBottom: '24px',
            padding: '20px',
            backgroundColor: '#f9fafb',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            flexWrap: 'wrap'
          }}>
            <div style={{ flex: '1', minWidth: '200px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                Estado
              </label>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  backgroundColor: 'white',
                  cursor: 'pointer'
                }}
              >
                <option value="">Todos</option>
                <option value="approved">Aprobada</option>
                <option value="pending">Pendiente</option>
                <option value="cancelled">Cancelada</option>
                <option value="completed">Completada</option>
              </select>
            </div>

            <div style={{ flex: '1', minWidth: '200px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                Fecha
              </label>
              <input 
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  backgroundColor: 'white'
                }}
              />
            </div>

            <div style={{ flex: '1', minWidth: '200px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                Precio mínimo
              </label>
              <input 
                type="number"
                placeholder="$0.00"
                value={minPriceFilter}
                onChange={(e) => setMinPriceFilter(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  backgroundColor: 'white'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
              <button
                onClick={handleSearch}
                style={{
                  padding: '10px 24px',
                  backgroundColor: '#8ED4BE',
                  color: '#294954',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#7BC4AE'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#8ED4BE'}
              >
                🔍 Buscar
              </button>

              {(statusFilter || dateFilter || minPriceFilter) && (
                <button
                  onClick={handleClearFilters}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
                >
                  Limpiar
                </button>
              )}
            </div>
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
              <p className="text-gray-500 text-lg">No se encontraron reservas con los filtros seleccionados</p>
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
      <LoadingOverlay
        open={Boolean(loading || detailLoading)}
        message="Preparando tu experiencia..."
        logoSrc="/logo.png"
        gifSrc="/icons8-rhombus-loader-96.gif"
      />
      
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
