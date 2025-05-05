import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import OffersBarChartOne from "../../components/charts/bar/OffersBarChartOne";
import PageMeta from "../../components/common/PageMeta";

export default function OfertasChart() {
  return (
    <div>
      <PageMeta
        title="React.js Chart Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="Esta es la página de ofertas"
      />
      <PageBreadcrumb pageTitle="Ofertas" />
      <div className="space-y-6">
        <ComponentCard title="Ofertas">
          <OffersBarChartOne />
        </ComponentCard>
      </div>
    </div>
  );
} 