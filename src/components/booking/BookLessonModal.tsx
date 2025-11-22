import React, { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import '../../styles/book-lesson-modal.css';

export interface TeacherInfo {
  name: string;
  subject?: string;
  level?: string;
  hourlyRate?: number; // precio por hora
  rating?: number;
}

export interface BookLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: TeacherInfo;
  availabilityByDate: Record<string, string[]>; // 'yyyy-MM-dd' -> ['09:00', '10:00']
  onProceed: (payload: { selections: { date: string; hours: string[] }[]; totalHours: number; totalPrice: number }) => void;
}

const WEEKDAY_LABELS = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

const toKey = (d: Date) => format(d, 'yyyy-MM-dd');

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

export default function BookLessonModal({ isOpen, onClose, teacher, availabilityByDate, onProceed }: BookLessonModalProps) {
  const [visibleMonth, setVisibleMonth] = useState<Date>(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const [focusedDate, setFocusedDate] = useState<Date | null>(null);
  const [selectedByDate, setSelectedByDate] = useState<Record<string, Set<string>>>({});

  const monthGrid = useMemo(() => buildMonthGrid(visibleMonth), [visibleMonth]);
  const monthLabel = useMemo(() => {
    try {
      return format(visibleMonth, "LLLL yyyy", { locale: es });
    } catch {
      return visibleMonth.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    }
  }, [visibleMonth]);

  const availableHoursForFocused = useMemo(() => {
    if (!focusedDate) return [] as string[];
    const key = toKey(focusedDate);
    return (availabilityByDate[key] || []).sort();
  }, [focusedDate, availabilityByDate]);

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
    const hasAvailability = (availabilityByDate[key] || []).length > 0;
    if (!hasAvailability) return;
    setFocusedDate(day);
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

  const selections = useMemo(() => {
    const entries = Object.entries(selectedByDate);
    entries.sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
    return entries.map(([dateKey, set]) => ({ dateKey, hours: Array.from(set).sort() }));
  }, [selectedByDate]);

  const totalHours = selections.reduce((acc, item) => acc + item.hours.length, 0);
  const total = (teacher.hourlyRate || 0) * totalHours;

  const summaryFocusedLabel = focusedDate
    ? focusedDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })
    : '';

  const proceedDisabled = totalHours === 0;

  const handleProceed = () => {
    if (totalHours === 0 || selections.length === 0) return;
    onProceed({
      selections: selections.map(s => ({ date: s.dateKey, hours: s.hours })),
      totalHours,
      totalPrice: total,
    });
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
                {WEEKDAY_LABELS.map((wd) => (
                  <div key={wd} className="blm-wd">{wd}</div>
                ))}
              </div>
              <div className="blm-grid">
                {monthGrid.map((day) => {
                  const inMonth = day.getMonth() === visibleMonth.getMonth();
                  const key = toKey(day);
                  const available = (availabilityByDate[key] || []).length > 0;
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
                      disabled={!available || isPast}
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
            </>
          )}
          <div className="blm-summary-total">
            <span>Total ({totalHours} {totalHours === 1 ? 'hora' : 'horas'}):</span>
            <strong>${total.toFixed(2)} MXN</strong>
          </div>
        </div>

        <div className="blm-footer">
          <button className="blm-primary" disabled={proceedDisabled} onClick={handleProceed}>
            Proceder al Pago
          </button>
        </div>
      </div>
    </div>
  );
}
