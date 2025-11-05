import React from 'react';

const TeacherSubscription: React.FC = () => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF9F5' }}>
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Suscripción</h1>
        <p className="text-slate-600 mb-6">Configura y gestiona tu plan de suscripción.</p>
        <div className="rounded-2xl border bg-white p-6 shadow-sm text-slate-700">
          <p>Contenido de suscripción próximamente…</p>
        </div>
      </div>
    </div>
  );
};

export default TeacherSubscription;
