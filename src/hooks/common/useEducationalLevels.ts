import { useState, useEffect } from 'react';
import type { EducationalLevel } from '../../context/common';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const useEducationalLevels = () => {
  const [educationalLevels, setEducationalLevels] = useState<EducationalLevel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEducationalLevels = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/educational-levels/`);
      if (!response.ok) throw new Error('Error al cargar los niveles educativos');
      const data = await response.json();
      setEducationalLevels(data);
    } catch (err) {
      setError('Error al cargar los niveles educativos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEducationalLevels();
  }, []);

  return {
    educationalLevels,
    loading,
    error,
    refetch: fetchEducationalLevels
  };
};

export default useEducationalLevels;
