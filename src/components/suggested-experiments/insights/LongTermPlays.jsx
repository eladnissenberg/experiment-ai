import React from 'react';
import { Target, ArrowRight, Users, TrendingUp, BarChart3 } from 'lucide-react';

const LongTermPlays = () => {
  const longTermPlays = [
    {
      id: 1,
      title: "Website Personalization Engine",
      description: "Implement AI-driven content personalization based on user behavior patterns",
      impact: "high",
      timeframe: "3-6 months",
      estimatedLift: "+40-50%",
      complexity: "high",
      icon: Users
    },
    {
      id: 2,
      title: "Predictive Analytics Integration",
      description: "Deploy machine learning models to predict user conversion probability",
      impact: "high",
      timeframe: "4-5 months",
      estimatedLift: "+30-40%",
      complexity: "high",
      icon: TrendingUp
    },
    {
      id: 3,
      title: "Advanced A/B Testing Framework",
      description: "Build a comprehensive testing infrastructure for simultaneous experiments",
      impact: "medium",
      timeframe: "2-3 months",
      estimatedLift: "+25-35%",
      complexity: "medium",
      icon: BarChart3
    }
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Long-term Plays</h3>
      <div className="space-y-4">
        {longTermPlays.map(play => (
          <div
            key={play.id}
            className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <div className="p-2 bg-blue-100 rounded-lg">
              <play.icon className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{play.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{play.description}</p>
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    play.impact === 'high' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {play.estimatedLift} potential lift
                  </span>
                  <span className="text-sm text-gray-500">
                    {play.timeframe}
                  </span>
                </div>
                <button className="text-sm text-blue-600 font-medium hover:text-blue-700 flex items-center">
                  Learn more
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LongTermPlays;