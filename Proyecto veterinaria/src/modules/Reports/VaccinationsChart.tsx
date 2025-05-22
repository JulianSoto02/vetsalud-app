import React, { useEffect, useRef } from 'react';

interface ChartData {
  status: string;
  count: number;
}

interface VaccinationsChartProps {
  data: ChartData[];
}

const VaccinationsChart: React.FC<VaccinationsChartProps> = ({ data }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!chartRef.current || !data.length) return;
    
    const loadChart = async () => {
      // Import Chart.js dynamically
      const { Chart, registerables } = await import('chart.js');
      Chart.register(...registerables);
      
      // Extract data for chart
      const labels = data.map(item => item.status);
      const counts = data.map(item => item.count);
      
      // Define colors for each status
      const backgroundColor = [
        'rgba(72, 187, 120, 0.6)',  // Completadas (green)
        'rgba(245, 101, 101, 0.6)', // Vencidas (red)
        'rgba(237, 137, 54, 0.6)',  // Próximas (orange)
        'rgba(49, 130, 206, 0.6)'   // Pendientes (blue)
      ];
      
      const borderColor = [
        'rgba(72, 187, 120, 1)',
        'rgba(245, 101, 101, 1)',
        'rgba(237, 137, 54, 1)',
        'rgba(49, 130, 206, 1)'
      ];
      
      // Create chart
      const ctx = chartRef.current.getContext('2d');
      
      if (ctx) {
        new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels,
            datasets: [
              {
                data: counts,
                backgroundColor,
                borderColor,
                borderWidth: 1
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  padding: 20
                }
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const value = context.parsed;
                    const label = context.label || '';
                    const total = context.dataset.data.reduce((acc: number, curr: number) => acc + curr, 0);
                    const percentage = Math.round((value * 100) / total);
                    return `${label}: ${value} (${percentage}%)`;
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

export default VaccinationsChart;