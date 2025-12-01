import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import Header from '../ui/Header';
import Footer from '../ui/Footer';
import type { NextClass } from '../../context/booking';
import '../../styles/docente-general.css';
import BookingDetailModal from './BookingDetailModal';
import '../../styles/booking-view.css';
import '../../styles/new-booking-view.css';
import { useOptionalTeacherConfirmationsContext, useOptionalStudentConfirmationsContext } from '../../context/confirmations';
import ConfirmAttendanceModal from './ConfirmAttendanceModal';
import type { ConfirmationHistoryItem } from '../../context/confirmations';
import { useNotificationContext } from '../NotificationProvider';
import AssessmentModal from './AssessmentModal';
import { useOptionalStudentAssessmentsContext } from '../../context/assessments/StudentAssessmentsContext';
import LoadingOverlay from './LoadingOverlay';
import { useBookingApi } from '../../hooks/booking/useBookingApi';
import {
  CalendarDays,
  Clock,
  MapPin,
  Link2,
  Eye,
  Video,
  ClipboardList,
  Timer,
  FileText,
  Check,
  GraduationCap,
  CheckCircle,
  Info,
  BookOpen,
  Pi,
  Atom,
  FlaskConical,
  Code,
  Languages,
  Dna,
  ScrollText,
  Globe,
  Sigma,
  Palette,
  Music,
  Brain,
  FileSpreadsheet,
  Cpu,
  Ruler,
  LineChart,
  Search,
} from 'lucide-react';

