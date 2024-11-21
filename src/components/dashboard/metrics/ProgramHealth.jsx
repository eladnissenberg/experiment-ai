import React from "react";
import { TrendingUp, Clock, Target, Brain, Zap } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const ProgramHealth = ({ metrics }) => {
  // Simulated trend data
  const trendData = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    successRate: Math.floor(65 + Math.random() * 20),
    impact: Math.floor(50000 + Math.random() * 50000)
  }));

  return (
    <>
      {/* Success Rate Card */}
      <div className="bg-white rounded-xl border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Success Rate</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {metrics.experimentSuccess}%
              </p>
            </div>
          </div>
        </div>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <Line 
                type="monotone" 
                dataKey="successRate" 
                stroke="#16a34a" 
                strokeWidth={2}
                dot={false}
              />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Velocity Card */}
      <div className="bg-white rounded-xl border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Time to Significance</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {metrics.avgTimeToSignificance} days
              </p>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Active Experiments</span>
            <span className="font-medium text-gray-900">{metrics.activeExperiments}</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-gray-600">Completed</span>
            <span className="font-medium text-gray-900">{metrics.completedExperiments}</span>
          </div>
        </div>
      </div>

      {/* Impact Card */}
      <div className="bg-white rounded-xl border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Target className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Impact Generated</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {metrics.impactGenerated}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Learnings Documented</span>
            <span className="font-medium text-gray-900">{metrics.learnings}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProgramHealth;