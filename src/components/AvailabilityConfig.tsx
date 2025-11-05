import React, { useMemo, useState } from 'react';
import { format } from 'date-fns';
import '../styles/docente-agenda.css';
import { useSchedule } from '../context/availability/ScheduleContext';
import type { DayKey } from '../context/availability/ScheduleContext';
import { useAgendaApi } from '../hooks/availability/useavailabilityApi';

interface AvailabilityConfigProps {
  onAvailabilityAdded?: () => void;
  onAvailabilityDeleted?: () => void;
}

const AvailabilityConfig: React.FC<AvailabilityConfigProps> = ({ onAvailabilityAdded, onAvailabilityDeleted }) => {
  const { dayLabels, enabledDays, slots, availableSlots, addHours, removeSlot, toggleDay, dayKeyToIndex, toHH } = useSchedule();
  const { deleteAvailability, createAvailability } = useAgendaApi();
  const weekKeys = useMemo<DayKey[]>(() => ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'], []);

  // Modal local state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDay, setModalDay] = useState<DayKey | null>(null);
  const [selectedHours, setSelectedHours] = useState<Set<number>>(new Set());
  const [deleting, setDeleting] = useState<string | null>(null);

  const openAddModal = (day: DayKey) => {
    if (!enabledDays[day]) return;
    setModalDay(day);
    setSelectedHours(new Set());
    setIsModalOpen(true);
  };

  const toggleHour = (h: number) => {
    setSelectedHours((prev) => {
      const next = new Set(prev);
      if (next.has(h)) next.delete(h); else next.add(h);
      return next;
    });
  };

  const confirmAdd = async () => {
    if (!modalDay) return;
    const hours = Array.from(selectedHours);
    if (hours.length === 0) {
      setIsModalOpen(false);
      return;
    }
    
    // Agregar al estado local
    addHours(modalDay, hours);
    
    // Guardar automáticamente en el backend
    try {
      const pref = localStorage.getItem('preference_id');
      if (!pref) {
        alert('❌ No se detectó preference_id. Inicia sesión nuevamente.');
        setIsModalOpen(false);
        return;
      }
      const preference_id = Number(pref);
      
      const dayMap: Record<DayKey, number> = {
        monday: 1, tuesday: 2, wednesday: 3, thursday: 4,
        friday: 5, saturday: 6, sunday: 7,
      };
      
      const payloads = hours.map(h => ({
        preference_id,
        day_of_week: dayMap[modalDay],
        start_time: `${String(h).padStart(2, '0')}:00`,
        end_time: `${String(h + 1).padStart(2, '0')}:00`,
      }));
      
      console.log('💾 Guardando horarios automáticamente:', payloads);
      
      const results = await Promise.all(payloads.map(payload => createAvailability(payload)));
      
      const failed = results.filter(r => !r.success);
      if (failed.length > 0) {
        alert(`⚠️ Algunos horarios no se pudieron guardar: ${failed[0].message}`);
      } else {
        console.log(`✅ ${results.length} horario(s) guardado(s)`);
      }
    } catch (e: any) {
      console.error('Error al guardar:', e);
      alert(`❌ Error al guardar: ${e?.message || 'Error desconocido'}`);
    }
    
    setIsModalOpen(false);
    setModalDay(null);
    setSelectedHours(new Set());
    if (onAvailabilityAdded) onAvailabilityAdded();
  };

  // Validaciones
  const canToggleDay = (day: DayKey): boolean => {
    const currentlyEnabled = Object.values(enabledDays).filter(Boolean).length;
    if (enabledDays[day] && currentlyEnabled === 1) {
      alert('⚠️ Debes tener al menos un día activo en tu agenda.');
      return false;
    }
    if (enabledDays[day]) {
      const dayIndex = dayKeyToIndex[day];
      const hasBookedClasses = availableSlots.some(slot => slot.isBooked && slot.start.getDay() === dayIndex);
      if (hasBookedClasses) {
        alert('⚠️ No puedes deshabilitar este día porque tienes clases reservadas. Primero debes reagendar con tus estudiantes.');
        return false;
      }
    }
    return true;
  };

  const handleToggleDay = (day: DayKey) => {
    if (!canToggleDay(day)) return;
    toggleDay(day);
  };

  const handleRemove = async (day: DayKey, id: string) => {
    const slotToRemove = slots[day].find(s => s.id === id);
    if (!slotToRemove) return;
    const targetDay = dayKeyToIndex[day];
    const hasBooked = availableSlots.some(s => s.isBooked && format(s.start, 'HH:mm') === slotToRemove.hour && s.start.getDay() === targetDay);
    if (hasBooked) {
      alert('⚠️ No puedes eliminar esta hora porque tienes clases reservadas. Primero debes reagendar con tus estudiantes.');
      return;
    }
    
    // Si el ID es numérico, es un horario del backend → eliminar del servidor
    const isExisting = !isNaN(Number(id));
    if (isExisting) {
      setDeleting(id);
      const result = await deleteAvailability(Number(id));
      setDeleting(null);
      
      if (!result.success) {
        alert(`❌ Error al eliminar: ${result.message}`);
        return;
      }
      console.log(`✅ Horario ${id} eliminado del servidor`);
      if (onAvailabilityDeleted) onAvailabilityDeleted();
    }
    
    removeSlot(day, id);
  };

  return (
    <div className="agenda-card">
      <div className="agenda-grid">
        {weekKeys.map((key) => {
          const isEnabled = enabledDays[key];
          return (
            <div key={key} className={`agenda-day ${!isEnabled ? 'agenda-day-disabled' : ''}`}>
              <div className="agenda-day-header">
                <div className="agenda-day-name">{dayLabels[key]}</div>
                <button
                  className={`day-toggle ${isEnabled ? 'day-toggle-active' : ''}`}
                  onClick={() => handleToggleDay(key)}
                  title={isEnabled ? 'Deshabilitar día' : 'Habilitar día'}
                >
                  {isEnabled ? '✓' : '○'}
                </button>
              </div>

              {!isEnabled ? (
                <div className="agenda-disabled-message">Día deshabilitado</div>
              ) : (
                <>
                  <div className="agenda-slots">
                    {slots[key].map((slot) => {
                      const dayIndex = dayKeyToIndex[key];
                      const hasBooking = availableSlots.some(s => s.isBooked && format(s.start, 'HH:mm') === slot.hour && s.start.getDay() === dayIndex);
                      return (
                        <div key={slot.id} className={`agenda-chip ${hasBooking ? 'has-booking' : ''}`}>
                          <span>{slot.hour} {hasBooking ? '🔒' : ''}</span>
                          <button
                            aria-label="remove"
                            className="chip-remove"
                            onClick={() => handleRemove(key, slot.id)}
                            title={hasBooking ? 'Esta hora tiene clases reservadas' : 'Eliminar hora'}
                          >
                            ×
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  <button className="agenda-add" onClick={() => openAddModal(key)}>+ Agregar horario</button>
                </>
              )}
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-card">
            <div className="modal-header">
              <h2 className="modal-title">Selecciona horas</h2>
            </div>
            <div className="modal-body">
              <p className="text-sm text-gray-600 mb-3">Selecciona las horas en las que estarás disponible (una por una):</p>
              <div className="hours-grid">
                {Array.from({ length: 24 }, (_, i) => i).map((h) => {
                  const active = selectedHours.has(h);
                  const hourString = toHH(h);
                  const alreadyExists = modalDay ? slots[modalDay].some(s => s.hour === hourString) : false;
                  return (
                    <button
                      key={h}
                      type="button"
                      className={"hour-btn" + (active ? " is-active" : "") + (alreadyExists ? " is-disabled" : "")}
                      onClick={() => !alreadyExists && toggleHour(h)}
                      disabled={alreadyExists || undefined}
                      title={alreadyExists ? "Esta hora ya está agregada" : ""}
                    >
                      {toHH(h)}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => { setIsModalOpen(false); setSelectedHours(new Set()); }}>Cancelar</button>
              <button className="btn-primary" onClick={confirmAdd}>Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvailabilityConfig;
