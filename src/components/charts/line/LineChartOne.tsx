import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

interface ChartData {
  options: ApexOptions;
  series: {
    name: string;
    data: number[];
  }[];
}

type TimeUnit = 'DAY' | 'WEEK' | 'MONTH';

export default function LineChartOne() {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeUnit, setTimeUnit] = useState<TimeUnit>('DAY');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  const getFirstDayOfWeek = (date: Date) => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getNextDate = (date: Date, unit: TimeUnit) => {
    const newDate = new Date(date);
    if (unit === 'DAY') {
      newDate.setDate(date.getDate() + 1);
    } else if (unit === 'WEEK') {
      newDate.setDate(date.getDate() + 7);
    } else if (unit === 'MONTH') {
      newDate.setMonth(date.getMonth() + 1);
    }
    return newDate;
  };

  const getPreviousDate = (date: Date, unit: TimeUnit) => {
    const newDate = new Date(date);
    if (unit === 'DAY') {
      newDate.setDate(date.getDate() - 1);
    } else if (unit === 'WEEK') {
      newDate.setDate(date.getDate() - 7);
    } else if (unit === 'MONTH') {
      newDate.setMonth(date.getMonth() - 1);
    }
    return newDate;
  };

  const fetchChartData = async (unit: TimeUnit, date: Date) => {
    try {
      const token = localStorage.getItem('credit-monitor-token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      let url = 'http://127.0.0.1:8080/api/contract/credits/accounting';
      let formattedDate = formatDate(date);
      
      if (unit === 'WEEK') {
        const firstDayOfWeek = formatDate(getFirstDayOfWeek(new Date(date)));
        url += `?unit=WEEK&date=${firstDayOfWeek}`;
      } else if (unit === 'MONTH') {
        const firstDayOfMonth = formatDate(getFirstDayOfMonth(new Date(date)));
        url += `?unit=MONTH&date=${firstDayOfMonth}`;
      } else {
        url += `?unit=DAY&date=${formattedDate}`;
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch chart data');
      }

      const data = await response.json();
      setChartData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchChartData(timeUnit, currentDate);
  }, [timeUnit, currentDate]);

  const handleTimeUnitChange = (unit: TimeUnit) => {
    setTimeUnit(unit);
    setCurrentDate(new Date()); // Reset to current date when changing unit
  };

  const handleNext = () => {
    setCurrentDate(getNextDate(currentDate, timeUnit));
  };

  const handlePrevious = () => {
    setCurrentDate(getPreviousDate(currentDate, timeUnit));
  };

  const formatDisplayDate = (date: Date, unit: TimeUnit) => {
    if (unit === 'DAY') {
      return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } else if (unit === 'WEEK') {
      const start = getFirstDayOfWeek(new Date(date));
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      return `${start.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })} - ${end.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}`;
    } else {
      return date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <button
              onClick={handlePrevious}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Anterior
            </button>
            <button
              onClick={handleNext}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Siguiente
            </button>
          </div>
          <div className="text-gray-600 dark:text-gray-300">
            {formatDisplayDate(currentDate, timeUnit)}
          </div>
          <select
            value={timeUnit}
            onChange={(e) => handleTimeUnitChange(e.target.value as TimeUnit)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="DAY">Día</option>
            <option value="WEEK">Semana</option>
            <option value="MONTH">Mes</option>
          </select>
        </div>
        <div className="flex items-center justify-center h-[310px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <button
              onClick={handlePrevious}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Anterior
            </button>
            <button
              onClick={handleNext}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Siguiente
            </button>
          </div>
          <div className="text-gray-600 dark:text-gray-300">
            {formatDisplayDate(currentDate, timeUnit)}
          </div>
          <select
            value={timeUnit}
            onChange={(e) => handleTimeUnitChange(e.target.value as TimeUnit)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="DAY">Día</option>
            <option value="WEEK">Semana</option>
            <option value="MONTH">Mes</option>
          </select>
        </div>
        <div className="flex items-center justify-center h-[310px] text-red-500">
          {error}
        </div>
      </div>
    );
  }

  if (!chartData) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <button
              onClick={handlePrevious}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Anterior
            </button>
            <button
              onClick={handleNext}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Siguiente
            </button>
          </div>
          <div className="text-gray-600 dark:text-gray-300">
            {formatDisplayDate(currentDate, timeUnit)}
          </div>
          <select
            value={timeUnit}
            onChange={(e) => handleTimeUnitChange(e.target.value as TimeUnit)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="DAY">Día</option>
            <option value="WEEK">Semana</option>
            <option value="MONTH">Mes</option>
          </select>
        </div>
        <div className="flex items-center justify-center h-[310px] text-gray-500">
          No data available
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <button
            onClick={handlePrevious}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Anterior
          </button>
          <button
            onClick={handleNext}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Siguiente
          </button>
        </div>
        <div className="text-gray-600 dark:text-gray-300">
          {formatDisplayDate(currentDate, timeUnit)}
        </div>
        <select
          value={timeUnit}
          onChange={(e) => handleTimeUnitChange(e.target.value as TimeUnit)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="DAY">Día</option>
          <option value="WEEK">Semana</option>
          <option value="MONTH">Mes</option>
        </select>
      </div>
    <div className="max-w-full overflow-x-auto custom-scrollbar">
      <div id="chartEight" className="min-w-[1000px]">
          <Chart 
            options={chartData.options} 
            series={chartData.series} 
            type="area" 
            height={310} 
          />
        </div>
      </div>
    </div>
  );
}
