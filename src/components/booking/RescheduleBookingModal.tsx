import React, { useEffect, useMemo, useRef, useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import '../../styles/book-lesson-modal.css';
import { usePublicAgendaApi } from '../../hooks/availability/usePublicAgendaApi';
import type { TimeSlot } from '../../context/availability/types';
import { useBookingApi } from '../../hooks/booking/useBookingApi';
import { useNotificationContext } from '../NotificationProvider';

export interface RescheduleBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: number;
  teacherId: number;
  currentStart: string; // ISO
  currentEnd: string;   // ISO
  requiredHours: number; // e.g., 2 (must keep same duration)
}

const WEEKDAY_LABELS = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
const toKey = (d: Date) => (isNaN(d.getTime()) ? '' : format(d, 'yyyy-MM-dd'));
const toMonthKey = (d: Date) => (isNaN(d.getTime()) ? '' : format(d, 'yyyy-MM'));
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

const isValidDate = (d: Date) => !isNaN(d.getTime());
const parseDateSafe = (val?: string | null): Date => {
  if (!val) return new Date('invalid');
  let d = new Date(val);
  if (isValidDate(d)) return d;
  // Intento 1: reemplazar espacio por 'T'
  d = new Date(val.replace(' ', 'T'));
  if (isValidDate(d)) return d;
  // Intento 2: forzar segundos
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(val)) {
    d = new Date(val + ':00');
    if (isValidDate(d)) return d;
  }
  return new Date('invalid');
};

