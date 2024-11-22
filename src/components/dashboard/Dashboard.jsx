import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiService } from '../../utils/api';
import {
  Users,
  TrendingUp,
  MousePointerClick,
  Timer,
  Brain,
  Sparkles,
  ArrowRight,
  RefreshCcw,
  BookOpen,
  Globe,
  Activity,
  Target,
  Eye,
  ExternalLink,
  MessageSquare,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

// Utility Components
const MetricCard = ({ title, value, change, trend }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 px-4 py-3">
      <div className="flex flex-col">
        <span className="text-sm text-gray-500">{title}</span>
        <div className="flex items-baseline mt-1 space-x-2">
          <span className="text-xl font-medium text-gray-900">{value}</span>
          <span className={`text-sm font-medium ${
            change >= 0 ? 'text-green-500' : 'text-red-500'
          }`}>
            {change >= 0 ? '+' : ''}{change}%
          </span>
        </div>
      </div>
    </div>
  );
};

const TimeframeSelector = ({ value, onChange, onRefresh }) => {
  return (
    <div className="flex items-center space-x-2">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-white border border-gray-200 rounded-full px-4 py-1.5 pr-8 text-sm text-gray-600 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="7">Last 7 days</option>
        <option value="30">Last 30 days</option>
        <option value="90">Last 90 days</option>
      </select>
      <button
        onClick={onRefresh}
        className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
      >
        <RefreshCcw className="w-4 h-4" />
      </button>
    </div>
  );
};

