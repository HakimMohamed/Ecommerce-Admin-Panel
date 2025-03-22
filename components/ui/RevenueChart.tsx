"use client";

import React from "react";
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ArrowUp, TrendingUp, Clock } from "lucide-react";
import { Card } from "@heroui/react";
const RevenueChart = () => {
  // Mock data for dashboard widgets
  const salesData = [
    { name: "Jan", value: 45600 },
    { name: "Feb", value: 52400 },
    { name: "Mar", value: 48900 },
    { name: "Apr", value: 63200 },
    { name: "May", value: 58700 },
    { name: "Jun", value: 68300 },
    { name: "Jul", value: 72100 },
  ];

  const orderData = [
    { hour: "12am", orders: 8 },
    { hour: "3am", orders: 3 },
    { hour: "6am", orders: 7 },
    { hour: "9am", orders: 21 },
    { hour: "12pm", orders: 42 },
    { hour: "3pm", orders: 56 },
    { hour: "6pm", orders: 49 },
    { hour: "9pm", orders: 27 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Card className=" rounded-lg shadow-md p-4 lg:col-span-2">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-base font-bold">Revenue Trend</h2>
            <p className="text-xs">Monthly revenue</p>
          </div>
          <div className="bg-blue-100 dark:bg-blue-900 p-1 rounded-full">
            <TrendingUp
              className="text-blue-600 dark:text-blue-400"
              size={16}
            />
          </div>
        </div>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={salesData}
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
                tickFormatter={(value) => `$${value / 1000}k`}
                tick={{ fontSize: 10, fill: "currentColor", opacity: 0.6 }}
              />
              <Tooltip
                formatter={(value) => [`$${value.toLocaleString()}`, "Revenue"]}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className=" rounded-lg shadow-md p-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-base font-bold">Today&apos;s Orders</h2>
            <p className="text-xs ">Hourly breakdown</p>
          </div>
          <div className="bg-orange-100 dark:bg-orange-900 p-1 rounded-full">
            <Clock className="text-orange-600 dark:text-orange-400" size={16} />
          </div>
        </div>
        <div className="flex items-center mb-4">
          <span className="text-2xl font-bold">213</span>
          <div className="flex items-center ml-3">
            <span className="flex items-center text-xs text-green-600 dark:text-green-500">
              <ArrowUp size={12} className="mr-1" />
              8.7%
            </span>
            <span className="text-xs  ml-1">vs yesterday</span>
          </div>
        </div>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={orderData}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              <XAxis
                dataKey="hour"
                tick={{ fontSize: 10, fill: "currentColor", opacity: 0.6 }}
              />
              <Tooltip formatter={(value) => [`${value} orders`, "Orders"]} />
              <Bar dataKey="orders" fill="#F97316" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default RevenueChart;
