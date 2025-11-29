import React from 'react';
import { useNavigate } from 'react-router-dom';

interface DashboardCardProps {
  title: string;
  description: string;
  linkText: string;
  route: string;
  icon: React.ElementType; // componente React del icono
  iconColor?: string;
  iconBg?: string;
  backgroundColor?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  description,
  linkText,
  route,
  icon: Icon,
  iconColor = '#3B82F6',
  iconBg = '#E6EEFF',
  backgroundColor = 'white',
}) => {
  const navigate = useNavigate();
  const overlayRef = React.useRef<HTMLDivElement | null>(null);

  const hexToRgb = (hex: string) => {
    const m = hex.trim().replace('#','');
    const full = m.length === 3 ? m.split('').map(c => c + c).join('') : m;
    const num = parseInt(full, 16);
    const r = (num >> 16) & 255; const g = (num >> 8) & 255; const b = num & 255;
    return { r, g, b };
  };
  const { r, g, b } = hexToRgb(iconColor);

  return (
    <div
      style={{
        backgroundColor,
        borderRadius: '1rem',
        padding: '1.5rem',
        boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        cursor: 'pointer',
        fontFamily: 'Roboto, sans-serif',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
      onClick={() => navigate(route)}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 6px 14px rgba(0,0,0,0.1)';
        e.currentTarget.style.transform = 'translateY(-2px)';
        if (overlayRef.current) overlayRef.current.style.opacity = '1';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.05)';
        e.currentTarget.style.transform = 'translateY(0)';
        if (overlayRef.current) overlayRef.current.style.opacity = '0';
      }}
    >
      <div
        ref={overlayRef}
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '1rem',
          background: `radial-gradient(180px 180px at 95% 5%, rgba(${r},${g},${b},0.18) 0%, rgba(${r},${g},${b},0.10) 45%, transparent 60%)`,
          opacity: 0,
          transition: 'opacity 200ms ease',
          pointerEvents: 'none'
        }}
      />
      {/* Icono circular */}
      <div
        style={{
          backgroundColor: iconBg,
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1rem',
        }}
      >
        <Icon color={iconColor} size={24} />
      </div>

      <h3
        style={{
          fontSize: '1.1rem',
          fontWeight: 'bold',
          marginBottom: '0.5rem',
          color: '#1F2937',
        }}
      >
        {title}
      </h3>

      <p style={{ color: '#4B5563', marginBottom: '1rem', fontSize: '0.95rem' }}>
        {description}
      </p>

      <span
        onClick={(e) => {
          e.stopPropagation();
          navigate(route);
        }}
        style={{
          color: iconColor,
          fontWeight: 600,
          fontSize: '0.95rem',
          marginTop: 'auto',
        }}
      >
        {linkText} →
      </span>
    </div>
  );
};

export default DashboardCard;
