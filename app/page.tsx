import { EcommerceMetrics } from "@/components/ui/EcommerceMetrics";
import MonthlySalesChart from "@/components/ui/MonthlySalesChart";

export default function Home() {
  return (
    <div className="space-y-6">
      <div className="space-y-6">
        <EcommerceMetrics />
        <MonthlySalesChart />
      </div>
      <div className="space-y-6">
        <EcommerceMetrics />
        <MonthlySalesChart />
      </div>
    </div>
  );
}
