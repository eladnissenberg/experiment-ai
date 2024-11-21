// File: C:\Users\eladn\Desktop\Bussiness\Initiatives\Benji\app3\src\components\onboarding\WebsiteAnalysisPanel.jsx

import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Target, 
  Users2, 
  TrendingUp,
  BadgeCheck,
  Zap,
  Building2,
  Share2,
  Layers,
  Code,
  Search,
  MessageCircle
} from 'lucide-react';

// Simulated website analysis data
const MOCK_ANALYSIS_STEPS = [
  { id: 1, label: 'Scanning website structure' },
  { id: 2, label: 'Analyzing content and messaging' },
  { id: 3, label: 'Identifying user flows' },
  { id: 4, label: 'Analyzing competitor landscape' },
  { id: 5, label: 'Identifying ICP and market position' }
];

const MOCK_WEBSITE_DATA = {
  overview: {
    mainOffering: "B2B SaaS Platform",
    targetMarket: "Enterprise Technology Companies",
    industry: "Software & Technology",
    businessModel: "Subscription-based SaaS",
    estimatedTraffic: "25K-50K monthly visits",
    marketPosition: "Premium Enterprise Solution"
  },
  contentAnalysis: {
    mainTopics: ["AI & Machine Learning", "Data Analytics", "Enterprise Software"],
    tone: "Professional & Technical",
    contentTypes: ["Blog Posts", "Case Studies", "Technical Documentation"],
    languages: ["English", "Spanish", "French"],
    readabilityScore: 72
  },
  competitors: [
    {
      name: "CompetitorA",
      overlapScore: 85,
      strengths: ["UI/UX", "Mobile Experience"],
      traffic: "100K-150K"
    },
    {
      name: "CompetitorB",
      overlapScore: 72,
      strengths: ["Feature Set", "Pricing"],
      traffic: "75K-100K"
    },
    {
      name: "CompetitorC",
      overlapScore: 65,
      strengths: ["Market Reach", "Customer Support"],
      traffic: "50K-75K"
    }
  ],
  idealCustomerProfile: {
    demographics: {
      companySize: "100-1000 employees",
      industry: "Technology & Software",
      revenue: "$10M-$100M annually",
      location: "North America & Europe"
    },
    psychographics: {
      painPoints: [
        "Inefficient data processing",
        "Limited automation capabilities",
        "Scaling challenges"
      ],
      goals: [
        "Improve operational efficiency",
        "Reduce manual workload",
        "Scale operations seamlessly"
      ],
      decisionDrivers: [
        "ROI potential",
        "Implementation ease",
        "Technical support quality"
      ]
    },
    buyingBehavior: {
      researchChannels: ["Industry forums", "Peer recommendations", "Technical review sites"],
      purchaseCycle: "3-6 months",
      decisionMakers: ["CTO", "VP of Engineering", "Head of Operations"]
    }
  },
  marketAnalysis: {
    marketSize: "$5.2B TAM",
    growthRate: "18% YoY",
    keyTrends: [
      "Increasing automation adoption",
      "Focus on data security",
      "Integration capabilities"
    ],
    competitiveLandscape: {
      positioning: "Premium Enterprise Solution",
      marketShare: "12% in target segment",
      differentiators: [
        "Advanced AI capabilities",
        "Enterprise-grade security",
        "24/7 technical support"
      ]
    }
  }
};

