import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../ui/Header';
import Footer from '../ui/Footer';
import type { NextClass } from '../../context/booking';
import '../../styles/docente-general.css';
import BookingDetailModal from './BookingDetailModal';
import '../../styles/booking-view.css';
import '../../styles/new-booking-view.css';

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

  // Calcular tiempo restante hasta la clase
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  const calculateTimeRemaining = (startTime: string) => {
    const now = new Date();
    const classStart = new Date(startTime);
    const diff = classStart.getTime() - now.getTime();

    if (diff <= 0) return 'La clase está en curso';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours >= 24) {
      const days = Math.floor(hours / 24);
      return `Empieza en ${days} día${days > 1 ? 's' : ''}`;
    } else if (hours > 0) {
      return `Empieza en ${hours} hora${hours > 1 ? 's' : ''}`;
    } else {
      return `Empieza en ${minutes} minuto${minutes > 1 ? 's' : ''}`;
    }
  };

  useEffect(() => {
    if (classes.length > 0 && classes[0]) {
      setTimeRemaining(calculateTimeRemaining(classes[0].start_time));
      const interval = setInterval(() => {
        setTimeRemaining(calculateTimeRemaining(classes[0].start_time));
      }, 60000); // Actualizar cada minuto
      return () => clearInterval(interval);
    }
  }, [classes]);

  const formatDate = (dateTimeStr: string) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
  };

  const formatTime = (dateTimeStr: string) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const formatTimeRange = (startTimeStr: string, endTimeStr: string) => {
    return `${formatTime(startTimeStr)} - ${formatTime(endTimeStr)}`;
  };

  const getTeacherName = (clase: NextClass) => {
    if (clase.teacher) {
      return `${clase.teacher.first_name} ${clase.teacher.last_name}`;
    }
    return 'Docente';
  };

  const getSubjectIcon = (materia: string) => {
    const lowerMateria = materia.toLowerCase();
    if (lowerMateria.includes('matemática') || lowerMateria.includes('cálculo') || lowerMateria.includes('álgebra')) return '📐';
    if (lowerMateria.includes('física')) return '⚛️';
    if (lowerMateria.includes('química')) return '🧪';
    if (lowerMateria.includes('programación') || lowerMateria.includes('código')) return '💻';
    if (lowerMateria.includes('inglés') || lowerMateria.includes('idioma')) return '🌍';
    if (lowerMateria.includes('historia')) return '📚';
    if (lowerMateria.includes('biología')) return '🧬';
    return '📖';
  };

  // Separar clases por estado
  const approvedClasses = classes.filter(c => c.status === 'approved');
  const nextClass = approvedClasses[0];
  const futureClasses = approvedClasses.slice(1);
  const completedClasses = classes.filter(c => c.status === 'completed');

  // Estados para mostrar más asesorías
  const [showAllFuturas, setShowAllFuturas] = useState(false);
  const [showAllCompletadas, setShowAllCompletadas] = useState(false);

  const MAX_ITEMS = 4;
  const displayedFuturas = showAllFuturas ? futureClasses : futureClasses.slice(0, MAX_ITEMS);
  const displayedCompletadas = showAllCompletadas ? completedClasses : completedClasses.slice(0, MAX_ITEMS);
  const hasMoreFuturas = futureClasses.length > MAX_ITEMS;
  const hasMoreCompletadas = completedClasses.length > MAX_ITEMS;

  const handleJoinClass = (classLink?: string) => {
    if (classLink) {
      window.open(classLink, '_blank');
    } else {
      alert('El enlace de la clase no está disponible aún');
    }
  };

  const handleConfirmAttendance = (bookingId: number) => {
    // TODO: Implementar confirmación de asistencia
    alert(`Confirmar asistencia para reserva ${bookingId}`);
  };

  return (
    <div className="min-h-screen flex flex-col page-container">
      <Header />
      <main className="flex-1 main-spacing">
        <section className="asesorias-container">
          {/* Perfil del usuario */}
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

          <h1 className="asesorias-title">Mis Asesorías</h1>

          {loading && (
            <div className="text-center py-8">
              <p className="text-gray-600">Cargando asesorías...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {!loading && !error && (
            <>
              {/* PRÓXIMA ASESORÍA */}
              <div className="proxima-asesoria-section">
                <div className="proxima-asesoria-label">PRÓXIMA ASESORÍA</div>
                {nextClass ? (
                  <div className="proxima-asesoria-card">
                    <div className="proxima-countdown">{timeRemaining}</div>
                    <h2 className="proxima-materia">{nextClass.materia}</h2>
                    <p className="proxima-profesor">
                      con <span className="proxima-profesor-name">{getTeacherName(nextClass)}</span>
                    </p>
                    <div className="proxima-info-row">
                      <div className="proxima-info-item">
                        <span className="proxima-info-icon">📅</span>
                        <span>{formatDate(nextClass.start_time)}</span>
                      </div>
                      <div className="proxima-info-item">
                        <span className="proxima-info-icon">🕐</span>
                        <span>{formatTimeRange(nextClass.start_time, nextClass.end_time)}</span>
                      </div>
                      <div className="proxima-info-item">
                        <span className="proxima-info-icon">{nextClass.modality === 'In-person' ? '📍' : '🔗'}</span>
                        <span>{nextClass.modality === 'In-person' ? 'Enlace de Zoom' : 'Enlace de Zoom'}</span>
                      </div>
                    </div>
                    <div className="proxima-actions">
                      <button 
                        className="btn-ver-detalles"
                        onClick={() => onCardClick(nextClass.booking_id)}
                      >
                        <span>👁️</span>
                        Ver detalles
                      </button>
                      <button 
                        className="btn-unirse"
                        onClick={() => handleJoinClass(nextClass.class_link)}
                      >
                        <span>📹</span>
                        Unirse a la llamada
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="empty-proxima-state">
                    <div className="empty-proxima-icon">📚</div>
                    <p className="empty-proxima-title">No tienes asesorías próximas</p>
                    <p className="empty-proxima-desc">
                      Para reservar una asesoría, visita nuestro catálogo de docentes y encuentra al profesor ideal para ti.
                    </p>
                    <Link to="/catalog/teachers" className="btn-ir-catalogo">
                      <span>🔍</span>
                      Ir al catálogo de docentes
                    </Link>
                  </div>
                )}
              </div>

              {/* ASESORÍAS FUTURAS */}
              <div className="asesorias-section">
                <h2 className="asesorias-section-title">Asesorías Futuras</h2>
                {futureClasses.length > 0 ? (
                  <>
                    <div className="asesorias-list">
                      {displayedFuturas.map((clase) => (
                        <div 
                          key={clase.booking_id} 
                          className="asesoria-item"
                          onClick={() => onCardClick(clase.booking_id)}
                        >
                          <div className="asesoria-icon">{getSubjectIcon(clase.materia)}</div>
                          <div className="asesoria-content">
                            <div className="asesoria-materia">{clase.materia} - {getTeacherName(clase)}</div>
                            <div className="asesoria-datetime">
                              {formatDate(clase.start_time)}, {formatTimeRange(clase.start_time, clase.end_time)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {hasMoreFuturas && !showAllFuturas && (
                      <div className="ver-mas-link" onClick={() => setShowAllFuturas(true)}>
                        Ver {futureClasses.length - MAX_ITEMS} asesoría{futureClasses.length - MAX_ITEMS > 1 ? 's' : ''} más ↓
                      </div>
                    )}
                    {showAllFuturas && hasMoreFuturas && (
                      <div className="ver-mas-link" onClick={() => setShowAllFuturas(false)}>
                        Ver menos ↑
                      </div>
                    )}
                  </>
                ) : (
                  <div className="empty-futuras-state">
                    <div className="empty-futuras-icon">📅</div>
                    <p className="empty-futuras-title">No tienes más asesorías programadas</p>
                    <p className="empty-futuras-desc">
                      Explora nuestro catálogo de docentes para agendar nuevas asesorías.
                    </p>
                    <Link to="/catalog/teachers" className="btn-ir-catalogo-small">
                      Ver catálogo de docentes
                    </Link>
                  </div>
                )}
              </div>

              {/* CLASES ASISTIDAS */}
              <div className="asesorias-section">
                <h2 className="asesorias-section-title">Clases Asistidas</h2>
                {completedClasses.length > 0 ? (
                  <>
                    <div className="asesorias-list">
                      {displayedCompletadas.map((clase) => {
                        const isConfirmed = user?.role === 'teacher' 
                          ? clase.confirmation_teacher 
                          : clase.confirmation_student;
                        
                        return (
                          <div key={clase.booking_id} className="clase-asistida-item">
                            <div className="clase-asistida-icon">🎓</div>
                            <div className="clase-asistida-content">
                              <div className="clase-asistida-materia">{clase.materia} - {getTeacherName(clase)}</div>
                              <div className="clase-asistida-datetime">
                                {formatDate(clase.start_time)}, {formatTime(clase.start_time)}
                              </div>
                            </div>
                            {isConfirmed ? (
                              <div className="confirmacion-badge confirmada">
                                <span>✅</span>
                                Confirmar Asistencia
                              </div>
                            ) : (
                              <button 
                                className="btn-confirmar-asistencia"
                                onClick={() => handleConfirmAttendance(clase.booking_id)}
                              >
                                <span>✓</span>
                                Confirmar Asistencia
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    {hasMoreCompletadas && !showAllCompletadas && (
                      <div className="ver-mas-link" onClick={() => setShowAllCompletadas(true)}>
                        Ver {completedClasses.length - MAX_ITEMS} clase{completedClasses.length - MAX_ITEMS > 1 ? 's' : ''} más ↓
                      </div>
                    )}
                    {showAllCompletadas && hasMoreCompletadas && (
                      <div className="ver-mas-link" onClick={() => setShowAllCompletadas(false)}>
                        Ver menos ↑
                      </div>
                    )}
                    <div className="confirmacion-nota">
                      ℹ️ Tienes un periodo de 2 horas máximo después de la clase para confirmar tu asistencia, 
                      de no ser así podrías recibir una penalización.
                    </div>
                  </>
                ) : (
                  <div className="empty-confirmacion-state">
                    <div className="empty-confirmacion-icon">📋</div>
                    <p className="empty-confirmacion-title">Todavía no hay reservaciones por confirmar</p>
                    <p className="empty-confirmacion-desc">
                      Recuerda que tienes un máximo de 2 horas después de finalizar cada asesoría 
                      para confirmar tu asistencia, de lo contrario pueden haber consecuencias.
                    </p>
                  </div>
                )}
              </div>


              {/* Botón Ver todas */}
              {showViewAllButton && (approvedClasses.length > 0 || completedClasses.length > 0) && (
                <div style={{ marginTop: '32px', textAlign: 'center' }}>
                  <Link to={allBookingsPath} className="view-all-btn-header">
                    📋 Ver todas las reservas
                  </Link>
                </div>
              )}
            </>
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