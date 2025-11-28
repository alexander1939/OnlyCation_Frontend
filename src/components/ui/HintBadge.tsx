import React from 'react';

export interface HintBadgeProps {
  text: string;
  intervalMs?: number; // intervalo entre auto-mostrados
  showDurationMs?: number; // tiempo visible en cada auto-mostrado
  fixed?: boolean; // si es true, permanece visible siempre
  offsetY?: number; // desplazamiento vertical en px desde el ancla
  children: React.ReactNode;
}

const HintBadge: React.FC<HintBadgeProps> = ({
  text,
  intervalMs = 30000,
  showDurationMs = 2800,
  fixed = false,
  offsetY = 36,
  children,
}) => {
  const [visible, setVisible] = React.useState<boolean>(fixed);
  const hideRef = React.useRef<number | null>(null);
  const intervalRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    // Reset visibilidad cuando cambia fixed
    setVisible(fixed);
    if (fixed) {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      if (hideRef.current) window.clearTimeout(hideRef.current);
      return;
    }
    const showOnce = () => {
      setVisible(true);
      if (hideRef.current) window.clearTimeout(hideRef.current);
      hideRef.current = window.setTimeout(() => setVisible(false), showDurationMs);
    };
    intervalRef.current = window.setInterval(showOnce, intervalMs);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      if (hideRef.current) window.clearTimeout(hideRef.current);
    };
  }, [fixed, intervalMs, showDurationMs]);

  const show = () => { if (!fixed) setVisible(true); };
  const hide = () => { if (!fixed) setVisible(false); };

  return (
    <div
      style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      onTouchStart={show}
    >
      <style>{`
        @keyframes hintPulse { 
          0%, 100% { transform: translateX(-50%) translateY(0) scale(1); } 
          50% { transform: translateX(-50%) translateY(0) scale(1.04); } 
        }
      `}</style>
      {children}
      <div
        style={{
          position: 'absolute',
          top: `${offsetY}px`,
          left: '50%',
          transform: visible ? 'translateX(-50%) translateY(0) scale(1)' : 'translateX(-50%) translateY(-4px) scale(0.98)',
          backgroundColor: '#294954',
          color: '#fff',
          padding: '6px 10px',
          borderRadius: '9999px',
          fontSize: '12px',
          boxShadow: '0 6px 14px rgba(41,73,84,0.16)',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          zIndex: 1000,
          opacity: visible ? 1 : 0,
          transition: 'opacity 220ms ease, transform 220ms ease',
          animation: visible ? 'hintPulse 1.6s ease-in-out infinite' : 'none'
        }}
      >
        {text}
      </div>
    </div>
  );
};

export default HintBadge;
