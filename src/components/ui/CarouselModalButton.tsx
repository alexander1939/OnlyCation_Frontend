import React from 'react';
import { createPortal } from 'react-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Keyboard } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export interface CarouselSlide {
  src: string;
  alt?: string;
  caption?: string;
}

export interface CarouselModalButtonProps {
  label?: string;
  slides: CarouselSlide[];
  initialIndex?: number;
  buttonStyle?: React.CSSProperties;
  buttonClassName?: string;
  onOpen?: () => void;
  onClose?: () => void;
}

const defaultBtnStyle: React.CSSProperties = {
  background: '#294954',
  color: '#fff',
  border: 'none',
  borderRadius: 12,
  padding: '10px 14px',
  boxShadow: '0 6px 14px rgba(41,73,84,0.22)',
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'Roboto, system-ui, -apple-system, Segoe UI, Arial, sans-serif',
};

const CarouselModalButton: React.FC<CarouselModalButtonProps> = ({
  label = 'Ver guía',
  slides,
  initialIndex = 0,
  buttonStyle,
  buttonClassName,
  onOpen,
  onClose,
}) => {
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(initialIndex);
  const [fsSrc, setFsSrc] = React.useState<string | null>(null);
  const overlayRef = React.useRef<HTMLDivElement | null>(null);
  const [isMobile, setIsMobile] = React.useState(false);
  const [openCount, setOpenCount] = React.useState(0);

  const openModal = () => {
    setOpen(true);
    setFsSrc(null);
    setActive(Math.min(initialIndex, (slides?.length ?? 1) - 1));
    setOpenCount((c) => c + 1);
    if (onOpen) onOpen();
  };
  const closeModal = () => {
    setOpen(false);
    setFsSrc(null);
    if (onClose) onClose();
  };

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (fsSrc) setFsSrc(null); else closeModal();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, fsSrc]);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(max-width: 640px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // Avoid SSR issues with portals (Vite dev ok, but guard anyway)
  const portalRoot = typeof document !== 'undefined' ? document.body : null;

  const computedBtnStyle: React.CSSProperties = buttonClassName
    ? (buttonStyle || {})
    : { ...defaultBtnStyle, ...buttonStyle };

  return (
    <>
      <button onClick={openModal} className={buttonClassName} style={computedBtnStyle}>
        {label}
      </button>

      {open && portalRoot && createPortal(
        <>
          <div
            ref={overlayRef}
            role="dialog"
            aria-modal="true"
            onClick={closeModal}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 1000,
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                width: 'clamp(320px, 96vw, 980px)',
                background: '#fff',
                borderRadius: 16,
                overflow: 'hidden',
                boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
                display: 'flex',
                flexDirection: 'column',
                maxHeight: '90vh',
                fontFamily: 'Roboto, system-ui, -apple-system, Segoe UI, Arial, sans-serif',
              }}
            >
            <style>{`
              .swiper-button-next, .swiper-button-prev { 
                color: #294954; 
                width: ${isMobile ? '28px' : '34px'}; 
                height: ${isMobile ? '28px' : '34px'}; 
                background: rgba(255,255,255,0.9); 
                border-radius: 9999px; 
                box-shadow: 0 6px 14px rgba(0,0,0,0.15);
              }
              .swiper-button-next:after, .swiper-button-prev:after { font-size: ${isMobile ? '14px' : '16px'}; }
              .swiper-pagination-bullet { background: #cbd5e1; opacity: 1; }
              .swiper-pagination-bullet-active { background: #294954; }
              .cms-caption { 
                font-family: 'Roboto', system-ui, -apple-system, 'Segoe UI', Arial, sans-serif; 
                font-weight: 700; 
                font-size: ${isMobile ? '15px' : '16px'}; 
                color: #0b1d29; 
                line-height: 1.45; 
                letter-spacing: 0.1px;
              }
              .cms-step-badge { 
                font-family: 'Roboto', system-ui, -apple-system, 'Segoe UI', Arial, sans-serif; 
                background: #294954; 
                color: #fff; 
                padding: ${isMobile ? '4px 8px' : '5px 10px'}; 
                border-radius: 9999px; 
                font-weight: 700; 
                font-size: ${isMobile ? '12px' : '13px'}; 
                box-shadow: 0 6px 14px rgba(0,0,0,0.15);
              }
            `}</style>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', padding: '10px 12px', borderBottom: '1px solid #eef2f7' }}>
              <div style={{ fontWeight: 700, color: '#294954' }}>Galería</div>
              <button
                aria-label="Cerrar"
                onClick={closeModal}
                style={{ marginLeft: 'auto', background: 'transparent', border: 0, cursor: 'pointer', fontSize: 18, padding: 6, color: '#294954' }}
              >
                ×
              </button>
            </div>

            {/* Caption on top */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '10px 14px', borderBottom: '1px solid #eef2f7', background: '#f8fafc' }}>
              <div className="cms-caption">{slides[active]?.caption ?? `Imagen ${active + 1} de ${slides.length}`}</div>
              <div className="cms-step-badge">Paso {active + 1} de {slides.length}</div>
            </div>

            {/* Carousel */}
            <div style={{ position: 'relative', padding: isMobile ? 8 : 12, background: '#0b1d29' }}>
              {slides && slides.length > 0 ? (
                <Swiper
                  key={openCount}
                  modules={[Navigation, Pagination, Keyboard]}
                  navigation
                  pagination={{ clickable: true }}
                  keyboard={{ enabled: true }}
                  onSlideChange={(s) => { setActive(s.activeIndex); setFsSrc(null); }}
                  initialSlide={Math.min(initialIndex, slides.length - 1)}
                  style={{ width: '100%', height: '100%' }}
                >
                  {slides.map((sl, idx) => (
                    <SwiperSlide key={idx}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', minHeight: isMobile ? '52vh' : '56vh' }}>
                        <img
                          src={sl.src}
                          alt={sl.alt || `Imagen ${idx + 1}`}
                          loading="lazy"
                          onClick={() => setFsSrc(sl.src)}
                          style={{
                            width: '100%',
                            height: 'auto',
                            maxHeight: isMobile ? '52vh' : '64vh',
                            objectFit: 'contain',
                            borderRadius: 12,
                            userSelect: 'none',
                            cursor: 'zoom-in',
                            transition: 'opacity 180ms ease',
                          }}
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                <div style={{ padding: '24px 10px', color: '#64748b' }}>No hay imágenes para mostrar.</div>
              )}
            </div>
            </div>
          </div>

          {fsSrc && (
            <div
              onClick={() => setFsSrc(null)}
              style={{
                position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 1100,
                cursor: 'zoom-out'
              }}
            >
              <img
                src={fsSrc}
                alt={slides[active]?.alt || `Imagen ${active + 1}`}
                style={{ maxWidth: '96vw', maxHeight: '96vh', objectFit: 'contain', borderRadius: 8 }}
                onClick={() => setFsSrc(null)}
              />
              <button
                aria-label="Cerrar imagen"
                onClick={() => setFsSrc(null)}
                style={{ position: 'fixed', top: 12, right: 12, background: 'rgba(0,0,0,0.6)', color: '#fff', border: 0, borderRadius: 9999, width: 36, height: 36, fontSize: 20, cursor: 'pointer' }}
              >
                ×
              </button>
            </div>
          )}
        </>,
        portalRoot
      )}
    </>
  );
};

export default CarouselModalButton;
