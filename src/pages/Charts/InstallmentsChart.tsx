import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import InstallmentsBarChartOne from "../../components/charts/bar/InstallmentsBarChartOne";
import PageMeta from "../../components/common/PageMeta";

export default function InstallmentsChart() {
  return (
    <div>
      <PageMeta
        title="React.js Chart Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="Esta es la página de cuotas (installments)"
      />
      <PageBreadcrumb pageTitle="Cuotas" />
      <div className="space-y-6">
        <ComponentCard title="Cuotas">
          <InstallmentsBarChartOne />
        </ComponentCard>
      </div>
    </div>
  );
} 