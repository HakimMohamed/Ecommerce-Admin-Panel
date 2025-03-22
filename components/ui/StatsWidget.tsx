"use client";

import { Card } from "@heroui/react";
import { ArrowDown, ArrowUp } from "lucide-react";

interface StatsWidgetProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  value: string;
  change: number;
  changeText: string;
  color: string;
}

export const StatsWidget: React.FC<StatsWidgetProps> = ({
  icon: Icon,
  title,
  value,
  change,
  changeText,
  color,
}) => {
  const isPositive = change >= 0;

  return (
    <Card className="rounded-xl shadow-lg p-4">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          <div className="flex items-center mt-1">
            <span
              className={`flex items-center text-sm ${isPositive ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"}`}
            >
              {isPositive ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
              {Math.abs(change)}%
            </span>
            <span className="text-xs ml-1">{changeText}</span>
          </div>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon width={20} height={20} className="text-white" />
        </div>
      </div>
    </Card>
  );
};
