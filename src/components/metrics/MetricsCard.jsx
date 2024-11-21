import React from "react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

const MetricsCard = ({ title, value, change, icon: Icon, trend }) => {
  return (
    <div className="bg-white p-6 rounded-xl border hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
          <Icon className="w-6 h-6" />
        </div>
        <span className={`text-sm font-medium ${
          change.startsWith("+") ? "text-green-600" : "text-red-600"
        }`}>
          {change}
        </span>
      </div>
      <h3 className="text-sm text-gray-600">{title}</h3>
      <p className="text-2xl font-semibold text-gray-900 mt-1 mb-4">
        {value}
      </p>
      <div className="h-16">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trend}>
            <Line
              type="monotone"
              dataKey="value"
              stroke="#2563eb"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MetricsCard;
