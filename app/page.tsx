import { EcommerceMetrics } from "@/components/ui/EcommerceMetrics";
import MonthlySalesChart from "@/components/ui/MonthlySalesChart";

export default function Home() {
  return (
    <div className="grid grid-cols-12">
      <div className="col-span-12 space-y-6">
        <EcommerceMetrics />

        <MonthlySalesChart />
      </div>

      <div className="col-span-12 space-y-6">
        <EcommerceMetrics />

        <MonthlySalesChart />
      </div>
    </div>
  );
}
