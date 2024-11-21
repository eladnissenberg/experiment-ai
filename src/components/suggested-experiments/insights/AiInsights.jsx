import React from 'react';
import { Zap, TrendingUp, Users, BarChart } from 'lucide-react';

const AiInsights = () => {
  const insights = [
    {
      icon: TrendingUp,
      title: "High Bounce Rate on Mobile",
      description: "Mobile users show 25% higher bounce rate than desktop. Consider optimizing mobile navigation.",
      impact: "High"
    },
    {
      icon: Users,
      title: "User Segment Opportunity",
      description: "First-time visitors convert 15% less than returning users. Test personalized welcome messages.",
      impact: "Medium"
    },
    {
      icon: BarChart,
      title: "Conversion Drop",
      description: "Checkout conversion dropped 8% in the last week. Investigate potential friction points.",
      impact: "High"
    }
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Insights</h3>
      <div className="space-y-4">
        {insights.map((insight, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className={`p-2 rounded-lg ${
              insight.impact === 'High' 
                ? 'bg-red-50 text-red-600'
                : 'bg-yellow-50 text-yellow-600'
            }`}>
              <insight.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{insight.title}</p>
              <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AiInsights;