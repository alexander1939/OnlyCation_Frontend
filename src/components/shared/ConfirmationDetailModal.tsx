import React, { useEffect, useState } from 'react';
import '../../styles/booking-modal.css';
import type { ConfirmationDetailData } from '../../context/confirmations';
import { useConfirmationsApi } from '../../hooks/confirmations/useConfirmationsApi';

export type ConfirmationDetailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
  error: string | null;
  detail: ConfirmationDetailData | null;
};

const formatDate = (dateTimeStr?: string | null) => {
  if (!dateTimeStr) return '-';
  const date = new Date(dateTimeStr);
  return (
    date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }) +
    ', ' +
    date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true })
  );
};

export default function ConfirmationDetailModal({ isOpen, onClose, loading, error, detail }: ConfirmationDetailModalProps) {
  const api = useConfirmationsApi();
  const [downloadingStudent, setDownloadingStudent] = useState(false);
  const [downloadingTeacher, setDownloadingTeacher] = useState(false);
  const [evidenceError, setEvidenceError] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setDownloadingStudent(false);
      setDownloadingTeacher(false);
      setEvidenceError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const triggerDownload = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const handleDownloadEvidence = async (side: 'student' | 'teacher') => {
    if (!detail) return;
    setEvidenceError(null);
    try {
      if (side === 'student') setDownloadingStudent(true);
      else setDownloadingTeacher(true);

      const res = await api.getConfirmationEvidence(detail.id, side, true); // download=true
      if (res.success && res.blob) {
        const filename = `evidencia_${side}_${detail.id}`;
        triggerDownload(res.blob, filename);
      } else {
        setEvidenceError(res.message || 'No se pudo descargar la evidencia');
      }
    } catch (e: any) {
      setEvidenceError(e?.message || 'Error al descargar la evidencia');
    } finally {
      setDownloadingStudent(false);
      setDownloadingTeacher(false);
    }
  };

  return (
    <div className="booking-modal-overlay" onClick={onClose}>
      <div className="booking-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="booking-modal-header">
          <div>
            <h2 className="booking-modal-title">Detalle de confirmación</h2>
            {detail && <p className="booking-modal-id">ID #{detail.id} · Reserva #{detail.payment_booking_id}</p>}
          </div>
          <button className="booking-modal-close" onClick={onClose}>×</button>
        </div>

        <div className="booking-modal-content">
          {loading && <p className="text-gray-600">Cargando detalle…</p>}

          {error && (
            <div className="booking-modal-error" style={{ marginTop: 0 }}>
              <span className="booking-modal-error-icon">⚠️</span>
              <div>
                <h4 className="booking-modal-error-title">Error</h4>
                <p className="booking-modal-error-message">{error}</p>
              </div>
            </div>
          )}

          {evidenceError && (
            <div className="booking-modal-error" style={{ marginTop: 12 }}>
              <span className="booking-modal-error-icon">⚠️</span>
              <div>
                <h4 className="booking-modal-error-title">Evidencia</h4>
                <p className="booking-modal-error-message">{evidenceError}</p>
              </div>
            </div>
          )}

          {detail && !loading && !error && (
            <div className="booking-modal-section" style={{ display: 'grid', gap: 12 }}>
              <div>
                <h4 style={{ margin: 0, color: '#294954' }}>Información</h4>
                <p style={{ margin: '8px 0 0 0', color: '#374151' }}>Inicio: {formatDate(detail.booking_start)}</p>
                <p style={{ margin: '4px 0 0 0', color: '#374151' }}>Fin: {formatDate(detail.booking_end)}</p>
              </div>

              <div>
                <h4 style={{ margin: 0, color: '#294954' }}>Estado</h4>
                <p style={{ margin: '8px 0 0 0', color: '#374151' }}>Alumno: {detail.confirmed_by_student ? `Confirmado (${formatDate(detail.confirmed_by_student)})` : '—'}</p>
                <p style={{ margin: '4px 0 0 0', color: '#374151' }}>Docente: {detail.confirmed_by_teacher ? `Confirmado (${formatDate(detail.confirmed_by_teacher)})` : '—'}</p>
              </div>

              <div>
                <h4 style={{ margin: 0, color: '#294954' }}>Descripciones</h4>
                <p style={{ margin: '8px 0 0 0', color: '#374151' }}>Alumno: {detail.description_student || '—'}</p>
                <p style={{ margin: '4px 0 0 0', color: '#374151' }}>Docente: {detail.description_teacher || '—'}</p>
              </div>

              <div>
                <h4 style={{ margin: 0, color: '#294954' }}>Evidencias</h4>
                <div style={{ display: 'flex', gap: 12, marginTop: 8, flexWrap: 'wrap' }}>
                  {detail.evidence_student ? (
                    <button
                      type="button"
                      className="btn-ver-detalles"
                      onClick={() => handleDownloadEvidence('student')}
                      disabled={downloadingStudent}
                    >
                      {downloadingStudent ? 'Descargando…' : 'Descargar evidencia alumno'}
                    </button>
                  ) : (
                    <span className="text-gray-500">Sin evidencia del alumno</span>
                  )}
                  {detail.evidence_teacher ? (
                    <button
                      type="button"
                      className="btn-ver-detalles"
                      onClick={() => handleDownloadEvidence('teacher')}
                      disabled={downloadingTeacher}
                    >
                      {downloadingTeacher ? 'Descargando…' : 'Descargar evidencia docente'}
                    </button>
                  ) : (
                    <span className="text-gray-500">Sin evidencia del docente</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
