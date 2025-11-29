import React, { useEffect, useMemo, useRef, useState } from 'react';
import { BookOpen, Calculator, FlaskConical, Languages, Code, GraduationCap, Cpu, TrendingUp, Globe } from 'lucide-react';
import '../../styles/subjects-catalog.css';

type Level = 'Preparatoria' | 'Universidad' | 'Posgrado';

interface SubjectItem {
  id: string;
  name: string;
  level: Level;
  icon: string;
}

const LEVELS: Level[] = ['Preparatoria', 'Universidad', 'Posgrado'];

const SUBJECTS: SubjectItem[] = [
  { id: 'alg-prepa', name: 'Álgebra', level: 'Preparatoria', icon: '🎓' },
  { id: 'qui-prepa', name: 'Química General', level: 'Preparatoria', icon: '⚗️' },
  { id: 'his-prepa', name: 'Historia de México', level: 'Preparatoria', icon: '🏛️' },
  { id: 'ing-prepa', name: 'Inglés Avanzado', level: 'Preparatoria', icon: '🗣️' },
  { id: 'dib-prepa', name: 'Dibujo Técnico', level: 'Preparatoria', icon: '✍️' },
  { id: 'bio-prepa', name: 'Biología', level: 'Preparatoria', icon: '🔬' },
  { id: 'lit-prepa', name: 'Literatura Universal', level: 'Preparatoria', icon: '📖' },
  { id: 'fis-prepa', name: 'Física I', level: 'Preparatoria', icon: '🧪' },

  { id: 'cal-uni', name: 'Cálculo Diferencial', level: 'Universidad', icon: '∫' },
  { id: 'prog-uni', name: 'Programación I', level: 'Universidad', icon: '💻' },
  { id: 'eco-uni', name: 'Microeconomía', level: 'Universidad', icon: '📈' },
  { id: 'der-uni', name: 'Derecho Civil', level: 'Universidad', icon: '⚖️' },

  { id: 'ia-pos', name: 'Machine Learning', level: 'Posgrado', icon: '🤖' },
  { id: 'inv-pos', name: 'Metodología de la Investigación', level: 'Posgrado', icon: '🔎' },
  { id: 'fin-pos', name: 'Finanzas Avanzadas', level: 'Posgrado', icon: '💹' },
];

// Map subject names to icon + colors (fallback to GraduationCap)
const getSubjectVisual = (name: string) => {
  const n = name.toLowerCase();
  // Matemáticas
  if (/(álgebra|algebra|cálculo|calculo|mate)/.test(n)) {
    return { Icon: Calculator, color: '#1d9ad6', bg: 'rgba(29,154,214,0.12)' };
  }
  // Ciencias
  if (/(quím|quim|fís|fis|biolog|quimica|física|biología)/.test(n)) {
    return { Icon: FlaskConical, color: '#0ea5e9', bg: 'rgba(14,165,233,0.12)' };
  }
  // Programación / IA
  if (/(program|código|codigo|comput|sistemas|machine|learning|ia|inteligencia)/.test(n)) {
    return { Icon: Code, color: '#7c3aed', bg: 'rgba(124,58,237,0.12)' };
  }
  // Economía / Finanzas
  if (/(econ|finan|micro|macro|contab|finanzas)/.test(n)) {
    return { Icon: TrendingUp, color: '#16a34a', bg: 'rgba(22,163,74,0.12)' };
  }
  // Idiomas
  if (/(inglés|ingles|idioma|language|francés|frances|alemán|aleman)/.test(n)) {
    return { Icon: Languages, color: '#2563eb', bg: 'rgba(37,99,235,0.12)' };
  }
  // Historia / Humanidades / Literatura
  if (/(historia|literat|filos|human)/.test(n)) {
    return { Icon: BookOpen, color: '#0f766e', bg: 'rgba(15,118,110,0.12)' };
  }
  // Geografía / Globales
  if (/(geo|mundo|global)/.test(n)) {
    return { Icon: Globe, color: '#059669', bg: 'rgba(5,150,105,0.12)' };
  }
  return { Icon: GraduationCap, color: '#475569', bg: 'rgba(71,85,105,0.12)' };
};

