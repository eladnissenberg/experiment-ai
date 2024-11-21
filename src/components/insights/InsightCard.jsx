import React from "react";

const InsightCard = ({ insight }) => {
  const { title, description, impact, category, icon: Icon, trend, action } = insight;

  return (
    <div className="flex items-start space-x-4 p-4 bg-white rounded-lg border hover:shadow-md transition-shadow duration-200">
      <div className={`p-2 rounded-lg ${
        trend === "positive"
          ? "bg-green-100 text-green-600"
          : "bg-red-100 text-red-600"
      }`}>
        {Icon && <Icon className="w-5 h-5" />}
      </div>
      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-medium text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          </div>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
            impact === "High"
              ? "bg-red-100 text-red-800"
              : "bg-yellow-100 text-yellow-800"
          }`}>
            {impact} Impact
          </span>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-gray-500">{category}</span>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            {action}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InsightCard;
