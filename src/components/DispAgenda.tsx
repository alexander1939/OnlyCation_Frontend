import React, { useMemo, useEffect, useState } from 'react';
import { format, addDays, startOfWeek, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import '../styles/DispAgenda.css';
import { useWeeklyAgendaContext } from '../context/availability/WeeklyAgendaContext';

const DispAgenda: React.FC = () => {
  const { agendaData, loading, fetchWeeklyAgenda, currentWeekStart } = useWeeklyAgendaContext();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    fetchWeeklyAgenda();
  }, []);

  // Formatear el rango de la semana
  const formatWeekHeader = (date: Date): string => {
    const weekStart = startOfWeek(date, { weekStartsOn: 1 });
    const weekEnd = addDays(weekStart, 6);
    return `${format(weekStart, "d 'de' MMMM", { locale: es })} - ${format(weekEnd, "d 'de' MMMM, yyyy", { locale: es })}`;
  };

  // Navegación entre semanas
  const navigateWeeks = (weeks: number) => {
    const newDate = addDays(currentWeekStart, weeks * 7);
    setSelectedDate(newDate);
    fetchWeeklyAgenda(newDate);
  };

  // Obtener días de la semana desde agendaData
  const weekDays = useMemo(() => {
    if (!agendaData?.days) return [];
    return agendaData.days.slice(0, 7); // Solo 7 días para la vista semanal
  }, [agendaData]);

  // Agrupar los slots por día y hora
  const { groupedSlots, hours } = useMemo(() => {
    if (!agendaData?.days) return { groupedSlots: {}, hours: [] };

    const slotsByDayAndHour: Record<string, Record<string, any>> = {};
    const hoursSet = new Set<number>();

    agendaData.days.forEach(day => {
      slotsByDayAndHour[day.date] = {};
      
      day.slots?.forEach(slot => {
        const hour = parseInt(slot.start_time.split(':')[0]);
        const hourKey = `${hour.toString().padStart(2, '0')}:00`;
        
        slotsByDayAndHour[day.date][hourKey] = {
          ...slot,
          status: slot.status, // "available" o "occupied"
          availability_id: slot.availability_id
        };
        
        hoursSet.add(hour);
      });
    });

    const sortedHours = Array.from(hoursSet).sort((a, b) => a - b);

    return {
      groupedSlots: slotsByDayAndHour,
      hours: sortedHours
    };
  }, [agendaData]);

  // Calcular estadísticas
  const stats = useMemo(() => {
    if (!agendaData?.summary) return { total: 0, occupied: 0, available: 0 };
    
    return {
      total: agendaData.summary.total_slots || 0,
      occupied: agendaData.summary.occupied_slots || 0,
      available: agendaData.summary.available_slots || 0,
    };
  }, [agendaData]);

  if (loading) {
    return (
      <div className="disp-agenda">
        <div className="disp-agenda-header">
          <div className="date-navigation">
            <button className="nav-button" disabled>←</button>
            <h3>Cargando...</h3>
            <button className="nav-button" disabled>→</button>
          </div>
        </div>
        <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
          <div style={{ fontSize: '24px', marginBottom: '10px' }}>🔄</div>
          <p>Cargando agenda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="disp-agenda">
      <div className="disp-agenda-header">
        <div className="date-navigation">
          <button 
            onClick={() => navigateWeeks(-1)} 
            className="nav-button"
            aria-label="Semana anterior"
            disabled={loading}
          >
            ←
          </button>
          
          <h3>{formatWeekHeader(currentWeekStart)}</h3>
          
          <button 
            onClick={() => navigateWeeks(1)} 
            className="nav-button"
            aria-label="Siguiente semana"
            disabled={loading}
          >
            →
          </button>
        </div>
        
        <div className="stats-container">
          <div className="stat-item">
            <span className="stat-value">{stats.occupied}</span>
            <span className="stat-label">Ocupados</span>
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
            <div key={day.date} className="day-header">
              <div className="day-name">{day.day_name}</div>
              <div className="day-number">{format(parseISO(day.date), 'd')}</div>
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
                  const slot = groupedSlots[day.date]?.[hourKey];
                  const isOccupied = slot?.status === 'occupied';
                  const isAvailable = slot?.status === 'available';
                  
                  return (
                    <div 
                      key={`${day.date}-${hourKey}`}
                      className={`time-slot ${isOccupied ? 'booked' : isAvailable ? 'available' : 'empty'}`}
                      title={slot ? (isOccupied ? 'Ocupado' : 'Disponible') : 'Sin horario'}
                    >
                      {isOccupied ? (
                        <div className="slot-content">
                          <span className="student-name">Ocupado</span>
                        </div>
                      ) : isAvailable ? (
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
