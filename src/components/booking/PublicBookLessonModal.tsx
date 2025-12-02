import React, { useEffect, useMemo, useRef, useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import '../../styles/book-lesson-modal.css';
import { usePublicAgendaApi } from '../../hooks/availability/usePublicAgendaApi';
import { useCreateBookingContext } from '../../context/booking';
import { useAuthToken } from '../../hooks/auth/useAuthToken';
import type { TimeSlot } from '../../context/availability/types';
import { useNavigate } from 'react-router-dom';
import { useNotificationContext } from '../NotificationProvider';

export interface PublicTeacherInfo {
  name: string;
  subject?: string;
  level?: string;
  hourlyRate?: number;
  rating?: number;
}

export interface PublicBookLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacherId: number;
  teacher: PublicTeacherInfo;
  availabilityByDate: Record<string, string[]>; // 'yyyy-MM-dd' -> ['09:00', '10:00']
  onProceed?: (payload: { selections: { date: string; hours: string[] }[]; totalHours: number; totalPrice: number }) => void;
}

const WEEKDAY_LABELS = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

const toKey = (d: Date) => format(d, 'yyyy-MM-dd');
const toMonthKey = (d: Date) => format(d, 'yyyy-MM');
const monthRange = (d: Date) => {
  const first = new Date(d.getFullYear(), d.getMonth(), 1);
  const last = new Date(d.getFullYear(), d.getMonth() + 1, 0);
  const start = format(first, 'yyyy-MM-dd');
  const end = format(last, 'yyyy-MM-dd');
  return { start, end };
};

const buildMonthGrid = (visibleMonth: Date) => {
  const firstOfMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1);
  const startOffset = firstOfMonth.getDay(); // 0=Domingo
  const gridStart = new Date(firstOfMonth);
  gridStart.setDate(firstOfMonth.getDate() - startOffset);
  const days: Date[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    d.setHours(0, 0, 0, 0);
    days.push(d);
  }
  return days;
};

