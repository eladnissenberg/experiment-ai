import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  TrendingUp,
  Users,
  Clock,
  FileText,
  ArrowUpRight,
  ArrowRight,
  Search,
  Share2,
  Smartphone,
  Monitor,
  Tablet,
  Globe
} from 'lucide-react';

// Mock data for analytics - in a real app, this would come from an API
const MOCK_DATA = {
  trafficOverview: Array(30).fill().map((_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    users: Math.floor(Math.random() * 1000 + 500),
    sessions: Math.floor(Math.random() * 1500 + 800),
    pageviews: Math.floor(Math.random() * 3000 + 1500)
  })),
  behaviors: {
    avgSessionDuration: '4:32',
    pagesPerSession: 3.8,
    bounceRate: '32.5%',
    returnRate: '28.4%'
  },
  insights: [
    {
      title: 'Traffic Spike Detected',
      description: 'Unusual increase in traffic from social media sources',
      impact: 'high',
      action: 'Investigate social media campaigns'
    },
    {
      title: 'Mobile Conversion Drop',
      description: '15% decrease in mobile conversion rate',
      impact: 'medium',
      action: 'Review mobile checkout flow'
    },
    {
      title: 'New Traffic Source',
      description: 'Growing traffic from referral website example.com',
      impact: 'low',
      action: 'Analyze referral traffic'
    }
  ]
};

const COLORS = {
  primary: '#3b82f6',
  success: '#22c55e',
  warning: '#eab308',
  danger: '#ef4444'
};

const KEY_METRICS = [
  {
    label: "Avg. Session",
    value: "4:32",
    icon: Clock
  },
  {
    label: "Pages/Session",
    value: "3.8",
    icon: FileText
  },
  {
    label: "Bounce Rate",
    value: "32.5%",
    icon: ArrowUpRight
  },
  {
    label: "Return Rate",
    value: "28.4%",
    icon: Users
  }
];

const AnalyticsPanel = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Simulated data loading
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsLoading(false);
          setData(MOCK_DATA);
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    return () => clearInterval(interval);
  }, []);

  const renderLoadingState = () => (
    <div className="h-full flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-sm">
        <div className="mb-4">
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-gray-900">
            Loading Analytics Data... {loadingProgress}%
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Analyzing historical performance
          </p>
        </div>
      </div>
    </div>
  );

  const renderMetricsGrid = () => (
    <div className="grid grid-cols-4 gap-3">
      {KEY_METRICS.map((metric, index) => (
        <div 
          key={index} 
          className="bg-white rounded-lg p-3 flex items-center space-x-3 border border-gray-100"
        >
          <metric.icon className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <div>
            <div className="text-lg font-semibold text-gray-900">{metric.value}</div>
            <div className="text-xs text-gray-500 whitespace-nowrap">{metric.label}</div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderTrafficChart = () => (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h4 className="text-lg font-medium text-gray-900 mb-4">Traffic Overview</h4>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data.trafficOverview}>
            <defs>
              <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.1}/>
                <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="date" 
              tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              stroke="#9CA3AF"
              fontSize={12}
            />
            <YAxis stroke="#9CA3AF" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                padding: '8px'
              }}
            />
            <Area
              type="monotone"
              dataKey="users"
              stroke={COLORS.primary}
              fillOpacity={1}
              fill="url(#colorUsers)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderTopPages = () => (
    <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-100 p-4">
      <h4 className="font-medium text-gray-900 mb-4">Top Pages for Optimization</h4>
      <div className="space-y-4">
        {[
          {
            path: '/products',
            traffic: '45,230 monthly visits',
            potential: 'high',
            description: 'Main product listing page with high bounce rate'
          },
          {
            path: '/checkout',
            traffic: '12,845 monthly visits',
            potential: 'high',
            description: 'Critical conversion point with drop-offs'
          },
          {
            path: '/pricing',
            traffic: '8,924 monthly visits',
            potential: 'medium',
            description: 'Key decision page for conversions'
          }
        ].map((page, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
              page.potential === 'high' ? 'bg-blue-100' : 'bg-blue-50'
            }`}>
              <Globe className={`w-4 h-4 ${
                page.potential === 'high' ? 'text-blue-600' : 'text-blue-500'
              }`} />
            </div>
            <div>
              <h5 className="font-medium text-gray-900">{page.path}</h5>
              <p className="text-sm text-gray-600 mt-1">{page.traffic}</p>
              <p className="text-sm text-gray-500 mt-1">{page.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => (
    <div className="space-y-6">
      {renderTrafficChart()}
      {renderMetricsGrid()}
      {renderTopPages()}
    </div>
  );

  return (
    <div className="sticky top-4 h-[calc(100vh-120px)] bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
      {isLoading ? renderLoadingState() : (
        <div className="h-full flex flex-col">
          <div className="border-b border-gray-200">
            <div className="px-6 py-4">
              <h3 className="text-lg font-medium text-gray-900">Analytics Overview</h3>
              <p className="text-sm text-gray-500 mt-1">Last 30 days performance</p>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            {renderContent()}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsPanel;