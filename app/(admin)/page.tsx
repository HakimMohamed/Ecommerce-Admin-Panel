"use client";
import React from "react";

import { DollarSign, ShoppingBag, Users, CreditCard } from "lucide-react";
import { StatsWidget } from "@/components/ui/StatsWidget";
import RevenueChart from "@/components/ui/RevenueChart";
import CategoryPieChart from "@/components/ui/CategoryPieChat";
import TopProductsTable from "@/components/ui/TopProducts";

const EcommerceDashboard = () => {
  return (
    <div className="p-4 w-full flex flex-col gap-6">
      <header>
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">
          Ecommerce Analytics
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Overview of your store&apos;s performance
        </p>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsWidget
          icon={DollarSign}
          title="Revenue"
          value="$142,384"
          change={12.3}
          changeText="vs last month"
          color="bg-blue-600"
        />
        <StatsWidget
          icon={ShoppingBag}
          title="Orders"
          value="3,865"
          change={8.1}
          changeText="vs last month"
          color="bg-orange-500"
        />
        <StatsWidget
          icon={Users}
          title="New Customers"
          value="1,242"
          change={14.5}
          changeText="vs last month"
          color="bg-green-600"
        />
        <StatsWidget
          icon={CreditCard}
          title="Avg. Order Value"
          value="$36.84"
          change={-2.3}
          changeText="vs last month"
          color="bg-purple-600"
        />
      </div>
      <RevenueChart />
      <CategoryPieChart />
      <TopProductsTable />
    </div>
  );
};

export default EcommerceDashboard;
