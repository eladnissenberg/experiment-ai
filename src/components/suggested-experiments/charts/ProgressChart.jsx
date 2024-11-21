import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const ProgressChart = ({ data }) => {
  const COLORS = ['#3b82f6', '#e5e7eb'];

  return (
    <div className="relative h-32">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={[
              { value: data.completed },
              { value: data.total - data.completed }
            ]}
            cx="50%"
            cy="50%"
            innerRadius={25}
            outerRadius={40}
            fill="#8884d8"
            dataKey="value"
            startAngle={90}
            endAngle={-270}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-semibold text-gray-900">{data.percentage}%</p>
          <p className="text-sm text-gray-500">Complete</p>
        </div>
      </div>
    </div>
  );
};

export default ProgressChart;