import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import DispAgenda from '../../components/DispAgenda';
import AvailabilityConfig from '../../components/AvailabilityConfig';
import { ScheduleProvider } from '../../context/availability/ScheduleContext';

export default function AgendaDocente() {


  return (
    <div className="min-h-screen flex flex-col page-container">
      <Header />
      <main className="flex-1 main-spacing">
        <section className="agenda-container">
          <h1 className="agenda-title">Mi Agenda</h1>
          <p className="agenda-subtitle">Gestiona tu disponibilidad y revisa las clases programadas</p>
          
          <ScheduleProvider>
            {/* Vista de disponibilidad */}
            <div className="mb-8">
              <DispAgenda />
            </div>

            <h2 className="text-xl font-semibold mb-4 text-gray-800">Configuración de disponibilidad</h2>
            <p className="text-sm text-gray-600 mb-4">
              💡 Los horarios que configures aquí se reflejarán automáticamente en tu agenda semanal.
            </p>
            <AvailabilityConfig />
          </ScheduleProvider>

          {/* El modal y lógica de selección de horas ahora viven en AvailabilityConfig */}
        </section>
      </main>
      <Footer />
    </div>
  );
}
