import React from "react";
import {
  Zap,
  AlertCircle,
  TrendingUp,
  ArrowRight,
  Target,
  Brain
} from "lucide-react";

const InsightCard = ({ insight }) => {
  const getInsightStyles = (type) => {
    switch (type) {
      case "opportunity":
        return {
          icon: Target,
          bg: "bg-green-50",
          iconColor: "text-green-600",
          border: "border-green-100"
        };
      case "alert":
        return {
          icon: AlertCircle,
          bg: "bg-red-50",
          iconColor: "text-red-600",
          border: "border-red-100"
        };
      case "learning":
        return {
          icon: Brain,
          bg: "bg-purple-50",
          iconColor: "text-purple-600",
          border: "border-purple-100"
        };
      default:
        return {
          icon: Zap,
          bg: "bg-blue-50",
          iconColor: "text-blue-600",
          border: "border-blue-100"
        };
    }
  };

  const styles = getInsightStyles(insight.type);
  const Icon = styles.icon;

  return (
    <div className={`p-4 rounded-lg border ${styles.border} ${styles.bg}`}>
      <div className="flex items-start space-x-3">
        <div className={`p-2 rounded-lg ${styles.bg}`}>
          <Icon className={`w-5 h-5 ${styles.iconColor}`} />
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-medium text-gray-900">{insight.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              insight.impact === 'high' 
                ? 'bg-red-100 text-red-700'
                : 'bg-yellow-100 text-yellow-700'
            }`}>
              {insight.confidence}% confidence
            </span>
          </div>
          <button className="mt-3 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700">
            {insight.suggestedAction}
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

const ActionableInsights = ({ insights }) => {
  return (
    <div className="bg-white rounded-xl border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Brain className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">AI Insights</h2>
        </div>
        <select className="px-3 py-1 text-sm border rounded-lg">
          <option value="all">All Types</option>
          <option value="opportunity">Opportunities</option>
          <option value="alert">Alerts</option>
          <option value="learning">Learnings</option>
        </select>
      </div>

      <div className="space-y-4">
        {insights.map((insight) => (
          <InsightCard key={insight.id} insight={insight} />
        ))}
      </div>

      <div className="mt-6 border-t pt-4">
        <button className="inline-flex items-center justify-center w-full px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100">
          View All Insights
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );
};

export default ActionableInsights;