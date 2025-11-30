import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Booking.css';
import OnboardingSteps from '../../components/OnboardingSteps';
import AvailabilityConfig from '../../components/AvailabilityConfig';
import { ScheduleProvider } from '../../context/availability/ScheduleContext';
import { useSchedule, type DayKey } from '../../context/availability/ScheduleContext';
import { useAgendaApi } from '../../hooks/availability/useavailabilityApi';
import { useTokenRefresh } from '../../hooks/auth/useTokenRefresh';

const BookingPage: React.FC = () => {
  // Al montar la página, si falta preference_id intentamos renovarlo
  const { refreshIfMissingPreference } = useTokenRefresh();
  const navigate = useNavigate();
  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await refreshIfMissingPreference();
      } catch {}
    })();
    return () => { mounted = false; };
  }, [refreshIfMissingPreference]);

  return (
    <div className="booking-page booking-container">
      <div className="booking-wrap">
        <OnboardingSteps />
        <div className="booking-header">
          <h1 className="booking-title booking-title-lg">Crear disponibilidad</h1>
          <p className="booking-subtitle booking-text-sm">Registra tus bloques de disponibilidad para la agenda.</p>
        </div>

        <div className="booking-card">
          <div className="booking-body">
            <ScheduleProvider>
              <AvailabilityConfig />
              <SaveAvailabilityBar />
            </ScheduleProvider>
          </div>
        </div>
      </div>
      <div className="onboarding-mascot">
        <img src="/Activar_cuenta.png" alt="activar cuenta" />
      </div>
    </div>
  );
};

export default BookingPage;

const SaveAvailabilityBar: React.FC = () => {
  const { enabledDays, slots, dayKeyToIndex } = useSchedule();
  const { createAvailability } = useAgendaApi();
  const [creating, setCreating] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const navigate = useNavigate();
  const { refreshIfMissingPreference } = useTokenRefresh();

  // Map DayKey -> backend day_of_week (1=Mon..7=Sun) using context indices (Sun=0..Sat=6)
  const toBackendDow = (dayKey: DayKey): number => ((dayKeyToIndex[dayKey] + 6) % 7) + 1;

  const onSave = async () => {
    setCreating(true);
    setError(null);
    setSuccess(null);
    try {
      // Asegurar preference_id: si no existe, refrescar tokens y datos primero
      let pref = (localStorage.getItem('user_preference_id') || '').trim();
      if (!pref) {
        await refreshIfMissingPreference();
        pref = (localStorage.getItem('user_preference_id') || '').trim();
      }
      if (!pref) throw new Error('No se detectó preference_id. Actualiza la página o inicia sesión nuevamente.');
      const preference_id = Number(pref);
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      const datePrefix = `${yyyy}-${mm}-${dd}`;

      // Build requests per selected hour
      const requests: Array<Promise<any>> = [];
      (Object.keys(enabledDays) as DayKey[]).forEach((dayKey) => {
        if (!enabledDays[dayKey]) return;
        const daySlots = slots[dayKey] || [];
        daySlots.forEach((s) => {
          const start_time = `${datePrefix} ${s.hour}:00`;
          const [hStr] = s.hour.split(':');
          const endHour = String(Number(hStr) + 1).padStart(2, '0');
          const end_time = `${datePrefix} ${endHour}:00`;
          const payload = {
            preference_id,
            day_of_week: toBackendDow(dayKey),
            start_time,
            end_time,
          };
          requests.push(createAvailability(payload));
        });
      });

      if (requests.length === 0) {
        throw new Error('No hay horarios seleccionados para guardar.');
      }

      for (const req of requests) {
        // eslint-disable-next-line no-await-in-loop
        const res = await req;
        if (!res?.success) throw new Error(res?.message || 'Error al crear disponibilidad');
      }
      setSuccess('Disponibilidad guardada correctamente.');
      navigate('/profile/continue');
    } catch (e: any) {
      setError(e?.message || 'Error al guardar');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="booking-actions" style={{ marginTop: '1rem' }}>
      <button
        type="button"
        className="booking-btn--danger booking-btn--lg booking-btn--exit"
        onClick={() => navigate('/teacher-home')}
      >
        Salir de activación
      </button>
      <button type="button" className="booking-btn--primary booking-btn--lg booking-btn--next" onClick={onSave} disabled={creating}>
        {creating ? 'Guardando...' : 'Siguiente'}
      </button>
      {error && <p className="booking-alert booking-alert--error" style={{ marginTop: 8 }}>{error}</p>}
      {success && <p className="booking-alert booking-alert--success" style={{ marginTop: 8 }}>{success}</p>}
    </div>
  );
};
