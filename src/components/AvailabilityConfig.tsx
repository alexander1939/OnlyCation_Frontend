import React, { useMemo, useState } from 'react';
import '../styles/docente-agenda.css';
import { useSchedule } from '../context/availability/ScheduleContext';
import type { DayKey } from '../context/availability/ScheduleContext';
import { useAgendaApi } from '../hooks/availability/useavailabilityApi';
import { useNotificationContext } from '../components/NotificationProvider';

interface AvailabilityConfigProps {
  onAvailabilityAdded?: () => void;
  onAvailabilityDeleted?: () => void;
}

const AvailabilityConfig: React.FC<AvailabilityConfigProps> = ({ onAvailabilityAdded, onAvailabilityDeleted }) => {
  const { dayLabels, enabledDays, slots, availableSlots, removeSlot, toggleDay, dayKeyToIndex, toHH, loadFromAgenda } = useSchedule();
  const { deleteAvailability, createAvailability, fetchWeeklyAgenda } = useAgendaApi();
  const { showSuccess, showError, showWarning } = useNotificationContext();
  const weekKeys = useMemo<DayKey[]>(() => ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'], []);

  // Modal local state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDay, setModalDay] = useState<DayKey | null>(null);
  const [selectedHours, setSelectedHours] = useState<Set<number>>(new Set());
  const [, setDeleting] = useState<string | null>(null);

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
    
    // Guardar en el backend primero
    try {
      const pref = localStorage.getItem('user_preference_id');
      if (!pref) {
        showError('No se detectó preference_id. Inicia sesión nuevamente.');
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
        end_time: `${String((h + 1) % 24).padStart(2, '0')}:00`,
      }));
      
      // Enviar secuencialmente en lugar de paralelo para evitar conflictos
      const successfulHours: number[] = [];
      let errorCount = 0;
      
      for (let i = 0; i < payloads.length; i++) {
        const payload = payloads[i];
        const hour = hours[i];
        const result = await createAvailability(payload);
        
        if (result.success) {
          successfulHours.push(hour);
          const startTime = `${String(hour).padStart(2, '0')}:00`;
          const endTime = `${String((hour + 1) % 24).padStart(2, '0')}:00`;
          showSuccess(`Disponibilidad agregada: ${startTime} - ${endTime}`);
        } else {
          errorCount++;
          const startTime = `${String(hour).padStart(2, '0')}:00`;
          showError(`Error al guardar horario ${startTime}: ${result.message}`);
        }
      }
      
      // Recargar TODA la agenda desde el backend con datos reales
      if (successfulHours.length > 0) {
        // Calcular rango de fechas para la semana actual
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay()); // Domingo
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6); // Sábado
        
        const formatDate = (date: Date) => {
          const yyyy = date.getFullYear();
          const mm = String(date.getMonth() + 1).padStart(2, '0');
          const dd = String(date.getDate()).padStart(2, '0');
          return `${yyyy}-${mm}-${dd}`;
        };
        
        const startDate = formatDate(startOfWeek);
        const endDate = formatDate(endOfWeek);
        
        console.log('🔄 Recargando agenda desde backend:', startDate, 'a', endDate);
        
        // Fetch agenda from backend with REAL data
        const agendaResponse = await fetchWeeklyAgenda(startDate, endDate);
        if (agendaResponse.success && agendaResponse.data) {
          console.log('✅ Agenda recibida del backend:', agendaResponse.data);
          loadFromAgenda?.(agendaResponse.data);
          // Notificar al padre para refrescar DispAgenda inmediatamente
          onAvailabilityAdded?.();
        } else {
          showError('Error al recargar la agenda');
        }
      }
      
      if (errorCount > 0 && successfulHours.length > 0) {
        showWarning(`${successfulHours.length} horario(s) guardado(s), ${errorCount} fallaron`);
      }
    } catch (e: any) {
      showError(`Error al guardar: ${e?.message || 'Error desconocido'}`);
      // No agregar al estado local si hubo error
    }
    
    setIsModalOpen(false);
    setModalDay(null);
    setSelectedHours(new Set());
  };

  // Validaciones
  const canToggleDay = (day: DayKey): boolean => {
    const currentlyEnabled = Object.values(enabledDays).filter(Boolean).length;
    if (enabledDays[day] && currentlyEnabled === 1) {
      showWarning('Debes tener al menos un día activo en tu agenda.');
      return false;
    }
    if (enabledDays[day]) {
      const dayIndex = dayKeyToIndex[day];
      const hasBookedClasses = availableSlots.some(s => s.isBooked && s.start.getDay() === dayIndex);
      if (hasBookedClasses) {
        showWarning('No puedes deshabilitar este día porque tienes clases reservadas. Primero debes reagendar con tus estudiantes.');
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
    const hasBooked = availableSlots.some(s => s.isBooked && s.start.getDay() === targetDay);
    if (hasBooked) {
      showWarning('No puedes eliminar esta hora porque tienes clases reservadas. Primero debes reagendar con tus estudiantes.');
      return;
    }
    
    // Si el ID es numérico, es un horario del backend → eliminar del servidor
    const isExisting = !isNaN(Number(id));
    if (isExisting) {
      setDeleting(id);
      const result = await deleteAvailability(Number(id));
      setDeleting(null);
      
      // Si el backend devuelve 'deactivated', es un soft delete → advertencia, no error
      if (!result.success) {
        if (result.action === 'deactivated' || result.warning) {
          showWarning(result.warning || result.message);
          // Continuar para reflejar el cambio localmente
        } else {
          showError(`Error al eliminar horario ${slotToRemove.hour}: ${result.message}`);
          return;
        }
      } else if (result.action === 'deactivated' || result.warning) {
        // success true con advertencia informativa
        showWarning(result.warning || result.message);
      }
    }
    
    // Eliminar del estado local
    removeSlot(day, id);
    
    // Mostrar notificación de éxito siempre
    const [hourStr] = slotToRemove.hour.split(':');
    const hourNum = parseInt(hourStr);
    const endTime = `${String((hourNum + 1) % 24).padStart(2, '0')}:00`;
    showSuccess(`Disponibilidad eliminada: ${slotToRemove.hour} - ${endTime}`);
    // Notificar al padre para refrescar DispAgenda inmediatamente
    onAvailabilityDeleted?.();
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
                      const hasBooking = availableSlots.some(s => s.isBooked && s.start.getDay() === dayIndex);
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
              <button className="btn-primary" onClick={confirmAdd}>Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvailabilityConfig;
