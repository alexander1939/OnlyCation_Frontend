import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useOptionalTeacherConfirmationsContext, useOptionalStudentConfirmationsContext } from '../../context/confirmations';
import { useOptionalConfirmationDetailContext } from '../../context/confirmations';
import ConfirmationDetailModal from './ConfirmationDetailModal';
import '../../styles/confirmations.css';
import HintBadge from '../ui/HintBadge';
import { Calendar as CalendarIcon, CalendarDays, FileText, Hourglass, CheckCircle, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';

type ConfirmationViewProps = {
  role?: string;
};

export default function ConfirmationView({ role }: ConfirmationViewProps) {
  const isTeacher = (role || '').toLowerCase() === 'teacher';
  // Usar hooks opcionales para evitar errores si el Provider no está presente
  const teacherCtx = useOptionalTeacherConfirmationsContext();
  const studentCtx = useOptionalStudentConfirmationsContext();
  const detailCtx = useOptionalConfirmationDetailContext();

  // Modo: 'all' (listado paginado) o 'byDate' (filtrado)
  const [mode, setMode] = useState<'all' | 'byDate'>('all');
  const [dateInput, setDateInput] = useState(''); // Admite YYYY-MM-DD o DD/MM/YYYY
  const [lastQuery, setLastQuery] = useState('');
  const [detailOpen, setDetailOpen] = useState(false);
  const datePickerRef = useRef<HTMLInputElement | null>(null);
  const fieldRef = useRef<HTMLDivElement | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const today = new Date();
  const parseInputToDate = (value: string) => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return new Date(value + 'T00:00:00');
    const m = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (m) {
      const [, dd, mm, yyyy] = m;
      return new Date(`${yyyy}-${mm}-${dd}T00:00:00`);
    }
    return null;
  };
  const selectedDate = parseInputToDate(dateInput) || null;
  const [viewYear, setViewYear] = useState<number>((selectedDate || today).getFullYear());
  const [viewMonth, setViewMonth] = useState<number>((selectedDate || today).getMonth()); // 0-11

  // Estados para 'byDate'
  const dateLoading = useMemo(() => (isTeacher ? teacherCtx?.dateLoading : studentCtx?.dateLoading) || false, [isTeacher, teacherCtx?.dateLoading, studentCtx?.dateLoading]);
  const dateError = useMemo(() => (isTeacher ? teacherCtx?.dateError : studentCtx?.dateError) || null, [isTeacher, teacherCtx?.dateError, studentCtx?.dateError]);
  const dateItems = useMemo(() => (isTeacher ? teacherCtx?.dateItems : studentCtx?.dateItems) || [], [isTeacher, teacherCtx?.dateItems, studentCtx?.dateItems]);

  // Estados para 'all' (paginado)
  const allLoading = useMemo(() => (isTeacher ? teacherCtx?.allLoading : studentCtx?.allLoading) || false, [isTeacher, teacherCtx?.allLoading, studentCtx?.allLoading]);
  const allError = useMemo(() => (isTeacher ? teacherCtx?.allError : studentCtx?.allError) || null, [isTeacher, teacherCtx?.allError, studentCtx?.allError]);
  const allItems = useMemo(() => (isTeacher ? teacherCtx?.allItems : studentCtx?.allItems) || [], [isTeacher, teacherCtx?.allItems, studentCtx?.allItems]);
  const total = useMemo(() => (isTeacher ? teacherCtx?.total : studentCtx?.total) ?? 0, [isTeacher, teacherCtx?.total, studentCtx?.total]);
  const hasMore = useMemo(() => (isTeacher ? teacherCtx?.hasMore : studentCtx?.hasMore) ?? false, [isTeacher, teacherCtx?.hasMore, studentCtx?.hasMore]);
  const pageOffset = useMemo(() => (isTeacher ? teacherCtx?.offset : studentCtx?.offset) ?? 0, [isTeacher, teacherCtx?.offset, studentCtx?.offset]);
  const pageLimit = useMemo(() => (isTeacher ? teacherCtx?.limit : studentCtx?.limit) ?? 10, [isTeacher, teacherCtx?.limit, studentCtx?.limit]);

  // Derivados según modo
  const loading = mode === 'byDate' ? dateLoading : allLoading;
  const error = mode === 'byDate' ? dateError : allError;
  const items = mode === 'byDate' ? dateItems : allItems;

  // Ordenar visualmente: primero las con ventana abierta (confirmable_now)
  const sortedItems = useMemo(() => {
    const copy = Array.isArray(items) ? [...items] : [];
    copy.sort((a: any, b: any) => Number(b?.confirmable_now) - Number(a?.confirmable_now));
    return copy;
  }, [items]);

  // Cargar listado paginado al entrar
  useEffect(() => {
    if (isTeacher) teacherCtx?.loadTeacherAll?.(0, 10);
    else studentCtx?.loadStudentAll?.(0, 10);
    setMode('all');
    setLastQuery('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTeacher]);

  const parseDateForApi = (value: string) => {
    const val = value.trim();
    if (!val) return '';
    // Si viene en YYYY-MM-DD, mandamos tal cual
    if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val;
    // Si viene en DD/MM/YYYY, mandamos tal cual también (backend lo soporta)
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(val)) return val;
    return val; // fallback: mandamos lo que el usuario ingresó
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = parseDateForApi(dateInput);
    if (!q) return;
    setLastQuery(q);
    setMode('byDate');
    if (isTeacher) await teacherCtx?.loadTeacherByDate?.(q);
    else await studentCtx?.loadStudentByDate?.(q);
  };

  const handleClearFilter = async () => {
    setDateInput('');
    setLastQuery('');
    setMode('all');
    if (isTeacher) await teacherCtx?.loadTeacherAll?.(0, pageLimit || 10);
    else await studentCtx?.loadStudentAll?.(0, pageLimit || 10);
  };

  const handlePrevPage = async () => {
    const prevOffset = Math.max(0, (pageOffset || 0) - (pageLimit || 10));
    if (isTeacher) await teacherCtx?.loadTeacherAll?.(prevOffset, pageLimit || 10);
    else await studentCtx?.loadStudentAll?.(prevOffset, pageLimit || 10);
  };

  const handleNextPage = async () => {
    const nextOffset = (pageOffset || 0) + (pageLimit || 10);
    if (isTeacher) await teacherCtx?.loadTeacherAll?.(nextOffset, pageLimit || 10);
    else await studentCtx?.loadStudentAll?.(nextOffset, pageLimit || 10);
  };

  const openDetail = async (confirmationId: number) => {
    if (!detailCtx) return;
    await detailCtx.fetchDetail(confirmationId);
    setDetailOpen(true);
  };

  const closeDetail = () => {
    setDetailOpen(false);
    detailCtx?.resetDetail();
  };

  const formatDate = (dateTimeStr: string) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
  };

  const formatTime = (dateTimeStr: string) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const openCalendar = () => {
    setShowCalendar((v) => !v);
    // sincronizar vista con selección o hoy
    const base = selectedDate || today;
    setViewYear(base.getFullYear());
    setViewMonth(base.getMonth());
  };

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!showCalendar) return;
      const target = e.target as Node;
      if (fieldRef.current && !fieldRef.current.contains(target)) setShowCalendar(false);
    };
    const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setShowCalendar(false); };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onEsc);
    };
  }, [showCalendar]);

  const daysOfWeek = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  const getMonthMatrix = (year: number, month: number) => {
    const first = new Date(year, month, 1);
    const startDay = (first.getDay() + 6) % 7; // L=0 .. D=6
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevDays = startDay;
    const totalCells = Math.ceil((prevDays + daysInMonth) / 7) * 7;
    const cells: Array<{ date: Date | null; inMonth: boolean } > = [];
    for (let i = 0; i < totalCells; i++) {
      const dayNum = i - prevDays + 1;
      if (dayNum < 1 || dayNum > daysInMonth) {
        cells.push({ date: null, inMonth: false });
      } else {
        cells.push({ date: new Date(year, month, dayNum), inMonth: true });
      }
    }
    return cells;
  };
  const monthLabel = new Date(viewYear, viewMonth, 1).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  const isSameDay = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  const toISO = (d: Date) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  const selectDay = (d: Date) => {
    setDateInput(toISO(d));
    setShowCalendar(false);
  };
  const prevMonth = () => {
    const m = viewMonth - 1;
    if (m < 0) { setViewMonth(11); setViewYear(viewYear - 1); } else setViewMonth(m);
  };
  const nextMonth = () => {
    const m = viewMonth + 1;
    if (m > 11) { setViewMonth(0); setViewYear(viewYear + 1); } else setViewMonth(m);
  };

  return (
    <div className="confirmations-page">
      <div className="confirmations-container">
        <div className="confirmations-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
          <h1>Confirmaciones</h1>
        </div>
        <div className="confirmations-back-row">
          <HintBadge text="Regresar a reservas" intervalMs={2147483647}>
            <Link to={isTeacher ? '/teacher/my_next_booking' : '/student/my_next_booking'} className="view-all-btn-header" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <ArrowLeft size={16} />
              <span>Volver</span>
            </Link>
          </HintBadge>
        </div>
        <p style={{ color: '#6B7280', marginBottom: 24 }}>
          Busca y filtra tus confirmaciones por fecha. Formatos válidos: <b>YYYY-MM-DD</b> o <b>DD/MM/YYYY</b>.
        </p>

        {/* Filtro por fecha */}
        <div className="confirmations-filter" style={{ padding: 24, marginBottom: 24, color: '#374151' }}>
          <form onSubmit={handleSearch} className="confirmations-form" style={{ display: 'grid', gap: 12 }}>
            <label className="block">Buscar confirmación por fecha</label>
            <div className="confirmations-field" ref={fieldRef}>
              <span className="input-icon" aria-hidden>
                <CalendarIcon size={16} />
              </span>
              <input
                type="text"
                inputMode="numeric"
                placeholder="DD/MM/AAAA o YYYY-MM-DD"
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
                className="confirmations-input has-icon"
              />
              <HintBadge text="Abrir calendario" intervalMs={2147483647}>
                <button type="button" className="confirmations-picker-btn" onClick={openCalendar} aria-label="Abrir calendario">
                  <CalendarDays size={18} />
                </button>
              </HintBadge>
              <button type="submit" className="confirmations-search-btn" disabled={!dateInput || loading}>
                {loading ? 'Buscando…' : 'Buscar por fecha'}
              </button>
              <input
                ref={datePickerRef}
                type="date"
                value={/^\d{4}-\d{2}-\d{2}$/.test(dateInput) ? dateInput : ''}
                onChange={(e) => setDateInput(e.target.value)}
                className="confirmations-native-date"
                aria-hidden
                tabIndex={-1}
              />
              {showCalendar && (
                <div className="confirmations-calendar-popover" role="dialog" aria-label="Selector de fecha">
                  <div className="calendar-header">
                    <button type="button" className="cal-nav" onClick={prevMonth} aria-label="Mes anterior">
                      <ChevronLeft size={16} />
                    </button>
                    <div className="cal-title">{monthLabel}</div>
                    <button type="button" className="cal-nav" onClick={nextMonth} aria-label="Mes siguiente">
                      <ChevronRight size={16} />
                    </button>
                  </div>
                  <div className="calendar-grid">
                    {daysOfWeek.map((d) => (
                      <div key={d} className="cal-dow">{d}</div>
                    ))}
                    {getMonthMatrix(viewYear, viewMonth).map((cell, idx) => {
                      if (!cell.inMonth || !cell.date) return <div key={idx} className="cal-day cal-day--empty" />;
                      const d = cell.date;
                      const isToday = isSameDay(d, today);
                      const isSelected = selectedDate ? isSameDay(d, selectedDate) : false;
                      return (
                        <button
                          type="button"
                          key={idx}
                          className={`cal-day ${isToday ? 'is-today' : ''} ${isSelected ? 'is-selected' : ''}`}
                          onClick={() => selectDay(d)}
                        >
                          {d.getDate()}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            <p className="confirmations-help">Ingresa la fecha o selecciona desde el calendario.</p>
            <div className="confirmations-actions" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button type="button" className="btn-ver-detalles" onClick={handleClearFilter} disabled={mode === 'all' && !lastQuery}>
                Limpiar filtro
              </button>
              {lastQuery && (
                <span style={{ fontSize: 12, color: '#6B7280' }}>Consulta: {lastQuery}</span>
              )}
            </div>
          </form>
          {error && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', borderRadius: 10, padding: 12, marginTop: 16 }}>{error}</div>
          )}
        </div>

        {/* Resultados */}
        <div className="confirmations-results" style={{ padding: 24, color: '#374151' }}>
          <h2 style={{ marginTop: 0, marginBottom: 12, color: '#294954', fontWeight: 700 }}>{mode === 'byDate' ? 'Resultados por fecha' : 'Todas las confirmaciones'}</h2>
          {loading && <p style={{ color: '#6B7280' }}>Cargando…</p>}
          {!loading && items.length === 0 && (
            <p style={{ color: '#6B7280' }}>{mode === 'byDate' ? 'No hay confirmaciones para la fecha consultada.' : 'No hay confirmaciones registradas.'}</p>
          )}
          {!loading && items.length > 0 && (
            <div className="confirmations-list asesorias-list">
              {sortedItems.map((it) => (
                <div key={it.id} className="clase-asistida-item">
                  <div className="clase-asistida-icon"><CalendarDays size={20} /></div>
                  <div className="clase-asistida-content">
                    <div className="clase-asistida-materia">Reserva #{it.payment_booking_id}</div>
                    <div className="clase-asistida-datetime">
                      Finalizó: {formatDate(it.booking_end)}, {formatTime(it.booking_end)}
                    </div>
                    {typeof it.has_assessment_by_student === 'boolean' && (
                      <div style={{ marginTop: 6 }}>
                        <div
                          className={`confirmacion-badge ${it.has_assessment_by_student ? 'confirmada' : 'pendiente'}`}
                          title={it.has_assessment_by_student ? 'El alumno ya contestó la evaluación' : 'El alumno no ha contestado la evaluación'}
                        >
                          <FileText size={16} />
                          {isTeacher
                            ? (it.has_assessment_by_student ? 'Evaluación del alumno' : 'Sin evaluación del alumno')
                            : (it.has_assessment_by_student ? 'Tu evaluación enviada' : 'Tu evaluación pendiente')}
                        </div>
                      </div>
                    )}
                  </div>
                  {it.confirmable_now ? (
                    <div className="confirmacion-badge pendiente">
                      <Hourglass size={16} />
                      Ventana abierta
                    </div>
                  ) : (
                    <div className="confirmacion-badge confirmada">
                      <CheckCircle size={16} />
                      Registrada/No disponible
                    </div>
                  )}
                  <div>
                    <HintBadge text="Ver detalles de la reserva" intervalMs={2147483647}>
                    <button className="btn-ver-detalles" onClick={() => openDetail(it.id)}>
                      Ver detalle
                    </button>
                    </HintBadge>
                  </div>
                </div>
              ))}
            </div>
          )}
          {mode === 'all' && (
            <div className="confirmations-pagination" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 14, color: '#6B7280' }}>
                Página: {Math.floor((pageOffset || 0) / (pageLimit || 10)) + 1} · Mostrando {items.length} de {total}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <HintBadge text="Página anterior" intervalMs={2147483647}>
                  <button className="btn-ver-detalles" onClick={handlePrevPage} disabled={loading || (pageOffset || 0) <= 0}>
                    ← Anterior
                  </button>
                </HintBadge>
                <HintBadge text="Siguiente página" intervalMs={2147483647}>
                  <button className="btn-unirse" onClick={handleNextPage} disabled={loading || !hasMore}>
                    Siguiente →
                  </button>
                </HintBadge>
              </div>
            </div>
          )}
        </div>
        {/* Modal de detalle */}
        <ConfirmationDetailModal
          isOpen={detailOpen}
          onClose={closeDetail}
          loading={!!detailCtx?.loading}
          error={detailCtx?.error || null}
          detail={detailCtx?.detail || null}
        />
      </div>
    </div>
  );
}
