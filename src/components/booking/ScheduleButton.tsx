import React, { useEffect, useMemo, useState } from 'react';
import BookLessonModal from './BookLessonModal';
import BookingConfirmationModal from './BookingConfirmationModal';
import { useWeeklyAgendaContext } from '../../context/availability/WeeklyAgendaContext';
import { usePreferencesContext } from '../../context/preferences/PreferencesContext';
import { useDocumentsContext } from '../../context/documents/DocumentsContext';
import { usePricesContext } from '../../context/prices/PricesContext';
import { useAssessmentsContext } from '../../context/assessments';

export interface ScheduleButtonProps {
  teacher: { name: string; subject?: string; level?: string; hourlyRate?: number; rating?: number };
  align?: 'left' | 'right' | 'center';
}

export default function ScheduleButton({ teacher, align = 'right' }: ScheduleButtonProps) {
  const { agendaData, loading, fetchWeeklyAgenda } = useWeeklyAgendaContext();
  const [open, setOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { educationalLevel, getEducationalLevel } = usePreferencesContext();
  const { myExpertiseArea, getMyExpertiseArea } = useDocumentsContext();
  const { myPrice, getMyPrice } = usePricesContext();
  const { myRating, getMyRating } = useAssessmentsContext();

  useEffect(() => {
    if (!agendaData && !loading) fetchWeeklyAgenda();
  }, [agendaData, loading, fetchWeeklyAgenda]);

  useEffect(() => {
    getEducationalLevel();
    getMyExpertiseArea();
    getMyPrice();
    getMyRating();
  }, [getEducationalLevel, getMyExpertiseArea, getMyPrice, getMyRating]);

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

  const totalAvailable = useMemo(() => {
    if (!agendaData?.days) return 0;
    let c = 0;
    agendaData.days.forEach((day) => day.slots?.forEach((s) => { if (s.status === 'available') c++; }));
    return c;
  }, [agendaData]);

  const mergedTeacher = useMemo(() => {
    const price = typeof myPrice === 'number' ? myPrice : teacher.hourlyRate;
    const rating = typeof myRating === 'number' ? myRating : teacher.rating;
    return {
      name: teacher.name,
      subject: myExpertiseArea || teacher.subject,
      level: educationalLevel || teacher.level,
      hourlyRate: price,
      rating,
    };
  }, [teacher, educationalLevel, myExpertiseArea, myPrice, myRating]);

  const handleProceed = (p: { selections: { date: string; hours: string[] }[]; totalHours: number; totalPrice: number }) => {
    const lines = p.selections.map(sel => `${sel.date}: ${sel.hours.join(', ')}`).join('\n');
    alert(`Reservas seleccionadas:\n${lines}\nTotal de horas: ${p.totalHours}\nTotal a pagar: $${p.totalPrice.toFixed(2)} MXN`);
    setOpen(false);
  };

  const justify = align === 'left' ? 'flex-start' : align === 'center' ? 'center' : 'flex-end';

  return (
    <>
      <div style={{ display: 'flex', justifyContent: justify, marginTop: 12, gap: 8 }}>
        <button className="profile-action primary" onClick={() => setOpen(true)} disabled={loading || totalAvailable === 0}>
          Agendar
        </button>
        {/* <button className="profile-action secondary" type="button" onClick={() => setShowConfirm(true)}>
          Ver confirmación (demo)
        </button> */}
      </div>
      <BookLessonModal
        isOpen={open}
        onClose={() => setOpen(false)}
        teacher={mergedTeacher}
        availabilityByDate={availabilityByDate}
        onProceed={handleProceed}
      />
      <BookingConfirmationModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        data={{
          teacherName: mergedTeacher.name,
          subject: mergedTeacher.subject || 'Materia',
          items: [
            { dateLabel: 'Viernes, 25 de Oct de 2024', timeLabel: '10:00 - 11:00 AM (CST)' },
            { dateLabel: 'Lunes, 28 de Oct de 2024', timeLabel: '09:00 - 10:00 AM (CST)' },
          ],
        }}
      />
    </>
  );
}
