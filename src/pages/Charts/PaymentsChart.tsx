import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PaymentsBarChartOne from "../../components/charts/bar/PaymentsBarChartOne";
import PageMeta from "../../components/common/PageMeta";

export default function PaymentsChart() {
  return (
    <div>
      <PageMeta
        title="React.js Chart Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="Esta es la página de pagos (payments)"
      />
      <PageBreadcrumb pageTitle="Pagos" />
      <div className="space-y-6">
        <ComponentCard title="Pagos">
          <PaymentsBarChartOne />
        </ComponentCard>
      </div>
    </div>
  );
} 