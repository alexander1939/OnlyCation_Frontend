import { useMemo, useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import '../../styles/docente-agenda.css';

type Slot = { id: string; from: string; to: string };

type DayKey = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

const dayLabels: Record<DayKey, string> = {
  monday: 'Lunes',
  tuesday: 'Martes',
  wednesday: 'Miércoles',
  thursday: 'Jueves',
  friday: 'Viernes',
  saturday: 'Sábado',
  sunday: 'Domingo',
};

export default function AgendaDocente() {
  const [slots, setSlots] = useState<Record<DayKey, Slot[]>>({
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [],
  });

  // Estado para días habilitados/deshabilitados
  const [enabledDays, setEnabledDays] = useState<Record<DayKey, boolean>>({
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: false,
    sunday: false,
  });

  const weekKeys = useMemo<DayKey[]>(() => ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'], []);

  // Modal state for hour selection
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDay, setModalDay] = useState<DayKey | null>(null);
  const [selectedHours, setSelectedHours] = useState<Set<number>>(new Set());

  const openAddModal = (day: DayKey) => {
    if (!enabledDays[day]) {
      alert('Este día está deshabilitado. Habilítalo primero para agregar horarios.');
      return;
    }
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

  const toHH = (n: number) => `${n.toString().padStart(2,'0')}:00`;

  const consolidate = (hours: number[]): Array<{from: string; to: string}> => {
    if (hours.length === 0) return [];
    const sorted = [...hours].sort((a,b)=>a-b).filter(h => h>=0 && h<=23);
    const ranges: Array<{from: string; to: string}> = [];
    let start = sorted[0];
    let prev = sorted[0];
    for (let i=1;i<sorted.length;i++){
      const h = sorted[i];
      if (h === prev + 1){
        prev = h;
      } else {
        ranges.push({ from: toHH(start), to: toHH(prev+1) });
        start = h; prev = h;
      }
    }
    ranges.push({ from: toHH(start), to: toHH(prev+1) });
    return ranges;
  };

  const confirmAdd = () => {
    if (!modalDay) return;
    const ranges = consolidate(Array.from(selectedHours));
    if (ranges.length === 0){
      setIsModalOpen(false);
      return;
    }
    setSlots((prev) => ({
      ...prev,
      [modalDay]: [
        ...prev[modalDay],
        ...ranges.map(r => ({ id: crypto.randomUUID(), from: r.from, to: r.to }))
      ],
    }));
    setIsModalOpen(false);
    setModalDay(null);
    setSelectedHours(new Set());
  };

  const handleRemove = (day: DayKey, id: string) => {
    setSlots((prev) => ({
      ...prev,
      [day]: prev[day].filter((s) => s.id !== id),
    }));
  };

  const toggleDayEnabled = (day: DayKey) => {
    const currentlyEnabled = Object.values(enabledDays).filter(Boolean).length;
    
    // No permitir deshabilitar si es el último día activo
    if (enabledDays[day] && currentlyEnabled === 1) {
      alert('Debes tener al menos un día activo en tu agenda.');
      return;
    }

    setEnabledDays((prev) => ({
      ...prev,
      [day]: !prev[day],
    }));

    // Si se deshabilita un día, limpiar sus slots
    if (enabledDays[day]) {
      setSlots((prev) => ({
        ...prev,
        [day]: [],
      }));
    }
  };

  return (
    <div className="min-h-screen flex flex-col page-container">
      <Header />
      <main className="flex-1 main-spacing">
        <section className="agenda-container">
          <h1 className="agenda-title">Horario semanal</h1>
          <p className="agenda-subtitle">Establece tu horario semanal. Los horarios se aplicarán a todas las semanas.</p>

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
                      onClick={() => toggleDayEnabled(key)}
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
                        {slots[key].map((slot) => (
                          <div key={slot.id} className="agenda-chip">
                            <span>{slot.from} - {slot.to}</span>
                            <button aria-label="remove" className="chip-remove" onClick={() => handleRemove(key, slot.id)}>×</button>
                          </div>
                        ))}
                      </div>

                      <button className="agenda-add" onClick={() => openAddModal(key)}>+ Agregar horario</button>
                    </>
                  )}
                </div>
              );})}
            </div>
          </div>

          {isModalOpen && (
            <div className="modal-backdrop" role="dialog" aria-modal="true">
              <div className="modal-card">
                <div className="modal-header">
                  <h2 className="modal-title">Selecciona horas</h2>
                </div>
                <div className="modal-body">
                  <div className="hours-grid">
                    {Array.from({ length: 24 }, (_, i) => i).map((h) => {
                      const active = selectedHours.has(h);
                      return (
                        <button
                          key={h}
                          type="button"
                          className={"hour-btn" + (active ? " is-active" : "")}
                          onClick={() => toggleHour(h)}
                        >
                          {toHH(h)} - {toHH(h+1)}
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
        </section>
      </main>
      <Footer />
    </div>
  );
}
