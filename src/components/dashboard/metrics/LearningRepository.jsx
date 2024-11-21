import React from "react";
import { Book, Tag, ThumbsUp, Search, ArrowRight } from "lucide-react";

const LearningRepository = () => {
  // Simulated data
  const learnings = [
    {
      id: 1,
      pattern: "Social Proof Elements",
      applications: 12,
      avgImpact: "+18%",
      confidence: 95,
      tags: ["conversion", "trust"]
    },
    {
      id: 2,
      pattern: "Progressive Disclosure",
      applications: 8,
      avgImpact: "+12%",
      confidence: 92,
      tags: ["ux", "forms"]
    },
    {
      id: 3,
      pattern: "Price Anchoring",
      applications: 6,
      avgImpact: "+15%",
      confidence: 89,
      tags: ["pricing", "conversion"]
    }
  ];

  return (
    <div className="bg-white rounded-xl border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Book className="w-5 h-5 text-purple-600" />
          <h2 className="text-lg font-semibold text-gray-900">
            Learning Repository
          </h2>
        </div>
      </div>

      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search learnings..."
          className="w-full pl-10 pr-4 py-2 border rounded-lg"
        />
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
      </div>

      <div className="space-y-4">
        {learnings.map((learning) => (
          <div 
            key={learning.id}
            className="p-4 rounded-lg border border-purple-100 bg-purple-50 hover:bg-purple-100 transition-colors cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium text-gray-900">
                  {learning.pattern}
                </h4>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                  <span className="flex items-center">
                    <ThumbsUp className="w-4 h-4 mr-1" />
                    {learning.applications} applications
                  </span>
                  <span>
                    Avg. Impact: {learning.avgImpact}
                  </span>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  {learning.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-white rounded-full text-xs font-medium text-purple-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                {learning.confidence}% confidence
              </span>
            </div>
          </div>
        ))}
      </div>

      <button className="mt-4 w-full px-4 py-2 text-sm text-purple-600 font-medium bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors flex items-center justify-center">
        View Full Repository
        <ArrowRight className="w-4 h-4 ml-2" />
      </button>
    </div>
  );
};

export default LearningRepository;