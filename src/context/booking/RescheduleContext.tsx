import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import RescheduleBookingModal from '../../components/booking/RescheduleBookingModal';
import { useNotificationContext } from '../../components/NotificationProvider';
import { useAuthContext } from '../auth';

export type RescheduleOpenParams = {
  bookingId: number;
  teacherId: number;
  currentStart: string; // ISO
  currentEnd: string;   // ISO
  requiredHours: number; // duración en horas que debe mantenerse
};

export type RescheduleContextType = {
  openRescheduleModal: (params: RescheduleOpenParams) => void;
  closeRescheduleModal: () => void;
};

const RescheduleContext = createContext<RescheduleContextType | undefined>(undefined);

export const RescheduleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuthContext();
  const { showError } = useNotificationContext();

  const [isOpen, setIsOpen] = useState(false);
  const [params, setParams] = useState<RescheduleOpenParams | null>(null);

  const openRescheduleModal = useCallback((p: RescheduleOpenParams) => {
    // Solo alumno puede reagendar, y solo con datos válidos
    if (!user || user.role !== 'student') {
      showError('Solo los alumnos pueden reagendar reservas.');
      return;
    }
    if (!p?.bookingId || !p?.teacherId || !p?.currentEnd || !p?.requiredHours) {
      showError('Faltan datos para reagendar esta reserva.');
      return;
    }
    setParams(p);
    setIsOpen(true);
  }, [user, showError]);

  const closeRescheduleModal = useCallback(() => {
    setIsOpen(false);
    setParams(null);
  }, []);

  const value = useMemo(() => ({ openRescheduleModal, closeRescheduleModal }), [openRescheduleModal, closeRescheduleModal]);

  return (
    <RescheduleContext.Provider value={value}>
      {children}
      {/* Montar el modal solo cuando esté abierto para evitar fechas inválidas iniciales */}
      {isOpen && params && (
        <RescheduleBookingModal
          isOpen={isOpen}
          onClose={closeRescheduleModal}
          bookingId={params.bookingId}
          teacherId={params.teacherId}
          currentStart={params.currentStart}
          currentEnd={params.currentEnd}
          requiredHours={params.requiredHours}
        />
      )}
    </RescheduleContext.Provider>
  );
};

export const useRescheduleContext = (): RescheduleContextType => {
  const ctx = useContext(RescheduleContext);
  if (!ctx) throw new Error('useRescheduleContext debe usarse dentro de un RescheduleProvider');
  return ctx;
};
