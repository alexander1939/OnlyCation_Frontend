import type { Teacher } from '../hooks/teachers/useTeachersApi';

const CACHE_KEY = 'teachers_cache';
const CACHE_TIMESTAMP_KEY = 'teachers_cache_timestamp';

interface TeachersCache {
  teachers: Teacher[];
  timestamp: number;
}

export const saveTeachersToCache = (teachers: Teacher[]) => {
  try {
    if (!Array.isArray(teachers)) {
      console.warn('Teachers no es un array, no se puede guardar en caché');
      return;
    }
    
    const cache: TeachersCache = {
      teachers: teachers.slice(0, 10), // Guardar solo los primeros 10
      timestamp: Date.now()
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    console.log('Profesores guardados en caché:', teachers.length, '→', cache.teachers.length);
  } catch (error) {
    console.error('Error al guardar profesores en caché:', error);
  }
};

export const getTeachersFromCache = (): Teacher[] | null => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) {
      console.log('No hay profesores en caché');
      return null;
    }

    const cache: TeachersCache = JSON.parse(cached);
    const now = Date.now();
    const age = now - cache.timestamp;

    console.log('Profesores encontrados en caché:', cache.teachers.length);
    console.log('Antigüedad del caché:', Math.round(age / 1000 / 60), 'minutos');

    // Siempre devolver el caché, sin importar la antigüedad
    // El caché sirve como respaldo cuando el backend no está disponible
    return cache.teachers;
  } catch (error) {
    console.error('Error al leer profesores del caché:', error);
    return null;
  }
};

export const clearTeachersCache = () => {
  try {
    localStorage.removeItem(CACHE_KEY);
    localStorage.removeItem(CACHE_TIMESTAMP_KEY);
    console.log('Caché de profesores eliminado');
  } catch (error) {
    console.error('Error al eliminar caché:', error);
  }
};
