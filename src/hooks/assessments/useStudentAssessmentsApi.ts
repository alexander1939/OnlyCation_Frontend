import { useMemo } from 'react';
import axios, { AxiosError } from 'axios';
import { useAuthToken } from '../auth/useAuthToken';
import type { AssessmentCreate, PublicAssessmentComment } from '../../context/assessments/types';

const API_URL = import.meta.env.VITE_API_URL as string;

export const useStudentAssessmentsApi = () => {
  const { getAccessToken } = useAuthToken();

  const client = useMemo(() => {
    return axios.create({
      baseURL: API_URL,
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' },
    });
  }, []);

  const createAssessment = async (
    paymentBookingId: number | string,
    payload: { qualification: number; comment: string }
  ): Promise<{ success: boolean; message: string; data?: AssessmentCreate }> => {
    try {
      const token = getAccessToken();
      if (!token) throw new Error('No hay token de acceso. Inicia sesión nuevamente.');
      const res = await client.post<AssessmentCreate>(
        `/assessments/create/${encodeURIComponent(String(paymentBookingId))}`,
        { qualification: payload.qualification, comment: payload.comment },
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      return { success: true, message: 'Evaluación creada', data: res.data };
    } catch (err) {
      const axErr = err as AxiosError<{ detail?: string; message?: string }>;
      const status = axErr.response?.status;
      const message =
        axErr.response?.data?.detail ||
        axErr.response?.data?.message ||
        (status === 404 ? 'La reserva indicada no existe' : undefined) ||
        axErr.message ||
        'Error al crear la evaluación';
      return { success: false, message };
    }
  };

  const getStudentComments = async (): Promise<{ success: boolean; message: string; data?: PublicAssessmentComment[] }> => {
    try {
      const token = getAccessToken();
      if (!token) throw new Error('No hay token de acceso. Inicia sesión nuevamente.');
      const res = await client.get<{ success: boolean; message: string; data: PublicAssessmentComment[] }>(
        `/assessments/student/comments/`,
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      return { success: !!res.data?.success, message: res.data?.message || 'OK', data: res.data?.data };
    } catch (err) {
      const axErr = err as AxiosError<{ detail?: string; message?: string }>;
      const message = axErr.response?.data?.detail || axErr.response?.data?.message || axErr.message || 'Error al obtener comentarios del estudiante';
      return { success: false, message };
    }
  };

  return { createAssessment, getStudentComments };
};
