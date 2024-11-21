import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle } from "lucide-react";

const Analytics = () => {
  const [timeFrame, setTimeFrame] = useState("30");  // days

  // Sample data - would come from your backend
  const experimentPerformance = {
    totalExperiments: 24,
    activeExperiments: 8,
    successfulExperiments: 15,
    failedExperiments: 6,
    inconclusiveExperiments: 3,
    averageConfidence: 95.2,
    averageImpact: "+12.3%"
  };

  const activeExperiments = [
    {
      name: "Homepage Banner Test",
      runningDays: 15,
      confidence: 98.2,
      uplift: 12.5,
      traffic: 5000,
      status: "significant"
    },
    {
      name: "Checkout Flow Optimization",
      runningDays: 8,
      confidence: 82.4,
      uplift: -2.1,
      traffic: 3200,
      status: "needs-more-data"
    },
    // Add more experiments
  ];

  const historicalInsights = [
    { month: 'Jan', successRate: 75, experimentsRun: 4 },
    { month: 'Feb', successRate: 80, experimentsRun: 5 },
    { month: 'Mar', successRate: 60, experimentsRun: 3 },
    { month: 'Apr', successRate: 90, experimentsRun: 6 },
    { month: 'May', successRate: 85, experimentsRun: 4 },
    { month: 'Jun', successRate: 95, experimentsRun: 5 }
  ];

  const COLORS = ['#16a34a', '#dc2626', '#f59e0b'];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Experimentation Analytics</h1>
          <p className="text-gray-600">Track, measure, and improve your experiments</p>
        </div>
        <select 
          className="border rounded-lg px-4 py-2"
          value={timeFrame}
          onChange={(e) => setTimeFrame(e.target.value)}
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
          <option value="365">Last year</option>
        </select>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">Success Rate</h3>
            <span className="text-green-500">
              <TrendingUp className="w-5 h-5" />
            </span>
          </div>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {((experimentPerformance.successfulExperiments / experimentPerformance.totalExperiments) * 100).toFixed(1)}%
          </p>
          <p className="mt-1 text-sm text-gray-600">
            {experimentPerformance.successfulExperiments} successful out of {experimentPerformance.totalExperiments}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">Average Impact</h3>
            <span className="text-green-500">
              <TrendingUp className="w-5 h-5" />
            </span>
          </div>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {experimentPerformance.averageImpact}
          </p>
          <p className="mt-1 text-sm text-gray-600">
            Across all successful experiments
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">Active Experiments</h3>
            <span className="text-blue-500">
              <AlertCircle className="w-5 h-5" />
            </span>
          </div>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {experimentPerformance.activeExperiments}
          </p>
          <p className="mt-1 text-sm text-gray-600">
            Currently running
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">Avg. Confidence</h3>
            <span className="text-green-500">
              <CheckCircle className="w-5 h-5" />
            </span>
          </div>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {experimentPerformance.averageConfidence}%
          </p>
          <p className="mt-1 text-sm text-gray-600">
            Statistical significance
          </p>
        </div>
      </div>

      {/* Active Experiments Performance */}
      <div className="bg-white p-6 rounded-xl border">
        <h2 className="text-lg font-semibold mb-4">Active Experiments Performance</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Experiment</th>
                <th className="text-right py-3 px-4">Running Time</th>
                <th className="text-right py-3 px-4">Confidence</th>
                <th className="text-right py-3 px-4">Uplift</th>
                <th className="text-right py-3 px-4">Traffic</th>
                <th className="text-right py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {activeExperiments.map((exp, idx) => (
                <tr key={idx} className="border-b">
                  <td className="py-3 px-4">{exp.name}</td>
                  <td className="text-right py-3 px-4">{exp.runningDays} days</td>
                  <td className="text-right py-3 px-4">{exp.confidence}%</td>
                  <td className={`text-right py-3 px-4 ${exp.uplift > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {exp.uplift > 0 ? '+' : ''}{exp.uplift}%
                  </td>
                  <td className="text-right py-3 px-4">{exp.traffic.toLocaleString()}</td>
                  <td className="text-right py-3 px-4">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                      exp.status === 'significant' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {exp.status === 'significant' ? 'Significant' : 'Needs Data'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Historical Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border">
          <h2 className="text-lg font-semibold mb-4">Success Rate Trend</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historicalInsights}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="successRate" 
                  stroke="#2563eb" 
                  strokeWidth={2}
                  name="Success Rate"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border">
          <h2 className="text-lg font-semibold mb-4">Experiment Outcomes</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Successful', value: experimentPerformance.successfulExperiments },
                    { name: 'Failed', value: experimentPerformance.failedExperiments },
                    { name: 'Inconclusive', value: experimentPerformance.inconclusiveExperiments }
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {COLORS.map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recommendations Section */}
      <div className="bg-white p-6 rounded-xl border">
        <h2 className="text-lg font-semibold mb-4">AI-Powered Recommendations</h2>
        <div className="space-y-4">
          <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
            <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900">Increase Sample Size</h3>
              <p className="text-blue-700 text-sm mt-1">
                "Checkout Flow Optimization" experiment needs larger sample size. Consider increasing traffic allocation to reach significance faster.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-green-900">Ready for Implementation</h3>
              <p className="text-green-700 text-sm mt-1">
                "Homepage Banner Test" has reached significant positive results. Consider implementing the winning variation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;