import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import MessagesBarChartOne from "../../components/charts/bar/MessagesBarChartOne";
import PageMeta from "../../components/common/PageMeta";

export default function MessagesChart() {
  return (
    <div>
      <PageMeta
        title="React.js Chart Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Chart Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Mensajes" />
      <div className="space-y-6">
        <ComponentCard title="Mensajes">
          <MessagesBarChartOne />
        </ComponentCard>
      </div>
    </div>
  );
}
