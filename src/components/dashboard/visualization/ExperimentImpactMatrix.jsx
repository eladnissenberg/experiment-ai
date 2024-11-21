import React, { useState } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import { TrendingUp, Info } from "lucide-react";

const ExperimentImpactMatrix = () => {
  const [selectedMetric, setSelectedMetric] = useState("conversion");
  
  // Simulated data - in real app would come from API
  const data = [
    { x: 85, y: 90, z: 200000, name: 'Homepage Redesign', status: 'running' },
    { x: 65, y: 75, z: 150000, name: 'Checkout Flow', status: 'running' },
    { x: 95, y: 60, z: 180000, name: 'Product Recs', status: 'completed' },
    { x: 75, y: 85, z: 120000, name: 'Mobile Nav', status: 'running' },
    { x: 55, y: 95, z: 90000, name: 'Search UX', status: 'proposed' },
    { x: 80, y: 70, z: 110000, name: 'Cart Updates', status: 'completed' },
  ];

  const renderTooltip = (props) => {
    const { payload } = props;
    if (!payload || !payload.length) return null;

    const experiment = payload[0].payload;
    return (
      <div className="bg-white p-3 shadow-lg rounded-lg border">
        <p className="font-medium text-gray-900">{experiment.name}</p>
        <div className="text-sm text-gray-600 mt-1">
          <p>Success Probability: {experiment.x}%</p>
          <p>Expected Impact: {experiment.y}%</p>
          <p>Status: {experiment.status}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Impact Matrix
            </h2>
          </div>
          <p className="text-sm text-gray-600">
            Success probability vs expected impact
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="conversion">Conversion Rate</option>
            <option value="revenue">Revenue</option>
            <option value="engagement">Engagement</option>
          </select>
          <button className="p-1 text-gray-400 hover:text-gray-600">
            <Info className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              type="number" 
              dataKey="x" 
              name="Success Probability" 
              unit="%" 
              domain={[0, 100]}
            />
            <YAxis 
              type="number" 
              dataKey="y" 
              name="Expected Impact" 
              unit="%" 
              domain={[0, 100]}
            />
            <ZAxis 
              type="number" 
              dataKey="z" 
              range={[50, 400]} 
              name="Value" 
            />
            <Tooltip content={renderTooltip} />
            <Legend />
            <Scatter
              name="Running"
              data={data.filter(d => d.status === 'running')}
              fill="#3b82f6"
            />
            <Scatter
              name="Completed"
              data={data.filter(d => d.status === 'completed')}
              fill="#22c55e"
            />
            <Scatter
              name="Proposed"
              data={data.filter(d => d.status === 'proposed')}
              fill="#6366f1"
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
            <span>Running ({data.filter(d => d.status === 'running').length})</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            <span>Completed ({data.filter(d => d.status === 'completed').length})</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
            <span>Proposed ({data.filter(d => d.status === 'proposed').length})</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperimentImpactMatrix;