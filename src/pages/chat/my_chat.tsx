import React from 'react';
import { useAuthContext } from '../../context/auth';

const StudentChat: React.FC = () => {
  const { user } = useAuthContext();
  const roleLabel = user?.role === 'teacher' ? 'docente' : 'estudiante';

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF9F5' }}>
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Chat</h1>
        <p className="text-slate-600 mb-6">
          Comunícate con tus {user?.role === 'teacher' ? 'estudiantes' : 'docentes'} y gestiona conversaciones como {roleLabel}.
        </p>
        <div className="rounded-2xl border bg-white p-6 shadow-sm text-slate-700">
          <p>Chat próximamente…</p>
        </div>
      </div>
    </div>
  );
};

export default StudentChat;