const WebsiteAnalysisPanel = ({ website }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [analysisData, setAnalysisData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Simulate analysis process
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= MOCK_ANALYSIS_STEPS.length - 1) {
          clearInterval(stepInterval);
          setTimeout(() => {
            setIsAnalyzing(false);
            setAnalysisData(MOCK_WEBSITE_DATA);
          }, 1000);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(stepInterval);
  }, []);

  const renderAnalyzingState = () => (
    <div className="h-full flex flex-col items-center justify-center p-8">
      <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-6"></div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Analyzing Website</h3>
      <div className="w-full max-w-sm space-y-3">
        {MOCK_ANALYSIS_STEPS.map((step, index) => (
          <div
            key={step.id}
            className={`flex items-center space-x-3 ${
              index <= currentStep ? 'text-gray-900' : 'text-gray-400'
            }`}
          >
            {index < currentStep ? (
              <BadgeCheck className="w-5 h-5 text-green-500" />
            ) : index === currentStep ? (
              <div className="w-5 h-5 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
            ) : (
              <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
            )}
            <span className="text-sm">{step.label}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderOverviewTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-2 text-gray-600 mb-2">
            <Building2 className="w-4 h-4" />
            <span className="text-sm font-medium">Main Offering</span>
          </div>
          <p className="text-gray-900">{analysisData.overview.mainOffering}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-2 text-gray-600 mb-2">
            <Target className="w-4 h-4" />
            <span className="text-sm font-medium">Target Market</span>
          </div>
          <p className="text-gray-900">{analysisData.overview.targetMarket}</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h4 className="font-medium text-gray-900 mb-3">Market Position</h4>
        <div className="flex items-center space-x-3">
          <div className="flex-1">
            <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
              <div className="h-full w-3/4 bg-blue-600 rounded-full"></div>
            </div>
          </div>
          <span className="text-sm font-medium text-gray-600">Premium Segment</span>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-lg border border-blue-100">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Traffic Estimate</h4>
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <span className="font-medium text-gray-900">{analysisData.overview.estimatedTraffic}</span>
        </div>
      </div>
    </div>
  );

  const renderICPTab = () => (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h4 className="font-medium text-gray-900 mb-3">Demographics</h4>
        <dl className="grid grid-cols-2 gap-4">
          {Object.entries(analysisData.idealCustomerProfile.demographics).map(([key, value]) => (
            <div key={key}>
              <dt className="text-sm text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</dt>
              <dd className="mt-1 text-sm font-medium text-gray-900">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
  
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h4 className="font-medium text-gray-900 mb-3">Pain Points & Goals</h4>
        <div className="space-y-4">
          <div>
            <h5 className="text-sm font-medium text-gray-700 mb-2">Key Pain Points</h5>
            <div className="flex flex-wrap gap-2">
              {analysisData.idealCustomerProfile.psychographics.painPoints.map((point, idx) => (
                <span key={idx} className="px-2 py-1 bg-red-50 text-red-700 rounded-full text-xs">
                  {point}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h5 className="text-sm font-medium text-gray-700 mb-2">Goals</h5>
            <div className="flex flex-wrap gap-2">
              {analysisData.idealCustomerProfile.psychographics.goals.map((goal, idx) => (
                <span key={idx} className="px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs">
                  {goal}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
  
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h4 className="font-medium text-gray-900 mb-3">Buying Behavior</h4>
        <dl className="space-y-3">
          <div>
            <dt className="text-sm text-gray-500">Purchase Cycle</dt>
            <dd className="mt-1 text-sm font-medium text-gray-900">
              {analysisData.idealCustomerProfile.buyingBehavior.purchaseCycle}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Key Decision Makers</dt>
            <dd className="mt-1 flex flex-wrap gap-2">
              {analysisData.idealCustomerProfile.buyingBehavior.decisionMakers.map((dm, idx) => (
                <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
                  {dm}
                </span>
              ))}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
  
  const renderMarketAnalysisTab = () => (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h4 className="font-medium text-gray-900 mb-3">Market Overview</h4>
        <dl className="grid grid-cols-2 gap-4">
          <div>
            <dt className="text-sm text-gray-500">Market Size</dt>
            <dd className="mt-1 text-sm font-medium text-gray-900">{analysisData.marketAnalysis.marketSize}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Growth Rate</dt>
            <dd className="mt-1 text-sm font-medium text-gray-900">{analysisData.marketAnalysis.growthRate}</dd>
          </div>
        </dl>
      </div>
  
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h4 className="font-medium text-gray-900 mb-3">Market Trends</h4>
        <div className="space-y-2">
          {analysisData.marketAnalysis.keyTrends.map((trend, idx) => (
            <div key={idx} className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-gray-700">{trend}</span>
            </div>
          ))}
        </div>
      </div>
  
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h4 className="font-medium text-gray-900 mb-3">Competitive Position</h4>
        <dl className="space-y-3">
          <div>
            <dt className="text-sm text-gray-500">Market Share</dt>
            <dd className="mt-1 text-sm font-medium text-gray-900">
              {analysisData.marketAnalysis.competitiveLandscape.marketShare}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Key Differentiators</dt>
            <dd className="mt-1 flex flex-wrap gap-2">
              {analysisData.marketAnalysis.competitiveLandscape.differentiators.map((diff, idx) => (
                <span key={idx} className="px-2 py-1 bg-purple-50 text-purple-700 rounded-full text-xs">
                  {diff}
                </span>
              ))}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
  
  const renderCompetitorsTab = () => (
    <div className="space-y-4">
      {analysisData.competitors.map((competitor, index) => (
        <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-900">{competitor.name}</h4>
            <span className={`px-2 py-1 rounded-full text-sm font-medium ${
              competitor.overlapScore >= 80 ? 'bg-red-100 text-red-800' :
              competitor.overlapScore >= 70 ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              {competitor.overlapScore}% Match
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <Share2 className="w-4 h-4 mr-2" />
              Traffic: {competitor.traffic}
            </div>
            <div className="flex flex-wrap gap-2">
              {competitor.strengths.map((strength, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                >
                  {strength}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  
  
  const renderAnalysisResults = () => (
    <div className="h-full flex flex-col">
      <div className="border-b border-gray-200">
        <div className="px-6 py-4">
          <h3 className="text-lg font-medium text-gray-900">Website Analysis</h3>
          <p className="text-sm text-gray-500">{website}</p>
        </div>
        <div className="px-6 flex space-x-4">
          {[
            { id: 'overview', label: 'Overview', icon: Globe },
            { id: 'competitors', label: 'Competitors', icon: Users2 },
            { id: 'icp', label: 'ICP Analysis', icon: Target },
            { id: 'market', label: 'Market Analysis', icon: TrendingUp }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
  
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'competitors' && renderCompetitorsTab()}
        {activeTab === 'icp' && renderICPTab()}
        {activeTab === 'market' && renderMarketAnalysisTab()}
      </div>
    </div>
  );

  return (
    <div className="sticky top-4 h-[calc(100vh-120px)] bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
      {isAnalyzing ? renderAnalyzingState() : renderAnalysisResults()}
    </div>
  );
};

export default WebsiteAnalysisPanel;