export default function RescheduleBookingModal({ isOpen, onClose, bookingId, teacherId, currentStart, currentEnd, requiredHours }: RescheduleBookingModalProps) {
  const { getPublicAgenda } = usePublicAgendaApi();
  const { rescheduleBooking } = useBookingApi();
  const { showError, showSuccess } = useNotificationContext();

  // Nuevo inicio debe ser > fin actual. Parseo seguro; si es inválido, caer a hoy.
  const minStart = useMemo(() => {
    const d = parseDateSafe(currentEnd);
    return isValidDate(d) ? d : new Date();
  }, [currentEnd]);
  const [visibleMonth, setVisibleMonth] = useState<Date>(() => {
    const seed = isValidDate(minStart) ? minStart : new Date();
    return new Date(seed.getFullYear(), seed.getMonth(), 1);
  });
  const [focusedDate, setFocusedDate] = useState<Date | null>(null);

  const [localAvailability, setLocalAvailability] = useState<Record<string, string[]>>({}); // 'yyyy-MM-dd' -> ['09:00', ...]
  const [localSlotsByDate, setLocalSlotsByDate] = useState<Record<string, Record<string, TimeSlot>>>({}); // 'yyyy-MM-dd' -> { '09:00': slot }
  const fetchedMonths = useRef<Set<string>>(new Set());
  const [loadingMonth, setLoadingMonth] = useState(false);

  // selección: una sola fecha y un bloque contiguo de requiredHours
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
  const [selectedHours, setSelectedHours] = useState<string[]>([]);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // helpers
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
    const all = (localAvailability[key] || []).sort();
    // filtrar horas que cumplen minStart (si mismo día)
    const minKey = toKey(minStart);
    if (key !== minKey) return all;
    const minHour = new Date(minStart).getHours();
    return all.filter((h) => parseInt(h.split(':')[0], 10) > minHour);
  }, [focusedDate, localAvailability, minStart]);

  const isSameDay = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

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
          const dateKey = day.date;
          const dAt = parseDateSafe(`${dateKey}T00:00:00`);
          // Descartar días anteriores al minStart
          const minDayKey = toKey(minStart);
          const isBeforeMin = isValidDate(dAt) && dAt.getTime() < new Date(minDayKey + 'T00:00:00').getTime();
          const hours: string[] = [];
          const slotMapForDay: Record<string, TimeSlot> = {};
          if (!isBeforeMin) {
            day.slots?.forEach((slot) => {
              if (slot.status === 'available' && slot.start_time) {
                let hhmm = slot.start_time;
                if (hhmm.includes(':')) {
                  const parts = hhmm.split(':');
                  hhmm = `${parts[0]}:${parts[1]}`;
                }
                // si es el mismo día que minStart, exigir hora > minHour
                const minHour = new Date(minStart).getHours();
                const isSameMinDay = dateKey === toKey(minStart);
                const hourNum = parseInt(hhmm.split(':')[0], 10);
                if (isSameMinDay && hourNum <= minHour) return; // no permitido
                hours.push(hhmm);
                slotMapForDay[hhmm] = slot as TimeSlot;
              }
            });
          }
          if (hours.length) map[dateKey] = Array.from(new Set(hours)).sort();
          if (Object.keys(slotMapForDay).length) slotsMap[dateKey] = slotMapForDay;
        });
        if (Object.keys(map).length > 0) {
          setLocalAvailability((prev) => ({ ...prev, ...map }));
        }
        if (Object.keys(slotsMap).length > 0) {
          setLocalSlotsByDate((prev) => ({ ...prev, ...slotsMap }));
        }
        // Enfocar primer día válido si no hay enfoque
        if (!focusedDate) {
          const allDays = Object.keys(map).sort();
          if (allDays.length) {
            const firstKey = allDays[0];
            const [y, mm, dd] = firstKey.split('-').map((x) => parseInt(x, 10));
            setFocusedDate(new Date(y, mm - 1, dd));
            // Importante: sincronizar selectedDateKey para permitir seleccionar horas de inmediato
            setSelectedDateKey(firstKey);
          }
        }
      }
    } catch (e) {
      // ignorar, notificar solo al intentar confirmar
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

  useEffect(() => {
    // reset state when opening/closing or on props change
    if (isOpen) {
      setSelectedDateKey(null);
      setSelectedHours([]);
      setValidationError(null);
    }
  }, [isOpen, currentEnd, requiredHours]);

  const pad = (n: number) => String(n).padStart(2, '0');

  const handleDayClick = (day: Date) => {
    const key = toKey(day);
    // no permitir días previos a minStart (por seguridad extra)
    const minDayKey = toKey(minStart);
    if (key < minDayKey) return;
    setFocusedDate(day);
    setSelectedDateKey(key);
    setSelectedHours([]);
    setValidationError(null);
  };

  const trySelectBlockFrom = (hour: string) => {
    if (!selectedDateKey) return;
    const hoursForDay = localAvailability[selectedDateKey] || [];
    const startHour = parseInt(hour.split(':')[0], 10);
    const block: string[] = [];
    for (let i = 0; i < requiredHours; i++) {
      const h = `${pad(startHour + i)}:00`;
      if (!hoursForDay.includes(h)) {
        setValidationError(`Debes seleccionar un bloque de ${requiredHours} hora(s) contiguas disponibles.`);
        setSelectedHours([]);
        return;
      }
      block.push(h);
    }
    // si es el mismo día que minStart, validar que start > minHour (ya filtrado arriba, pero revalidamos)
    const isSameMinDay = selectedDateKey === toKey(minStart);
    if (isSameMinDay && startHour <= new Date(minStart).getHours()) {
      setValidationError(`El inicio debe ser posterior a ${pad(new Date(minStart).getHours())}:00.`);
      setSelectedHours([]);
      return;
    }
    setSelectedHours(block);
    setValidationError(null);
  };

  const handleHourClick = (h: string) => {
    trySelectBlockFrom(h);
  };

  const handleConfirm = async () => {
    if (!selectedDateKey || selectedHours.length !== requiredHours) {
      setValidationError(`Selecciona un bloque de ${requiredHours} hora(s) contiguas.`);
      return;
    }
    const startHH = selectedHours[0];
    const startNum = parseInt(startHH.split(':')[0], 10);
    const newStart = `${selectedDateKey}T${startHH}:00`;
    const newEnd = `${selectedDateKey}T${pad(startNum + requiredHours)}:00:00`;

    // availability_id del primer slot
    const slotMap = localSlotsByDate[selectedDateKey] || {};
    const startSlot = slotMap[startHH];
    if (!startSlot) {
      showError('El horario seleccionado ya no está disponible. Actualiza e intenta nuevamente.');
      return;
    }

    // Validación rápida: nuevo inicio después de fin actual
    if (new Date(newStart).getTime() <= new Date(currentEnd).getTime()) {
      showError('El nuevo horario debe ser posterior al fin de tu reserva actual.');
      return;
    }

    // Construir payload multi-hora (un tramo por cada hora seleccionada)
    const items = selectedHours.map((h) => {
      const hNum = parseInt(h.split(':')[0], 10);
      const slot = slotMap[h];
      if (!slot) throw new Error('Uno de los tramos ya no está disponible.');
      return {
        availability_id: slot.availability_id,
        start_time: `${selectedDateKey}T${h}:00`,
        end_time: `${selectedDateKey}T${pad(hNum + 1)}:00:00`,
      };
    });

    setSubmitting(true);
    try {
      const res = await rescheduleBooking({ booking_id: bookingId, items });
      if (res.success) {
        showSuccess(res.message || 'Reserva reagendada exitosamente');
        onClose();
      } else {
        showError(res.message || 'No se pudo reagendar la reserva');
      }
    } catch (e: any) {
      showError(e?.message || 'Error al reagendar la reserva');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="blm-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="blm-title" aria-describedby="blm-subtitle">
      <div className="blm-container" onClick={(e) => e.stopPropagation()}>
        <div className="blm-header">
          <div>
            <h2 id="blm-title" className="blm-title">Reagendar reserva #{bookingId}</h2>
            <div id="blm-subtitle" className="blm-subtitle">
              Selecciona un nuevo horario (bloque de {requiredHours} {requiredHours === 1 ? 'hora' : 'horas'}) posterior a la hora fin actual.
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
                  const selected = focusedDate ? isSameDay(day, focusedDate) : false;
                  const isPast = day.getTime() < today.getTime();
                  const isBeforeMin = key < toKey(minStart);
                  const className = [
                    'blm-day',
                    inMonth ? '' : 'is-out',
                    available && !isBeforeMin ? 'is-available' : 'is-disabled',
                    selected ? 'is-selected' : '',
                    isPast ? 'is-past' : ''
                  ].join(' ').trim();
                  return (
                    <button
                      key={key}
                      className={className}
                      onClick={() => handleDayClick(day)}
                      disabled={isPast || isBeforeMin}
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
                Se reagendará en un bloque de {requiredHours} {requiredHours === 1 ? 'hora' : 'horas'} contiguas. Haz clic en la hora de inicio.
              </p>

              {focusedDate && (
                <div className="blm-slot-group" style={{ marginTop: 8 }}>
                  <div className="blm-slot-group-title">Horas disponibles</div>
                  <div className="blm-slot-list">
                    {availableHoursForFocused.length === 0 && <div className="blm-slot-empty">No hay horarios</div>}
                    {availableHoursForFocused.map((h) => {
                      const isSelected = selectedHours.includes(h);
                      return (
                        <button
                          key={`h-${h}`}
                          className={`blm-hour ${isSelected ? 'is-selected' : ''}`}
                          onClick={() => handleHourClick(h)}
                        >
                          {h}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {selectedHours.length > 0 && (
                <div className="blm-summary" style={{ marginTop: 12 }}>
                  <div className="blm-summary-row">
                    <div className="blm-summary-label">Selección</div>
                    <div className="blm-summary-value">
                      {selectedDateKey} · {selectedHours[0]} - {pad(parseInt(selectedHours[0].split(':')[0], 10) + requiredHours)}:00 ({requiredHours} {requiredHours === 1 ? 'hora' : 'horas'})
                    </div>
                  </div>
                </div>
              )}

              {validationError && (
                <p className="blm-help-text" style={{ color: '#b91c1c', marginTop: 12 }}>{validationError}</p>
              )}
            </div>
          </div>
        </div>

        <div className="blm-footer">
          <button className="blm-primary" disabled={submitting || selectedHours.length !== requiredHours || !selectedDateKey} onClick={handleConfirm}>
            {submitting ? 'Enviando…' : 'Reagendar'}
          </button>
        </div>
      </div>
    </div>
  );
}
