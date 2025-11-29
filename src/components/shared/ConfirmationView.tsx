import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useOptionalTeacherConfirmationsContext, useOptionalStudentConfirmationsContext } from '../../context/confirmations';
import { useOptionalConfirmationDetailContext } from '../../context/confirmations';
import ConfirmationDetailModal from './ConfirmationDetailModal';

type ConfirmationViewProps = {
  role?: string;
};

export default function ConfirmationView({ role }: ConfirmationViewProps) {
  const isTeacher = (role || '').toLowerCase() === 'teacher';
  // Usar hooks opcionales para evitar errores si el Provider no está presente
  const teacherCtx = useOptionalTeacherConfirmationsContext();
  const studentCtx = useOptionalStudentConfirmationsContext();
  const detailCtx = useOptionalConfirmationDetailContext();

  // Modo: 'all' (listado paginado) o 'byDate' (filtrado)
  const [mode, setMode] = useState<'all' | 'byDate'>('all');
  const [dateInput, setDateInput] = useState(''); // Admite YYYY-MM-DD o DD/MM/YYYY
  const [lastQuery, setLastQuery] = useState('');
  const [detailOpen, setDetailOpen] = useState(false);

  // Estados para 'byDate'
  const dateLoading = useMemo(() => (isTeacher ? teacherCtx?.dateLoading : studentCtx?.dateLoading) || false, [isTeacher, teacherCtx?.dateLoading, studentCtx?.dateLoading]);
  const dateError = useMemo(() => (isTeacher ? teacherCtx?.dateError : studentCtx?.dateError) || null, [isTeacher, teacherCtx?.dateError, studentCtx?.dateError]);
  const dateItems = useMemo(() => (isTeacher ? teacherCtx?.dateItems : studentCtx?.dateItems) || [], [isTeacher, teacherCtx?.dateItems, studentCtx?.dateItems]);

  // Estados para 'all' (paginado)
  const allLoading = useMemo(() => (isTeacher ? teacherCtx?.allLoading : studentCtx?.allLoading) || false, [isTeacher, teacherCtx?.allLoading, studentCtx?.allLoading]);
  const allError = useMemo(() => (isTeacher ? teacherCtx?.allError : studentCtx?.allError) || null, [isTeacher, teacherCtx?.allError, studentCtx?.allError]);
  const allItems = useMemo(() => (isTeacher ? teacherCtx?.allItems : studentCtx?.allItems) || [], [isTeacher, teacherCtx?.allItems, studentCtx?.allItems]);
  const total = useMemo(() => (isTeacher ? teacherCtx?.total : studentCtx?.total) ?? 0, [isTeacher, teacherCtx?.total, studentCtx?.total]);
  const hasMore = useMemo(() => (isTeacher ? teacherCtx?.hasMore : studentCtx?.hasMore) ?? false, [isTeacher, teacherCtx?.hasMore, studentCtx?.hasMore]);
  const pageOffset = useMemo(() => (isTeacher ? teacherCtx?.offset : studentCtx?.offset) ?? 0, [isTeacher, teacherCtx?.offset, studentCtx?.offset]);
  const pageLimit = useMemo(() => (isTeacher ? teacherCtx?.limit : studentCtx?.limit) ?? 10, [isTeacher, teacherCtx?.limit, studentCtx?.limit]);

  // Derivados según modo
  const loading = mode === 'byDate' ? dateLoading : allLoading;
  const error = mode === 'byDate' ? dateError : allError;
  const items = mode === 'byDate' ? dateItems : allItems;

  // Cargar listado paginado al entrar
  useEffect(() => {
    if (isTeacher) teacherCtx?.loadTeacherAll?.(0, 10);
    else studentCtx?.loadStudentAll?.(0, 10);
    setMode('all');
    setLastQuery('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTeacher]);

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
    setMode('byDate');
    if (isTeacher) await teacherCtx?.loadTeacherByDate?.(q);
    else await studentCtx?.loadStudentByDate?.(q);
  };

  const handleClearFilter = async () => {
    setDateInput('');
    setLastQuery('');
    setMode('all');
    if (isTeacher) await teacherCtx?.loadTeacherAll?.(0, pageLimit || 10);
    else await studentCtx?.loadStudentAll?.(0, pageLimit || 10);
  };

  const handlePrevPage = async () => {
    const prevOffset = Math.max(0, (pageOffset || 0) - (pageLimit || 10));
    if (isTeacher) await teacherCtx?.loadTeacherAll?.(prevOffset, pageLimit || 10);
    else await studentCtx?.loadStudentAll?.(prevOffset, pageLimit || 10);
  };

  const handleNextPage = async () => {
    const nextOffset = (pageOffset || 0) + (pageLimit || 10);
    if (isTeacher) await teacherCtx?.loadTeacherAll?.(nextOffset, pageLimit || 10);
    else await studentCtx?.loadStudentAll?.(nextOffset, pageLimit || 10);
  };

  const openDetail = async (confirmationId: number) => {
    if (!detailCtx) return;
    await detailCtx.fetchDetail(confirmationId);
    setDetailOpen(true);
  };

  const closeDetail = () => {
    setDetailOpen(false);
    detailCtx?.resetDetail();
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
              <button type="button" className="btn-ver-detalles" onClick={handleClearFilter} disabled={mode === 'all' && !lastQuery}>
                Limpiar filtro
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
          <h2 className="text-lg font-bold text-slate-800 mb-3">{mode === 'byDate' ? 'Resultados por fecha' : 'Todas las confirmaciones'}</h2>
          {loading && <p className="text-slate-600">Cargando…</p>}
          {!loading && items.length === 0 && (
            <p className="text-slate-600">{mode === 'byDate' ? 'No hay confirmaciones para la fecha consultada.' : 'No hay confirmaciones registradas.'}</p>
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
                    {typeof it.has_assessment_by_student === 'boolean' && (
                      <div style={{ marginTop: 6 }}>
                        <div
                          className={`confirmacion-badge ${it.has_assessment_by_student ? 'confirmada' : 'pendiente'}`}
                          title={it.has_assessment_by_student ? 'El alumno ya contestó la evaluación' : 'El alumno no ha contestado la evaluación'}
                        >
                          <span>🧾</span>
                          {isTeacher
                            ? (it.has_assessment_by_student ? 'Evaluación del alumno' : 'Sin evaluación del alumno')
                            : (it.has_assessment_by_student ? 'Tu evaluación enviada' : 'Tu evaluación pendiente')}
                        </div>
                      </div>
                    )}
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
                  <div>
                    <button className="btn-ver-detalles" onClick={() => openDetail(it.id)}>
                      Ver detalle
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {mode === 'all' && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-slate-500">
                Página: {Math.floor((pageOffset || 0) / (pageLimit || 10)) + 1} · Mostrando {items.length} de {total}
              </div>
              <div className="flex items-center gap-2">
                <button className="btn-ver-detalles" onClick={handlePrevPage} disabled={loading || (pageOffset || 0) <= 0}>
                  ← Anterior
                </button>
                <button className="btn-unirse" onClick={handleNextPage} disabled={loading || !hasMore}>
                  Siguiente →
                </button>
              </div>
            </div>
          )}
        </div>
        {/* Modal de detalle */}
        <ConfirmationDetailModal
          isOpen={detailOpen}
          onClose={closeDetail}
          loading={!!detailCtx?.loading}
          error={detailCtx?.error || null}
          detail={detailCtx?.detail || null}
        />
      </div>
    </div>
  );
}
