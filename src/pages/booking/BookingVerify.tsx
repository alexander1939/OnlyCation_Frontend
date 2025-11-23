import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import { useVerifyBookingContext } from '../../context/booking';
import BookingConfirmationModal from '../../components/booking/BookingConfirmationModal';
import type { BookingConfirmationData } from '../../components/booking/BookingConfirmationModal';
import BookingErrorModal from '../../components/booking/BookingErrorModal';
import { useBookingApi } from '../../hooks/booking/useBookingApi';

export default function BookingVerify() {
  const [params] = useSearchParams();
  const sessionId = params.get('session_id') || '';
  const navigate = useNavigate();

  const { loading, error, result, verifyBooking } = useVerifyBookingContext();
  const { getBookingDetail } = useBookingApi();

  const requestedRef = useRef<string | null>(null);
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [confirmData, setConfirmData] = useState<BookingConfirmationData | null>(null);

  useEffect(() => {
    if (!sessionId) return;
    // Evitar múltiples llamadas por el mismo session_id
    if (requestedRef.current === sessionId) return;
    requestedRef.current = sessionId;

    (async () => {
      const res = await verifyBooking(sessionId);
      try { console.log('[BookingVerify][DEBUG] verifyBooking response:', res); } catch {}

      // Intentar recuperar un preview guardado antes de ir a Stripe
      let preview: BookingConfirmationData | null = null;
      try {
        const raw = sessionStorage.getItem('onlycation_booking_preview');
        if (raw) {
          preview = JSON.parse(raw) as BookingConfirmationData;
          console.log('[BookingVerify][DEBUG] preview from sessionStorage:', preview);
        }
      } catch (e) {
        console.log('[BookingVerify][DEBUG] failed to read preview:', e);
      }
      try { sessionStorage.removeItem('onlycation_booking_preview'); } catch {}

      if (res.success) {
        // Si hay booking_id, intentamos obtener detalles para poblar el modal
        const bookingId = res.data?.data?.booking_id;
        if (bookingId) {
          const detailRes = await getBookingDetail(bookingId);
          try { console.log('[BookingVerify][DEBUG] getBookingDetail response:', detailRes); } catch {}
          if (detailRes.success && detailRes.data?.data) {
            const d = detailRes.data.data;
            const start = new Date(d.start_time);
            const end = new Date(d.end_time);
            const dateLabel = start.toLocaleDateString('es-ES', {
              weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
            });
            const timeLabel = `${start.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false })} - ${end.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false })}`;
            setConfirmData({
              teacherName: `${d.teacher.first_name} ${d.teacher.last_name}`,
              subject: d.materia,
              // Si tenemos preview (multi-slot), usarlo; si no, al menos un item con start/end
              items: preview?.items && preview.items.length > 0 ? preview.items : [{ dateLabel, timeLabel }],
            });
          } else {
            // Éxito pero sin detalle: usar preview si existe; si no, genérico
            setConfirmData(preview ?? { teacherName: 'Docente', subject: '—', items: [] });
          }
        } else {
          // Éxito pero sin booking_id en respuesta: usar preview si existe; si no, genérico
          setConfirmData(preview ?? { teacherName: 'Docente', subject: '—', items: [] });
        }
        setSuccessOpen(true);
      } else {
        setErrorOpen(true);
      }
      // Limpiar el query param para evitar reintentos al re-render o refresh
      const url = new URL(window.location.href);
      url.searchParams.delete('session_id');
      window.history.replaceState({}, '', url.toString());
    })();
  }, [sessionId, verifyBooking, getBookingDetail]);

  const goMyBookings = () => navigate('/student/my_next_booking');

  return (
    <div className="min-h-screen flex flex-col page-container">
      <Header />
      <main className="flex-1 main-spacing">
        <section className="docente-container" style={{ maxWidth: 720, margin: '0 auto' }}>
          <h1 className="section-heading">Verificando tu pago...</h1>
          {!sessionId && (
            <p className="text-gray-700" style={{ marginTop: 12 }}>
              No se encontró el parámetro <code>session_id</code>. Por favor, regresa a tus reservas.
            </p>
          )}

          {loading && null}

          {!loading && error && (
            <div style={{ marginTop: 16 }}>
              <p style={{ color: '#b91c1c' }}>Error: {error}</p>
              <div style={{ marginTop: 12 }}>
                <Link to="/student/my_next_booking" className="profile-action primary">Ir a mis próximas clases</Link>
              </div>
            </div>
          )}

          {!loading && result && (
            <div style={{ marginTop: 16 }}>
              <h2 className="section-heading" style={{ marginBottom: 8 }}>Pago verificado</h2>
              <p className="text-gray-700">{result.message}</p>
            </div>
          )}
        </section>
      </main>
      <Footer />

      {loading && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40"
          role="status"
          aria-busy="true"
          aria-live="polite"
        >
          <div className="rounded-2xl bg-white p-6 shadow-xl flex flex-col items-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-[#294954]" />
            <p className="mt-3 text-gray-700">Procesando tu pago y creando tu reserva…</p>
          </div>
        </div>
      )}

      {/* Modales */}
      <BookingConfirmationModal
        isOpen={successOpen}
        onClose={goMyBookings}
        data={confirmData || { teacherName: 'Docente', subject: '—', items: [] }}
        onGoToMyBookings={goMyBookings}
      />
      <BookingErrorModal
        isOpen={errorOpen}
        onClose={goMyBookings}
      />
    </div>
  );
}
