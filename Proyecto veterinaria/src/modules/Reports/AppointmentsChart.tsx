import React, { useEffect, useRef } from 'react';

interface ChartData {
  date: string;
  count: number;
}

interface AppointmentsChartProps {
  data: ChartData[];
}

const AppointmentsChart: React.FC<AppointmentsChartProps> = ({ data }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!chartRef.current || !data.length) return;
    
    const loadChart = async () => {
      // Import Chart.js dynamically
      const { Chart, registerables } = await import('chart.js');
      Chart.register(...registerables);
      
      // Format dates for display
      const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', { 
          weekday: 'short', 
          day: 'numeric', 
          month: 'short' 
        });
      };
      
      // Extract data for chart
      const labels = data.map(item => formatDate(item.date));
      const counts = data.map(item => item.count);
      
      // Create chart
      const ctx = chartRef.current.getContext('2d');
      
      if (ctx) {
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels,
            datasets: [
              {
                label: 'Número de Citas',
                data: counts,
                backgroundColor: 'rgba(56, 178, 172, 0.6)',
                borderColor: 'rgba(56, 178, 172, 1)',
                borderWidth: 1
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  precision: 0
                }
              }
            },
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                callbacks: {
                  title: function(tooltipItems) {
                    return tooltipItems[0].label;
                  },
                  label: function(context) {
                    const value = context.parsed.y;
                    return `${value} cita${value !== 1 ? 's' : ''}`;
                  }
                }
              }
            }
          }
        });
      }
    };
    
    loadChart();
  }, [data]);

  if (!data.length) {
    return <div className="flex items-center justify-center h-full">No hay datos disponibles</div>;
  }

  return <canvas ref={chartRef} />;
};

export default AppointmentsChart;