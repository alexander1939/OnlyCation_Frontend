import { useMemo, useState, useEffect, useRef } from 'react';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import '../../styles/teacher-catalog.css';

type TeacherItem = {
  id: string;
  name: string;
  subject: string;
  level: 'Preparatoria' | 'Universidad' | 'Posgrado';
  hourlyRate: number;
  rating: number;
  available: boolean;
  videoUrl: string;
  thumbnailUrl?: string;
};

const EXAMPLE: TeacherItem[] = [
  {
    id: 't1',
    name: 'Dr. Evelyn Reed',
    subject: 'Matemáticas',
    level: 'Universidad',
    hourlyRate: 350,
    rating: 4.8,
    available: true,
    videoUrl: 'https://youtu.be/tdFNA7YBM4c',
  },
  {
    id: 't2',
    name: 'Lic. Alan Grant',
    subject: 'Física',
    level: 'Preparatoria',
    hourlyRate: 280,
    rating: 4.9,
    available: false,
    videoUrl: 'https://www.youtube.com/watch?v=ysz5S6PUM-U',
  },
  {
    id: 't3',
    name: 'Dr. Ian Malcolm',
    subject: 'Estadística',
    level: 'Posgrado',
    hourlyRate: 450,
    rating: 4.7,
    available: false,
    videoUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
  },
  {
    id: 't4',
    name: 'Ing. Sarah Connor',
    subject: 'Programación',
    level: 'Universidad',
    hourlyRate: 400,
    rating: 5.0,
    available: true,
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  },
];

function extractYouTubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname === 'youtu.be') return u.pathname.slice(1);
    if (u.hostname.includes('youtube.com')) {
      const v = u.searchParams.get('v');
      if (v) return v;
      const parts = u.pathname.split('/').filter(Boolean);
      const embedIdx = parts.indexOf('embed');
      if (embedIdx >= 0 && parts[embedIdx + 1]) return parts[embedIdx + 1];
      const shortsIdx = parts.indexOf('shorts');
      if (shortsIdx >= 0 && parts[shortsIdx + 1]) return parts[shortsIdx + 1];
    }
  } catch {}
  return null;
}

