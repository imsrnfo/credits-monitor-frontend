import { useEffect, useState } from "react";
import ComponentCard from "../../components/common/ComponentCard";
import api from "../../services/api";

const COUNTRY_NAMES: Record<string, string> = {
  AR: "Argentina",
  CL: "Chile",
  DO: "República Dominicana",
  EC: "Ecuador",
  GT: "Guatemala",
  PE: "Perú",
  SV: "El Salvador",
};

const STATUS_NAMES: Record<string, string> = {
  PENDING: "Pendiente",
  ACCOUNTING: "Contabilizando",
  ACCOUNTED: "Contabilizado",
  DEPOSIT_FAIL: "Fallo en depósito",
  IN_PROGRESS: "En progreso",
  REGRETTED: "Rechazado",
  FINISHED: "Finalizado",
  WRITE_OFF: "Incobrable",
};

const COUNTRIES = Object.keys(COUNTRY_NAMES);
const STATUSES = Object.keys(STATUS_NAMES);

interface Credit {
  country: string;
  status: string;
  qty: number;
}

export default function Home() {
  const [credits, setCredits] = useState<Credit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get("/credits")
      .then((res) => {
        setCredits(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Error al cargar los créditos");
        setLoading(false);
      });
  }, []);

  // Generar estructura completa país -> status -> qty
  const grouped: Record<string, Record<string, number>> = {};
  COUNTRIES.forEach((country) => {
    grouped[country] = {};
    STATUSES.forEach((status) => {
      grouped[country][status] = 0;
    });
  });
  credits.forEach(({ country, status, qty }) => {
    if (grouped[country] && grouped[country][status] !== undefined) {
      grouped[country][status] = qty;
    }
  });

  if (loading) {
    return <div className="p-4">Cargando...</div>;
  }
  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
        {`Créditos ${new Date().getFullYear()}`}
      </h1>
      <div className="space-y-10">
        {COUNTRIES.map((country) => (
          <div key={country}>
            <h2 className="text-xl font-bold mb-4 text-blue-700 dark:text-blue-300 flex items-center gap-2">
              <span className={`fi fi-${country.toLowerCase()} w-6 h-6`} />
              {COUNTRY_NAMES[country]}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {STATUSES.map((status) => (
                <ComponentCard
                  key={status}
                  title={STATUS_NAMES[status]}
                  desc={`País: ${COUNTRY_NAMES[country]}`}
                  className={grouped[country][status] === 0 ? "opacity-30" : ""}
                >
                  <div className="text-3xl font-bold text-center text-gray-800 dark:text-white">
                    {grouped[country][status]}
                  </div>
                </ComponentCard>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
