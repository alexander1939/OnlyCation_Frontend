import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTeacherConfirmationsContext, useStudentConfirmationsContext } from '../../context/confirmations';

type ConfirmationViewProps = {
  role?: string;
};

export default function ConfirmationView({ role }: ConfirmationViewProps) {
  const isTeacher = (role || '').toLowerCase() === 'teacher';
  const teacherCtx = isTeacher ? useTeacherConfirmationsContext() : null;
  const studentCtx = !isTeacher ? useStudentConfirmationsContext() : null;

  const [dateInput, setDateInput] = useState(''); // Admite YYYY-MM-DD o DD/MM/YYYY
  const [lastQuery, setLastQuery] = useState('');

  const loading = useMemo(() => (isTeacher ? teacherCtx?.dateLoading : studentCtx?.dateLoading) || false, [isTeacher, teacherCtx?.dateLoading, studentCtx?.dateLoading]);
  const error = useMemo(() => (isTeacher ? teacherCtx?.dateError : studentCtx?.dateError) || null, [isTeacher, teacherCtx?.dateError, studentCtx?.dateError]);
  const items = useMemo(() => (isTeacher ? teacherCtx?.dateItems : studentCtx?.dateItems) || [], [isTeacher, teacherCtx?.dateItems, studentCtx?.dateItems]);

  const parseDateForApi = (value: string) => {
    const val = value.trim();
    if (!val) return '';
    // Si viene en YYYY-MM-DD, mandamos tal cual
    if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val;
    // Si viene en DD/MM/YYYY, mandamos tal cual también (backend lo soporta)
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(val)) return val;
    return val; // fallback: mandamos lo que el usuario ingresó
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = parseDateForApi(dateInput);
    if (!q) return;
    setLastQuery(q);
    if (isTeacher) await teacherCtx?.loadTeacherByDate(q);
    else await studentCtx?.loadStudentByDate(q);
  };

  const formatDate = (dateTimeStr: string) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
  };
  const formatTime = (dateTimeStr: string) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF9F5' }}>
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-slate-800">Confirmaciones</h1>
          <Link to={isTeacher ? '/teacher/my_next_booking' : '/student/my_next_booking'} className="view-all-btn-header">↩️ Volver</Link>
        </div>
        <p className="text-slate-600 mb-6">
          Busca y filtra tus confirmaciones por fecha. Formatos válidos: <b>YYYY-MM-DD</b> o <b>DD/MM/YYYY</b>.
        </p>

        {/* Filtro por fecha */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm text-slate-700 mb-6">
          <form onSubmit={handleSearch} className="flex flex-col gap-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="col-span-1">
                <label className="block text-sm font-semibold text-slate-700 mb-1">Fecha (YYYY-MM-DD)</label>
                <input
                  type="date"
                  value={/^\d{4}-\d{2}-\d{2}$/.test(dateInput) ? dateInput : ''}
                  onChange={(e) => setDateInput(e.target.value)}
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1">O escribe fecha (DD/MM/YYYY)</label>
                <input
                  type="text"
                  placeholder="p. ej. 11/11/2025"
                  value={/^[^\d]{0}$/.test(dateInput) ? '' : dateInput}
                  onChange={(e) => setDateInput(e.target.value)}
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button type="submit" className="btn-unirse" disabled={!dateInput || loading}>
                {loading ? 'Buscando…' : 'Buscar por fecha'}
              </button>
              {lastQuery && (
                <span className="text-sm text-slate-500">Consulta: {lastQuery}</span>
              )}
            </div>
          </form>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-4 text-red-600">{error}</div>
          )}
        </div>

        {/* Resultados */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm text-slate-700">
          <h2 className="text-lg font-bold text-slate-800 mb-3">Resultados</h2>
          {loading && <p className="text-slate-600">Cargando…</p>}
          {!loading && items.length === 0 && (
            <p className="text-slate-600">No hay confirmaciones para la fecha consultada.</p>
          )}
          {!loading && items.length > 0 && (
            <div className="asesorias-list">
              {items.map((it) => (
                <div key={it.id} className="clase-asistida-item">
                  <div className="clase-asistida-icon">🗓️</div>
                  <div className="clase-asistida-content">
                    <div className="clase-asistida-materia">Reserva #{it.payment_booking_id}</div>
                    <div className="clase-asistida-datetime">
                      Finalizó: {formatDate(it.booking_end)}, {formatTime(it.booking_end)}
                    </div>
                  </div>
                  {it.confirmable_now ? (
                    <div className="confirmacion-badge pendiente">
                      <span>⏳</span>
                      Ventana abierta
                    </div>
                  ) : (
                    <div className="confirmacion-badge confirmada">
                      <span>📌</span>
                      Registrada/No disponible
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