const ExperimentTable = ({ experiments, title, type, onViewAll }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  const shouldPaginate = type === 'suggested';
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = shouldPaginate ? 
    experiments.slice(indexOfFirstItem, indexOfLastItem) : 
    experiments;
  const totalPages = shouldPaginate ? 
    Math.ceil(experiments.length / itemsPerPage) : 
    1;

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-1.5 bg-blue-50 rounded-lg">
              {type === 'active' ? (
                <MousePointerClick className="w-4 h-4 text-blue-600" />
              ) : (
                <Sparkles className="w-4 h-4 text-blue-600" />
              )}
            </div>
            <h2 className="text-base font-semibold text-gray-900">{title}</h2>
          </div>
          <button
            onClick={onViewAll}
            className="text-sm text-blue-600 font-medium hover:text-blue-700 flex items-center"
          >
            View All
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variants</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Traffic</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Confidence</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentItems.map((experiment) => (
              <tr key={experiment.id} className="hover:bg-gray-50/50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-900">
                    {experiment.title}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    experiment.status === 'running' ? 'bg-green-100 text-green-800' :
                    experiment.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                    experiment.status === 'proposed' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {experiment.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">
                    {(experiment.variants?.length || 0) + 2}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">
                    {type === 'active' ?
                      experiment.results?.visitors?.toLocaleString() :
                      experiment.traffic + '% split'
                    }
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${type === 'active' ?
                          experiment.results?.confidence :
                          experiment.successProbability}%`
                        }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 min-w-[3rem]">
                      {type === 'active' ?
                        `${experiment.results?.confidence?.toFixed(0)}%` :
                        `${experiment.successProbability}%`
                      }
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {shouldPaginate && totalPages > 1 && (
        <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, experiments.length)} of {experiments.length} experiments
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-1 rounded ${
                currentPage === 1 
                  ? 'text-gray-300 cursor-not-allowed' 
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`px-3 py-1 rounded text-sm ${
                  currentPage === index + 1
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                {index + 1}
              </button>
            ))}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-1 rounded ${
                currentPage === totalPages 
                  ? 'text-gray-300 cursor-not-allowed' 
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const InsightsCard = ({ insights, type }) => {
  const isDataInsight = type === 'data';

  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          {isDataInsight ? (
            <Activity className="w-4 h-4 text-blue-600" />
          ) : (
            <Globe className="w-4 h-4 text-green-600" />
          )}
          <h3 className="text-sm font-medium text-gray-900">
            {isDataInsight ? 'Data Insights' : 'Market Intelligence'}
          </h3>
        </div>
        <button className={`text-sm font-medium hover:text-opacity-70 flex items-center ${
          isDataInsight ? 'text-blue-600' : 'text-green-600'
        }`}>
          View All
          <ArrowRight className="w-4 h-4 ml-1" />
        </button>
      </div>

      <div className="space-y-3">
        {insights.map((insight) => (
          <div key={insight.id} className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">{insight.title}</h4>
                <p className="mt-1 text-sm text-gray-600">{insight.description}</p>
              </div>
              {insight.source && (
                <a
                  href={insight.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-xs text-gray-500 hover:text-gray-700"
                >
                  {insight.source}
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              )}
            </div>

            {isDataInsight && insight.metrics && (
              <div className="mt-3 grid grid-cols-3 gap-3">
                {insight.metrics.map((metric) => (
                  <div key={metric.name} className="flex flex-col">
                    <span className="text-xs text-gray-500">{metric.name}</span>
                    <div className="flex items-baseline space-x-1">
                      <span className="text-sm font-medium text-gray-900">
                        {metric.value}
                      </span>
                      <span className={`text-xs ${
                        metric.change >= 0 ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {metric.change >= 0 ? '+' : ''}{metric.change}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!isDataInsight && (
              <div className="mt-2 flex items-center space-x-2">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  insight.impact === 'high' ? 'bg-red-100 text-red-700' :
                  insight.impact === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {insight.impact} impact
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(insight.timestamp).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const InsightsContainer = ({ dataInsights, marketInsights }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="p-1.5 bg-blue-50 rounded-lg">
            <Brain className="w-4 h-4 text-blue-600" />
          </div>
          <h2 className="text-base font-semibold text-gray-900">Insights Dashboard</h2>
        </div>
      </div>
      <div className="grid grid-cols-2 divide-x divide-gray-100">
        <div className="p-6">
          <InsightsCard insights={dataInsights} type="data" />
        </div>
        <div className="p-6">
          <InsightsCard insights={marketInsights} type="market" />
        </div>
      </div>
    </div>
  );
};

const LearningRepository = ({ learnings }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-1.5 bg-purple-50 rounded-lg">
              <BookOpen className="w-4 h-4 text-purple-600" />
            </div>
            <h2 className="text-base font-semibold text-gray-900">Learning Repository</h2>
          </div>
          <button className="text-sm text-purple-600 font-medium hover:text-purple-700 flex items-center">
            View All
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4">
          {learnings.map((learning) => (
            <div key={learning.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Brain className="w-4 h-4 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900">{learning.pattern}</h3>
                <p className="mt-1 text-sm text-gray-600">{learning.description}</p>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>{learning.applications} applications</span>
                    <span>Avg. Impact: {learning.avgImpact}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {learning.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeframe, setTimeframe] = useState('30');
  const [metrics, setMetrics] = useState(null);
  const [activeExperiments, setActiveExperiments] = useState([]);
  const [suggestedExperiments, setSuggestedExperiments] = useState([]);
  const [learnings, setLearnings] = useState([]);
  const [marketInsights, setMarketInsights] = useState([]);
  const [dataInsights, setDataInsights] = useState([]);

  // Check API health function
  const checkApiHealth = async () => {
    try {
      await apiService.checkHealth();
      return true;
    } catch (error) {
      console.error('API Health Check Failed:', error);
      return false;
    }
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      // First check API health
      const isHealthy = await checkApiHealth();
      if (!isHealthy) {
        throw new Error('API is not available at the moment');
      }

      // Fetch experiments data
      try {
        const [activeExperimentsData, suggestedExperimentsData] = await Promise.all([
          apiService.getExperiments('running'),
          apiService.getExperiments('proposed')
        ]);

        setActiveExperiments(activeExperimentsData);
        setSuggestedExperiments(suggestedExperimentsData);

        // Mock data - to be replaced with real API calls later
        const mockMetrics = {
          experiments: {
            value: activeExperimentsData.length.toString(),
            change: 12.5
          },
          conversion: {
            value: '15.8%',
            change: 8.2
          },
          traffic: {
            value: '125.4k',
            change: -2.1
          },
          velocity: {
            value: '3.2/week',
            change: 15.0
          }
        };

        const mockLearnings = [
          {
            id: 1,
            pattern: "Social Proof Elements",
            description: "Adding social proof consistently shows positive impact across different user segments",
            applications: 12,
            avgImpact: "+18%",
            tags: ["conversion", "trust"]
          },
          {
            id: 2,
            pattern: "Progressive Disclosure",
            description: "Gradually revealing information improves form completion rates",
            applications: 8,
            avgImpact: "+12%",
            tags: ["ux", "forms"]
          }
        ];

        const mockMarketInsights = [
          {
            id: 1,
            type: "trend",
            title: "Rising Mobile Checkout Trend",
            description: "Industry seeing 25% increase in mobile checkout completion rates with simplified forms",
            impact: "high",
            source: "Industry Report",
            sourceUrl: "#",
            timestamp: new Date().toISOString()
          },
          {
            id: 2,
            type: "competitor",
            title: "Competitor Feature Launch",
            description: "Major competitor launched one-click checkout experience",
            impact: "medium",
            source: "Market Analysis",
            sourceUrl: "#",
            timestamp: new Date().toISOString()
          }
        ];

        const mockDataInsights = [
          {
            id: 1,
            title: "Mobile Conversion Gap",
            description: "Mobile conversion rate is 40% lower than desktop during peak hours",
            confidence: 95,
            dataPoints: 25000,
            metrics: [
              { name: "Mobile Conv.", value: "2.1%", change: -15 },
              { name: "Desktop Conv.", value: "3.5%", change: 5 },
              { name: "Gap Trend", value: "Growing", change: -8 }
            ]
          },
          {
            id: 2,
            title: "High-Value Customer Pattern",
            description: "Users who interact with size guide are 2x more likely to purchase",
            confidence: 88,
            dataPoints: 15000,
            metrics: [
              { name: "Guide Usage", value: "15%", change: 12 },
              { name: "Conv. Rate", value: "4.2%", change: 25 },
              { name: "AOV", value: "$128", change: 15 }
            ]
          }
        ];

        setMetrics(mockMetrics);
        setLearnings(mockLearnings);
        setMarketInsights(mockMarketInsights);
        setDataInsights(mockDataInsights);

      } catch (apiError) {
        console.error('API Error:', apiError);
        throw new Error('Failed to fetch experiments data. Please try again later.');
      }
    } catch (err) {
      setError(err.message);
      console.error('Dashboard Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Debug current environment
  useEffect(() => {
    console.log('Current Environment:', import.meta.env.MODE);
    console.log('API URL:', import.meta.env.VITE_API_URL);
    fetchDashboardData();
  }, [timeframe]);

  const handleTimeframeChange = (newTimeframe) => {
    setTimeframe(newTimeframe);
  };

  const handleRefresh = () => {
    fetchDashboardData();
  };

  const handleViewAll = (type) => {
    if (type === 'suggested') {
      navigate('/suggested-experiments');
    } else if (type === 'active') {
      navigate('/experiments');
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-64 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white rounded-xl border p-3 h-20"></div>
            ))}
          </div>
          <div className="bg-white rounded-xl border p-6 h-64"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Dashboard</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <div className="flex space-x-4">
            <button
              onClick={handleRefresh}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <RefreshCcw className="w-4 h-4 mr-2" />
              Retry
            </button>
            <button
              onClick={() => setError(null)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    );
  }

  const metricCards = [
    {
      id: 'experiments',
      title: 'Active Experiments',
      value: metrics.experiments.value,
      change: metrics.experiments.change
    },
    {
      id: 'conversion',
      title: 'Avg. Conversion Lift',
      value: metrics.conversion.value,
      change: metrics.conversion.change
    },
    {
      id: 'traffic',
      title: 'Total Traffic',
      value: metrics.traffic.value,
      change: metrics.traffic.change
    },
    {
      id: 'velocity',
      title: 'Testing Velocity',
      value: metrics.velocity.value,
      change: metrics.velocity.change
    }
  ];

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
          <div className="flex items-center space-x-2">
            <p className="text-sm text-gray-600">Track and analyze your experimentation program</p>
            {import.meta.env.DEV && (
              <span className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full">
                Development Mode
              </span>
            )}
          </div>
        </div>
        <TimeframeSelector
          value={timeframe}
          onChange={handleTimeframeChange}
          onRefresh={handleRefresh}
        />
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {metricCards.map((card) => (
          <MetricCard
            key={card.id}
            title={card.title}
            value={card.value}
            change={card.change}
          />
        ))}
      </div>

      {/* Main Content - Vertical Stack */}
      <div className="space-y-4">
        <ExperimentTable
          experiments={activeExperiments}
          title="Active Experiments"
          type="active"
          onViewAll={() => handleViewAll('active')}
        />

        <ExperimentTable
          experiments={suggestedExperiments}
          title="Suggested Experiments"
          type="suggested"
          onViewAll={() => handleViewAll('suggested')}
        />

        <InsightsContainer
          dataInsights={dataInsights}
          marketInsights={marketInsights}
        />

        <LearningRepository
          learnings={learnings}
        />
      </div>
    </div>
  );
};

export default Dashboard;