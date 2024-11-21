import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle,
  ChevronRight,
  ChevronDown,
  Building2,
  Users,
  Briefcase,
  BarChart,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Globe,
  Target,
  Zap,
  LineChart,
  AlertCircle
} from 'lucide-react';
import WebsiteAnalysisPanel from './WebsiteAnalysisPanel';
import AnalyticsPanel from './AnalyticsPanel';
import ProgressBar from './ProgressBar';

const STEPS = {
  WELCOME: 0,
  COMPANY_BASICS: 1,
  ROLE_TEAM: 2,
  INTEGRATIONS: 3,
  SUMMARY: 4
};

const INDUSTRIES = [
  'SaaS',
  'E-commerce',
  'Healthcare',
  'Finance',
  'Education',
  'Media',
  'Other'
];

const OBJECTIVES = [
  'Increase Sales',
  'Improve Engagement',
  'Reduce Churn',
  'Brand Awareness'
];

const ROLES = [
  'CEO/Founder',
  'CMO',
  'Product Manager',
  'Growth Manager',
  'Developer',
  'Marketing Manager'
];

const METRICS = [
  { 
    id: 'conversion', 
    label: 'Conversion Rate', 
    default: true, 
    description: 'Track and improve user to customer conversion rate' 
  },
  { 
    id: 'bounce', 
    label: 'Bounce Rate', 
    default: true, 
    description: 'Monitor and reduce visitor bounce rates' 
  },
  { 
    id: 'engagement', 
    label: 'User Engagement', 
    default: false, 
    description: 'Measure how users interact with your content' 
  },
  { 
    id: 'revenue', 
    label: 'Revenue per User', 
    default: false, 
    description: 'Measure and optimize revenue per user' 
  }
];

const DATA_SOURCES = [
  { 
    id: 'ga', 
    name: 'Google Analytics', 
    icon: '📊',
    description: 'Connect your GA4 property for detailed visitor insights',
    benefits: ['Visitor behavior tracking', 'Conversion analytics', 'User flow analysis']
  },
  { 
    id: 'hubspot', 
    name: 'HubSpot', 
    icon: '🎯',
    description: 'Import your CRM and marketing automation data',
    benefits: ['Lead tracking', 'Marketing automation', 'Sales pipeline']
  },
  { 
    id: 'shopify', 
    name: 'Shopify', 
    icon: '🛍️',
    description: 'Connect your e-commerce store analytics',
    benefits: ['Product performance', 'Cart analytics', 'Revenue tracking']
  },
  { 
    id: 'segment', 
    name: 'Segment', 
    icon: '📈',
    description: 'Import your customer data platform metrics',
    benefits: ['Customer journey', 'Cross-platform tracking', 'Data unification']
  }
];

const DEFAULT_FORM_DATA = {
  company: {
    name: '',
    website: '',
    industry: '',
    objective: ''
  },
  role: {
    title: '',
    teamSize: ''
  },
  priorities: [],
  integrations: {
    primary: METRICS.filter(m => m.default).map(m => m.id),
    dataSources: []
  }
};

