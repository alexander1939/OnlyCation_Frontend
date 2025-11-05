import React from 'react';

type ConfirmationViewProps = {
  role?: string;
};

export default function ConfirmationView({ role }: ConfirmationViewProps) {
  const roleLabel = role === 'teacher' ? 'docente' : 'estudiante';

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF9F5' }}>
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Confirmación</h1>
        <p className="text-slate-600 mb-6">
          Gestiona confirmaciones pendientes y revisa el estado de tus procesos como {roleLabel}.
        </p>
        <div className="rounded-2xl border bg-white p-6 shadow-sm text-slate-700">
          <p>Contenido de confirmación próximamente…</p>
        </div>
      </div>
    </div>
  );
}
