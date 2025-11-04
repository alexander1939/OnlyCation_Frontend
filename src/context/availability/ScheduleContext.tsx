import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { eachDayOfInterval, endOfWeek, startOfWeek } from 'date-fns';

export type DayKey = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
export type Slot = { id: string; hour: string };
export interface TimeSlot {
  id: string;
  start: Date;
  end: Date;
  isBooked: boolean;
  studentName?: string;
  subject?: string;
}

const dayLabels: Record<DayKey, string> = {
  monday: 'Lunes',
  tuesday: 'Martes',
  wednesday: 'Miércoles',
  thursday: 'Jueves',
  friday: 'Viernes',
  saturday: 'Sábado',
  sunday: 'Domingo',
};

const dayKeyToIndex: Record<DayKey, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

const toHH = (n: number) => `${n.toString().padStart(2,'0')}:00`;

interface ScheduleContextValue {
  // Data
  selectedDate: Date;
  availableSlots: TimeSlot[];
  enabledDays: Record<DayKey, boolean>;
  slots: Record<DayKey, Slot[]>;
  // Labels/utils
  dayLabels: Record<DayKey, string>;
  dayKeyToIndex: Record<DayKey, number>;
  toHH: (n: number) => string;
  // Actions
  setSelectedDate: (d: Date) => void;
  addHours: (day: DayKey, hours: number[]) => void;
  removeSlot: (day: DayKey, id: string) => void;
  toggleDay: (day: DayKey) => void;
  onSlotClick?: (slot: TimeSlot) => void;
  loadFromAgenda?: (agendaData: any) => void;
}

const ScheduleContext = createContext<ScheduleContextValue | undefined>(undefined);

export const ScheduleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);

  // Estado base vacío
  const [slots, setSlots] = useState<Record<DayKey, Slot[]>>({
    monday: [], tuesday: [], wednesday: [], thursday: [], friday: [], saturday: [], sunday: [],
  });
  const [enabledDays, setEnabledDays] = useState<Record<DayKey, boolean>>({
    monday: false, tuesday: false, wednesday: false, thursday: false, friday: false, saturday: false, sunday: false,
  });

  // Función para cargar datos desde agenda del backend
  const loadFromAgenda = (agendaData: any) => {
    if (!agendaData || !agendaData.days) return;

    console.log('🔍 Loading from agenda:', agendaData);

    const newSlots: Record<DayKey, Slot[]> = {
      monday: [], tuesday: [], wednesday: [], thursday: [], friday: [], saturday: [], sunday: [],
    };
    const newEnabledDays: Record<DayKey, boolean> = {
      monday: false, tuesday: false, wednesday: false, thursday: false, friday: false, saturday: false, sunday: false,
    };

    agendaData.days.forEach((day: any) => {
      // Convertir nombre del día a DayKey
      const dayName = day.day_name.toLowerCase();
      const dayKeyMap: Record<string, DayKey> = {
        'lunes': 'monday',
        'martes': 'tuesday',
        'miércoles': 'wednesday',
        'jueves': 'thursday',
        'viernes': 'friday',
        'sábado': 'saturday',
        'domingo': 'sunday',
      };
      const dayKey = dayKeyMap[dayName];
      
      if (dayKey) {
        if (day.slots && day.slots.length > 0) {
          // Filtrar solo horarios recurrentes (ignorar fechas específicas)
          const recurringSlots = day.slots.filter((slot: any) => {
            // Si tiene specific_date, es una cita específica → ignorar
            if (slot.specific_date) {
              console.log(`⏭️ Ignorando slot con fecha específica: ${slot.specific_date} ${slot.start_time}`);
              return false;
            }
            // Si no tiene specific_date, es recurrente → incluir
            return true;
          });

          if (recurringSlots.length > 0) {
            newEnabledDays[dayKey] = true;
            newSlots[dayKey] = recurringSlots.map((slot: any) => {
              // Limpiar formato: "09:00:00" → "09:00"
              let cleanTime = slot.start_time;
              if (cleanTime && cleanTime.includes(':')) {
                const parts = cleanTime.split(':');
                cleanTime = `${parts[0]}:${parts[1]}`; // Solo HH:MM
              }
              
              return {
                id: `${slot.availability_id}`,
                hour: cleanTime
              };
            });
            console.log(`✅ ${dayKey}: ${recurringSlots.length} slots recurrentes`, newSlots[dayKey]);
          } else {
            console.log(`⚠️ ${dayKey}: sin slots recurrentes`);
          }
        }
      }
    });

    console.log('📅 Final slots (solo recurrentes):', newSlots);
    console.log('🔓 Final enabledDays:', newEnabledDays);

    setSlots(newSlots);
    setEnabledDays(newEnabledDays);
  };

  // Generar slots semanales a partir de configuración
  useEffect(() => {
    const days = eachDayOfInterval({
      start: startOfWeek(selectedDate, { weekStartsOn: 1 }),
      end: endOfWeek(selectedDate, { weekStartsOn: 1 })
    });

    const generated: TimeSlot[] = [];
    days.forEach(day => {
      const dow = day.getDay();
      const key = (Object.keys(dayKeyToIndex) as DayKey[]).find(k => dayKeyToIndex[k] === dow);
      if (!key || !enabledDays[key]) return;

      const daySlots = slots[key];
      if (!daySlots || daySlots.length === 0) return;

      daySlots.forEach(s => {
        const [hour] = s.hour.split(':').map(Number);
        const start = new Date(day); start.setHours(hour, 0, 0, 0);
        const end = new Date(day); end.setHours(hour + 1, 0, 0, 0);
        generated.push({ id: `${day.getTime()}-${hour}`, start, end, isBooked: false });
      });
    });

    setAvailableSlots(generated);
  }, [selectedDate, slots, enabledDays]);

  const addHours = (day: DayKey, hours: number[]) => {
    setSlots(prev => {
      const existing = new Set(prev[day].map(s => s.hour));
      const toAdd = hours.map(toHH).filter(hh => !existing.has(hh)).map(hh => ({ id: crypto.randomUUID(), hour: hh }));
      return { ...prev, [day]: [...prev[day], ...toAdd].sort((a, b) => a.hour.localeCompare(b.hour)) };
    });
  };

  const removeSlot = (day: DayKey, id: string) => {
    setSlots(prev => ({ ...prev, [day]: prev[day].filter(s => s.id !== id) }));
  };

  const toggleDay = (day: DayKey) => {
    setEnabledDays(prev => {
      const wasEnabled = prev[day];
      const next = { ...prev, [day]: !prev[day] };
      if (wasEnabled) {
        setSlots(prevSlots => ({ ...prevSlots, [day]: [] }));
      }
      return next;
    });
  };

  const value: ScheduleContextValue = useMemo(() => ({
    selectedDate,
    availableSlots,
    enabledDays,
    slots,
    dayLabels,
    dayKeyToIndex,
    toHH,
    setSelectedDate,
    addHours,
    removeSlot,
    toggleDay,
    loadFromAgenda,
    onSlotClick: (slot) => {
      if (!slot.isBooked) {
        // Placeholder: se puede reemplazar desde fuera si se desea
        console.log('Horario seleccionado:', slot);
      }
    },
  }), [selectedDate, availableSlots, enabledDays, slots]);

  return (
    <ScheduleContext.Provider value={value}>
      {children}
    </ScheduleContext.Provider>
  );
};

export const useSchedule = () => {
  const ctx = useContext(ScheduleContext);
  if (!ctx) throw new Error('useSchedule debe usarse dentro de ScheduleProvider');
  return ctx;
};
