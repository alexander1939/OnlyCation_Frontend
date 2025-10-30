import React, { useMemo } from 'react';
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import '../styles/DispAgenda.css';
import { useSchedule } from '../context/availability/ScheduleContext';
import type { TimeSlot } from '../context/availability/ScheduleContext';

const DispAgenda: React.FC = () => {
  const { availableSlots, selectedDate, setSelectedDate, onSlotClick } = useSchedule();

  // Formatear el rango de la semana
  const formatWeekHeader = (date: Date): string => {
    const weekStart = startOfWeek(date, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(date, { weekStartsOn: 1 });
    return `${format(weekStart, "d 'de' MMMM", { locale: es })} - ${format(weekEnd, "d 'de' MMMM, yyyy", { locale: es })}`;
  };

  // Navegación entre semanas
  const navigateWeeks = (weeks: number) => {
    const newDate = addDays(selectedDate, weeks * 7);
    setSelectedDate(newDate);
  };

  // Obtener los días de la semana
  const weekDays = useMemo(() => {
    const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
    return eachDayOfInterval({ start: weekStart, end: weekEnd });
  }, [selectedDate]);

  // Agrupar los slots por día y hora
  const { groupedSlots, hours } = useMemo(() => {
    const slotsByDayAndHour: Record<string, Record<string, TimeSlot | null>> = {};
    const hoursSet = new Set<number>();

    // Inicializar estructura para cada día de la semana
    weekDays.forEach(day => {
      const dayKey = format(day, 'yyyy-MM-dd');
      slotsByDayAndHour[dayKey] = {};
    });

    // Llenar con los slots disponibles
    availableSlots.forEach(slot => {
      const slotDate = typeof slot.start === 'string' ? parseISO(slot.start) : slot.start;
      const dayKey = format(slotDate, 'yyyy-MM-dd');
      const hour = slotDate.getHours();
      const hourKey = `${hour.toString().padStart(2, '0')}:00`;
      
      if (slotsByDayAndHour[dayKey]) {
        slotsByDayAndHour[dayKey][hourKey] = slot;
        hoursSet.add(hour);
      }
    });

    // Ordenar las horas
    const sortedHours = Array.from(hoursSet).sort((a, b) => a - b);

    return {
      groupedSlots: slotsByDayAndHour,
      hours: sortedHours
    };
  }, [availableSlots, weekDays]);

  // Calcular estadísticas
  const stats = useMemo(() => {
    const totalSlots = availableSlots.length;
    const bookedSlots = availableSlots.filter(slot => slot.isBooked).length;
    const availableSlotsCount = totalSlots - bookedSlots;

    return {
      total: totalSlots,
      booked: bookedSlots,
      available: availableSlotsCount,
    };
  }, [availableSlots]);

  return (
    <div className="disp-agenda">
      <div className="disp-agenda-header">
        <div className="date-navigation">
          <button 
            onClick={() => navigateWeeks(-1)} 
            className="nav-button"
            aria-label="Semana anterior"
          >
            ←
          </button>
          
          <h3>{formatWeekHeader(selectedDate)}</h3>
          
          <button 
            onClick={() => navigateWeeks(1)} 
            className="nav-button"
            aria-label="Siguiente semana"
          >
            →
          </button>
        </div>
        
        <div className="stats-container">
          <div className="stat-item">
            <span className="stat-value">{stats.booked}</span>
            <span className="stat-label">Reservados</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{stats.available}</span>
            <span className="stat-label">Disponibles</span>
          </div>
        </div>
      </div>
      
      <div className="week-view">
        <div className="week-header">
          <div className="time-column-header"></div>
          {weekDays.map(day => (
            <div key={day.toString()} className="day-header">
              <div className="day-name">{format(day, 'EEEE', { locale: es })}</div>
              <div className="day-number">{format(day, 'd')}</div>
            </div>
          ))}
        </div>
        
        <div className="time-slots">
          {hours.map(hour => {
            const hourKey = `${hour.toString().padStart(2, '0')}:00`;
            
            return (
              <div key={hour} className="time-slot-row">
                <div className="time-label">
                  {hourKey}
                </div>
                
                {weekDays.map(day => {
                  const dayKey = format(day, 'yyyy-MM-dd');
                  const slot = groupedSlots[dayKey]?.[hourKey];
                  
                  return (
                    <div 
                      key={`${dayKey}-${hourKey}`}
                      className={`time-slot ${slot ? (slot.isBooked ? 'booked' : 'available') : 'empty'}`}
                      onClick={() => slot && onSlotClick?.(slot)}
                      title={slot ? (slot.isBooked ? `Reservado: ${slot.studentName || ''}` : 'Disponible') : 'Sin horario'}
                    >
                      {slot && slot.isBooked && slot.studentName ? (
                        <div className="slot-content">
                          <span className="student-name">
                            {slot.studentName.split(' ')[0]}
                          </span>
                        </div>
                      ) : slot && !slot.isBooked ? (
                        <div className="slot-content available-indicator">
                          ✓
                        </div>
                      ) : (
                        <div className="slot-content empty-indicator">
                          -
                        </div>
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
  );
};

export default DispAgenda;
