import React, { useMemo, useState } from 'react';
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

const SubjectsCatalog: React.FC = () => {
  const [activeLevel, setActiveLevel] = useState<Level>('Preparatoria');
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState(false);
  
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
            <div className={`sc-carousel-track ${carouselItems.length ? '' : 'sc-carousel-empty'}`}>
              {carouselItems.map((s, idx) => (
                <div
                  key={`${s.id}-${idx}`}
                  role="button"
                  tabIndex={0}
                  className="sc-card sc-card--carousel"
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
                    <span className="sc-icon">{s.icon}</span>
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
                  <span className="sc-icon">{s.icon}</span>
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
