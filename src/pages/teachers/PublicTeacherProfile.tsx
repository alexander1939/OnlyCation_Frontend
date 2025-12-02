import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import { Star, BadgeDollarSign, Play } from 'lucide-react';
import { usePublicTeacherProfileContext } from '../../context/teachers/PublicTeacherProfileContext';
import { usePublicAssessmentsContext } from '../../context/assessments/PublicAssessmentsContext';
import { usePublicAgendaContext } from '../../context/availability/PublicAgendaContext';
import { format, addDays, startOfWeek, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import '../../styles/docente-general.css';
import '../../styles/docente-profile.css';
import '../../styles/DispAgenda.css';
import PublicBookLessonModal from '../../components/booking/PublicBookLessonModal';

export default function PublicTeacherProfile() {
  const { teacherId: teacherIdParam } = useParams();
  const teacherId = Number(teacherIdParam);

  const { profilesByTeacherId, fetchPublicTeacherProfile } = usePublicTeacherProfileContext();
  const { commentsByTeacherId, fetchPublicComments } = usePublicAssessmentsContext();
  const { agendaData, fetchPublicAgenda, loading: loadingAgenda } = usePublicAgendaContext();

  const profile = profilesByTeacherId[teacherId];
  const comments = commentsByTeacherId[teacherId] || [];

  const [showVideo, setShowVideo] = useState(false);
  const fetchTimer = useRef<number | undefined>(undefined);
  const [openBooking, setOpenBooking] = useState(false);

  // Semana actual y navegación
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const currentWeekStart = useMemo(() => startOfWeek(selectedDate, { weekStartsOn: 1 }), [selectedDate]);

  const weekHeader = useMemo(() => {
    const weekEnd = addDays(currentWeekStart, 6);
    return `${format(currentWeekStart, "d 'de' MMMM", { locale: es })} - ${format(weekEnd, "d 'de' MMMM, yyyy", { locale: es })}`;
  }, [currentWeekStart]);

  const goWeeks = (delta: number) => {
    const next = addDays(currentWeekStart, delta * 7);
    setSelectedDate(next);
  };

  // Disparar una sola vez por teacherId; los providers manejan cache y in-flight
  const requestedOnceRef = useRef<number | null>(null);
  useEffect(() => {
    if (!Number.isFinite(teacherId)) return;
    if (requestedOnceRef.current === teacherId) return;
    requestedOnceRef.current = teacherId;
    fetchPublicTeacherProfile(teacherId);
    fetchPublicComments(teacherId);
  }, [teacherId]);

  useEffect(() => {
    if (!Number.isFinite(teacherId)) return;
    const y = currentWeekStart.getFullYear();
    const m = String(currentWeekStart.getMonth() + 1).padStart(2, '0');
    const d = String(currentWeekStart.getDate()).padStart(2, '0');
    const weekStr = `${y}-${m}-${d}`;

    if (fetchTimer.current) {
      window.clearTimeout(fetchTimer.current);
    }
    fetchTimer.current = window.setTimeout(() => {
      fetchPublicAgenda(teacherId, { week: weekStr });
    }, 350);

    return () => {
      if (fetchTimer.current) {
        window.clearTimeout(fetchTimer.current);
      }
    };
  }, [teacherId, currentWeekStart, fetchPublicAgenda]);

  const availabilityByDate = useMemo(() => {
    const map: Record<string, string[]> = {};
    if (!agendaData?.days) return map;
    agendaData.days.forEach((day) => {
      const hours: string[] = [];
      day.slots?.forEach((slot) => {
        if (slot.status === 'available' && slot.start_time) {
          let hhmm = slot.start_time;
          if (hhmm.includes(':')) {
            const parts = hhmm.split(':');
            hhmm = `${parts[0]}:${parts[1]}`;
          }
          hours.push(hhmm);
        }
      });
      if (hours.length) map[day.date] = Array.from(new Set(hours)).sort();
    });
    return map;
  }, [agendaData]);

  const publicTeacher = useMemo(() => ({
    name: profile ? `${profile.first_name} ${profile.last_name}` : 'Docente',
    subject: profile?.expertise_area,
    level: profile?.educational_level,
    hourlyRate: profile?.price_per_hour,
    rating: profile?.average_rating,
  }), [profile]);

  const handleProceed = (payload: { selections: { date: string; hours: string[] }[]; totalHours: number; totalPrice: number }) => {
    const lines = payload.selections.map(sel => `${sel.date}: ${sel.hours.join(', ')}`).join('\n');
    alert(`Reservas seleccionadas:\n${lines}\nTotal de horas: ${payload.totalHours}\nTotal a pagar: $${payload.totalPrice.toFixed(2)} MXN`);
    setOpenBooking(false);
  };

  // Construir horas y mapa por día/hora para la grilla
  const { days, hours, grouped } = useMemo(() => {
    const dayList = agendaData?.days || [];
    const hoursSet = new Set<number>();
    const map: Record<string, Record<string, any>> = {};
    for (const day of dayList) {
      map[day.date] = map[day.date] || {};
      for (const slot of (day.slots || [])) {
        const hour = parseInt(String(slot.start_time).split(':')[0]);
        const hourKey = `${String(hour).padStart(2, '0')}:00`;
        map[day.date][hourKey] = slot; // slot.status: 'available' | 'occupied'
        hoursSet.add(hour);
      }
    }
    const hoursArr = Array.from(hoursSet).sort((a, b) => a - b);
    return { days: dayList, hours: hoursArr, grouped: map };
  }, [agendaData]);

  const fullName = profile ? `${profile.first_name} ${profile.last_name}` : 'Docente';
  const videoThumb = profile?.video_thumbnail_url || '/Gemini_Generated_Image_ccdndiccdndiccdn.png';
  const embedUrl = profile?.video_embed_url || '';

  return (
    <div className="min-h-screen flex flex-col page-container">
      <Header />
      <main className="flex-1 main-spacing">
        <section className="docente-container">
          <div className="profile-grid">
            <div>
              <div
                className="profile-hero"
                style={{ backgroundImage: `url(${videoThumb})` }}
                aria-label="Video de presentación"
              >
                {embedUrl && (
                  <div className="profile-hero-play">
                    <button className="profile-hero-btn" onClick={() => setShowVideo(true)} aria-label="Reproducir video">
                      <Play width={36} height={36} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="profile-info-card">
                <div className="profile-title-row">
                  <h1 className="profile-title">{fullName}</h1>
                </div>
                <div className="profile-meta-chips">
                  <span className="meta-chip meta-chip-blue">{profile?.educational_level || '—'}</span>
                  <span className="meta-chip meta-chip-mint">{profile?.expertise_area || '—'}</span>
                </div>

                <div className="profile-stats">
                  <div className="stat">
                    <Star color="#c78f00" fill="#c78f00" width={20} height={20} />
                    <span className="stat-value">{(profile?.average_rating ?? 0).toFixed(1)}</span>
                    <span className="stat-label">Estrellas</span>
                  </div>
                  <div className="stat">
                    <BadgeDollarSign color="#68B2C9" width={20} height={20} />
                    <span className="stat-value">${profile?.price_per_hour ?? 0}</span>
                    <span className="stat-label">/ hora</span>
                  </div>
                </div>

                <div className="profile-actions-row">
                  <button
                    className="profile-action primary"
                    onClick={() => setOpenBooking(true)}
                    disabled={!agendaData || Object.keys(availabilityByDate).length === 0}
                  >
                    Reserva ahora
                  </button>
                </div>
              </div>
            </div>
          </div>

          <hr className="separator-mint" />

          <div className="bio-card" style={{ marginTop: 16 }}>
            <h2 className="section-heading" style={{ margin: 0 }}>Descripción</h2>
            <p className="bio-text">{profile?.description || 'Sin descripción disponible'}</p>
          </div>

          <hr className="separator-mint" />

          <div style={{ marginTop: 16 }}>
            <h2 className="section-heading">Disponibilidad Semanal</h2>
            <p className="section-sub">Consulta los horarios disponibles. El estado se actualiza en tiempo real.</p>

            <div className="disp-agenda" style={{ marginTop: 12 }}>
              <div className="disp-agenda-header">
                <div className="date-navigation">
                  <button onClick={() => goWeeks(-1)} className="nav-button" aria-label="Semana anterior" disabled={loadingAgenda}>←</button>
                  <h3>{weekHeader}</h3>
                  <button onClick={() => goWeeks(1)} className="nav-button" aria-label="Siguiente semana" disabled={loadingAgenda}>→</button>
                </div>
              </div>

              <div className="week-view">
                <div className="week-header">
                  <div className="time-column-header"></div>
                  {days.map(day => (
                    <div key={day.date} className="day-header">
                      <div className="day-name">{day.day_name}</div>
                      <div className="day-number">{format(parseISO(day.date), 'd')}</div>
                    </div>
                  ))}
                </div>

                <div className="time-slots">
                  {hours.map((hour) => {
                    const hourKey = `${String(hour).padStart(2, '0')}:00`;
                    return (
                      <div key={hour} className="time-slot-row">
                        <div className="time-label">{hourKey}</div>
                        {days.map((day) => {
                          const slot = grouped[day.date]?.[hourKey];
                          const isOccupied = slot?.status === 'occupied';
                          const isAvailable = slot?.status === 'available';
                          return (
                            <div key={`${day.date}-${hourKey}`} className={`time-slot ${isOccupied ? 'booked' : isAvailable ? 'available' : 'empty'}`} title={slot ? (isOccupied ? 'Ocupado' : 'Disponible') : 'Sin horario'}>
                              {isOccupied ? (
                                <div className="slot-content"><span className="student-name">Ocupado</span></div>
                              ) : isAvailable ? (
                                <div className="slot-content available-indicator">✓</div>
                              ) : (
                                <div className="slot-content empty-indicator">-</div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <hr className="separator-yellow" />

          <div>
            <h2 className="section-heading">Reseñas de Alumnos</h2>
            <div className="reviews-grid" style={{ marginTop: 12 }}>
              {comments.length === 0 ? (
                <p className="text-gray-600">No hay comentarios aún</p>
              ) : (
                comments.map((r) => (
                  <article key={r.id} className="review-card">
                    <div className="review-top">
                      <div className="review-user">
                        <div className="review-avatar">
                          <span className="review-avatar-initials">
                            {(r.student_name?.trim()?.[0] || 'U').toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="review-name">{r.student_name}</p>
                          <p className="review-date">{new Date(r.created_at).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="review-pill">
                        <Star width={16} height={16} color="#c78f00" fill="#c78f00" />
                        <span>{r.qualification.toFixed(1)}</span>
                      </div>
                    </div>
                    <p className="review-text">{r.comment}</p>
                  </article>
                ))
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />

      {showVideo && embedUrl && (
        <div className="video-modal-overlay" role="dialog" aria-modal="true">
          <div className="video-modal">
            <div className="video-aspect">
              <iframe src={embedUrl} title="Video de presentación" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
              <button className="video-close" aria-label="Cerrar video" onClick={() => setShowVideo(false)}>✕</button>
            </div>
          </div>
        </div>
      )}

      <PublicBookLessonModal
        isOpen={openBooking}
        onClose={() => setOpenBooking(false)}
        teacherId={teacherId}
        teacher={publicTeacher}
        availabilityByDate={availabilityByDate}
        onProceed={handleProceed}
      />
    </div>
  );
}
