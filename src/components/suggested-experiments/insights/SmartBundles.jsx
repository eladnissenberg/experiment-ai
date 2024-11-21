import React from 'react';
import { Star, Package, ArrowRight } from 'lucide-react';

const SmartBundles = () => {
  const bundles = [
    {
      title: "Homepage Optimization Bundle",
      description: "3 complementary tests to maximize homepage conversion rate",
      tests: 3,
      impact: "High"
    },
    {
      title: "Mobile Experience Bundle",
      description: "Comprehensive mobile optimization test suite",
      tests: 4,
      impact: "Medium"
    }
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Smart Test Bundles</h3>
      <div className="space-y-4">
        {bundles.map((bundle, index) => (
          <div key={index} className="flex items-start space-x-3">
            <Star className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900">{bundle.title}</p>
              <p className="text-sm text-gray-600 mt-1">{bundle.description}</p>
              <button className="mt-2 text-blue-600 text-sm font-medium flex items-center">
                Launch Bundle
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SmartBundles;