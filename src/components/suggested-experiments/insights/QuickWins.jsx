import React from 'react';
import { Zap } from 'lucide-react';

const QuickWins = () => {
  const quickWins = [
    {
      id: 1,
      title: "Add Trust Badges",
      description: "Place security badges near checkout button",
      impact: "medium",
      effort: "low",
      timeToValue: "2 days"
    },
    {
      id: 2,
      title: "Optimize Image Loading",
      description: "Implement lazy loading for better performance",
      impact: "high",
      effort: "low",
      timeToValue: "1 day"
    },
    {
      id: 3,
      title: "Mobile Menu Simplification",
      description: "Streamline navigation for mobile users",
      impact: "medium",
      effort: "low",
      timeToValue: "3 days"
    }
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Wins</h3>
      <div className="space-y-4">
        {quickWins.map(win => (
          <div
            key={win.id}
            className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <div className="p-2 bg-green-100 rounded-lg">
              <Zap className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">{win.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{win.description}</p>
              <div className="mt-2 flex items-center space-x-4 text-sm">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  win.impact === 'high'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {win.impact} impact
                </span>
                <span className="text-gray-500">
                  {win.timeToValue} to value
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickWins;