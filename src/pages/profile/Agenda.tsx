import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBookingContext } from '../../context/booking';
import '../../styles/Booking.css';
import OnboardingSteps from '../../components/OnboardingSteps';
import { useAuthToken } from '../../hooks/auth/useAuthToken';

const BookingPage: React.FC = () => {
  const { createAvailability, creating, error, success, lastResponse, resetStatus } = useBookingContext();
  const { getAccessToken, parseJwt } = useAuthToken();
  const navigate = useNavigate();
  const [preferenceId, setPreferenceId] = useState<string>('');
  const days = [
    { key: 'monday', label: 'Lunes' },
    { key: 'tuesday', label: 'Martes' },
    { key: 'wednesday', label: 'Miércoles' },
    { key: 'thursday', label: 'Jueves' },
    { key: 'friday', label: 'Viernes' },
    { key: 'saturday', label: 'Sábado' },
    { key: 'sunday', label: 'Domingo' },
  ] as const;

  type DayKey = typeof days[number]['key'];
  const [form, setForm] = useState<Record<DayKey, { enabled: boolean; start: string; end: string }>>({
    monday: { enabled: false, start: '09:00', end: '12:00' },
    tuesday: { enabled: false, start: '09:00', end: '12:00' },
    wednesday: { enabled: false, start: '09:00', end: '12:00' },
    thursday: { enabled: false, start: '09:00', end: '12:00' },
    friday: { enabled: false, start: '09:00', end: '12:00' },
    saturday: { enabled: false, start: '09:00', end: '12:00' },
    sunday: { enabled: false, start: '09:00', end: '12:00' },
  });
  const [formError, setFormError] = useState<string | null>(null);

  React.useEffect(() => {
    const token = getAccessToken();
    if (token) {
      const payload = parseJwt<Record<string, any>>(token);
      const pid = payload?.preference_id || payload?.pref_id || payload?.preferenceId;
      if (pid) {
        setPreferenceId(String(pid));
        return;
      }
    }
    const stored = localStorage.getItem('preference_id');
    if (stored) setPreferenceId(stored);
  }, [getAccessToken, parseJwt]);

  const handleToggle = (k: DayKey) => {
    setForm(prev => ({ ...prev, [k]: { ...prev[k], enabled: !prev[k].enabled } }));
    if (error || success || formError) resetStatus();
  };

  // Go to next step when success
  React.useEffect(() => {
    if (success) {
      navigate('/profile/cartera');
    }
  }, [success, navigate]);

  const handleTime = (k: DayKey, field: 'start' | 'end', value: string) => {
    setForm(prev => ({ ...prev, [k]: { ...prev[k], [field]: value } }));
  };

  const handleCreate = async () => {
    setFormError(null);
    const dayNumber: Record<DayKey, number> = {
      monday: 1,
      tuesday: 2,
      wednesday: 3,
      thursday: 4,
      friday: 5,
      saturday: 6,
      sunday: 7,
    };
    const selected = days.filter(d => form[d.key].enabled);
    if (selected.length === 0) {
      setFormError('Selecciona al menos un día.');
      return;
    }
    if (!preferenceId) {
      setFormError('No se detectó preference_id. Vuelve a iniciar sesión o configura tus preferencias.');
      return;
    }
    // Validación de horas y construcción de payloads con fecha completa
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const datePrefix = `${yyyy}-${mm}-${dd}`;

    const payloads = selected.map(d => {
      const start = form[d.key].start; // HH:mm
      const end = form[d.key].end;     // HH:mm
      if (!start || !end || start >= end) {
        throw new Error('Verifica que las horas sean válidas (inicio < fin).');
      }
      return {
        preference_id: Number(preferenceId),
        day_of_week: dayNumber[d.key],
        start_time: `${datePrefix} ${start}:00`,
        end_time: `${datePrefix} ${end}:00`,
      };
    });

    try {
      // Ejecutar en secuencia para respetar el estado del contexto
      for (const p of payloads) {
        // eslint-disable-next-line no-await-in-loop
        await createAvailability(p);
      }
    } catch (e: any) {
      setFormError(e?.message || 'Error al crear la disponibilidad');
    }
  };

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
            <div className="booking-field">
              <label className="booking-label">Selecciona días y horarios</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}>
                {days.map(d => (
                  <div key={d.key} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 120 }}>
                      <input type="checkbox" checked={form[d.key].enabled} onChange={() => handleToggle(d.key)} />
                      <span>{d.label}</span>
                    </label>
                    <input
                      type="time"
                      className="booking-textarea"
                      style={{ maxWidth: 160 }}
                      value={form[d.key].start}
                      onChange={(e) => handleTime(d.key, 'start', e.target.value)}
                      disabled={!form[d.key].enabled}
                    />
                    <span>—</span>
                    <input
                      type="time"
                      className="booking-textarea"
                      style={{ maxWidth: 160 }}
                      value={form[d.key].end}
                      onChange={(e) => handleTime(d.key, 'end', e.target.value)}
                      disabled={!form[d.key].enabled}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="booking-actions">
              <button
                type="button"
                onClick={handleCreate}
                disabled={creating}
                className={`booking-btn--primary ${creating ? 'cursor-not-allowed' : ''}`}
              >
                {creating ? 'Creando...' : 'Crear disponibilidad'}
              </button>
              <button type="button" onClick={resetStatus} className="booking-btn--secondary">
                Limpiar estado
              </button>
            </div>

            {formError && <p className="booking-alert booking-alert--error">{formError}</p>}
            {error && <p className="booking-alert booking-alert--error">{error}</p>}
            {success && lastResponse && (
              <div className="booking-result">
                <p className="booking-alert booking-alert--success">{lastResponse.message || 'Disponibilidad creada exitosamente.'}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
