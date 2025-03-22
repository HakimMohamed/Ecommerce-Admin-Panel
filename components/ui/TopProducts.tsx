"use client";
import React from "react";

import { ArrowUp, ArrowDown, Activity, Map } from "lucide-react";
import { Card } from "@heroui/react";

const TopProductsTable = () => {
  const topProducts = [
    {
      id: 1,
      name: "Wireless Headphones",
      sales: 342,
      revenue: 23940,
      growth: 12.5,
    },
    { id: 2, name: "Smart Watch X3", sales: 276, revenue: 41400, growth: 8.3 },
    {
      id: 3,
      name: "Premium Yoga Mat",
      sales: 251,
      revenue: 12550,
      growth: 16.7,
    },
    {
      id: 4,
      name: "Organic Face Cream",
      sales: 187,
      revenue: 9350,
      growth: -2.4,
    },
    {
      id: 5,
      name: "Bluetooth Speaker",
      sales: 153,
      revenue: 13770,
      growth: 5.2,
    },
  ];

  const customerLocations = [
    { id: 1, city: "New York", customers: 2845, revenue: 285400 },
    { id: 2, city: "Los Angeles", customers: 1923, revenue: 192300 },
    { id: 3, city: "Chicago", customers: 1247, revenue: 124700 },
    { id: 4, city: "Houston", customers: 958, revenue: 95800 },
    { id: 5, city: "Phoenix", customers: 842, revenue: 84200 },
  ];
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Top products */}
      <Card className=" rounded-lg shadow-md p-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-base font-bold ">Top Products</h2>
            <p className="text-xs">Best performers</p>
          </div>
          <div className="bg-blue-100 dark:bg-blue-900 p-1 rounded-full">
            <Activity className="text-blue-600 dark:text-blue-400" size={16} />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b ">
                <th className="pb-2 text-xs font-medium ">Product</th>
                <th className="pb-2 text-xs font-medium ">Sales</th>
                <th className="pb-2 text-xs font-medium ">Revenue</th>
                <th className="pb-2 text-xs font-medium ">Growth</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((product) => (
                <tr key={product.id} className="border-b ">
                  <td className="py-2 pr-2 text-xs">{product.name}</td>
                  <td className="py-2 pr-2 text-xs">{product.sales}</td>
                  <td className="py-2 pr-2 text-xs">
                    ${product.revenue.toLocaleString()}
                  </td>
                  <td className="py-2 pr-2">
                    <span
                      className={`inline-flex items-center text-xs ${product.growth >= 0 ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"}`}
                    >
                      {product.growth >= 0 ? (
                        <ArrowUp size={10} className="mr-1" />
                      ) : (
                        <ArrowDown size={10} className="mr-1" />
                      )}
                      {Math.abs(product.growth)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Customer locations */}
      <Card className=" rounded-lg shadow-md p-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-base font-bold">Top Locations</h2>
            <p className="text-xs ">Customer cities</p>
          </div>
          <div className="bg-green-100 dark:bg-green-900 p-1 rounded-full">
            <Map className="text-green-600 dark:text-green-400" size={16} />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-gray-200 dark:border-gray-700">
                <th className="pb-2 text-xs font-medium ">City</th>
                <th className="pb-2 text-xs font-medium ">Customers</th>
                <th className="pb-2 text-xs font-medium ">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {customerLocations.map((location) => (
                <tr key={location.id} className="border-b ">
                  <td className="py-2 pr-2 text-xs">{location.city}</td>
                  <td className="py-2 pr-2 text-xs">
                    {location.customers.toLocaleString()}
                  </td>
                  <td className="py-2 pr-2 text-xs">
                    ${location.revenue.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default TopProductsTable;