// Normaliza cadenas de fecha/hora a un formato parseable en todos los navegadores.
// Acepta formatos tipo "YYYY-MM-DD HH:mm:ss" (los convierte a "YYYY-MM-DDTHH:mm:ss").
// Si aún es inválido, intenta con sufijo Z como fallback.
const parseDateTime = (s: string): Date => {
  try {
    if (!s) return new Date(NaN);
    let str = s.trim();
    if (/^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}(:\d{2})?$/.test(str)) {
      str = str.replace(' ', 'T');
    }
    const d = new Date(str);
    if (!isNaN(d.getTime())) return d;
    if (!/[zZ]|[+-]\d{2}:\d{2}$/.test(str)) {
      const d2 = new Date(`${str}Z`);
      if (!isNaN(d2.getTime())) return d2;
    }
    return new Date(str);
  } catch {
    return new Date(NaN);
  }
};

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
      'active': 'Activa',
      'pending': 'Pendiente',
      'cancelled': 'Cancelada',
      'completed': 'Completada'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      'approved': '#0f9d68',
      'active': '#0f9d68',
      'pending': '#f59e0b',
      'cancelled': '#ef4444',
      'completed': '#6b7280'
    };
    return colorMap[status] || '#6b7280';
  };

  // Calcular tiempo restante hasta la clase
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  // Habilitar "Unirse" 15 minutos antes del inicio de la clase
  const [joinEnabled, setJoinEnabled] = useState<boolean>(false);
  const [joinUnlockAt, setJoinUnlockAt] = useState<Date | null>(null);

  const calculateTimeRemaining = (startTime: string) => {
    const now = new Date();
    const classStart = parseDateTime(startTime);
    if (isNaN(classStart.getTime())) return 'Horario por definir';
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
    // Calcular la verdadera próxima asesoría: estados activos o aprobados ordenados por start_time
    const upcoming = [...classes]
      .filter(c => c.status === 'approved' || c.status === 'active')
      .sort((a, b) => parseDateTime(a.start_time).getTime() - parseDateTime(b.start_time).getTime());

    if (upcoming.length > 0) {
      setTimeRemaining(calculateTimeRemaining(upcoming[0].start_time));
      const interval = setInterval(() => {
        setTimeRemaining(calculateTimeRemaining(upcoming[0].start_time));
      }, 60000); // Actualizar cada minuto
      return () => clearInterval(interval);
    } else {
      setTimeRemaining('');
    }
  }, [classes]);

  // Controlar el desbloqueo de "Unirse" 15 minutos antes del inicio
  useEffect(() => {
    const upcoming = [...classes]
      .filter(c => c.status === 'approved' || c.status === 'active')
      .sort((a, b) => parseDateTime(a.start_time).getTime() - parseDateTime(b.start_time).getTime());

    if (upcoming.length === 0) {
      setJoinEnabled(false);
      setJoinUnlockAt(null);
      return;
    }
    const start = parseDateTime(upcoming[0].start_time);
    if (isNaN(start.getTime())) {
      setJoinEnabled(false);
      setJoinUnlockAt(null);
      return;
    }
    const unlock = new Date(start.getTime() - 15 * 60 * 1000);
    setJoinUnlockAt(unlock);

    const update = () => {
      const now = new Date();
      setJoinEnabled(now.getTime() >= unlock.getTime());
    };
    update();
    const id = setInterval(update, 15000); // revisar cada 15s para precisión
    return () => clearInterval(id);
  }, [classes]);

  const formatDate = (dateTimeStr: string) => {
    const date = parseDateTime(dateTimeStr);
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
  };

  const formatTime = (dateTimeStr: string) => {
    const date = parseDateTime(dateTimeStr);
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

  const getSubjectIcon = (materia: string): React.ReactNode => {
    const m = (materia || '').toLowerCase();
    if (m.includes('matem') || m.includes('álgebra') || m.includes('algebra') || m.includes('cálculo') || m.includes('calculo') || m.includes('trigonom')) return <Pi size={18} />;
    if (m.includes('física') || m.includes('fisica')) return <Atom size={18} />;
    if (m.includes('química') || m.includes('quimica')) return <FlaskConical size={18} />;
    if (m.includes('program') || m.includes('código') || m.includes('codigo') || m.includes('inform')) return <Code size={18} />;
    if (m.includes('inglés') || m.includes('ingles') || m.includes('idioma') || m.includes('language') || m.includes('english')) return <Languages size={18} />;
    if (m.includes('historia')) return <ScrollText size={18} />;
    if (m.includes('biolog')) return <Dna size={18} />;
    if (m.includes('literat')) return <BookOpen size={18} />;
    if (m.includes('geograf')) return <Globe size={18} />;
    if (m.includes('econom') || m.includes('finanzas')) return <LineChart size={18} />;
    if (m.includes('estad')) return <Sigma size={18} />;
    if (m.includes('arte') || m.includes('dibu') || m.includes('pint')) return <Palette size={18} />;
    if (m.includes('música') || m.includes('musica')) return <Music size={18} />;
    if (m.includes('filoso')) return <Brain size={18} />;
    if (m.includes('contab') || m.includes('contabilidad')) return <FileSpreadsheet size={18} />;
    if (m.includes('electrónica') || m.includes('electronica')) return <Cpu size={18} />;
    if (m.includes('arquitec') || m.includes('diseño')) return <Ruler size={18} />;
    return <GraduationCap size={18} />;
  };

  // Confirmables ahora (recent) por rol
  const teacherConfCtx = useOptionalTeacherConfirmationsContext();
  const studentConfCtx = useOptionalStudentConfirmationsContext();
  const loadedRecentRef = useRef(false);

  const { showSuccess, showError } = useNotificationContext();

  // Modal confirmación
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedConfirmItem, setSelectedConfirmItem] = useState<ConfirmationHistoryItem | null>(null);
  const [confirmSubmitting, setConfirmSubmitting] = useState(false);
  const [confirmError, setConfirmError] = useState<string | null>(null);

  // Modal evaluación (solo alumno)
  const studentAssessCtx = useOptionalStudentAssessmentsContext();
  const [assessmentOpen, setAssessmentOpen] = useState(false);
  const [assessmentPaymentBookingId, setAssessmentPaymentBookingId] = useState<number | string | null>(null);
  const [assessmentError, setAssessmentError] = useState<string | null>(null);

  useEffect(() => {
    if (loadedRecentRef.current) return;
    if (user?.role === 'teacher' && teacherConfCtx) {
      loadedRecentRef.current = true;
      teacherConfCtx.loadTeacherRecent?.();
    } else if (user?.role === 'student' && studentConfCtx) {
      loadedRecentRef.current = true;
      studentConfCtx.loadStudentRecent?.();
    }
  }, [user?.role, teacherConfCtx, studentConfCtx]);

  const recentLoading = useMemo(() => {
    if (user?.role === 'teacher') return teacherConfCtx?.recentLoading;
    if (user?.role === 'student') return studentConfCtx?.recentLoading;
    return false;
  }, [user?.role, teacherConfCtx?.recentLoading, studentConfCtx?.recentLoading]);

  const recentError = useMemo(() => {
    if (user?.role === 'teacher') return teacherConfCtx?.recentError || null;
    if (user?.role === 'student') return studentConfCtx?.recentError || null;
    return null;
  }, [user?.role, teacherConfCtx?.recentError, studentConfCtx?.recentError]);

  const recentItems = useMemo(() => {
    if (user?.role === 'teacher') return teacherConfCtx?.recentItems || [];
    if (user?.role === 'student') return studentConfCtx?.recentItems || [];
    return [];
  }, [user?.role, teacherConfCtx?.recentItems, studentConfCtx?.recentItems]);

  const formatSecondsLeft = (seconds?: number) => {
    if (!seconds || seconds <= 0) return 'Expirado';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s < 10 ? '0' : ''}${s}s`;
  };

  const openConfirmModal = (item: ConfirmationHistoryItem) => {
    setSelectedConfirmItem(item);
    setConfirmError(null);
    setConfirmModalOpen(true);
  };

  const closeConfirmModal = () => {
    setConfirmModalOpen(false);
    setSelectedConfirmItem(null);
  };

  const handleSubmitConfirm = async ({ description, file }: { description: string; file: File | Blob }) => {
    if (!selectedConfirmItem) return;
    setConfirmSubmitting(true);
    setConfirmError(null);
    try {
      const paymentBookingId = selectedConfirmItem.payment_booking_id;
      let res: { success: boolean; message?: string } | undefined;
      // Revalidar ventana justo antes de enviar si es ALUMNO
      if (user?.role === 'student' && studentConfCtx) {
        const latest = await studentConfCtx.loadStudentRecent();
        const latestItem = latest?.data?.items?.find((i) => i.payment_booking_id === paymentBookingId);
        if (!latestItem || !latestItem.confirmable_now || (latestItem.seconds_left ?? 0) <= 0) {
          const msg = 'El tiempo de confirmación expiró.';
          setConfirmError(msg);
          showError(msg);
          return;
        }
      }
      if (user?.role === 'teacher' && teacherConfCtx) {
        res = await teacherConfCtx.submitTeacherConfirmation(paymentBookingId, {
          confirmation: true,
          description_teacher: description,
          evidence_file: file,
        });
      } else if (user?.role === 'student' && studentConfCtx) {
        res = await studentConfCtx.submitStudentConfirmation(paymentBookingId, {
          confirmation: true,
          description_student: description,
          evidence_file: file,
        });
      } else {
        setConfirmError('No hay contexto de confirmación disponible.');
        return;
      }

      if (res?.success) {
        showSuccess('Confirmación enviada');
        if (user?.role === 'teacher') await teacherConfCtx?.loadTeacherRecent?.();
        else await studentConfCtx?.loadStudentRecent?.();
        // Cerrar modal de confirmación primero
        closeConfirmModal();
        // Si es alumno y no tiene evaluación previa, abrir modal de evaluación
        if (user?.role === 'student') {
          const hasAssessment = selectedConfirmItem.has_assessment_by_student === true;
          if (!hasAssessment) {
            setAssessmentPaymentBookingId(paymentBookingId);
            setAssessmentError(null);
            setAssessmentOpen(true);
          }
        }
      } else {
        const msg = res?.message || 'No se pudo enviar la confirmación';
        setConfirmError(msg);
        showError(msg);
      }
    } catch (e: any) {
      const msg = e?.message || 'Error al enviar la confirmación';
      setConfirmError(msg);
      showError(msg);
    } finally {
      setConfirmSubmitting(false);
    }
  };

  // Separar clases por estado (próximas: 'active' y 'approved')
  const upcomingClasses = [...classes]
    .filter(c => c.status === 'approved' || c.status === 'active')
    .sort((a, b) => parseDateTime(a.start_time).getTime() - parseDateTime(b.start_time).getTime());
  const nextClass = upcomingClasses[0];
  const futureClasses = upcomingClasses.slice(1);
  const completedClasses = classes.filter(c => c.status === 'completed');

  // Estados para mostrar más asesorías
  const [showAllFuturas, setShowAllFuturas] = useState(false);
  const [showAllCompletadas, setShowAllCompletadas] = useState(false);

  const MAX_ITEMS = 4;
  const displayedFuturas = showAllFuturas ? futureClasses : futureClasses.slice(0, MAX_ITEMS);
  const displayedCompletadas = showAllCompletadas ? completedClasses : completedClasses.slice(0, MAX_ITEMS);
  const hasMoreFuturas = futureClasses.length > MAX_ITEMS;
  const hasMoreCompletadas = completedClasses.length > MAX_ITEMS;

  const { getBookingDetail } = useBookingApi();
  const [joinFetching, setJoinFetching] = useState(false);

  const handleJoinClass = async (bookingId: number, fallbackLink?: string) => {
    if (!joinEnabled) {
      const when = joinUnlockAt ? joinUnlockAt.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : null;
      showError(when ? `Disponible a las ${when}` : 'Aún no es hora de unirse.');
      return;
    }
    setJoinFetching(true);
    try {
      // Siempre consultamos el detalle oficial para obtener el link actualizado
      const res = await getBookingDetail(bookingId);
      const link = res?.success ? res.data?.data?.class_link : undefined;
      const finalLink = link || fallbackLink;
      if (!finalLink) {
        showError('El enlace de la clase aún no está disponible. Intenta nuevamente al inicio.');
        return;
      }
      const w = window.open(finalLink, '_blank', 'noopener,noreferrer');
      if (!w) showError('No se pudo abrir la llamada. Habilita ventanas emergentes e intenta nuevamente.');
    } catch (e: any) {
      const msg = e?.message || 'Ocurrió un error al obtener el enlace de la clase.';
      showError(msg);
    } finally {
      setJoinFetching(false);
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
                        <span className="proxima-info-icon"><CalendarDays size={16} /></span>
                        <span>{formatDate(nextClass.start_time)}</span>
                      </div>
                      <div className="proxima-info-item">
                        <span className="proxima-info-icon"><Clock size={16} /></span>
                        <span>{formatTimeRange(nextClass.start_time, nextClass.end_time)}</span>
                      </div>
                      <div className="proxima-info-item">
                        <span className="proxima-info-icon">{nextClass.modality === 'In-person' ? <MapPin size={16} /> : <Link2 size={16} />}</span>
                        <span>{nextClass.modality === 'In-person' ? 'Enlace de Jitsimeet' : 'Enlace de Jitsimeet'}</span>
                      </div>
                    </div>
                    <div className="proxima-actions">
                      <button 
                        className="btn-ver-detalles"
                        onClick={() => onCardClick(nextClass.booking_id)}
                      >
                        <Eye size={16} />
                        Ver detalles
                      </button>
                      <button 
                        className="btn-unirse"
                        disabled={!joinEnabled || joinFetching}
                        title={
                          !joinEnabled && joinUnlockAt
                            ? `Disponible a las ${joinUnlockAt.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`
                            : (joinFetching ? 'Conectando…' : 'Abrir llamada')
                        }
                        onClick={() => { void handleJoinClass(nextClass.booking_id, nextClass.class_link); }}
                      >
                        <Video size={16} />
                        {joinFetching ? 'Entrando…' : 'Unirse a la llamada'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="empty-proxima-state">
                    <div className="empty-proxima-icon"><BookOpen size={24} /></div>
                    <p className="empty-proxima-title">No tienes asesorías próximas</p>
                    <p className="empty-proxima-desc">
                      Para reservar una asesoría, visita nuestro catálogo de docentes y encuentra al profesor ideal para ti.
                    </p>
                    <Link to="/catalog/teachers" className="btn-ir-catalogo">
                      <Search size={16} />
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
                    <div className="empty-futuras-icon"><CalendarDays size={24} /></div>
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

              {/* Botón Ver todas */}
              {showViewAllButton && (upcomingClasses.length > 0 || completedClasses.length > 0) && (
                <div style={{ marginTop: '32px', textAlign: 'center' }}>
                  <Link to={allBookingsPath} className="view-all-btn-header" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <ClipboardList size={16} />
                    Ver todas las reservas
                  </Link>
                </div>
              )}

              {/* CLASES ASISTIDAS */}
              <div className="asesorias-section">
                <h2 className="asesorias-section-title">Clases Asistidas</h2>

                {/* Confirmables ahora (según rol) */}
                {(user?.role === 'teacher' || user?.role === 'student') && (
                  <div className="empty-confirmacion-state" style={{ marginBottom: 16 }}>
                    <div className="empty-confirmacion-icon"><Timer size={18} /></div>
                    <div className="empty-confirmacion-title">Confirmables ahora</div>

                    {recentLoading && (
                      <div className="text-gray-600" style={{ padding: '6px 0' }}>Cargando confirmaciones…</div>
                    )}
                    {recentError && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3 text-red-600">{recentError}</div>
                    )}
                    {!recentLoading && !recentError && recentItems.length === 0 && (
                      <div className="empty-confirmacion-desc">No tienes confirmaciones pendientes en este momento.</div>
                    )}
                    {!recentLoading && !recentError && recentItems.length > 0 && (
                      <div className="asesorias-list" style={{ marginTop: 8 }}>
                        {recentItems.map((it) => (
                          <div key={it.id} className="clase-asistida-item">
                            <div className="clase-asistida-icon"><FileText size={20} /></div>
                            <div className="clase-asistida-content">

                              <div className="clase-asistida-materia">Reserva #{it.payment_booking_id}</div>
                              <div className="clase-asistida-datetime">
                                Finalizó: {formatDate(it.booking_end)}, {formatTime(it.booking_end)} · Tiempo restante: {formatSecondsLeft(it.seconds_left)}
                              </div>
                            </div>
                            {/* Oculto: badge de evaluación del alumno junto a 'Confirmar ahora' */}
                            <button
                              className="btn-confirmar-asistencia"
                              onClick={() => openConfirmModal(it)}
                              disabled={!it.confirmable_now || (it.seconds_left ?? 0) <= 0}
                            >
                              <Check size={16} />
                              Confirmar ahora
                            </button>
                          </div>
                        ))}
                        {/* Link a listado completo de confirmaciones */}
                        <div style={{ textAlign: 'right', marginTop: 8 }}>
                          <Link
                            to={user?.role === 'teacher' ? '/teacher/confirmation' : '/student/confirmation'}
                            className="view-all-btn-header"
                          >
                            <ClipboardList size={16} /> Ver todas las reservas
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {completedClasses.length > 0 ? (
                  <>
                    <div className="asesorias-list">
                      {displayedCompletadas.map((clase) => {
                        const isConfirmed = user?.role === 'teacher' 
                          ? clase.confirmation_teacher 
                          : clase.confirmation_student;
                        
                        return (
                          <div key={clase.booking_id} className="clase-asistida-item">
                            <div className="clase-asistida-icon"><GraduationCap size={20} /></div>
                            <div className="clase-asistida-content">
                              <div className="clase-asistida-materia">{clase.materia} - {getTeacherName(clase)}</div>
                              <div className="clase-asistida-datetime">
                                {formatDate(clase.start_time)}, {formatTime(clase.start_time)}
                              </div>
                            </div>
                            {isConfirmed ? (
                              <div className="confirmacion-badge confirmada">
                                <CheckCircle size={16} />
                                Confirmar Asistencia
                              </div>
                            ) : (
                              <button 
                                className="btn-confirmar-asistencia"
                                onClick={() => handleConfirmAttendance(clase.booking_id)}
                              >
                                <Check size={16} />
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
                    <div className="confirmacion-nota" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Info size={14} />
                      <span>
                        Tienes un periodo de 2 horas máximo después de la clase para confirmar tu asistencia, 
                        de no ser así podrías recibir una penalización.
                      </span>
                    </div>
                  </>
                ) : (
                  <div >

                  </div>
                )}
              </div>


           
            </>
          )}
        </section>
      </main>
      <Footer />
      <LoadingOverlay
        open={Boolean(loading || detailLoading || confirmSubmitting || studentAssessCtx?.createLoading)}
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

      {/* Modal Confirmar asistencia (solo para items de recent) */}
      <ConfirmAttendanceModal
        isOpen={confirmModalOpen}
        onClose={closeConfirmModal}
        role={(user?.role === 'teacher' ? 'teacher' : 'student')}
        item={selectedConfirmItem}
        loading={confirmSubmitting}
        error={confirmError}
        onSubmit={handleSubmitConfirm}
      />

      {/* Modal Evaluación (solo alumno) */}
      <AssessmentModal
        isOpen={assessmentOpen && user?.role === 'student'}
        onClose={() => setAssessmentOpen(false)}
        paymentBookingId={assessmentPaymentBookingId}
        teacherName={undefined}
        loading={!!studentAssessCtx?.createLoading}
        error={assessmentError || studentAssessCtx?.createError || null}
        onSubmit={async ({ qualification, comment }) => {
          try {
            if (!assessmentPaymentBookingId || !studentAssessCtx) return;
            const res = await studentAssessCtx.createAssessment(assessmentPaymentBookingId, { qualification, comment });
            if (res.success) {
              showSuccess('Evaluación enviada');
              setAssessmentOpen(false);
              // Opcional: recargar recientes para reflejar bandera de evaluación
              await studentConfCtx?.loadStudentRecent?.();
            } else {
              const msg = res.message || 'No se pudo enviar la evaluación';
              setAssessmentError(msg);
              showError(msg);
            }
          } catch (e: any) {
            const msg = e?.message || 'Error al enviar la evaluación';
            setAssessmentError(msg);
            showError(msg);
          }
        }}
      />
    </div>
  );
}