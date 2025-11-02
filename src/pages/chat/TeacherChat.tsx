import React from 'react';

const TeacherChat: React.FC = () => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF9F5' }}>
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Chat</h1>
        <p className="text-slate-600 mb-6">Comunícate con tus estudiantes y gestiona conversaciones.</p>
        <div className="rounded-2xl border bg-white p-6 shadow-sm text-slate-700">
          <p>Chat próximamente…</p>
        </div>
      </div>
    </div>
  );
};

export default TeacherChat;
