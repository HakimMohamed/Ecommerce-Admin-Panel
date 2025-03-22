import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ArrowUp, ArrowDown, Activity } from "lucide-react";

const DailyOrdersWidget = () => {
  // Sample data - in a real application, this would come from your API
  const [ordersData, setOrdersData] = useState({
    todayOrders: 147,
    yesterdayOrders: 132,
    percentChange: 11.36,
    hourlyBreakdown: [
      { hour: "12am", orders: 3 },
      { hour: "3am", orders: 1 },
      { hour: "6am", orders: 5 },
      { hour: "9am", orders: 12 },
      { hour: "12pm", orders: 25 },
      { hour: "3pm", orders: 42 },
      { hour: "6pm", orders: 38 },
      { hour: "9pm", orders: 21 },
    ],
  });

  // Calculate if we're trending up or down
  const isPositiveChange = ordersData.percentChange >= 0;

  // Function to get chart bar color based on theme
  const getChartBarColor = () => {
    // Check if we're in dark mode using a media query
    // This is just for the demo - in real usage, the chart will use the user's system/browser theme
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return "#60A5FA"; // lighter blue for dark theme
    }
    return "#3B82F6"; // darker blue for light theme
  };

  return (
    <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg shadow-md p-6 w-full max-w-md">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">Today&apos;s Orders</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Daily order performance
          </p>
        </div>
        <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
          <Activity className="text-blue-600 dark:text-blue-400" size={24} />
        </div>
      </div>

      <div className="flex items-end mb-6">
        <span className="text-4xl font-bold">{ordersData.todayOrders}</span>
        <div className="flex items-center ml-4 mb-1">
          <span
            className={`flex items-center ${isPositiveChange ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"}`}
          >
            {isPositiveChange ? (
              <ArrowUp size={16} className="mr-1" />
            ) : (
              <ArrowDown size={16} className="mr-1" />
            )}
            {Math.abs(ordersData.percentChange).toFixed(1)}%
          </span>
          <span className="text-gray-500 dark:text-gray-400 text-sm ml-1">
            vs yesterday
          </span>
        </div>
      </div>

      <div className="h-48 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={ordersData.hourlyBreakdown}>
            <XAxis
              dataKey="hour"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "currentColor", opacity: 0.6 }}
            />
            <YAxis hide={true} />
            <Tooltip
              formatter={(value) => [`${value} orders`, "Orders"]}
              labelFormatter={(label) => `${label}`}
              contentStyle={{
                backgroundColor: "var(--tooltip-bg, white)",
                color: "var(--tooltip-text, black)",
                border: "none",
                borderRadius: "4px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              }}
            />
            <Bar
              dataKey="orders"
              fill={getChartBarColor()}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400">Yesterday</p>
          <p className="text-xl font-semibold">{ordersData.yesterdayOrders}</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400">Peak Hour</p>
          <p className="text-xl font-semibold">3 PM</p>
        </div>
      </div>
    </div>
  );
};

export default DailyOrdersWidget;
