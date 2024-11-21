import React from 'react';
import {
  TrendingUp,
  Users,
  Clock,
  X,
  ChevronRight,
  Calendar,
  Globe,
  Search,
  ShoppingCart,
  Smartphone,
  Monitor,
  MousePointer
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';

// Shared Components
const MetricCard = ({ title, value, secondaryValue, icon: IconComponent, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg border border-gray-100 p-4 ${className}`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-gray-500">{title}</span>
        <div className="p-1.5 bg-gray-50 rounded-lg">
          <IconComponent className="w-4 h-4 text-gray-400" />
        </div>
      </div>
      <div className="mt-2">
        <div className="text-xl font-semibold text-gray-900">{value}</div>
        {secondaryValue && (
          <div className="text-sm text-gray-500 mt-0.5">{secondaryValue}</div>
        )}
      </div>
    </div>
  );
};

const ChartCard = ({ title, description, children }) => (
  <div className="bg-white rounded-lg border border-gray-100">
    <div className="px-4 py-3 border-b border-gray-100">
      <h3 className="text-sm font-medium text-gray-900">{title}</h3>
      {description && (
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      )}
    </div>
    <div className="p-4">
      {children}
    </div>
  </div>
);

// First-Time Visitors Analysis
const FirstTimeVisitorAnalysis = () => {
  // Time series data showing consistent pattern
  const timeSeriesData = [
    { month: 'Jan', firstTime: 2.1, returning: 4.2 },
    { month: 'Feb', firstTime: 2.3, returning: 4.5 },
    { month: 'Mar', firstTime: 2.0, returning: 4.1 },
    { month: 'Apr', firstTime: 2.2, returning: 4.3 },
    { month: 'May', firstTime: 2.1, returning: 4.4 },
    { month: 'Jun', firstTime: 2.0, returning: 4.2 },
  ];

  // Traffic source data
  const sourceData = [
    { source: 'Organic', firstTime: 2.1, returning: 4.2 },
    { source: 'Direct', firstTime: 2.0, returning: 4.1 },
    { source: 'Social', firstTime: 2.2, returning: 4.3 },
    { source: 'Email', firstTime: 2.1, returning: 4.2 },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 rounded-lg shadow-sm text-xs">
          <p className="font-medium text-gray-900 mb-1">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-600">{entry.name}:</span>
              <span className="font-medium text-gray-900">{entry.value}%</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <MetricCard
          title="Hesitant Regions Conversion"
          value="2.1%"
          secondaryValue="Avg. over last 6 months"
          icon={Users}
        />
        <MetricCard
          title="Non-Hesitant Regions Conversion"
          value="4.2%"
          secondaryValue="Avg. over last 6 months"
          icon={Users}
        />
      </div>

      {/* Conversion Rate Over Time */}
      <ChartCard
        title="Conversion Rate by Visitor Type"
        description="6-month trend showing consistent performance gap"
      >
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timeSeriesData} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                name="Hesitant Regions"
                type="monotone"
                dataKey="firstTime"
                stroke="#94a3b8"
                strokeWidth={2}
                dot={{ fill: '#94a3b8', strokeWidth: 2 }}
              />
              <Line
                name="Non-Hesitant Regions"
                type="monotone"
                dataKey="returning"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Conversion by Traffic Source */}
      <ChartCard
        title="Conversion by Traffic Source"
        description="Gap consistent across all traffic sources"
      >
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sourceData} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="source" 
                tick={{ fontSize: 12, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                name="Hesitant Regions"
                dataKey="firstTime"
                fill="#94a3b8"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                name="Non-Hesitant Regions"
                dataKey="returning"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </div>
  );
};

// High Cart Value Analysis
const HighCartValueAnalysis = () => {
  const abandonmentData = [
    { range: '$0-50', rate: 22 },
    { range: '$51-100', rate: 25 },
    { range: '$101-200', rate: 28 },
    { range: '$201+', rate: 32 }
  ];

  const checkoutStepsData = [
    { step: 'Cart Review', low: 85, high: 82 },
    { step: 'Shipping', low: 75, high: 70 },
    { step: 'Payment', low: 65, high: 55 },
    { step: 'Final Review', low: 58, high: 45 }
  ];

  return (
    <div className="space-y-4">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <MetricCard
          title="High-Value Cart Abandonment"
          value="32%"
          secondaryValue="For carts over $200"
          icon={ShoppingCart}
        />
        <MetricCard
          title="Standard Cart Abandonment"
          value="24%"
          secondaryValue="For carts under $200"
          icon={ShoppingCart}
        />
      </div>

      {/* Abandonment by Cart Value */}
      <ChartCard
        title="Abandonment Rate by Cart Value"
        description="Clear correlation between cart value and abandonment"
      >
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={abandonmentData} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="range" 
                tick={{ fontSize: 12, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.5rem',
                  fontSize: '12px'
                }}
              />
              <Bar
                dataKey="rate"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Checkout Flow Progress */}
      <ChartCard
        title="Checkout Flow Progress"
        description="Drop-off points comparison by cart value"
      >
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={checkoutStepsData} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="step" 
                tick={{ fontSize: 12, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.5rem',
                  fontSize: '12px'
                }}
              />
              <Line
                name="Standard Carts"
                type="monotone"
                dataKey="low"
                stroke="#94a3b8"
                strokeWidth={2}
                dot={{ fill: '#94a3b8', strokeWidth: 2 }}
              />
              <Line
                name="High-Value Carts"
                type="monotone"
                dataKey="high"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </div>
  );
};

// Mobile Users Analysis
const MobileUsersAnalysis = () => {
  const engagementData = [
    { section: 'Hero', mobile: 85, desktop: 90 },
    { section: 'Features', mobile: 45, desktop: 85 },
    { section: 'Details', mobile: 25, desktop: 70 },
    { section: 'Specs', mobile: 15, desktop: 65 }
  ];

  const scrollDepthData = [
    { depth: '25%', mobile: 85, desktop: 90 },
    { depth: '50%', mobile: 45, desktop: 80 },
    { depth: '75%', mobile: 25, desktop: 65 },
    { depth: '100%', mobile: 10, desktop: 55 }
  ];

  return (
    <div className="space-y-4">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <MetricCard
          title="Mobile Content Engagement"
          value="45 sec"
          secondaryValue="vs 125 sec on desktop"
          icon={Smartphone}
        />
        <MetricCard
          title="Mobile Scroll Depth"
          value="35%"
          secondaryValue="vs 85% on desktop"
          icon={MousePointer}
        />
      </div>

      {/* Content Engagement */}
      <ChartCard
        title="Content Section Engagement"
        description="Percentage of users who interact with each section"
      >
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={engagementData} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="section" 
                tick={{ fontSize: 12, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.5rem',
                  fontSize: '12px'
                }}
              />
              <Bar
                name="Mobile"
                dataKey="mobile"
                fill="#94a3b8"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                name="Desktop"
                dataKey="desktop"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Scroll Depth */}
      <ChartCard
        title="Content Consumption"
        description="How far users scroll through the content"
      >
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={scrollDepthData} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="depth" 
                tick={{ fontSize: 12, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.5rem',
                  fontSize: '12px'
                }}
              />
              <Line
                name="Mobile"
                type="monotone"
                dataKey="mobile"
                stroke="#94a3b8"
                strokeWidth={2}
                dot={{ fill: '#94a3b8', strokeWidth: 2 }}
              />
              <Line
                name="Desktop"
                type="monotone"
                dataKey="desktop"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </div>
  );
};

// Main Analysis Modal Component
const AnalysisModal = ({ experiment, onClose }) => {
  const getAnalysisComponent = () => {
    if (experiment.title.includes('Social Proof')) {
      return {
        component: <FirstTimeVisitorAnalysis />,
        type: 'Visitor Behavior Analysis',
        description: 'Data showing conversion rate differences between first-time and returning visitors',
        insight: 'Users from Texas and Florida have a 25% lower conversion rate compared to the national average'
      };
    }
    if (experiment.title.includes('Urgency')) {
      return {
        component: <HighCartValueAnalysis />,
        type: 'Cart Value Analysis',
        description: 'Analysis of abandonment patterns based on cart value',
        insight: 'Users with high cart values (over $200) abandon carts more frequently than those with lower cart values'
      };
    }
    if (experiment.title.includes('Mobile')) {
      return {
        component: <MobileUsersAnalysis />,
        type: 'Mobile Engagement Analysis',
        description: 'Comparison of content engagement between mobile and desktop users',
        insight: 'Mobile users have significantly lower engagement with detailed product descriptions'
      };
    }
    return {
      component: <div>No analysis available.</div>,
      type: 'Analysis',
      description: 'No data available',
      insight: ''
    };
  };

  const analysis = getAnalysisComponent();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-gray-900/20 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative w-[800px] max-h-[650px] bg-gray-50 rounded-xl shadow-xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-white border-b border-gray-200 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>Supporting Data</span>
                <ChevronRight className="w-4 h-4" />
                <span className="text-gray-900">{analysis.type}</span>
              </div>
              <div className="space-y-1">
                <h2 className="text-base font-semibold text-gray-900">
                  {experiment.title}
                </h2>
                <p className="text-sm text-gray-600">
                  {analysis.insight}
                </p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {analysis.component}
        </div>
      </div>
    </div>
  );
};

export { AnalysisModal };