const SubjectsCatalog: React.FC = () => {
  const [activeLevel, setActiveLevel] = useState<Level>('Preparatoria');
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState(false);
  // Carousel state/refs
  const trackRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const prevTsRef = useRef<number | null>(null);
  const posRef = useRef<number>(0); // current translateX
  const halfWidthRef = useRef<number>(0);
  const [dragging, setDragging] = useState(false);
  const startXRef = useRef<number>(0);
  const startPosRef = useRef<number>(0);
  const dragMovedRef = useRef<boolean>(false);
  
  const handleSelect = (s: SubjectItem) => {
    const params = new URLSearchParams({ subject: s.id, level: s.level });
    window.location.href = `/catalog/teachers?${params.toString()}`;
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SUBJECTS.filter(s => s.level === activeLevel && (q === '' || s.name.toLowerCase().includes(q)));
  }, [activeLevel, query]);

  const carouselItems = useMemo(() => {
    const base = filtered.slice(0, 6);
    if (base.length === 0) return [];
    // duplicamos para loop infinito
    return [...base, ...base];
  }, [filtered]);

  // Measure half width for wrap-around
  const measure = () => {
    const el = trackRef.current;
    if (!el) return;
    const total = el.scrollWidth;
    halfWidthRef.current = total / 2;
  };

  useEffect(() => {
    measure();
    const onResize = () => measure();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [carouselItems.length, expanded]);

  // Apply transform
  const apply = () => {
    const el = trackRef.current;
    if (!el) return;
    el.style.transform = `translateX(${posRef.current}px)`;
  };

  // Wrap position to create infinite loop
  const wrap = () => {
    const half = halfWidthRef.current;
    if (!half) return;
    while (posRef.current <= -half) posRef.current += half;
    while (posRef.current > 0) posRef.current -= half;
  };

  // Auto-scroll when not dragging and not expanded
  useEffect(() => {
    const speed = 40; // px/seg
    const step = (ts: number) => {
      if (prevTsRef.current == null) prevTsRef.current = ts;
      const dt = (ts - prevTsRef.current) / 1000;
      prevTsRef.current = ts;
      if (!dragging && !expanded && carouselItems.length > 0) {
        posRef.current -= speed * dt;
        wrap();
        apply();
      }
      frameRef.current = requestAnimationFrame(step);
    };
    frameRef.current = requestAnimationFrame(step);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
      prevTsRef.current = null;
    };
  }, [dragging, expanded, carouselItems.length]);

  const onPointerDown: React.PointerEventHandler<HTMLDivElement> = (e) => {
    if (expanded || carouselItems.length === 0) return;
    setDragging(true);
    dragMovedRef.current = false;
    startXRef.current = e.clientX;
    startPosRef.current = posRef.current;
  };

  const onPointerMove: React.PointerEventHandler<HTMLDivElement> = (e) => {
    if (!dragging) return;
    const dx = e.clientX - startXRef.current;
    if (Math.abs(dx) > 5) dragMovedRef.current = true;
    posRef.current = startPosRef.current + dx;
    wrap();
    apply();
  };

  const endDrag = (e?: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    setDragging(false);
    prevTsRef.current = null; // suaviza reanudación
    try { if (e) (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId); } catch {}
  };

  const onPointerCancel: React.PointerEventHandler<HTMLDivElement> = (e) => {
    endDrag(e);
  };

  return (
    <section className="py-[60px] px-4 sm:px-[50px] bg-soft-white subjects-catalog">
      <div className="max-w-[1200px] mx-auto">
        <h2 className="sc-title mb-2">Catálogo de Materias</h2>
        <p className="sc-subtitle mb-6">Explora, busca y encuentra las materias disponibles en cada nivel educativo.</p>

        <div className="mb-6">
          <div className="flex items-center bg-white rounded-[14px] border sc-search">
            <div className="pl-4 pr-2 select-none sc-search-icon">🔎</div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar materia..."
              className="w-full outline-none rounded-[14px] py-3 pr-4 sc-search-input"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 sc-tabs">
          {LEVELS.map(level => {
            const active = level === activeLevel;
            return (
              <button
                key={level}
                onClick={() => setActiveLevel(level)}
                className={`sc-tab sc-tab-pill ${active ? 'active' : ''}`}
              >
                {level}
              </button>
            );
          })}
        </div>

        {!expanded ? (
          <div className="mt-6 sc-carousel-container">
            <div
              ref={trackRef}
              className={`sc-carousel-track ${carouselItems.length ? '' : 'sc-carousel-empty'} ${dragging ? 'dragging' : ''}`}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={endDrag}
              onPointerLeave={endDrag}
              onPointerCancel={onPointerCancel}
            >
              {carouselItems.map((s, idx) => (
                <div
                  key={`${s.id}-${idx}`}
                  role="button"
                  tabIndex={0}
                  className="sc-card sc-card--carousel"
                  onClick={() => { if (!dragMovedRef.current) handleSelect(s); }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSelect(s);
                    }
                  }}
                  aria-label={`Abrir profesores para ${s.name} en ${s.level}`}
                >
                  <div className="sc-card-media">
                    {(() => { const { Icon, color, bg } = getSubjectVisual(s.name); return (
                      <div style={{ width: 56, height: 56, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon color={color} size={28} />
                      </div>
                    ); })()}
                  </div>
                  <div className="p-4 sc-card-body">
                    <div className="sc-card-title truncate">{s.name}</div>
                    <div className="sc-card-level">{s.level}</div>
                  </div>
                </div>
              ))}
            </div>
            {filtered.length === 0 && (
              <div className="sc-card-level mt-4">No se encontraron materias para esta búsqueda.</div>
            )}
          </div>
        ) : (
          <div className="mt-6 sc-grid">
            {filtered.map(s => (
              <div
                key={s.id}
                role="button"
                tabIndex={0}
                className="sc-card"
                onClick={() => handleSelect(s)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSelect(s);
                  }
                }}
                aria-label={`Abrir profesores para ${s.name} en ${s.level}`}
              >
                <div className="sc-card-media">
                  {(() => { const { Icon, color, bg } = getSubjectVisual(s.name); return (
                    <div style={{ width: 56, height: 56, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon color={color} size={28} />
                    </div>
                  ); })()}
                </div>
                <div className="p-4 sc-card-body">
                  <div className="sc-card-title truncate">{s.name}</div>
                  <div className="sc-card-level">{s.level}</div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full sc-card-level">No se encontraron materias para esta búsqueda.</div>
            )}
          </div>
        )}

        <div className="mt-6 flex justify-center">
          <button
            className="sc-primary-btn"
            onClick={() => setExpanded(prev => !prev)}
            aria-label={expanded ? 'Mostrar carrusel' : 'Cargar más materias'}
          >
            {expanded ? 'Mostrar carrusel' : 'Cargar más materias'}
          </button>
        </div>
      </div>
    </section>
  );
}

export default SubjectsCatalog;
