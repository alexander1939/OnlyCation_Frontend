import { useEffect, useState } from 'react';
import { useAuthContext } from '../../context/auth';
import { useDocumentsContext } from '../../context/documents';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import '../../styles/docente-documentos.css';
import { GraduationCap, FileText, Folder, Target, Save, X, Pencil, Download, Loader2 } from 'lucide-react';
import { useNotificationContext } from '../../components/NotificationProvider';
import ConfirmDialog from '../../components/shared/ConfirmDialog';
import LoadingOverlay from '../../components/shared/LoadingOverlay';
import { SUBJECTS } from '../../components/subjects/SubjectsCatalog';

export default function DocenteDocumentos() {
  const { user } = useAuthContext();
  const { showSuccess, showError, showWarning } = useNotificationContext();

  const { 
    documents, 
    loading, 
    updating, 
    error, 
    readDocuments, 
    downloadDocument,
    updateCertificate,
    updateCurriculum,
    updateRfc,
    updateDescription,
    updateExpertiseArea
  } = useDocumentsContext();
  const fullName = user ? `${user.first_name} ${user.last_name}`.trim() : '—';
  
  const [downloading, setDownloading] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValues, setTempValues] = useState({
    rfc: '',
    description: '',
    expertise_area: '',
    certificate: null as File | null,
    curriculum: null as File | null,
  });
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [confirmAction, setConfirmAction] = useState<
    'all' | 'rfc' | 'description' | 'expertise_area' | 'certificate' | 'curriculum' | null
  >(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    readDocuments();
  }, []);

  const currentDoc = documents[0]; // Asumiendo un documento por usuario

  const overlayOpen = Boolean(loading || updating || confirmLoading || downloading);

  const handleEditField = (field: string) => {
    if (!currentDoc) return;
    setEditingField(field);
    setTempValues({
      rfc: currentDoc.rfc,
      description: currentDoc.description,
      expertise_area: currentDoc.expertise_area,
      certificate: null,
      curriculum: null,
    });
    try {
      const subj = SUBJECTS.find(s => s.name === currentDoc.expertise_area);
      setSelectedSubjectId(subj ? subj.id : '');
    } catch {}
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setTempValues({
      rfc: '',
      description: '',
      expertise_area: '',
      certificate: null,
      curriculum: null,
    });
    setSelectedSubjectId('');
  };

  const sanitizeInput = (value: string) => {
    return value.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s]/g, '');
  };

  const handleSaveAll = async () => {
    if (!currentDoc) return;
    
    let hasErrors = false;
    
    if (tempValues.rfc !== currentDoc.rfc) {
      const result = await updateRfc(currentDoc.id, tempValues.rfc);
      if (!result.success) hasErrors = true;
    }
    
    if (tempValues.description !== currentDoc.description) {
      const result = await updateDescription(currentDoc.id, tempValues.description);
      if (!result.success) hasErrors = true;
    }
    
    if (tempValues.expertise_area !== currentDoc.expertise_area) {
      const result = await updateExpertiseArea(currentDoc.id, tempValues.expertise_area);
      if (!result.success) hasErrors = true;
    }
    
    if (tempValues.certificate) {
      const result = await updateCertificate(currentDoc.id, tempValues.certificate);
      if (!result.success) hasErrors = true;
    }
    
    if (tempValues.curriculum) {
      const result = await updateCurriculum(currentDoc.id, tempValues.curriculum);
      if (!result.success) hasErrors = true;
    }
    
    if (!hasErrors) {
      setEditingField(null);
      showSuccess('✅ Todos los campos actualizados exitosamente');
      await readDocuments();
    } else {
      showError('⚠️ Algunos campos no se actualizaron correctamente');
    }
  };

  const handleSaveRfc = async () => {
    if (!currentDoc) return;
    const result = await updateRfc(currentDoc.id, tempValues.rfc);
    if (result.success) {
      setEditingField(null);
      showSuccess('✅ RFC actualizado exitosamente');
      await readDocuments();
    } else {
      showError(`❌ Error: ${result.message}`);
    }
  };

  const handleSaveDescription = async () => {
    if (!currentDoc) return;
    const result = await updateDescription(currentDoc.id, tempValues.description);
    if (result.success) {
      setEditingField(null);
      showSuccess('✅ Descripción actualizada exitosamente');
      await readDocuments();
    } else {
      showError(`❌ Error: ${result.message}`);
    }
  };

  const handleSaveExpertiseArea = async () => {
    if (!currentDoc) return;
    const result = await updateExpertiseArea(currentDoc.id, tempValues.expertise_area);
    if (result.success) {
      setEditingField(null);
      showSuccess('✅ Área de especialidad actualizada exitosamente');
      await readDocuments();
    } else {
      showError(`❌ Error: ${result.message}`);
    }
  };

  const handleSaveCertificate = async () => {
    if (!currentDoc || !tempValues.certificate) return;
    const result = await updateCertificate(currentDoc.id, tempValues.certificate);
    if (result.success) {
      setEditingField(null);
      setTempValues(prev => ({ ...prev, certificate: null }));
      showSuccess('✅ Certificado actualizado exitosamente');
      await readDocuments();
    } else {
      showError(`❌ Error: ${result.message}`);
    }
  };

  const handleSaveCurriculum = async () => {
    if (!currentDoc || !tempValues.curriculum) return;
    const result = await updateCurriculum(currentDoc.id, tempValues.curriculum);
    if (result.success) {
      setEditingField(null);
      setTempValues(prev => ({ ...prev, curriculum: null }));
      showSuccess('✅ Curriculum actualizado exitosamente');
      await readDocuments();
    } else {
      showError(`❌ Error: ${result.message}`);
    }
  };

  const handleFileChange = (field: 'certificate' | 'curriculum', file: File | null) => {
    setTempValues(prev => ({ ...prev, [field]: file }));
  };

  const handleDownload = async (kind: 'certificate' | 'curriculum') => {
    if (!currentDoc) return;
    
    setDownloading(kind);
    const result = await downloadDocument(currentDoc.id, kind);
    setDownloading(null);
    
    if (!result.success) {
      showError(`❌ Error al descargar: ${result.message}`);
    }
  };

  const openConfirm = (
    action: 'all' | 'rfc' | 'description' | 'expertise_area' | 'certificate' | 'curriculum'
  ) => {
    if (!currentDoc) return;
    setConfirmAction(action);
  };

  const handleConfirmAction = async () => {
    if (!confirmAction) return;
    setConfirmLoading(true);
    try {
      if (confirmAction === 'all') {
        await handleSaveAll();
      } else if (confirmAction === 'rfc') {
        await handleSaveRfc();
      } else if (confirmAction === 'description') {
        await handleSaveDescription();
      } else if (confirmAction === 'expertise_area') {
        await handleSaveExpertiseArea();
      } else if (confirmAction === 'certificate') {
        await handleSaveCertificate();
      } else if (confirmAction === 'curriculum') {
        await handleSaveCurriculum();
      }
    } finally {
      setConfirmLoading(false);
      setConfirmAction(null);
    }
  };

  const handleCancelConfirm = () => {
    if (confirmLoading) return;
    setConfirmAction(null);
  };

  return (
    <div className="min-h-screen flex flex-col page-container">
      <Header />
      <main className="flex-1 main-spacing">
        <section className="documentos-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h1 className="documentos-main-title">Gestión de Documentos y RFC</h1>
              <div className="documentos-user-name">{fullName}</div>
            </div>
            
            {currentDoc && !loading && (
              editingField === 'all' ? (
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    className="btn-actualizar"
                    onClick={() => openConfirm('all')}
                    disabled={updating}
                    style={{ backgroundColor: '#10b981', color: 'white', minWidth: '120px' }}
                  >
                    {updating ? 'Guardando...' : (<><Save size={16} /> <span style={{ marginLeft: 6 }}>Guardar todo</span></>)}
                  </button>
                  <button 
                    className="btn-actualizar"
                    onClick={handleCancelEdit}
                    disabled={updating}
                    style={{ backgroundColor: '#6b7280', color: 'white', minWidth: '120px' }}
                  >
                    <X size={16} /> <span style={{ marginLeft: 6 }}>Cancelar</span>
                  </button>
                </div>
              ) : (
                <button 
                  className="btn-actualizar"
                  onClick={() => handleEditField('all')}
                  style={{ backgroundColor: '#3b82f6', color: 'white', minWidth: '120px' }}
                >
                  <Pencil size={16} /> <span style={{ marginLeft: 6 }}>Editar todo</span>
                </button>
              )
            )}
          </div>

          {loading && <p className="text-center text-gray-600"><Loader2 size={16} /> <span style={{ marginLeft: 6 }}>Cargando documentos...</span></p>}
          {error && <p className="text-center text-red-600"><X size={16} /> <span style={{ marginLeft: 6 }}>{error}</span></p>}

          {!loading && !currentDoc && (
            <div className="text-center p-8 bg-gray-50 rounded-lg">
              <p className="text-gray-600">No tienes documentos registrados.</p>
              <p className="text-sm text-gray-500 mt-2">Por favor, completa tu perfil primero.</p>
            </div>
          )}

          {currentDoc && (
            <>
              {/* Sección Documentos */}
              <div className="documentos-section">
                <h2 className="documentos-section-title">Documentos</h2>
                
                {/* Certificado */}
                <div className="documentos-list">
                  <article className="documento-item">
                    <div className="documento-icon"><GraduationCap size={20} /></div>
                    <div className="documento-info">
                      <div className="documento-nombre">Certificado</div>
                      <div className="documento-fecha">
                        {currentDoc.certificate ? 'Archivo disponible' : 'No disponible'}
                      </div>
                    </div>
                    {editingField === 'all' || editingField === 'certificate' ? (
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <input 
                          type="file" 
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileChange('certificate', e.target.files?.[0] || null)}
                          className="text-sm"
                        />
                        {editingField === 'certificate' && (
                          <>
                            <button 
                              onClick={() => openConfirm('certificate')}
                              disabled={updating || !tempValues.certificate}
                              style={{
                                background: '#10b981',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '6px 12px',
                                color: 'white',
                                cursor: !tempValues.certificate ? 'not-allowed' : 'pointer',
                                fontSize: '14px',
                                opacity: !tempValues.certificate ? 0.5 : 1
                              }}
                            >
                              <Save size={16} /> <span style={{ marginLeft: 6 }}>Guardar</span>
                            </button>
                            <button 
                              onClick={handleCancelEdit}
                              disabled={updating}
                              style={{
                                background: '#6b7280',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '6px 12px',
                                color: 'white',
                                cursor: 'pointer',
                                fontSize: '14px'
                              }}
                            >
                              <X size={16} /> <span style={{ marginLeft: 6 }}>Cancelar</span>
                            </button>
                          </>
                        )}
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <button 
                          onClick={() => handleDownload('certificate')}
                          disabled={downloading === 'certificate' || !currentDoc.certificate}
                          title="Descargar certificado"
                          style={{
                            background: downloading === 'certificate' ? '#93c5fd' : '#3b82f6',
                            border: 'none',
                            borderRadius: '50%',
                            width: '44px',
                            height: '44px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            cursor: downloading === 'certificate' || !currentDoc.certificate ? 'not-allowed' : 'pointer',
                            transition: 'all 0.3s ease',
                            fontSize: '20px',
                            boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
                            opacity: !currentDoc.certificate ? 0.4 : 1
                          }}
                          onMouseEnter={(e) => {
                            if (!downloading && currentDoc.certificate) {
                              e.currentTarget.style.transform = 'scale(1.1)';
                              e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.5)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(59, 130, 246, 0.3)';
                          }}
                        >
                          {downloading === 'certificate' ? <Loader2 size={18} /> : <Download size={18} />}
                        </button>
                        
                        <button 
                          onClick={() => handleEditField('certificate')}
                          title="Editar certificado"
                          style={{
                            background: '#10b981',
                            border: 'none',
                            borderRadius: '50%',
                            width: '44px',
                            height: '44px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            fontSize: '18px',
                            boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.1)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.5)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(16, 185, 129, 0.3)';
                          }}
                        >
                          <Pencil size={16} />
                        </button>
                      </div>
                    )}
                  </article>

                  {/* Curriculum */}
                  <article className="documento-item">
                    <div className="documento-icon"><FileText size={20} /></div>
                    <div className="documento-info">
                      <div className="documento-nombre">Curriculum Vitae</div>
                      <div className="documento-fecha">
                        {currentDoc.curriculum ? 'Archivo disponible' : 'No disponible'}
                      </div>
                    </div>
                    {editingField === 'all' || editingField === 'curriculum' ? (
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <input 
                          type="file" 
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => handleFileChange('curriculum', e.target.files?.[0] || null)}
                          className="text-sm"
                        />
                        {editingField === 'curriculum' && (
                          <>
                            <button 
                              onClick={() => openConfirm('curriculum')}
                              disabled={updating || !tempValues.curriculum}
                              style={{
                                background: '#10b981',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '6px 12px',
                                color: 'white',
                                cursor: !tempValues.curriculum ? 'not-allowed' : 'pointer',
                                fontSize: '14px',
                                opacity: !tempValues.curriculum ? 0.5 : 1
                              }}
                            >
                              <Save size={16} /> <span style={{ marginLeft: 6 }}>Guardar</span>
                            </button>
                            <button 
                              onClick={handleCancelEdit}
                              disabled={updating}
                              style={{
                                background: '#6b7280',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '6px 12px',
                                color: 'white',
                                cursor: 'pointer',
                                fontSize: '14px'
                              }}
                            >
                              <X size={16} /> <span style={{ marginLeft: 6 }}>Cancelar</span>
                            </button>
                          </>
                        )}
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <button 
                          onClick={() => handleDownload('curriculum')}
                          disabled={downloading === 'curriculum' || !currentDoc.curriculum}
                          title="Descargar curriculum"
                          style={{
                            background: downloading === 'curriculum' ? '#93c5fd' : '#3b82f6',
                            border: 'none',
                            borderRadius: '50%',
                            width: '44px',
                            height: '44px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            cursor: downloading === 'curriculum' || !currentDoc.curriculum ? 'not-allowed' : 'pointer',
                            transition: 'all 0.3s ease',
                            fontSize: '20px',
                            boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
                            opacity: !currentDoc.curriculum ? 0.4 : 1
                          }}
                          onMouseEnter={(e) => {
                            if (!downloading && currentDoc.curriculum) {
                              e.currentTarget.style.transform = 'scale(1.1)';
                              e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.5)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(59, 130, 246, 0.3)';
                          }}
                        >
                          {downloading === 'curriculum' ? <Loader2 size={18} /> : <Download size={18} />}
                        </button>
                        
                        {editingField !== 'all' && (
                          <button 
                            onClick={() => handleEditField('curriculum')}
                            title="Editar curriculum"
                            style={{
                              background: '#10b981',
                              border: 'none',
                              borderRadius: '50%',
                              width: '44px',
                              height: '44px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              fontSize: '18px',
                              boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'scale(1.1)';
                              e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.5)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'scale(1)';
                              e.currentTarget.style.boxShadow = '0 2px 8px rgba(16, 185, 129, 0.3)';
                            }}
                          >
                            <Pencil size={16} />
                          </button>
                        )}
                      </div>
                    )}
                  </article>
                </div>
              </div>

              {/* Sección RFC */}
              <div className="documentos-section">
                <h2 className="documentos-section-title">Registro Federal de Contribuyentes (RFC)</h2>
                <div className="documentos-list">
                  <article className="documento-item">
                    <div className="documento-icon"><Folder size={20} /></div>
                    <div className="documento-info">
                      <div className="documento-fecha">Tu RFC</div>
                      {editingField === 'all' || editingField === 'rfc' ? (
                        <input 
                          type="text"
                          value={tempValues.rfc}
                          onChange={(e) => setTempValues(prev => ({ ...prev, rfc: sanitizeInput(e.target.value) }))}
                          className="documento-rfc border-2 border-blue-400 rounded px-2 py-1"
                          placeholder="RFC"
                        />
                      ) : (
                        <div className="documento-rfc">{currentDoc.rfc}</div>
                      )}
                    </div>
                    {editingField === 'rfc' && (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          onClick={() => openConfirm('rfc')}
                          disabled={updating}
                          style={{
                            background: '#10b981',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '6px 12px',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '14px'
                          }}
                        >
                          <Save size={16} /> <span style={{ marginLeft: 6 }}>Guardar</span>
                        </button>
                        <button 
                          onClick={handleCancelEdit}
                          disabled={updating}
                          style={{
                            background: '#6b7280',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '6px 12px',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '14px'
                          }}
                        >
                          <X size={16} /> <span style={{ marginLeft: 6 }}>Cancelar</span>
                        </button>
                      </div>
                    )}
                    {editingField !== 'all' && editingField !== 'rfc' && (
                      <button 
                        onClick={() => handleEditField('rfc')}
                        title="Editar RFC"
                        style={{
                          background: '#10b981',
                          border: 'none',
                          borderRadius: '50%',
                          width: '44px',
                          height: '44px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          fontSize: '18px',
                          boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.1)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.5)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(16, 185, 129, 0.3)';
                        }}
                      >
                        <Pencil size={16} />
                      </button>
                    )}
                  </article>
                </div>
              </div>

              {/* Sección Área de Especialidad */}
              <div className="documentos-section">
                <h2 className="documentos-section-title">Área de Especialidad</h2>
                <div className="documentos-list">
                  <article className="documento-item">
                    <div className="documento-icon"><Target size={20} /></div>
                    <div className="documento-info">
                      <div className="documento-fecha">Especialidad</div>
                      {editingField === 'all' || editingField === 'expertise_area' ? (
                        <select
                          value={selectedSubjectId}
                          onChange={(e) => {
                            const id = e.target.value;
                            setSelectedSubjectId(id);
                            const subj = SUBJECTS.find(s => s.id === id);
                            setTempValues(prev => ({ ...prev, expertise_area: subj ? subj.name : '' }));
                          }}
                          className="documento-rfc border-2 border-blue-400 rounded px-2 py-1"
                        >
                          <option value="">Selecciona una materia</option>
                          {SUBJECTS.map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                          ))}
                        </select>
                      ) : (
                        <div className="documento-rfc">{currentDoc.expertise_area}</div>
                      )}
                    </div>
                    {editingField === 'expertise_area' && (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          onClick={() => openConfirm('expertise_area')}
                          disabled={updating || !tempValues.expertise_area}
                          style={{
                            background: '#10b981',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '6px 12px',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '14px'
                          }}
                        >
                          <Save size={16} /> <span style={{ marginLeft: 6 }}>Guardar</span>
                        </button>
                        <button 
                          onClick={handleCancelEdit}
                          disabled={updating}
                          style={{
                            background: '#6b7280',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '6px 12px',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '14px'
                          }}
                        >
                          <X size={16} /> <span style={{ marginLeft: 6 }}>Cancelar</span>
                        </button>
                      </div>
                    )}
                    {editingField !== 'all' && editingField !== 'expertise_area' && (
                      <button 
                        onClick={() => handleEditField('expertise_area')}
                        title="Editar área de especialidad"
                        style={{
                          background: '#10b981',
                          border: 'none',
                          borderRadius: '50%',
                          width: '44px',
                          height: '44px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          fontSize: '18px',
                          boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.1)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.5)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(16, 185, 129, 0.3)';
                        }}
                      >
                        <Pencil size={16} />
                      </button>
                    )}
                  </article>
                </div>
              </div>

              {/* Sección Descripción */}
              <div className="documentos-section">
                <h2 className="documentos-section-title">Descripción</h2>
                <div className="documentos-list">
                  <article className="documento-item" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '8px', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div className="documento-icon"><FileText size={20} /></div>
                        <div className="documento-fecha" style={{ marginLeft: '12px' }}>Descripción del perfil</div>
                      </div>
                      {editingField === 'description' && (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            onClick={() => openConfirm('description')}
                            disabled={updating}
                            style={{
                              background: '#10b981',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '6px 12px',
                              color: 'white',
                              cursor: 'pointer',
                              fontSize: '14px'
                            }}
                          >
                            <Save size={16} /> <span style={{ marginLeft: 6 }}>Guardar</span>
                          </button>
                          <button 
                            onClick={handleCancelEdit}
                            disabled={updating}
                            style={{
                              background: '#6b7280',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '6px 12px',
                              color: 'white',
                              cursor: 'pointer',
                              fontSize: '14px'
                            }}
                          >
                            <X size={16} /> <span style={{ marginLeft: 6 }}>Cancelar</span>
                          </button>
                        </div>
                      )}
                      {editingField !== 'all' && editingField !== 'description' && (
                        <button 
                          onClick={() => handleEditField('description')}
                          title="Editar descripción"
                          style={{
                            background: '#10b981',
                            border: 'none',
                            borderRadius: '50%',
                            width: '44px',
                            height: '44px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            fontSize: '18px',
                            boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
                            color: 'white'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.1)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.5)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(16, 185, 129, 0.3)';
                          }}
                        >
                          <Pencil size={16} />
                        </button>
                      )}
                    </div>
                    {editingField === 'all' || editingField === 'description' ? (
                      <textarea 
                        value={tempValues.description}
                        onChange={(e) => setTempValues(prev => ({ ...prev, description: sanitizeInput(e.target.value) }))}
                        className="w-full border-2 border-blue-400 rounded px-3 py-2 min-h-[100px]"
                        placeholder="Describe tu experiencia, especialidades, metodología..."
                      />
                    ) : (
                      <div style={{ 
                        width: '100%', 
                        padding: '12px', 
                        backgroundColor: '#f9fafb', 
                        borderRadius: '8px',
                        color: '#374151',
                        lineHeight: '1.6'
                      }}>
                        {currentDoc.description || 'Sin descripción'}
                      </div>
                    )}
                  </article>
                </div>
              </div>
            </>
          )}
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

      <LoadingOverlay
        open={overlayOpen}
        message="Preparando tu experiencia..."
        logoSrc="/logo.png"
        gifSrc="/icons8-rhombus-loader-96.gif"
      />

      <ConfirmDialog
        isOpen={!!confirmAction}
        title="Confirmar cambios"
        description={
          confirmAction === 'all'
            ? '¿Estás seguro de que deseas guardar todos los cambios realizados en tus documentos y datos?'
            : '¿Estás seguro de que deseas guardar este cambio?'
        }
        confirmText="Sí, guardar"
        cancelText="Cancelar"
        onConfirm={handleConfirmAction}
        onCancel={handleCancelConfirm}
        loading={confirmLoading}
      />
    </div>
  );
}
