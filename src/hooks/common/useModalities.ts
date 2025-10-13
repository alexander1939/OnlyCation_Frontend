import { useState, useEffect } from 'react';
import type { Modality } from '../../context/common';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const useModalities = () => {
  const [modalities, setModalities] = useState<Modality[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchModalities = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/modalities/`);
      if (!response.ok) throw new Error('Error al cargar las modalidades');
      const data = await response.json();
      setModalities(data);
    } catch (err) {
      setError('Error al cargar las modalidades');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModalities();
  }, []);

  return {
    modalities,
    loading,
    error,
    refetch: fetchModalities
  };
};

export default useModalities;
