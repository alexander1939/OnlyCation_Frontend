import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useCatalogsApi, type EducationalLevel, type Modality } from '../../hooks/catalogs/useCatalogsApi';

interface CatalogsContextType {
  educationalLevels: EducationalLevel[];
  modalities: Modality[];
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

const CatalogsContext = createContext<CatalogsContextType | undefined>(undefined);

export const CatalogsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { getEducationalLevels, getModalities } = useCatalogsApi();
  const [educationalLevels, setEducationalLevels] = useState<EducationalLevel[]>([]);
  const [modalities, setModalities] = useState<Modality[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [levels, mods] = await Promise.all([
        getEducationalLevels(),
        getModalities(),
      ]);
      setEducationalLevels(levels);
      setModalities(mods);
    } catch (e: any) {
      setError(e?.message || 'Error al cargar catálogos');
    } finally {
      setLoading(false);
    }
  }, [getEducationalLevels, getModalities]);

  useEffect(() => { void load(); }, [load]);

  const value = useMemo(() => ({ educationalLevels, modalities, loading, error, reload: load }), [educationalLevels, modalities, loading, error, load]);

  return (
    <CatalogsContext.Provider value={value}>
      {children}
    </CatalogsContext.Provider>
  );
};

export const useCatalogsContext = (): CatalogsContextType => {
  const ctx = useContext(CatalogsContext);
  if (!ctx) throw new Error('useCatalogsContext must be used within a CatalogsProvider');
  return ctx;
};
