import React, { useEffect } from 'react';
import '../../styles/booking-modal.css';

export type ConfirmDialogProps = {
  isOpen: boolean;
  title?: string;
  description?: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  loading?: boolean;
};

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title = 'Confirmar acción',
  description = '¿Estás seguro de realizar esta acción?',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  loading = false,
}) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="booking-modal-overlay" onClick={() => (!loading ? onCancel() : void 0)}>
      <div className="booking-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="booking-modal-header">
          <h2 className="booking-modal-title">{title}</h2>
          <button className="booking-modal-close" onClick={onCancel} disabled={loading}>×</button>
        </div>

        <div className="booking-modal-content">
          <div className="booking-modal-section" style={{ display: 'grid', gap: 12 }}>
            <div style={{ color: '#374151', fontSize: 14 }}>{description}</div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
              <button type="button" className="btn-ver-detalles" onClick={onCancel} disabled={loading}>
                {cancelText}
              </button>
              <button type="button" className="btn-unirse" onClick={onConfirm} disabled={loading}>
                {loading ? 'Procesando…' : confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
