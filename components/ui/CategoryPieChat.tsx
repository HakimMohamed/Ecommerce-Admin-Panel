"use client";
import React from "react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ArrowUp, Package, ShoppingCart } from "lucide-react";
import { Card } from "@heroui/react";
const CategoryPieChart = () => {
  const categoryData = [
    { name: "Electronics", value: 35 },
    { name: "Clothing", value: 25 },
    { name: "Home", value: 20 },
    { name: "Beauty", value: 15 },
    { name: "Other", value: 5 },
  ];

  const conversionData = [
    { name: "Mon", visitors: 2400, conversions: 120 },
    { name: "Tue", visitors: 1980, conversions: 108 },
    { name: "Wed", visitors: 2800, conversions: 168 },
    { name: "Thu", visitors: 3200, conversions: 192 },
    { name: "Fri", visitors: 3600, conversions: 216 },
    { name: "Sat", visitors: 4200, conversions: 252 },
    { name: "Sun", visitors: 3800, conversions: 210 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A569BD"];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Category distribution */}
      <Card className="rounded-lg shadow-md p-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-base font-bold text-gray-800 dark:text-white">
              Sales by Category
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Product categories
            </p>
          </div>
          <div className="bg-green-100 dark:bg-green-900 p-1 rounded-full">
            <Package className="text-green-600 dark:text-green-400" size={16} />
          </div>
        </div>
        <div className="flex flex-col md:flex-row">
          <div className="h-48 w-full md:w-1/2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={60}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-full md:w-1/2 flex flex-col justify-center mt-2 md:mt-0">
            {categoryData.map((item, index) => (
              <div key={index} className="flex items-center mb-2">
                <div
                  className="w-2 h-2 rounded-full mr-2"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-xs">
                  {item.name}: <strong>{item.value}%</strong>
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Conversion rate */}
      <Card className="rounded-lg shadow-md p-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-base font-bold text-gray-800 dark:text-white">
              Conversion Rate
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Visitors vs. purchases
            </p>
          </div>
          <div className="bg-purple-100 dark:bg-purple-900 p-1 rounded-full">
            <ShoppingCart
              className="text-purple-600 dark:text-purple-400"
              size={16}
            />
          </div>
        </div>
        <div className="flex items-center mb-4">
          <span className="text-2xl font-bold">6.2%</span>
          <div className="flex items-center ml-3">
            <span className="flex items-center text-xs text-green-600 dark:text-green-500">
              <ArrowUp size={12} className="mr-1" />
              0.5%
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
              vs last week
            </span>
          </div>
        </div>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={conversionData}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#ccc"
                opacity={0.1}
              />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10, fill: "currentColor", opacity: 0.6 }}
              />
              <YAxis
                yAxisId="left"
                tick={{ fontSize: 10, fill: "currentColor", opacity: 0.6 }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 10, fill: "currentColor", opacity: 0.6 }}
              />
              <Tooltip />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="visitors"
                stroke="#94A3B8"
                strokeWidth={2}
                dot={false}
                name="Visitors"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="conversions"
                stroke="#A855F7"
                strokeWidth={2}
                dot={false}
                name="Orders"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default CategoryPieChart;