export default function PublicBookLessonModal({ isOpen, onClose, teacherId, teacher, availabilityByDate, onProceed }: PublicBookLessonModalProps) {
  const { getPublicAgenda } = usePublicAgendaApi();
  const { 
    createBooking, 
    loading: creatingBooking, 
    error: createError,
    // Cotización
    quoteBooking,
    quoteLoading,
    quoteError,
    quoteResult,
  } = useCreateBookingContext();
  const { getAccessToken } = useAuthToken();
  const navigate = useNavigate();
  const { showWarning } = useNotificationContext();

  const [visibleMonth, setVisibleMonth] = useState<Date>(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const [focusedDate, setFocusedDate] = useState<Date | null>(null);
  const [selectedByDate, setSelectedByDate] = useState<Record<string, Set<string>>>({});

  // Disponibilidad local (prop + lo que se cargue por mes)
  const [localAvailability, setLocalAvailability] = useState<Record<string, string[]>>({});
  const [localSlotsByDate, setLocalSlotsByDate] = useState<Record<string, Record<string, TimeSlot>>>({});
  const fetchedMonths = useRef<Set<string>>(new Set());
  const [loadingMonth, setLoadingMonth] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    // fusionar disponibilidad inicial recibida desde la página
    if (availabilityByDate && Object.keys(availabilityByDate).length > 0) {
      setLocalAvailability(prev => ({ ...prev, ...availabilityByDate }));
    }
  }, [availabilityByDate]);

  const monthGrid = useMemo(() => buildMonthGrid(visibleMonth), [visibleMonth]);
  const monthLabel = useMemo(() => {
    try {
      return format(visibleMonth, 'LLLL yyyy', { locale: es });
    } catch {
      return visibleMonth.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    }
  }, [visibleMonth]);

  const availableHoursForFocused = useMemo(() => {
    if (!focusedDate) return [] as string[];
    const key = toKey(focusedDate);
    return (localAvailability[key] || []).sort();
  }, [focusedDate, localAvailability]);

  const morningHours = useMemo(
    () => availableHoursForFocused.filter(h => parseInt(h.split(':')[0], 10) < 12),
    [availableHoursForFocused]
  );
  const afternoonHours = useMemo(
    () => availableHoursForFocused.filter(h => parseInt(h.split(':')[0], 10) >= 12),
    [availableHoursForFocused]
  );

  const isSameDay = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const handleDayClick = (day: Date) => {
    const key = toKey(day);
    setFocusedDate(day);
    // si aún no hay horas para ese día, se mostrarán vacías hasta cargar el mes
  };

  const toggleHour = (h: string) => {
    if (!focusedDate) return;
    const key = toKey(focusedDate);
    if (!availableHoursForFocused.includes(h)) return;
    setSelectedByDate(prev => {
      const current = new Set(prev[key] ?? []);
      if (current.has(h)) current.delete(h); else current.add(h);
      const next = { ...prev };
      if (current.size === 0) {
        delete next[key];
      } else {
        next[key] = current;
      }
      return next;
    });
  };

  const goPrevMonth = () => {
    const d = new Date(visibleMonth);
    d.setMonth(d.getMonth() - 1);
    setVisibleMonth(new Date(d.getFullYear(), d.getMonth(), 1));
  };
  const goNextMonth = () => {
    const d = new Date(visibleMonth);
    d.setMonth(d.getMonth() + 1);
    setVisibleMonth(new Date(d.getFullYear(), d.getMonth(), 1));
  };

  const fetchMonthIfNeeded = async (month: Date) => {
    const mKey = `${teacherId}|${toMonthKey(month)}`;
    if (fetchedMonths.current.has(mKey)) return;
    fetchedMonths.current.add(mKey);
    setLoadingMonth(true);
    try {
      const { start, end } = monthRange(month);
      const res = await getPublicAgenda(teacherId, { start_date: start, end_date: end });
      if (res.success && res.data) {
        const days = res.data.data.days || [];
        const map: Record<string, string[]> = {};
        const slotsMap: Record<string, Record<string, TimeSlot>> = {};
        days.forEach((day) => {
          const hours: string[] = [];
          const slotMapForDay: Record<string, TimeSlot> = {};
          day.slots?.forEach((slot) => {
            if (slot.status === 'available' && slot.start_time) {
              let hhmm = slot.start_time;
              if (hhmm.includes(':')) {
                const parts = hhmm.split(':');
                hhmm = `${parts[0]}:${parts[1]}`;
              }
              hours.push(hhmm);
              slotMapForDay[hhmm] = slot as TimeSlot;
            }
          });
          if (hours.length) map[day.date] = Array.from(new Set(hours)).sort();
          if (Object.keys(slotMapForDay).length) slotsMap[day.date] = slotMapForDay;
        });
        if (Object.keys(map).length > 0) {
          setLocalAvailability(prev => ({ ...prev, ...map }));
        }
        if (Object.keys(slotsMap).length > 0) {
          setLocalSlotsByDate(prev => ({ ...prev, ...slotsMap }));
        }
        // Enfocar primer día disponible si no hay enfoque o no hay horas
        if (!focusedDate) {
          const allDays = Object.keys(map).sort();
          if (allDays.length) {
            const [y, mm, dd] = allDays[0].split('-').map(x => parseInt(x, 10));
            setFocusedDate(new Date(y, mm - 1, dd));
          }
        }
      }
    } catch {
      // ignorar errores
    } finally {
      setLoadingMonth(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    fetchMonthIfNeeded(visibleMonth);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    fetchMonthIfNeeded(visibleMonth);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleMonth]);

  const selections = useMemo(() => {
    const entries = Object.entries(selectedByDate);
    entries.sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
    return entries.map(([dateKey, set]) => ({ dateKey, hours: Array.from(set).sort() }));
  }, [selectedByDate]);

  const totalHours = useMemo(() => {
    // Suma de todas las horas seleccionadas en todos los días
    return selections.reduce((acc, sel) => acc + sel.hours.length, 0);
  }, [selections]);
  const total = (teacher.hourlyRate || 0) * totalHours;

  // Construir bloques contiguos por día para cotización
  const quoteItems = useMemo(() => {
    const items: { availability_id: number; start_time: string; end_time: string }[] = [];
    const pad = (n: number) => String(n).padStart(2, '0');
    const entries = Object.entries(selectedByDate);
    if (entries.length === 0) return items;
    for (const [dateKey, set] of entries) {
      const hours = Array.from(set || []).sort(); // ['09:00','10:00','12:00']
      if (hours.length === 0) continue;
      const nums = hours
        .map((h) => parseInt(h.split(':')[0], 10))
        .sort((a, b) => a - b);
      let blockStart = nums[0];
      let prev = nums[0];
      const pushBlock = (startH: number, endH: number) => {
        const startKey = `${pad(startH)}:00`;
        const slot = (localSlotsByDate[dateKey] || {})[startKey];
        if (!slot) return; // si ya no está disponible, omitimos este bloque en la cotización
        items.push({
          availability_id: slot.availability_id,
          start_time: `${dateKey}T${pad(startH)}:00:00`,
          end_time: `${dateKey}T${pad(endH)}:00:00`,
        });
      };
      for (let i = 1; i < nums.length; i++) {
        const curr = nums[i];
        if (curr === prev + 1) {
          prev = curr; // continúa el bloque
        } else {
          // cerrar bloque anterior [blockStart, prev]
          pushBlock(blockStart, prev + 1);
          // iniciar nuevo
          blockStart = curr;
          prev = curr;
        }
      }
      // último bloque del día
      pushBlock(blockStart, prev + 1);
    }
    return items;
  }, [selectedByDate, localSlotsByDate]);

  // Control de cotización para evitar peticiones repetidas
  const quoteTimerRef = useRef<number | undefined>(undefined);
  const lastQuoteKeyRef = useRef<string | null>(null);
  const inFlightQuoteRef = useRef<boolean>(false);

  // Firma estable de la cotización para deduplicar (cambia solo si cambian los items)
  const quoteKey = useMemo(() => {
    if (!quoteItems || quoteItems.length === 0) return '';
    const parts = quoteItems.map(i => `${i.availability_id}|${i.start_time}|${i.end_time}`).sort();
    return parts.join(';');
  }, [quoteItems]);

  useEffect(() => {
    if (!isOpen) return;
    if (!quoteItems || quoteItems.length === 0) return;
    const token = getAccessToken();
    if (!token) return; // si no hay token, no cotizamos para evitar errores en UI pública

    // Si la firma no cambió desde la última cotización exitosa, no volver a cotizar
    if (quoteKey && quoteKey === lastQuoteKeyRef.current) return;

    // Reiniciar debounce previo
    if (quoteTimerRef.current) {
      window.clearTimeout(quoteTimerRef.current);
      quoteTimerRef.current = undefined;
    }

    // Debounce y control de concurrencia
    quoteTimerRef.current = window.setTimeout(async () => {
      if (!quoteKey) return;
      if (inFlightQuoteRef.current) return;
      inFlightQuoteRef.current = true;
      try {
        console.log('[Booking][DEBUG] quoting payload:', { items: quoteItems });
        await quoteBooking({ items: quoteItems });
        // Guardar como última firma cotizada exitosamente
        lastQuoteKeyRef.current = quoteKey;
      } catch (e) {
        // no-op, el contexto ya maneja errores
      } finally {
        inFlightQuoteRef.current = false;
      }
    }, 450);

    return () => {
      if (quoteTimerRef.current) {
        window.clearTimeout(quoteTimerRef.current);
        quoteTimerRef.current = undefined;
      }
    };
  }, [isOpen, quoteKey, quoteItems, quoteBooking, getAccessToken]);

  const isContiguous = (hours: string[]) => {
    if (hours.length <= 1) return true;
    const nums = hours.map(h => parseInt(h.split(':')[0], 10)).sort((a, b) => a - b);
    for (let i = 1; i < nums.length; i++) {
      if (nums[i] !== nums[i - 1] + 1) return false;
    }
    return true;
  };

  const handleProceed = async () => {
    setValidationError(null);
    const token = getAccessToken();
    if (!token) {
      showWarning('Debes iniciar sesión para reservar.', 5000);
      onClose();
      navigate('/login');
      return;
    }

    if (selections.length === 0) return;

    // Construir todos los slots seleccionados (multi-día, no contiguos)
    type SelSlot = { dateKey: string; hour: string; availability_id: number };
    const selectedSlots: SelSlot[] = [];
    for (const sel of selections) {
      for (const h of sel.hours) {
        const m = localSlotsByDate[sel.dateKey] || {};
        const s = m[h];
        if (!s) {
          setValidationError('Uno de los horarios seleccionados ya no está disponible. Actualiza e intenta de nuevo.');
          return;
        }
        selectedSlots.push({ dateKey: sel.dateKey, hour: h, availability_id: s.availability_id });
      }
    }
    if (selectedSlots.length === 0) return;

    // Tomar el primer slot cronológico como referencia para availability_id/start/end
    const sortedByTime = [...selectedSlots].sort((a, b) => (a.dateKey < b.dateKey ? -1 : a.dateKey > b.dateKey ? 1 : a.hour.localeCompare(b.hour)));
    const ref = sortedByTime[0];

    const pad = (n: number) => String(n).padStart(2, '0');
    const start = `${ref.dateKey}T${ref.hour}:00`;
    const hNum = parseInt(ref.hour.split(':')[0], 10);
    const end = `${ref.dateKey}T${pad(hNum + 1)}:00:00`;
    const totalSelectedHours = selectedSlots.length;

    const availabilityIds = selectedSlots.map(s => s.availability_id);
    const items = selectedSlots.map(s => {
      const h = parseInt(s.hour.split(':')[0], 10);
      return {
        availability_id: s.availability_id,
        start_time: `${s.dateKey}T${s.hour}:00`,
        end_time: `${s.dateKey}T${pad(h + 1)}:00:00`,
      };
    });

    // Guardar preview para la página de verificación (fallback si el detalle no está disponible)
    try {
      const previewItems = selectedSlots.map(s => {
        const startDate = new Date(`${s.dateKey}T${s.hour}:00`);
        const endHour = String(parseInt(s.hour.split(':')[0], 10) + 1).padStart(2, '0') + ':00';
        const endDate = new Date(`${s.dateKey}T${endHour}:00`);
        const dateLabel = startDate.toLocaleDateString('es-ES', {
          weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
        });
        const timeLabel = `${startDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false })} - ${endDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false })}`;
        return { dateLabel, timeLabel };
      });
      const preview = {
        teacherName: teacher.name || 'Docente',
        subject: teacher.subject || '—',
        items: previewItems,
      };
      sessionStorage.setItem('onlycation_booking_preview', JSON.stringify(preview));
      console.log('[Booking][DEBUG] saved preview for verify page:', preview);
    } catch (e) {
      console.log('[Booking][DEBUG] failed to save preview:', e);
    }

    try {
      const res = await createBooking({
        availability_id: ref.availability_id,
        price_id: 1,
        start_time: start,
        end_time: end,
        total_hours: totalSelectedHours,
        availability_ids: availabilityIds,
        items,
      });
      if (res.success && res.data?.data?.url) {
        window.location.href = res.data.data.url;
      } else {
        setValidationError(res.message || 'No fue posible iniciar el pago.');
      }
    } catch (e: any) {
      console.log('[Booking][DEBUG] API error:', e);
      setValidationError(e?.message || 'No fue posible iniciar el pago.');
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  // Formatear política de precios en español
  const formatPolicyEs = (policy: string | { base_hours: number; rule: string; scope?: string }) => {
    if (typeof policy === 'string') return policy;
    const base = policy?.base_hours ?? 0;
    const nextHour = base + 1;
    const scopeTxt = policy?.scope === 'per_block'
      ? 'por bloque'
      : policy?.scope === 'per_booking'
        ? 'por reserva'
        : '';
    // Ej.: "Primeras 2 horas por bloque base, desde la 3ª hora por bloque extra"
    return `Primeras ${base} horas ${scopeTxt} base, desde la ${nextHour}ª hora ${scopeTxt} extra`;
  };

  if (!isOpen) return null;

  return (
    <div className="blm-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="blm-title" aria-describedby="blm-subtitle">
      <div className="blm-container" onClick={(e) => e.stopPropagation()}>
        <div className="blm-header">
          <div>
            <h2 id="blm-title" className="blm-title">Reservar Asesoría con {teacher.name}</h2>
            <div id="blm-subtitle" className="blm-subtitle">
              {teacher.subject ? <span>Materia: {teacher.subject}</span> : null}
              {teacher.level ? <span>• Nivel: {teacher.level}</span> : null}
              {typeof teacher.hourlyRate === 'number' ? (
                <span>• Tarifa: ${teacher.hourlyRate.toFixed(2)} MXN por hora</span>
              ) : null}
              {typeof teacher.rating === 'number' ? (
                <span>• Calificación: {teacher.rating.toFixed(1)}★</span>
              ) : null}
            </div>
          </div>
          <button className="blm-close" onClick={onClose}>×</button>
        </div>

        <div className="blm-body">
          <div className="blm-col blm-col-calendar">
            <div className="blm-calendar">
              <div className="blm-cal-header">
                <button className="blm-nav" onClick={goPrevMonth}>‹</button>
                <div className="blm-month">{monthLabel}</div>
                <button className="blm-nav" onClick={goNextMonth}>›</button>
              </div>
              <div className="blm-weekdays">
                {WEEKDAY_LABELS.map((wd, idx) => (
                  <div key={`${wd}-${idx}`} className="blm-wd">{wd}</div>
                ))}
              </div>
              <div className="blm-grid">
                {monthGrid.map((day) => {
                  const inMonth = day.getMonth() === visibleMonth.getMonth();
                  const key = toKey(day);
                  const available = (localAvailability[key] || []).length > 0;
                  const hasSelection = !!selectedByDate[key] && selectedByDate[key].size > 0;
                  const selected = focusedDate ? isSameDay(day, focusedDate) : false;
                  const isToday = isSameDay(day, today);
                  const isPast = day.getTime() < today.getTime();
                  const className = [
                    'blm-day',
                    inMonth ? '' : 'is-out',
                    available ? 'is-available' : 'is-disabled',
                    hasSelection ? 'has-selection' : '',
                    isToday ? 'is-today' : '',
                    selected ? 'is-selected' : '',
                    isPast ? 'is-past' : ''
                  ].join(' ').trim();
                  return (
                    <button
                      key={key}
                      className={className}
                      onClick={() => handleDayClick(day)}
                      disabled={isPast}
                      aria-label={format(day, 'd LLLL yyyy', { locale: es })}
                    >
                      {day.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="blm-col blm-col-slots">
            <div className="blm-slots">
              <div className="blm-slots-title">
                {focusedDate ? (
                  <span>Elige el horario para el {focusedDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}</span>
                ) : (
                  <span>Elige una fecha disponible</span>
                )}
              </div>
              {loadingMonth && !focusedDate && (
                <p className="blm-help-text">Cargando disponibilidad del mes...</p>
              )}
              <p className="blm-help-text">
                Puedes seleccionar varios días y horarios. Haz clic de nuevo en una hora para desmarcarla. Solo puedes agendar desde hoy en adelante.
              </p>

              <div className="blm-slot-group">
                <div className="blm-slot-group-title">Mañana</div>
                <div className="blm-slot-list">
                  {morningHours.length === 0 && <div className="blm-slot-empty">No hay horarios</div>}
                  {morningHours.map(h => {
                    const key = focusedDate ? toKey(focusedDate) : '';
                    const selectedSet = key && selectedByDate[key] ? selectedByDate[key] : undefined;
                    const isSelected = !!selectedSet && selectedSet.has(h);
                    return (
                      <button
                        key={`m-${h}`}
                        className={`blm-hour ${isSelected ? 'is-selected' : ''}`}
                        onClick={() => toggleHour(h)}
                      >
                        {h}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="blm-slot-group" style={{ marginTop: 16 }}>
                <div className="blm-slot-group-title">Tarde</div>
                <div className="blm-slot-list">
                  {afternoonHours.length === 0 && <div className="blm-slot-empty">No hay horarios</div>}
                  {afternoonHours.map(h => {
                    const key = focusedDate ? toKey(focusedDate) : '';
                    const selectedSet = key && selectedByDate[key] ? selectedByDate[key] : undefined;
                    const isSelected = !!selectedSet && selectedSet.has(h);
                    return (
                      <button
                        key={`t-${h}`}
                        className={`blm-hour ${isSelected ? 'is-selected' : ''}`}
                        onClick={() => toggleHour(h)}
                      >
                        {h}
                      </button>
                    );
                  })}
                </div>
              </div>

              {validationError && (
                <p className="blm-help-text" style={{ color: '#b91c1c', marginTop: 12 }}>{validationError}</p>
              )}
              {createError && (
                <p className="blm-help-text" style={{ color: '#b91c1c', marginTop: 4 }}>{createError}</p>
              )}
            </div>
          </div>
        </div>

        <div className="blm-summary">
          <div className="blm-summary-title">Resumen de tu reserva</div>
          {selections.length === 0 ? (
            <div className="blm-summary-row">
              <div className="blm-summary-label">Sin horarios seleccionados aún.</div>
            </div>
          ) : (
            <>
              {selections.map(({ dateKey, hours }) => {
                const dateObj = new Date(dateKey + 'T00:00:00');
                const label = dateObj.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
                return (
                  <div key={dateKey} className="blm-summary-row">
                    <div className="blm-summary-label">{label}</div>
                    <div className="blm-summary-value">
                      {hours.join(', ')} ({hours.length} {hours.length > 1 ? 'horas' : 'hora'})
                    </div>
                  </div>
                );
              })}
              <div className="blm-summary-total">
                <span>Total ({totalHours} {totalHours === 1 ? 'hora' : 'horas'}):</span>
                <strong>
                  {quoteResult?.data?.total_amount_mxn !== undefined
                    ? `$${quoteResult.data.total_amount_mxn.toFixed(2)} MXN`
                    : `$${total.toFixed(2)} MXN`}
                  {quoteLoading && <span className="blm-spinner-inline" aria-hidden="true"></span>}
                </strong>
              </div>
              {quoteError && (
                <p className="blm-help-text" style={{ color: '#b91c1c', marginTop: 6 }}>Error al cotizar: {quoteError}</p>
              )}
              {quoteResult?.data?.global_pricing_policy && (
                <div className="blm-summary-row" style={{ marginTop: 6 }}>
                  <div className="blm-summary-label"></div>
                  <div className="blm-summary-value">
                    <span className="blm-policy-badge">
                      {formatPolicyEs(quoteResult.data.global_pricing_policy)}
                    </span>
                  </div>
                </div>
              )}
              {quoteResult?.data?.blocks?.length ? (
                <div className="blm-summary-row" style={{ marginTop: 8, display: 'grid', gap: 4 }}>
                  <div className="blm-summary-label">Desglose</div>
                  <div className="blm-summary-value" style={{ display: 'grid', gap: 2 }}>
                    {quoteResult.data.blocks.map((b, idx) => {
                      const s = new Date(b.start);
                      const e = new Date(b.end);
                      const dateLabel = s.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
                      const timeLabel = `${s.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false })} - ${e.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false })}`;
                      const amount = (b.amount_cents ?? 0) / 100;
                      return (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                          <span>{dateLabel} · {timeLabel} ({b.hours} {b.hours === 1 ? 'hora' : 'horas'})</span>
                          <strong>${amount.toFixed(2)} MXN</strong>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </>
          )}
        </div>

        <div className="blm-footer">
          <button className="blm-primary" disabled={totalHours === 0 || creatingBooking} onClick={handleProceed}>
            {creatingBooking ? 'Redirigiendo…' : 'Proceder al Pago'}
          </button>
        </div>
      </div>
    </div>
  );
}