const OnboardingFlow = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(STEPS.WELCOME);
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [showWebsiteAnalysis, setShowWebsiteAnalysis] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [errors, setErrors] = useState({});
  const [showMoreIntegrations, setShowMoreIntegrations] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateFormData = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));

    if (errors[`${section}.${field}`]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`${section}.${field}`];
        return newErrors;
      });
    }

    if (section === 'company' && field === 'website' && value.trim() !== '') {
      setShowWebsiteAnalysis(true);
    }
  };

  const validateStep = (step) => {
    // Remove validation entirely or make it just warn the user without blocking progress
    switch (step) {
      case STEPS.COMPANY_BASICS:
        if (!formData.company.name) {
          console.warn('Company name not provided');
        }
        if (!formData.company.website) {
          console.warn('Website URL not provided');
        }
        if (!formData.company.industry) {
          console.warn('Industry not provided');
        }
        if (!formData.company.objective) {
          console.warn('Business objective not provided');
        }
        break;
  
      case STEPS.ROLE_TEAM:
        if (!formData.role.title) {
          console.warn('Role not provided');
        }
        if (formData.priorities.length === 0) {
          console.warn('No priorities selected');
        }
        break;
  
      case STEPS.INTEGRATIONS:
        if (formData.integrations.dataSources.length === 0) {
          console.warn('No integrations selected');
        }
        break;
  
      default:
        break;
    }
  
    // Always return true to allow progress
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < STEPS.SUMMARY) {
        setCurrentStep(prev => prev + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > STEPS.WELCOME) {
      setCurrentStep(prev => prev - 1);
      setErrors({});
    }
  };

  const handleGAConnect = () => {
    setShowAnalytics(true);
    setFormData(prev => ({
      ...prev,
      integrations: {
        ...prev.integrations,
        dataSources: [...prev.integrations.dataSources, 'ga']
      }
    }));
  };

  const handleIntegrationClick = (sourceId) => {
    if (sourceId === 'ga') {
      handleGAConnect();
    }
    
    setFormData(prev => ({
      ...prev,
      integrations: {
        ...prev.integrations,
        dataSources: prev.integrations.dataSources.includes(sourceId)
          ? prev.integrations.dataSources.filter(id => id !== sourceId)
          : [...prev.integrations.dataSources, sourceId]
      }
    }));

    if (errors.integrations) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.integrations;
        return newErrors;
      });
    }
  };

  const renderWelcome = () => (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-240px)] py-12">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900">
          Welcome to ExperimentAI
        </h1>
        <p className="mt-4 text-xl text-gray-600">
          Let's supercharge your website optimization with AI-powered experimentation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 w-full max-w-5xl">
        <div className="p-6 bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-100">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <Sparkles className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900">AI-Powered Insights</h3>
          <p className="mt-2 text-sm text-gray-600">
            Get real-time recommendations powered by advanced AI algorithms
          </p>
        </div>

        <div className="p-6 bg-gradient-to-br from-green-50 to-white rounded-xl border border-green-100">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <BarChart className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-900">Real-time Analytics</h3>
          <p className="mt-2 text-sm text-gray-600">
            Track and analyze your experiments with comprehensive analytics
          </p>
        </div>

        <div className="p-6 bg-gradient-to-br from-purple-50 to-white rounded-xl border border-purple-100">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <Zap className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-900">Seamless Deployment</h3>
          <p className="mt-2 text-sm text-gray-600">
            Easily run A/B tests and push optimized designs to production
          </p>
        </div>
      </div>
    </div>
  );

  const renderCompanyBasics = () => (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Company & Website Details</h2>
        <p className="mt-2 text-gray-600">
          Let's analyze your website and provide tailored optimization recommendations.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Company Name</label>
          <input
            type="text"
            value={formData.company.name}
            onChange={(e) => updateFormData('company', 'name', e.target.value)}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
              errors['company.name'] ? 'border-red-300' : ''
            }`}
            placeholder="Enter your company name"
          />
          {errors['company.name'] && (
            <p className="mt-1 text-sm text-red-600">{errors['company.name']}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Website URL</label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
              https://
            </span>
            <input
              type="text"
              value={formData.company.website}
              onChange={(e) => updateFormData('company', 'website', e.target.value)}
              className={`block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                errors['company.website'] ? 'border-red-300' : ''
              }`}
              placeholder="example.com"
            />
          </div>
          {errors['company.website'] && (
            <p className="mt-1 text-sm text-red-600">{errors['company.website']}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Industry</label>
          <select
            value={formData.company.industry}
            onChange={(e) => updateFormData('company', 'industry', e.target.value)}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
              errors['company.industry'] ? 'border-red-300' : ''
            }`}
          >
            <option value="">Select Industry</option>
            {INDUSTRIES.map(industry => (
              <option key={industry} value={industry}>{industry}</option>
            ))}
          </select>
          {errors['company.industry'] && (
            <p className="mt-1 text-sm text-red-600">{errors['company.industry']}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Primary Business Objective</label>
          <select
            value={formData.company.objective}
            onChange={(e) => updateFormData('company', 'objective', e.target.value)}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
              errors['company.objective'] ? 'border-red-300' : ''
            }`}
          >
            <option value="">Select Objective</option>
            {OBJECTIVES.map(objective => (
              <option key={objective} value={objective}>{objective}</option>
            ))}
          </select>
          {errors['company.objective'] && (
            <p className="mt-1 text-sm text-red-600">{errors['company.objective']}</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderRoleTeam = () => (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Your Role & Priorities</h2>
        <p className="mt-2 text-gray-600">
          Help us customize your experience and set your key optimization goals.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Your Role</h3>
        <select
          value={formData.role.title}
          onChange={(e) => updateFormData('role', 'title', e.target.value)}
          className={`w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
            errors['role.title'] ? 'border-red-300' : ''
          }`}
        >
          <option value="">Select Your Role</option>
          {ROLES.map(role => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>
        {errors['role.title'] && (
          <p className="mt-1 text-sm text-red-600">{errors['role.title']}</p>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Key Priorities</h3>
        <div className="space-y-4">
          {METRICS.map(metric => (
            <label 
              key={metric.id} 
              className={`flex items-start space-x-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer ${
                errors['priorities'] ? 'border-red-300' : 'border-gray-200'
              }`}
            >
              <input
                type="checkbox"
                checked={formData.priorities.includes(metric.id)}
                className="mt-1 h-4 w-4 text-blue-600 rounded"
                onChange={(e) => {
                  const newPriorities = e.target.checked
                    ? [...formData.priorities, metric.id]
                    : formData.priorities.filter(p => p !== metric.id);
                  setFormData(prev => ({
                    ...prev,
                    priorities: newPriorities
                  }));
                }}
              />
              <div>
                <p className="font-medium text-gray-900">{metric.label}</p>
                <p className="text-sm text-gray-500">{metric.description}</p>
              </div>
            </label>
          ))}
        </div>
        {errors['priorities'] && (
          <p className="mt-2 text-sm text-red-600">{errors['priorities']}</p>
        )}
      </div>
    </div>
  );

  const IntegrationsStep = () => (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Connect Your Stack</h2>
        <p className="mt-2 text-gray-600">
          Let's connect your tools to power up your optimization engine.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {DATA_SOURCES.map(source => (
          <div
            key={source.id}
            onClick={() => handleIntegrationClick(source.id)}
            className={`relative bg-white rounded-xl border p-4 cursor-pointer transition-all duration-200 ${
              formData.integrations.dataSources.includes(source.id)
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-200'
            }`}
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{source.icon}</span>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{source.name}</p>
                <p className="text-sm text-gray-500">Click to connect</p>
              </div>
              {formData.integrations.dataSources.includes(source.id) && (
                <CheckCircle className="w-5 h-5 text-blue-600" />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <button
          onClick={() => setShowMoreIntegrations(!showMoreIntegrations)}
          className="text-blue-600 font-medium flex items-center space-x-2"
        >
          <span>{showMoreIntegrations ? 'Show Less' : 'View More Options'}</span>
          <ChevronDown 
            className={`w-4 h-4 transition-transform ${
              showMoreIntegrations ? 'rotate-180' : ''
            }`} 
          />
        </button>
      </div>

      {showMoreIntegrations && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Integrations</h3>
            <div className="grid grid-cols-2 gap-4">
              {['Wordpress', 'Magento', 'Webflow', 'Custom CMS'].map(platform => (
                <button 
                  key={platform} 
                  className="p-4 border rounded-lg hover:bg-gray-50 text-left"
                >
                  {platform}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900">Connect Google Analytics</p>
            <p className="text-sm text-blue-700 mt-1">
              Connect GA to unlock AI-powered insights and optimization recommendations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSummary = () => (
    <div className="max-w-4xl mx-auto pt-8">
      {/* Success Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900">You're All Set! 🎉</h2>
        <p className="mt-3 text-lg text-gray-600">
          Your optimization engine is ready to go. Let's start improving your website.
        </p>
      </div>
  
        
      {/* Next Steps Card */}
      <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-100 shadow-sm mb-8">
        <div className="px-6 py-4 border-b border-blue-100">
          <h3 className="text-lg font-semibold text-gray-900">Your Success Roadmap</h3>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="text-lg font-medium text-gray-900">Create Your First Experiment</h4>
              <p className="mt-1 text-gray-600">
                Based on your website analysis, we've prepared 3 high-impact experiment templates ready for launch.
              </p>
              <button className="mt-3 inline-flex items-center text-blue-600 font-medium hover:text-blue-700">
                View Templates
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
  
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h4 className="text-lg font-medium text-gray-900">Set Up Your Team</h4>
              <p className="mt-1 text-gray-600">
                Invite team members to collaborate on experiments and share insights.
              </p>
              <button className="mt-3 inline-flex items-center text-purple-600 font-medium hover:text-purple-700">
                Invite Team Members
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
  
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h4 className="text-lg font-medium text-gray-900">Review AI Insights</h4>
              <p className="mt-1 text-gray-600">
                We've analyzed your website and found {formData.priorities?.length || 5} optimization opportunities.
              </p>
              <button className="mt-3 inline-flex items-center text-green-600 font-medium hover:text-green-700">
                View Insights
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case STEPS.WELCOME:
        return renderWelcome();
      case STEPS.COMPANY_BASICS:
        return renderCompanyBasics();
      case STEPS.ROLE_TEAM:
        return renderRoleTeam();
      case STEPS.INTEGRATIONS:
        return <IntegrationsStep />;
      case STEPS.SUMMARY:
        return renderSummary();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1440px] mx-auto px-8 py-8">
        <ProgressBar currentStep={currentStep} totalSteps={Object.keys(STEPS).length} />
        
        <div className={`${
          (currentStep === STEPS.COMPANY_BASICS && showWebsiteAnalysis) || 
          (currentStep === STEPS.INTEGRATIONS && showAnalytics)
            ? 'grid grid-cols-[1fr,auto] gap-8'
            : 'w-full'
        }`}>
          <div className="w-full">
            <div className="mb-8">
              {renderCurrentStep()}
            </div>
  
            <div className="flex justify-between mt-8">
              {currentStep > STEPS.WELCOME && (
                <button
                  onClick={handleBack}
                  className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </button>
              )}
              
              <div className="ml-auto">
                {currentStep < STEPS.SUMMARY ? (
                  <button
                    onClick={handleNext}
                    className={`flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 ${
                      isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={isSubmitting}
                  >
                    {currentStep === STEPS.INTEGRATIONS ? 'Finish' : 'Continue'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                ) : (
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="group relative inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 overflow-hidden"
                  >
                    <span className="absolute inset-0 w-full h-full bg-white/10 group-hover:w-0 transition-all duration-300"></span>
                    <span className="relative flex items-center space-x-2">
                      <span className="text-lg font-semibold">Go to Dashboard</span>
                      <ChevronRight className="w-5 h-5 animate-pulse" />
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
  
          {/* Right panel container */}
          {(showWebsiteAnalysis || showAnalytics) && (
            <div className="w-[650px]">
              {showWebsiteAnalysis && currentStep === STEPS.COMPANY_BASICS && (
                <WebsiteAnalysisPanel website={formData.company.website} />
              )}
              {showAnalytics && currentStep === STEPS.INTEGRATIONS && (
                <AnalyticsPanel />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;