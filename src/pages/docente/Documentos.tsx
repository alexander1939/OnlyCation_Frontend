import { useAuthContext } from '../../context/auth';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import '../../styles/docente-documentos.css';

type Documento = {
  id: string;
  tipo: string;
  nombre: string;
  fechaActualizacion: string;
  icono: string;
};

export default function DocenteDocumentos() {
  const { user } = useAuthContext();
  const fullName = user ? `${user.first_name} ${user.last_name}`.trim() : '—';

  const documentos: Documento[] = [
    { id: '1', tipo: 'cv', nombre: 'Curriculum Vitae', fechaActualizacion: '24/05/2024', icono: '📄' },
    { id: '2', tipo: 'cedula', nombre: 'Cédula Profesional', fechaActualizacion: '15/01/2023', icono: '🎓' },
  ];

  const rfc = 'PEJU880825XYZ';

  const handleActualizar = (tipo: string) => {
    // TODO: Implementar lógica de actualización de documentos
    console.log(`Actualizar ${tipo}`);
  };

  return (
    <div className="min-h-screen flex flex-col page-container">
      <Header />
      <main className="flex-1 main-spacing">
        <section className="documentos-container">
          <h1 className="documentos-main-title">Gestión de Documentos y RFC</h1>
          <div className="documentos-user-name">{fullName}</div>

          {/* Sección Documentos */}
          <div className="documentos-section">
            <h2 className="documentos-section-title">Documentos</h2>
            <div className="documentos-list">
              {documentos.map((doc) => (
                <article key={doc.id} className="documento-item">
                  <div className="documento-icon">{doc.icono}</div>
                  <div className="documento-info">
                    <div className="documento-nombre">{doc.nombre}</div>
                    <div className="documento-fecha">actualizado el {doc.fechaActualizacion}</div>
                  </div>
                  <button 
                    className="btn-actualizar"
                    onClick={() => handleActualizar(doc.tipo)}
                  >
                    Actualizar
                  </button>
                </article>
              ))}
            </div>
          </div>

          {/* Sección RFC */}
          <div className="documentos-section">
            <h2 className="documentos-section-title">Registro Federal de Contribuyentes (RFC)</h2>
            <div className="documentos-list">
              <article className="documento-item">
                <div className="documento-icon">📁</div>
                <div className="documento-info">
                  <div className="documento-fecha">Tu RFC</div>
                  <div className="documento-rfc">{rfc}</div>
                </div>
                <button 
                  className="btn-actualizar"
                  onClick={() => handleActualizar('rfc')}
                >
                  Actualizar
                </button>
              </article>
            </div>
          </div>

          {/* Footer de ayuda */}
          <div className="documentos-footer">
            <p>
              ¿Necesitas ayuda? Contacta a <a href="/soporte" className="link-soporte">Soporte Técnico</a>
            </p>
            <p className="footer-note">Recuerda mantener tu información segura y actualizada.</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