export default function TeacherCatalog() {
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [levels, setLevels] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number>(0);
  const [priceMin, setPriceMin] = useState<number>(100);
  const [priceMax, setPriceMax] = useState<number>(1000);
  const [showVideo, setShowVideo] = useState(false);
  const [videoEmbed, setVideoEmbed] = useState<string>('');
  const [subjectDropdownOpen, setSubjectDropdownOpen] = useState(false);
  const [subjectSearch, setSubjectSearch] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const subjects = ['Matemáticas', 'Física', 'Estadística', 'Programación', 'Biología', 'Literatura', 'Química', 'Historia', 'Geografía', 'Inglés', 'Francés', 'Arte'];
  
  const filteredSubjects = useMemo(() => {
    if (!subjectSearch) return subjects;
    return subjects.filter(s => s.toLowerCase().includes(subjectSearch.toLowerCase()));
  }, [subjectSearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setSubjectDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const items = useMemo(() => {
    return EXAMPLE.map((t) => {
      const id = extractYouTubeId(t.videoUrl);
      const thumbnailUrl = id ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg` : undefined;
      return { ...t, thumbnailUrl } as TeacherItem;
    });
  }, []);

  const filtered = useMemo(() => {
    return items.filter((t) => {
      if (name && !t.name.toLowerCase().includes(name.toLowerCase())) return false;
      if (subject && t.subject !== subject) return false;
      if (levels.length && !levels.includes(t.level)) return false;
      if (t.rating < minRating) return false;
      if (t.hourlyRate < priceMin || t.hourlyRate > priceMax) return false;
      return true;
    });
  }, [items, name, subject, levels, minRating, priceMin, priceMax]);

  const toggleLevel = (lvl: string) => {
    setLevels((prev) => (prev.includes(lvl) ? prev.filter((x) => x !== lvl) : [...prev, lvl]));
  };

  const onPlay = (url: string) => {
    const id = extractYouTubeId(url);
    if (!id) return;
    setVideoEmbed(`https://www.youtube.com/embed/${id}?autoplay=1`);
    setShowVideo(true);
  };

  const handleCardClick = (teacherId: string) => {
    // TODO: Navigate to teacher profile page
    console.log('Navigate to teacher profile:', teacherId);
    // Future: navigate(`/teacher/${teacherId}`);
  };

  const clearFilters = () => {
    setName('');
    setSubject('');
    setLevels([]);
    setMinRating(0);
    setPriceMin(100);
    setPriceMax(1000);
  };

  return (
    <div className="catalog-page page-container">
      <Header />
      <main className="catalog-main main-spacing">
        <section className="catalog-container">
          <div className="catalog-grid">
            <div className={`filter-overlay ${filtersOpen ? 'active' : ''}`} onClick={() => setFiltersOpen(false)}></div>
            <aside className={`catalog-filters ${filtersOpen ? 'open' : ''}`}>
              <div className="filters-title">
                <div style={{display: 'flex', alignItems: 'center', gap: '10px', flex: 1}}>
                  <span className="label-icon">⚙️</span>
                  <h3>Filtros Avanzados</h3>
                </div>
                <button 
                  className="btn-close-filters"
                  onClick={() => setFiltersOpen(false)}
                  aria-label="Cerrar filtros"
                >
                  ✕
                </button>
              </div>

              <label className="filter-field">
                <div className="label-row"><span className="label-icon">🔍</span><span>Nombre del Docente</span></div>
                <div className="filter-input-wrap">
                  <input className="filter-input" placeholder="Buscar por nombre..." value={name} onChange={(e) => setName(e.target.value)} />
                </div>
              </label>

              <div className="filter-field">
                <div className="label-row"><span className="label-icon">📚</span><span>Materia</span></div>
                <div className="searchable-select-wrapper" ref={dropdownRef}>
                  <div className="searchable-select-input-wrapper">
                    <input
                      ref={inputRef}
                      type="text"
                      className="searchable-select-input"
                      placeholder={subject || 'Buscar materia...'}
                      value={subjectSearch}
                      onChange={(e) => setSubjectSearch(e.target.value)}
                      onFocus={() => setSubjectDropdownOpen(true)}
                      autoComplete="off"
                    />
                    {subject && (
                      <button
                        type="button"
                        className="clear-selection"
                        onClick={() => {
                          setSubject('');
                          setSubjectSearch('');
                          inputRef.current?.focus();
                        }}
                        aria-label="Limpiar selección"
                      >
                        ✕
                      </button>
                    )}
                    <span className={`searchable-select-arrow ${subjectDropdownOpen ? 'open' : ''}`}>🔍</span>
                  </div>
                  {subjectDropdownOpen && (
                    <div className="searchable-select-dropdown">
                      {!subjectSearch && (
                        <button
                          type="button"
                          className={`searchable-select-option ${!subject ? 'selected' : ''}`}
                          onClick={() => {
                            setSubject('');
                            setSubjectSearch('');
                            setSubjectDropdownOpen(false);
                          }}
                        >
                          Todas las materias
                          {!subject && <span className="check-icon">✓</span>}
                        </button>
                      )}
                      {filteredSubjects.length > 0 ? (
                        filteredSubjects.map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            className={`searchable-select-option ${subject === opt ? 'selected' : ''}`}
                            onClick={() => {
                              setSubject(opt);
                              setSubjectSearch('');
                              setSubjectDropdownOpen(false);
                            }}
                          >
                            {opt}
                            {subject === opt && <span className="check-icon">✓</span>}
                          </button>
                        ))
                      ) : (
                        <div className="no-results">
                          <span className="no-results-icon">🔍</span>
                          <p>No se encontraron materias</p>
                          <small>Intenta con otro término</small>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="filter-group">
                <div className="label-row"><span className="label-icon">🎓</span><h4>Nivel Educativo</h4></div>
                <div className="pill-row">
                  {(['Preparatoria','Universidad','Posgrado'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      className={`pill ${levels.includes(lvl) ? 'on' : ''}`}
                      onClick={() => toggleLevel(lvl)}
                      aria-pressed={levels.includes(lvl)}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="filter-group price-group">
                <div className="label-row"><span className="label-icon">💲</span><h4>Rango de Precio / hora</h4></div>
                <div className="price-head">
                  <span>Hasta</span>
                  <span className="price-badge">${priceMax} MXN/hr</span>
                </div>
                <div className="price-range">
                  <input type="range" min={100} max={1000} step={10} value={priceMax} onChange={(e)=> setPriceMax(Number(e.target.value))} aria-label="Precio máximo por hora" />
                  <div className="price-scale">
                    <span>$100 MXN</span>
                    <span>${priceMax} MXN</span>
                    <span>$1000 MXN</span>
                  </div>
                </div>
              </div>

              <div className="filter-group rating-group">
                <div className="label-row"><span className="label-icon">⭐</span><h4>Calificación Mínima</h4></div>
                <div className="rating-row">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <button
                      key={i}
                      type="button"
                      className={`star-btn ${minRating >= i ? 'on' : ''}`}
                      onClick={() => setMinRating(i)}
                      aria-label={`${i} estrellas o más`}
                      aria-pressed={minRating >= i}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div className="filter-actions">
                <button type="button" className="btn-primary" onClick={() => {}}>
                  Buscar Docentes
                </button>
                <button type="button" className="btn-secondary" onClick={clearFilters}>
                  Limpiar Filtros
                </button>
              </div>
            </aside>

            <div className="catalog-results">
              <div className="results-header">
                <div>
                  <h1 className="results-title">Catálogo de Docentes</h1>
                  <p className="results-sub">Explora perfiles, mira sus videos y elige al mejor para ti.</p>
                </div>
                <button className="btn-filter-mobile" onClick={() => setFiltersOpen(!filtersOpen)}>
                  <span>{filtersOpen ? '✕' : '⚙️'}</span>
                  <span>{filtersOpen ? 'Cerrar' : 'Filtros'}</span>
                </button>
              </div>

              <div className="cards-grid">
                {filtered.map((t, idx) => (
                  <article 
                    key={t.id} 
                    className="card card-appear" 
                    style={{ animationDelay: `${idx * 80}ms` }}
                    onClick={() => handleCardClick(t.id)}
                  >
                    <div className="card-video" style={{ backgroundImage: `url(${t.thumbnailUrl})` }} aria-label={`Video de ${t.name}`}>
                      <button 
                        className="card-play" 
                        onClick={(e) => {
                          e.stopPropagation();
                          onPlay(t.videoUrl);
                        }} 
                        aria-label={`Reproducir video de ${t.name}`}
                      >
                        ▶
                      </button>
                    </div>
                    <div className="card-body">
                      <div className="card-header">
                        <h3 className="card-name" title={t.name}>{t.name}</h3>
                        {t.available && <span className="badge-available">Disponible</span>}
                      </div>
                      <div className="card-meta">
                        <span className="chip chip-subject">{t.subject}</span>
                        <span className="chip chip-level">{t.level}</span>
                      </div>
                      <div className="card-actions">
                        <div className="info-boxes">
                          <div className="info-box price-box">
                            <span className="info-value">${t.hourlyRate}</span>
                            <span className="info-label">MXN/HORA</span>
                          </div>
                          <div className="info-box rating-box">
                            <div className="rating-content">
                              <span className="star-icon">★</span>
                              <span className="info-value">{t.rating.toFixed(1)}</span>
                            </div>
                            <span className="info-label">CALIFICACIÓN</span>
                          </div>
                        </div>
                        <a 
                          className="link-profile"
                          onClick={(e) => {
                            e.preventDefault();
                            handleCardClick(t.id);
                          }}
                          href="#"
                        >
                          Ver Perfil
                          <span className="arrow-icon">→</span>
                        </a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <div className="load-more">
                <button className="btn-primary">
                  Cargar más resultados
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      {showVideo && (
        <div className="video-modal-overlay" role="dialog" aria-modal="true">
          <div className="video-modal">
            <div className="video-aspect">
              <iframe src={videoEmbed} title="Video de presentación" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
              <button className="video-close" aria-label="Cerrar video" onClick={() => setShowVideo(false)}>✕</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
