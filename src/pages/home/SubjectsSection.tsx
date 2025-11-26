import React, { useState } from 'react';

const SubjectsSection: React.FC = () => {
  const [showMorePreparatoria, setShowMorePreparatoria] = useState(false);
  const [showMoreUniversidad, setShowMoreUniversidad] = useState(false);
  const [showMorePosgrado, setShowMorePosgrado] = useState(false);

  return (
    <section className="py-[10px] px-[50px] bg-soft-white">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-[60px]">
          <h2 className="text-[42px] font-bold mb-4 text-white drop-shadow-lg" style={{fontFamily: 'Roboto, sans-serif'}}>
            Asignaturas
          </h2>
        </div>
        
        {/* Preparatoria */}
        <div className="mb-[80px]">
          <h3 className="text-[32px] font-bold mb-8 text-center text-white drop-shadow-lg" style={{fontFamily: 'Roboto, sans-serif'}}>
            Preparatoria
          </h3>
          <div className="grid grid-cols-4 gap-[30px] justify-items-center" style={{padding: '20px 0'}}>
            {/* Matemáticas */}
            <div className="rounded-[20px] p-[30px] shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-2 w-[280px] h-[100px] flex items-center justify-between cursor-pointer border-2 border-pastel-yellow" style={{backgroundColor: '#FAF9F5'}}>
              <div className="flex items-center">
                <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center mr-4" style={{backgroundColor: '#A8E6CF'}}>
                  <span className="text-[24px]">📊</span>
                </div>
                <div className="flex flex-col" style={{padding: '0 0 0 20px'}}>
                  <h4 className="text-[20px] font-bold mb-1" style={{color: '#294954', fontFamily: 'Roboto, sans-serif'}}>Matemáticas</h4>
                  <p className="text-[14px]" style={{color: '#6B7280', fontFamily: 'Roboto, sans-serif'}}>1200 profesores</p>
                </div>
              </div>
              <div className="text-[32px] font-bold" style={{color: '#294954'}}>
                {'>'}
              </div>
            </div>

            {/* Biología */}
            <div className="rounded-[20px] p-[30px] shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-2 w-[280px] h-[100px] flex items-center justify-between cursor-pointer border-2 border-pastel-yellow" style={{backgroundColor: '#FAF9F5'}}>
              <div className="flex items-center">
                <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center mr-4" style={{backgroundColor: '#8ED4BE'}}>
                  <span className="text-[24px]">🧬</span>
                </div>
                <div className="flex flex-col" style={{padding: '0 0 0 20px'}}>
                  <h4 className="text-[20px] font-bold mb-1" style={{color: '#294954', fontFamily: 'Roboto, sans-serif'}}>Biología</h4>
                  <p className="text-[14px]" style={{color: '#6B7280', fontFamily: 'Roboto, sans-serif'}}>850 profesores</p>
                </div>
              </div>
              <div className="text-[32px] font-bold" style={{color: '#294954'}}>
                {'>'}
              </div>
            </div>

            {/* Historia */}
            <div className="rounded-[20px] p-[30px] shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-2 w-[280px] h-[100px] flex items-center justify-between cursor-pointer border-2 border-pastel-yellow" style={{backgroundColor: '#FAF9F5'}}>
              <div className="flex items-center">
                <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center mr-4" style={{backgroundColor: '#FFDE97'}}>
                  <span className="text-[24px]">🏛️</span>
                </div>
                <div className="flex flex-col" style={{padding: '0 0 0 20px'}}>
                  <h4 className="text-[20px] font-bold mb-1" style={{color: '#294954', fontFamily: 'Roboto, sans-serif'}}>Historia</h4>
                  <p className="text-[14px]" style={{color: '#6B7280', fontFamily: 'Roboto, sans-serif'}}>720 profesores</p>
                </div>
              </div>
              <div className="text-[32px] font-bold" style={{color: '#294954'}}>
                {'>'}
              </div>
            </div>

            {/* Lengua y Literatura */}
            <div className="rounded-[20px] p-[30px] shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-2 w-[280px] h-[100px] flex items-center justify-between cursor-pointer border-2 border-pastel-yellow" style={{backgroundColor: '#FAF9F5'}}>
              <div className="flex items-center">
                <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center mr-4" style={{backgroundColor: '#FF9978'}}>
                  <span className="text-[24px]">📚</span>
                </div>
                <div className="flex flex-col" style={{padding: '0 0 0 20px'}}>
                  <h4 className="text-[20px] font-bold mb-1" style={{color: '#294954', fontFamily: 'Roboto, sans-serif'}}>Lengua y Literatura</h4>
                  <p className="text-[14px]" style={{color: '#6B7280', fontFamily: 'Roboto, sans-serif'}}>950 profesores</p>
                </div>
              </div>
              <div className="text-[32px] font-bold" style={{color: '#294954'}}>
                {'>'}
              </div>
            </div>

            {/* Química */}
            <div className="rounded-[20px] p-[30px] shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-2 w-[280px] h-[100px] flex items-center justify-between cursor-pointer border-2 border-pastel-yellow" style={{backgroundColor: '#FAF9F5'}}>
              <div className="flex items-center">
                <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center mr-4" style={{backgroundColor: '#68B2C9'}}>
                  <span className="text-[24px]">⚗️</span>
                </div>
                <div className="flex flex-col" style={{padding: '0 0 0 20px'}}>
                  <h4 className="text-[20px] font-bold mb-1" style={{color: '#294954', fontFamily: 'Roboto, sans-serif'}}>Química</h4>
                  <p className="text-[14px]" style={{color: '#6B7280', fontFamily: 'Roboto, sans-serif'}}>680 profesores</p>
                </div>
              </div>
              <div className="text-[32px] font-bold" style={{color: '#294954'}}>
                {'>'}
              </div>
            </div>

            {/* Geografía */}
            <div className="rounded-[20px] p-[30px] shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-2 w-[280px] h-[100px] flex items-center justify-between cursor-pointer border-2 border-pastel-yellow" style={{backgroundColor: '#FAF9F5'}}>
              <div className="flex items-center">
                <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center mr-4" style={{backgroundColor: '#294954'}}>
                  <span className="text-[24px] text-white">🌍</span>
                </div>
                <div className="flex flex-col" style={{padding: '0 0 0 20px'}}>
                  <h4 className="text-[20px] font-bold mb-1" style={{color: '#294954', fontFamily: 'Roboto, sans-serif'}}>Geografía</h4>
                  <p className="text-[14px]" style={{color: '#6B7280', fontFamily: 'Roboto, sans-serif'}}>540 profesores</p>
                </div>
              </div>
              <div className="text-[32px] font-bold" style={{color: '#294954'}}>
                {'>'}
              </div>
            </div>

            {/* Más materias duplicadas - se pueden limpiar después */}
            <div className="rounded-[20px] p-[30px] shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-2 w-[280px] h-[100px] flex items-center justify-between cursor-pointer border-2 border-pastel-yellow" style={{backgroundColor: '#FAF9F5'}}>
              <div className="flex items-center">
                <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center mr-4" style={{backgroundColor: '#294954'}}>
                  <span className="text-[24px] text-white">🌍</span>
                </div>
                <div className="flex flex-col" style={{padding: '0 0 0 20px'}}>
                  <h4 className="text-[20px] font-bold mb-1" style={{color: '#294954', fontFamily: 'Roboto, sans-serif'}}>Geografía</h4>
                  <p className="text-[14px]" style={{color: '#6B7280', fontFamily: 'Roboto, sans-serif'}}>540 profesores</p>
                </div>
              </div>
              <div className="text-[32px] font-bold" style={{color: '#294954'}}>
                {'>'}
              </div>
            </div>

            <div className="rounded-[20px] p-[30px] shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-2 w-[280px] h-[100px] flex items-center justify-between cursor-pointer border-2 border-pastel-yellow" style={{backgroundColor: '#FAF9F5'}}>
              <div className="flex items-center">
                <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center mr-4" style={{backgroundColor: '#294954'}}>
                  <span className="text-[24px] text-white">🌍</span>
                </div>
                <div className="flex flex-col" style={{padding: '0 0 0 20px'}}>
                  <h4 className="text-[20px] font-bold mb-1" style={{color: '#294954', fontFamily: 'Roboto, sans-serif'}}>Geografía</h4>
                  <p className="text-[14px]" style={{color: '#6B7280', fontFamily: 'Roboto, sans-serif'}}>540 profesores</p>
                </div>
              </div>
              <div className="text-[32px] font-bold" style={{color: '#294954'}}>
                {'>'}
              </div>
            </div>
          </div>
          
          {/* Materias adicionales de Preparatoria */}
          {showMorePreparatoria && (
            <div className="grid grid-cols-4 gap-[30px] justify-items-center mb-6" style={{padding: '20px 0'}}>
              <div className="rounded-[20px] p-[30px] shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-2 w-[280px] h-[100px] flex items-center justify-between cursor-pointer border-2 border-pastel-yellow" style={{backgroundColor: '#FAF9F5'}}>
                <div className="flex items-center">
                  <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center mr-4" style={{backgroundColor: '#FFB6C1'}}>
                    <span className="text-[24px]">🎨</span>
                  </div>
                  <div className="flex flex-col" style={{padding: '0 0 0 20px'}}>
                    <h4 className="text-[20px] font-bold mb-1" style={{color: '#294954', fontFamily: 'Roboto, sans-serif'}}>Arte y Cultura</h4>
                    <p className="text-[14px]" style={{color: '#6B7280', fontFamily: 'Roboto, sans-serif'}}>420 profesores</p>
                  </div>
                </div>
                <div className="text-[32px] font-bold" style={{color: '#294954'}}>
                  {'>'}
                </div>
              </div>
              <div className="rounded-[20px] p-[30px] shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-2 w-[280px] h-[100px] flex items-center justify-between cursor-pointer border-2 border-pastel-yellow" style={{backgroundColor: '#FAF9F5'}}>
                <div className="flex items-center">
                  <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center mr-4" style={{backgroundColor: '#DDA0DD'}}>
                    <span className="text-[24px]">🏃</span>
                  </div>
                  <div className="flex flex-col" style={{padding: '0 0 0 20px'}}>
                    <h4 className="text-[20px] font-bold mb-1" style={{color: '#294954', fontFamily: 'Roboto, sans-serif'}}>Educación Física</h4>
                    <p className="text-[14px]" style={{color: '#6B7280', fontFamily: 'Roboto, sans-serif'}}>380 profesores</p>
                  </div>
                </div>
                <div className="text-[32px] font-bold" style={{color: '#294954'}}>
                  {'>'}
                </div>
              </div>
              <div className="rounded-[20px] p-[30px] shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-2 w-[280px] h-[100px] flex items-center justify-between cursor-pointer border-2 border-pastel-yellow" style={{backgroundColor: '#FAF9F5'}}>
                <div className="flex items-center">
                  <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center mr-4" style={{backgroundColor: '#98FB98'}}>
                    <span className="text-[24px]">🌱</span>
                  </div>
                  <div className="flex flex-col" style={{padding: '0 0 0 20px'}}>
                    <h4 className="text-[20px] font-bold mb-1" style={{color: '#294954', fontFamily: 'Roboto, sans-serif'}}>Ciencias Naturales</h4>
                    <p className="text-[14px]" style={{color: '#6B7280', fontFamily: 'Roboto, sans-serif'}}>590 profesores</p>
                  </div>
                </div>
                <div className="text-[32px] font-bold" style={{color: '#294954'}}>
                  {'>'}
                </div>
              </div>
              <div className="rounded-[20px] p-[30px] shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-2 w-[280px] h-[100px] flex items-center justify-between cursor-pointer border-2 border-pastel-yellow" style={{backgroundColor: '#FAF9F5'}}>
                <div className="flex items-center">
                  <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center mr-4" style={{backgroundColor: '#F0E68C'}}>
                    <span className="text-[24px]">🌍</span>
                  </div>
                  <div className="flex flex-col" style={{padding: '0 0 0 20px'}}>
                    <h4 className="text-[20px] font-bold mb-1" style={{color: '#294954', fontFamily: 'Roboto, sans-serif'}}>Inglés</h4>
                    <p className="text-[14px]" style={{color: '#6B7280', fontFamily: 'Roboto, sans-serif'}}>820 profesores</p>
                  </div>
                </div>
                <div className="text-[32px] font-bold" style={{color: '#294954'}}>
                  {'>'}
                </div>
              </div>
            </div>
          )}
          
          {/* Botón Ver más/menos para Preparatoria */}
          <div className="text-center">
            <button 
              onClick={() => setShowMorePreparatoria(!showMorePreparatoria)}
              className="text-[18px] font-semibold tracking-[0.5px] transition-colors"
              style={{
                backgroundColor: '#294954',
                color: '#FAF9F5',
                padding: '10px',
                borderRadius: '20px',
                border: '2px solid #294954',
                fontFamily: 'Roboto, sans-serif'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1e3a42'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#294954'}
            >
              {showMorePreparatoria ? 'Ver menos' : 'Ver más materias'}
            </button>
          </div>
        </div>

        {/* Universidad - Sección similar pero más corta para el ejemplo */}
        <div className="mb-[80px]">
          <h3 className="text-[32px] font-bold mb-8 text-center text-white drop-shadow-lg" style={{fontFamily: 'Roboto, sans-serif'}}>
            Universidad
          </h3>
          {/* Aquí iría el contenido de Universidad similar al de Preparatoria */}
          <div className="text-center">
            <button 
              onClick={() => setShowMoreUniversidad(!showMoreUniversidad)}
              className="text-[18px] font-semibold tracking-[0.5px] transition-colors"
              style={{
                backgroundColor: '#294954',
                color: '#FAF9F5',
                padding: '10px',
                borderRadius: '20px',
                border: '2px solid #294954',
                fontFamily: 'Roboto, sans-serif'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1e3a42'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#294954'}
            >
              {showMoreUniversidad ? 'Ver menos' : 'Ver más materias'}
            </button>
          </div>
        </div>

        {/* Posgrado - Sección similar pero más corta para el ejemplo */}
        <div className="mb-[80px]">
          <h3 className="text-[32px] font-bold mb-8 text-center text-white drop-shadow-lg" style={{fontFamily: 'Roboto, sans-serif'}}>
            Posgrado
          </h3>
          {/* Aquí iría el contenido de Posgrado similar al de Preparatoria */}
          <div className="text-center">
            <button 
              onClick={() => setShowMorePosgrado(!showMorePosgrado)}
              className="text-[18px] font-semibold tracking-[0.5px] transition-colors"
              style={{
                backgroundColor: '#294954',
                color: '#FAF9F5',
                padding: '10px',
                borderRadius: '20px',
                border: '2px solid #294954',
                fontFamily: 'Roboto, sans-serif'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1e3a42'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#294954'}
            >
              {showMorePosgrado ? 'Ver menos' : 'Ver más materias'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubjectsSection;
