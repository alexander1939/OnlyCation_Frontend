import React, { useEffect, useCallback } from 'react';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import DispAgenda from '../../components/DispAgenda';
import AvailabilityConfig from '../../components/AvailabilityConfig';
import { ScheduleProvider, useSchedule, type DayKey } from '../../context/availability/ScheduleContext';
import { useAgendaApi } from '../../hooks/availability/useavailabilityApi';
import { useWeeklyAgendaContext, WeeklyAgendaProvider } from '../../context/availability/WeeklyAgendaContext';

export default function AgendaDocente() {
  return (
    <div className="min-h-screen flex flex-col page-container">
      <Header />
      <main className="flex-1 main-spacing">
        <section className="agenda-container">
          <h1 className="agenda-title">Mi Agenda</h1>
          <p className="agenda-subtitle">Gestiona tu disponibilidad y revisa las clases programadas</p>
          
          <WeeklyAgendaProvider>
            <ScheduleProvider>
              <AgendaContent />
            </ScheduleProvider>
          </WeeklyAgendaProvider>
        </section>
      </main>
      <Footer />
    </div>
  );
}

const AgendaContent: React.FC = () => {
  const { loadFromAgenda, slots, enabledDays } = useSchedule();
  const { fetchAvailabilityList } = useAgendaApi();
  const { fetchWeeklyAgenda } = useWeeklyAgendaContext();
  const [loading, setLoading] = React.useState(true);

  const loadAvailabilities = React.useCallback(async () => {
    setLoading(true);
    const result = await fetchAvailabilityList();
    
    if (result.success && result.data?.availabilities) {
      console.log('📥 Datos de /availability/list/:', result.data);
      
      const dayNumberToName: Record<number, string> = {
        1: 'Lunes', 2: 'Martes', 3: 'Miércoles', 4: 'Jueves',
        5: 'Viernes', 6: 'Sábado', 7: 'Domingo',
      };

      const groupedByDay: Record<string, any[]> = {};
      result.data.availabilities.forEach((avail: any) => {
        let dayName: string;
        if (typeof avail.day_of_week === 'number') {
          dayName = dayNumberToName[avail.day_of_week] || `Día ${avail.day_of_week}`;
        } else {
          const dayNameMap: Record<string, string> = {
            'Monday': 'Lunes', 'Tuesday': 'Martes', 'Wednesday': 'Miércoles',
            'Thursday': 'Jueves', 'Friday': 'Viernes', 'Saturday': 'Sábado', 'Sunday': 'Domingo',
          };
          dayName = dayNameMap[avail.day_of_week] || avail.day_of_week;
        }
        
        if (!groupedByDay[dayName]) groupedByDay[dayName] = [];
        groupedByDay[dayName].push({
          availability_id: avail.id,
          start_time: avail.start_time,
          end_time: avail.end_time,
          specific_date: null,
        });
      });

      const transformedData = {
        days: Object.entries(groupedByDay).map(([dayName, slots]) => ({
          day_name: dayName,
          slots: slots,
        })),
      };

      loadFromAgenda(transformedData);
    }
    setLoading(false);
  }, [fetchAvailabilityList, loadFromAgenda]);

  React.useEffect(() => {
    loadAvailabilities();
  }, []);

  const handleAvailabilityAdded = React.useCallback(() => {
    console.log('✅ Disponibilidad agregada, recargando agenda...');
    fetchWeeklyAgenda(); // Recargar DispAgenda
  }, [fetchWeeklyAgenda]);

  const handleAvailabilityDeleted = React.useCallback(() => {
    console.log('🗑️ Disponibilidad eliminada, recargando agenda...');
    fetchWeeklyAgenda(); // Recargar DispAgenda
  }, [fetchWeeklyAgenda]);

  return (
    <>
      {/* Vista de disponibilidad */}
      <div className="mb-8">
        <DispAgenda />
      </div>

      <h2 className="text-xl font-semibold mb-4 text-gray-800">Configuración de disponibilidad</h2>
      <p className="text-sm text-gray-600 mb-4">
        💡 Los horarios que configures aquí se reflejarán automáticamente en tu agenda semanal.
      </p>

      {loading && <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded">🔄 Cargando...</div>}

      <AvailabilityConfig 
        onAvailabilityAdded={handleAvailabilityAdded}
        onAvailabilityDeleted={handleAvailabilityDeleted}
      />
    </>
  );
};
