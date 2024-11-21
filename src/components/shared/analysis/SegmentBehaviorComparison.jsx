import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { Users, TrendingDown, ExternalLink } from 'lucide-react';

const SegmentBehaviorComparison = ({ data }) => {
  const [view, setView] = useState('chart');

  // Use default data if none provided
  const defaultData = {
    firstTimeVisitors: {
      conversionRate: 2.5,
      averageOrderValue: 85,
      bounceRate: 65,
      timeOnSite: 2.8
    },
    returningVisitors: {
      conversionRate: 3.4,
      averageOrderValue: 110,
      bounceRate: 45,
      timeOnSite: 4.2
    }
  };

  const analysisData = data || defaultData;

  // Transform data for visualization
  const chartData = [
    {
      metric: 'Conversion Rate (%)',
      'First-time Visitors': analysisData.firstTimeVisitors.conversionRate,
      'Returning Visitors': analysisData.returningVisitors.conversionRate,
    },
    {
      metric: 'Avg Order Value ($)',
      'First-time Visitors': analysisData.firstTimeVisitors.averageOrderValue,
      'Returning Visitors': analysisData.returningVisitors.averageOrderValue,
    },
    {
      metric: 'Bounce Rate (%)',
      'First-time Visitors': analysisData.firstTimeVisitors.bounceRate,
      'Returning Visitors': analysisData.returningVisitors.bounceRate,
    },
    {
      metric: 'Time on Site (min)',
      'First-time Visitors': analysisData.firstTimeVisitors.timeOnSite,
      'Returning Visitors': analysisData.returningVisitors.timeOnSite,
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-500" />
            <h3 className="font-medium text-gray-900">Segment Behavior Analysis</h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setView('chart')}
              className={`px-3 py-1 text-sm rounded-md ${
                view === 'chart' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Chart
            </button>
            <button
              onClick={() => setView('table')}
              className={`px-3 py-1 text-sm rounded-md ${
                view === 'table' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Table
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Key Finding Summary */}
        <div className="mb-6 bg-red-50 rounded-lg p-4 flex items-start space-x-3">
          <TrendingDown className="w-5 h-5 text-red-500 mt-0.5" />
          <div>
            <h4 className="font-medium text-gray-900">Key Finding</h4>
            <p className="text-sm text-gray-600">
              First-time visitors show significantly lower engagement compared to returning visitors,
              with a {Math.abs(analysisData.firstTimeVisitors.conversionRate - analysisData.returningVisitors.conversionRate).toFixed(1)}% 
              difference in conversion rates.
            </p>
          </div>
        </div>

        {/* Visualization */}
        <div className="h-80">
          {view === 'chart' ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barGap={0}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="metric" 
                  tick={{ fontSize: 12 }}
                  interval={0}
                  height={60}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="First-time Visitors" fill="#93c5fd" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Returning Visitors" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Metric</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">First-time Visitors</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">Returning Visitors</th>
                  </tr>
                </thead>
                <tbody>
                  {chartData.map((row, index) => (
                    <tr key={index} className="border-b last:border-0">
                      <td className="px-4 py-3 text-sm text-gray-900">{row.metric}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 text-right">
                        {row['First-time Visitors']}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 text-right">
                        {row['Returning Visitors']}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Time Period Note */}
        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
          <span>Data from last 30 days</span>
          <button className="flex items-center text-blue-600 hover:text-blue-700">
            View detailed analysis
            <ExternalLink className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SegmentBehaviorComparison;