import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import api from "../../../services/api";

interface ChartData {
  options: ApexOptions;
  series: {
    name: string;
    data: number[];
  }[];
}

type TimeUnit = 'DAY' | 'WEEK' | 'MONTH';
type CountryCode = 'ALL' | 'AR' | 'CL' | 'DO' | 'EC' | 'GT' | 'PE' | 'SV';
type Integration = 'ALL' | 'ACCOUNTING' | 'CREATE_OFFER' | 'DEBT' | 'DEPOSIT' | 'INSTALLMENT_TAXES' | 'INVOICING' | 'NOTIFY' | 'PAYMENT' | 'SAVE_CLIENT' | 'SELECTED_DEBT';
type ClientType = 'RIDER' | 'CONTRACT';

const countries: { code: CountryCode; name: string }[] = [
  { code: 'ALL', name: 'Todos los países' },
  { code: 'AR', name: 'Argentina' },
  { code: 'CL', name: 'Chile' },
  { code: 'DO', name: 'República Dominicana' },
  { code: 'EC', name: 'Ecuador' },
  { code: 'GT', name: 'Guatemala' },
  { code: 'PE', name: 'Perú' },
  { code: 'SV', name: 'El Salvador' }
];

const integrations: { value: Integration; label: string }[] = [
  { value: 'ALL', label: 'Todas las integraciones' },
  { value: 'ACCOUNTING', label: 'Contabilidad' },
  { value: 'CREATE_OFFER', label: 'Crear oferta' },
  { value: 'DEBT', label: 'Deuda' },
  { value: 'DEPOSIT', label: 'Depósito' },
  { value: 'INSTALLMENT_TAXES', label: 'Impuestos en cuotas' },
  { value: 'INVOICING', label: 'Facturación' },
  { value: 'NOTIFY', label: 'Notificar' },
  { value: 'PAYMENT', label: 'Pago' },
  { value: 'SAVE_CLIENT', label: 'Guardar cliente' },
  { value: 'SELECTED_DEBT', label: 'Deuda seleccionada' }
];

const clientTypes: { value: ClientType; label: string }[] = [
  { value: 'CONTRACT', label: 'Contrato' },
  { value: 'RIDER', label: 'Rider' }
];

