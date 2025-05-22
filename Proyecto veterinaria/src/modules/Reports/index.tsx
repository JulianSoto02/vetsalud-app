import React, { useState, useEffect } from 'react';
import { BarChart as BarChartIcon, PieChart as PieChartIcon } from 'lucide-react';
import { useData } from '../../context/DataContext';
import AppointmentsChart from './AppointmentsChart';
import VaccinationsChart from './VaccinationsChart';

const Reports: React.FC = () => {
  const { appointments, vaccinations } = useData();
  const [appointmentData, setAppointmentData] = useState<{ date: string; count: number }[]>([]);
  const [vaccinationData, setVaccinationData] = useState<{ status: string; count: number }[]>([]);

  useEffect(() => {
    // Process appointment data for chart
    const processAppointmentData = () => {
      const today = new Date();
      const dates: { [key: string]: number } = {};
      
      // Initialize with the next 7 days
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dateString = date.toISOString().split('T')[0];
        dates[dateString] = 0;
      }
      
      // Count appointments for each date
      appointments.forEach(appointment => {
        if (appointment.status === 'scheduled' && dates[appointment.date] !== undefined) {
          dates[appointment.date] += 1;
        }
      });
      
      // Convert to array format for chart
      const chartData = Object.entries(dates).map(([date, count]) => ({ 
        date, 
        count 
      }));
      
      setAppointmentData(chartData);
    };
    
    // Process vaccination data for chart
    const processVaccinationData = () => {
      const today = new Date();
      const thirtyDaysFromNow = new Date(today);
      thirtyDaysFromNow.setDate(today.getDate() + 30);
      
      let pendingCount = 0;
      let upcomingCount = 0;
      let overdueCount = 0;
      let completedCount = 0;
      
      vaccinations.forEach(vaccination => {
        const dueDate = new Date(vaccination.nextDueDate);
        
        if (vaccination.status === 'completed') {
          completedCount += 1;
        } else if (dueDate < today) {
          overdueCount += 1;
        } else if (dueDate <= thirtyDaysFromNow) {
          upcomingCount += 1;
        } else {
          pendingCount += 1;
        }
      });
      
      setVaccinationData([
        { status: 'Completadas', count: completedCount },
        { status: 'Vencidas', count: overdueCount },
        { status: 'Próximas (30 días)', count: upcomingCount },
        { status: 'Pendientes', count: pendingCount }
      ]);
    };
    
    processAppointmentData();
    processVaccinationData();
  }, [appointments, vaccinations]);

  return (
    <div className="animate-fadeIn">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <BarChartIcon className="mr-2 h-6 w-6 text-teal-600" />
          Reportes
        </h2>
        <p className="text-gray-600">Estadísticas y análisis de datos de la clínica</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-teal-600 px-4 py-3 text-white flex items-center">
            <BarChartIcon className="h-5 w-5 mr-2" />
            <h3 className="font-medium">Citas por Día (Próximos 7 días)</h3>
          </div>
          <div className="p-4 h-80">
            <AppointmentsChart data={appointmentData} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-teal-600 px-4 py-3 text-white flex items-center">
            <PieChartIcon className="h-5 w-5 mr-2" />
            <h3 className="font-medium">Estado de Vacunaciones</h3>
          </div>
          <div className="p-4 h-80">
            <VaccinationsChart data={vaccinationData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;