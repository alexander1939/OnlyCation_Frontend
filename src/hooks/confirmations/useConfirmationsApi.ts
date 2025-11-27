import { useMemo } from 'react';
import axios, { AxiosError } from 'axios';
import { useAuthToken } from '../auth/useAuthToken';
import type {
  StudentConfirmationPostResponse,
  TeacherConfirmationPostResponse,
  StudentHistoryRecentResponse,
  StudentHistoryAllResponse,
  TeacherHistoryRecentResponse,
  TeacherHistoryAllResponse,
  TeacherHistoryByDateResponse,
  StudentHistoryByDateResponse,
} from '../../context/confirmations/types';

const API_URL = import.meta.env.VITE_API_URL as string;

export const useConfirmationsApi = () => {
  const { getAccessToken } = useAuthToken();

  const client = useMemo(() => {
    return axios.create({
      baseURL: API_URL,
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' },
    });
  }, []);

  // STUDENT
  const postStudentConfirmation = async (
    paymentBookingId: number | string,
    payload: { confirmation: boolean; description_student: string; evidence_file: File | Blob }
  ): Promise<{ success: boolean; data?: StudentConfirmationPostResponse; message: string }> => {
    try {
      const token = getAccessToken();
      if (!token) throw new Error('No hay token de acceso. Inicia sesión nuevamente.');

      const form = new FormData();
      form.append('confirmation', payload.confirmation ? 'true' : 'false');
      form.append('description_student', payload.description_student ?? '');
      form.append('evidence_file', payload.evidence_file);

      const response = await client.post<StudentConfirmationPostResponse>(
        `/confirmation/student/${encodeURIComponent(String(paymentBookingId))}`,
        form,
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }, withCredentials: true }
      );

      const data = response.data;
      return { success: !!data?.success, data, message: data?.message ?? 'Confirmación enviada' };
    } catch (err) {
      const axErr = err as AxiosError<{ detail?: string }>;
      const message = axErr.response?.data?.detail || axErr.message || 'Error al confirmar (alumno)';
      return { success: false, message };
    }
  };

  const getStudentEvidence = async (
    confirmationId: number
  ): Promise<{ success: boolean; blob?: Blob; message: string }> => {
    try {
      const token = getAccessToken();
      if (!token) throw new Error('No hay token de acceso. Inicia sesión nuevamente.');

      const response = await client.get(`/confirm/student/evidence/${confirmationId}` as string, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
        withCredentials: true,
      });
      return { success: true, blob: response.data as Blob, message: 'OK' };
    } catch (err) {
      const axErr = err as AxiosError<{ detail?: string }>;
      const message = axErr.response?.data?.detail || axErr.message || 'Error al descargar evidencia (alumno)';
      return { success: false, message };
    }
  };

  const getStudentHistoryRecent = async (): Promise<{
    success: boolean;
    data?: StudentHistoryRecentResponse;
    message: string;
  }> => {
    try {
      const token = getAccessToken();
      if (!token) throw new Error('No hay token de acceso. Inicia sesión nuevamente.');

      const response = await client.get<StudentHistoryRecentResponse>(
        `/confirmation/student/history/recent`,
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      const data = response.data;
      return { success: !!data?.success, data, message: 'OK' };
    } catch (err) {
      const axErr = err as AxiosError<{ detail?: string }>;
      const message = axErr.response?.data?.detail || axErr.message || 'Error al cargar historial reciente (alumno)';
      return { success: false, message };
    }
  };

  const getStudentHistoryAll = async (offset = 0, limit = 10): Promise<{
    success: boolean;
    data?: StudentHistoryAllResponse;
    message: string;
  }> => {
    try {
      const token = getAccessToken();
      if (!token) throw new Error('No hay token de acceso. Inicia sesión nuevamente.');

      const response = await client.get<StudentHistoryAllResponse>(
        `/confirmation/student/history/all?offset=${offset}&limit=${limit}`,
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      const data = response.data;
      return { success: !!data?.success, data, message: 'OK' };
    } catch (err) {
      const axErr = err as AxiosError<{ detail?: string }>;
      const message = axErr.response?.data?.detail || axErr.message || 'Error al cargar historial (alumno)';
      return { success: false, message };
    }
  };

  const getStudentHistoryByDate = async (dateStr: string): Promise<{ success: boolean; data?: StudentHistoryByDateResponse; message: string }> => {
    try {
      const token = getAccessToken();
      if (!token) throw new Error('No hay token de acceso. Inicia sesión nuevamente.');
      const response = await client.get<StudentHistoryByDateResponse>(
        `/confirmation/student/history/by-date?date=${encodeURIComponent(dateStr)}`,
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      const data = response.data;
      return { success: !!data?.success, data, message: 'OK' };
    } catch (err) {
      const axErr = err as AxiosError<{ detail?: string }>;
      const message = axErr.response?.data?.detail || axErr.message || 'Error al buscar por fecha (alumno)';
      return { success: false, message };
    }
  };

  // TEACHER
  const postTeacherConfirmation = async (
    paymentBookingId: number | string,
    payload: { confirmation: boolean; description_teacher: string; evidence_file: File | Blob }
  ): Promise<{ success: boolean; data?: TeacherConfirmationPostResponse; message: string }> => {
    try {
      const token = getAccessToken();
      if (!token) throw new Error('No hay token de acceso. Inicia sesión nuevamente.');

      const form = new FormData();
      form.append('confirmation', payload.confirmation ? 'true' : 'false');
      form.append('description_teacher', payload.description_teacher ?? '');
      form.append('evidence_file', payload.evidence_file);

      const response = await client.post<TeacherConfirmationPostResponse>(
        `/confirmation/teacher/${encodeURIComponent(String(paymentBookingId))}`,
        form,
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }, withCredentials: true }
      );

      const data = response.data;
      return { success: !!data?.success, data, message: data?.message ?? 'Confirmación enviada' };
    } catch (err) {
      const axErr = err as AxiosError<{ detail?: string }>;
      const message = axErr.response?.data?.detail || axErr.message || 'Error al confirmar (docente)';
      return { success: false, message };
    }
  };

  const getTeacherEvidence = async (
    confirmationId: number
  ): Promise<{ success: boolean; blob?: Blob; message: string }> => {
    try {
      const token = getAccessToken();
      if (!token) throw new Error('No hay token de acceso. Inicia sesión nuevamente.');

      const response = await client.get(`/confirm/teacher/evidence/${confirmationId}` as string, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
        withCredentials: true,
      });
      return { success: true, blob: response.data as Blob, message: 'OK' };
    } catch (err) {
      const axErr = err as AxiosError<{ detail?: string }>;
      const message = axErr.response?.data?.detail || axErr.message || 'Error al descargar evidencia (docente)';
      return { success: false, message };
    }
  };

  const getTeacherHistoryRecent = async (): Promise<{
    success: boolean;
    data?: TeacherHistoryRecentResponse;
    message: string;
  }> => {
    try {
      const token = getAccessToken();
      if (!token) throw new Error('No hay token de acceso. Inicia sesión nuevamente.');

      const response = await client.get<TeacherHistoryRecentResponse>(
        `/confirmation/teacher/history/recent`,
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      const data = response.data;
      return { success: !!data?.success, data, message: 'OK' };
    } catch (err) {
      const axErr = err as AxiosError<{ detail?: string }>;
      const message = axErr.response?.data?.detail || axErr.message || 'Error al cargar historial reciente (docente)';
      return { success: false, message };
    }
  };

  const getTeacherHistoryAll = async (offset = 0, limit = 10): Promise<{
    success: boolean;
    data?: TeacherHistoryAllResponse;
    message: string;
  }> => {
    try {
      const token = getAccessToken();
      if (!token) throw new Error('No hay token de acceso. Inicia sesión nuevamente.');

      const response = await client.get<TeacherHistoryAllResponse>(
        `/confirmation/teacher/history/all?offset=${offset}&limit=${limit}`,
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      const data = response.data;
      return { success: !!data?.success, data, message: 'OK' };
    } catch (err) {
      const axErr = err as AxiosError<{ detail?: string }>;
      const message = axErr.response?.data?.detail || axErr.message || 'Error al cargar historial (docente)';
      return { success: false, message };
    }
  };

  const getTeacherHistoryByDate = async (dateStr: string): Promise<{ success: boolean; data?: TeacherHistoryByDateResponse; message: string }> => {
    try {
      const token = getAccessToken();
      if (!token) throw new Error('No hay token de acceso. Inicia sesión nuevamente.');
      const response = await client.get<TeacherHistoryByDateResponse>(
        `/confirmation/teacher/history/by-date?date=${encodeURIComponent(dateStr)}`,
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      const data = response.data;
      return { success: !!data?.success, data, message: 'OK' };
    } catch (err) {
      const axErr = err as AxiosError<{ detail?: string }>;
      const message = axErr.response?.data?.detail || axErr.message || 'Error al buscar por fecha (docente)';
      return { success: false, message };
    }
  };

  return {
    // Student
    postStudentConfirmation,
    getStudentEvidence,
    getStudentHistoryRecent,
    getStudentHistoryAll,
    getStudentHistoryByDate,
    // Teacher
    postTeacherConfirmation,
    getTeacherEvidence,
    getTeacherHistoryRecent,
    getTeacherHistoryAll,
    getTeacherHistoryByDate,
  };
};