export default function BarChartOne() {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeUnit, setTimeUnit] = useState<TimeUnit>('DAY');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>('ALL');
  const [selectedIntegration, setSelectedIntegration] = useState<Integration>('ALL');
  const [selectedClient, setSelectedClient] = useState<ClientType>('CONTRACT');

  const getFirstDayOfWeek = (date: Date) => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  };

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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

  const formatWeekDays = (date: string) => {
    const weekDays = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const [year, month, day] = date.split('-').map(Number);
    const d = new Date(year, month - 1, day);
    return weekDays[d.getDay()];
  };

  const fetchChartData = async (unit: TimeUnit, date: Date) => {
    try {
      const token = localStorage.getItem('credit-monitor-token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      let formattedDate = formatDate(date);
      const params = new URLSearchParams();
      
      if (unit === 'WEEK') {
        const firstDayOfWeek = formatDate(getFirstDayOfWeek(new Date(date)));
        params.append('unit', 'WEEK');
        params.append('date', firstDayOfWeek);
      } else if (unit === 'MONTH') {
        const firstDayOfMonth = formatDate(getFirstDayOfMonth(new Date(date)));
        params.append('unit', 'MONTH');
        params.append('date', firstDayOfMonth);
      } else {
        params.append('unit', 'DAY');
        params.append('date', formattedDate);
      }

      if (selectedCountry !== 'ALL') {
        params.append('country', selectedCountry);
      }

      if (selectedIntegration !== 'ALL') {
        params.append('integration', selectedIntegration);
      }

      params.append('client', selectedClient);

      const response = await api.get(`/contract/credits?${params.toString()}`);

      if (response.status !== 200) {
        throw new Error('Failed to fetch chart data');
      }

      const data = response.data;

      if (unit === 'WEEK' && data.options?.xaxis?.categories) {
        data.options = {
          ...data.options,
          xaxis: {
            ...data.options.xaxis,
            categories: data.options.xaxis.categories.map(formatWeekDays)
          }
        };
      }

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
  }, [timeUnit, currentDate, selectedCountry, selectedIntegration, selectedClient]);

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
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex justify-between w-full lg:w-auto">
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
          <div className="text-gray-600 dark:text-gray-300 text-center w-full lg:w-auto">
            {formatDisplayDate(currentDate, timeUnit)}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex gap-2 w-full lg:w-auto">
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value as ClientType)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            >
              {clientTypes.map(clientType => (
                <option key={clientType.value} value={clientType.value}>
                  {clientType.label}
                </option>
              ))}
            </select>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value as CountryCode)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            >
              {countries.map(country => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
            <select
              value={selectedIntegration}
              onChange={(e) => setSelectedIntegration(e.target.value as Integration)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            >
              {integrations.map(integration => (
                <option key={integration.value} value={integration.value}>
                  {integration.label}
                </option>
              ))}
            </select>
            <select
              value={timeUnit}
              onChange={(e) => handleTimeUnitChange(e.target.value as TimeUnit)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            >
              <option value="DAY">Día</option>
              <option value="WEEK">Semana</option>
              <option value="MONTH">Mes</option>
            </select>
          </div>
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
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex justify-between w-full lg:w-auto">
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
          <div className="text-gray-600 dark:text-gray-300 text-center w-full lg:w-auto">
            {formatDisplayDate(currentDate, timeUnit)}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex gap-2 w-full lg:w-auto">
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value as ClientType)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            >
              {clientTypes.map(clientType => (
                <option key={clientType.value} value={clientType.value}>
                  {clientType.label}
                </option>
              ))}
            </select>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value as CountryCode)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            >
              {countries.map(country => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
            <select
              value={selectedIntegration}
              onChange={(e) => setSelectedIntegration(e.target.value as Integration)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            >
              {integrations.map(integration => (
                <option key={integration.value} value={integration.value}>
                  {integration.label}
                </option>
              ))}
            </select>
            <select
              value={timeUnit}
              onChange={(e) => handleTimeUnitChange(e.target.value as TimeUnit)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            >
              <option value="DAY">Día</option>
              <option value="WEEK">Semana</option>
              <option value="MONTH">Mes</option>
            </select>
          </div>
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
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex justify-between w-full lg:w-auto">
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
          <div className="text-gray-600 dark:text-gray-300 text-center w-full lg:w-auto">
            {formatDisplayDate(currentDate, timeUnit)}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex gap-2 w-full lg:w-auto">
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value as ClientType)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            >
              {clientTypes.map(clientType => (
                <option key={clientType.value} value={clientType.value}>
                  {clientType.label}
                </option>
              ))}
            </select>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value as CountryCode)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            >
              {countries.map(country => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
            <select
              value={selectedIntegration}
              onChange={(e) => setSelectedIntegration(e.target.value as Integration)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            >
              {integrations.map(integration => (
                <option key={integration.value} value={integration.value}>
                  {integration.label}
                </option>
              ))}
            </select>
            <select
              value={timeUnit}
              onChange={(e) => handleTimeUnitChange(e.target.value as TimeUnit)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            >
              <option value="DAY">Día</option>
              <option value="WEEK">Semana</option>
              <option value="MONTH">Mes</option>
            </select>
          </div>
        </div>
        <div className="flex items-center justify-center h-[310px] text-gray-500">
          No data available
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex justify-between w-full lg:w-auto">
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
        <div className="text-gray-600 dark:text-gray-300 text-center w-full lg:w-auto">
          {formatDisplayDate(currentDate, timeUnit)}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex gap-2 w-full lg:w-auto">
          <select
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value as ClientType)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          >
            {clientTypes.map(clientType => (
              <option key={clientType.value} value={clientType.value}>
                {clientType.label}
              </option>
            ))}
          </select>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value as CountryCode)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          >
            {countries.map(country => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </select>
          <select
            value={selectedIntegration}
            onChange={(e) => setSelectedIntegration(e.target.value as Integration)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          >
            {integrations.map(integration => (
              <option key={integration.value} value={integration.value}>
                {integration.label}
              </option>
            ))}
          </select>
          <select
            value={timeUnit}
            onChange={(e) => handleTimeUnitChange(e.target.value as TimeUnit)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          >
            <option value="DAY">Día</option>
            <option value="WEEK">Semana</option>
            <option value="MONTH">Mes</option>
          </select>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div id="chartOne" className="min-w-[1000px]">
          <Chart 
            options={chartData.options} 
            series={chartData.series} 
            type="bar" 
            height={310} 
          />
        </div>
      </div>
    </div>
  );
}
