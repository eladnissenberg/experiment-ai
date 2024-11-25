import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, Users, Clock, Target, Lightbulb,
  Beaker, Rocket, Share2, CheckCircle, BarChart2 
} from 'lucide-react';
import { SegmentBehaviorComparison } from '@/components/shared/analysis/analysis.index';

const ExperimentDetails = ({ experiment, onClose, onStartExperiment }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [copied, setCopied] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);

  if (!experiment) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/experiments/${experiment.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStartExperiment = () => {
    try {
      navigate('/experiments/editor-testimonials');
    } catch (error) {
      console.error('Navigation error:', error);
      window.location.href = `${window.location.origin}/experiments/editor-testimonials`;
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'technical', label: 'Technical Details' },
    { id: 'timeline', label: 'Timeline' }
  ];

  return (
    <div className={`bg-white rounded-xl w-full flex transition-all duration-300 ease-in-out ${showAnalysis ? 'max-w-6xl' : 'max-w-4xl'}`}>
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b bg-white">
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-semibold text-gray-900">{experiment.title}</h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                  {experiment.priority} priority
                </span>
              </div>
              <div className="flex items-center gap-6">
                <button 
                  onClick={handleCopyLink}
                  className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 flex items-center space-x-1"
                >
                  {copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <p className="mt-1 text-sm text-gray-600">{experiment.description}</p>
          </div>
        </div>

        {/* Metrics Bar */}
        <div className="flex border-b px-6 py-3 bg-gray-50 text-sm">
          <div className="flex-1 flex items-center space-x-1">
            <Target className="w-4 h-4 text-blue-500" />
            <span className="text-gray-500">Success:</span>
            <span className="font-medium text-gray-900">{experiment.successProbability}%</span>
          </div>
          <div className="flex-1 flex items-center space-x-1">
            <Users className="w-4 h-4 text-green-500" />
            <span className="text-gray-500">Uplift:</span>
            <span className="font-medium text-gray-900">{experiment.upliftPotential}</span>
          </div>
          <div className="flex-1 flex items-center space-x-1">
            <Clock className="w-4 h-4 text-orange-500" />
            <span className="text-gray-500">Time:</span>
            <span className="font-medium text-gray-900">{experiment.timeToImplement}</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b px-6 bg-white">
          <div className="flex space-x-6">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'overview' && (
            <div className="p-6 space-y-6">
              {/* Insight */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Lightbulb className="w-5 h-5 text-blue-500" />
                    <h3 className="font-medium text-gray-900">Current Insight</h3>
                  </div>
                  <button
                    onClick={() => setShowAnalysis(!showAnalysis)}
                    className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
                  >
                    <BarChart2 className="w-4 h-4" />
                    <span>{showAnalysis ? 'Hide Data' : 'View Data'}</span>
                  </button>
                </div>
                <p className="text-sm text-gray-600 pl-7">{experiment.insight}</p>
              </div>

              {/* Hypothesis */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Beaker className="w-5 h-5 text-purple-500" />
                  <h3 className="font-medium text-gray-900">Hypothesis</h3>
                </div>
                <div className="pl-7 space-y-3">
                  <p className="text-sm text-gray-600">{experiment.hypothesis}</p>
                  {experiment.similarExample && (
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <p className="text-sm text-purple-600">
                        <span className="font-medium">Similar Example:</span> {experiment.similarExample}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Recommendation */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Rocket className="w-5 h-5 text-green-500" />
                  <h3 className="font-medium text-gray-900">Recommendation</h3>
                </div>
                <p className="text-sm text-gray-600 pl-7">{experiment.recommendation}</p>
              </div>

              {/* Expected Outcome */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Target className="w-5 h-5 text-blue-500" />
                  <h3 className="font-medium text-gray-900">Expected Outcome</h3>
                </div>
                <p className="text-sm text-gray-600">{experiment.expectedOutcome}</p>
              </div>
            </div>
          )}

          {activeTab === 'technical' && (
            <div className="p-6">
              <p className="text-gray-600">Technical implementation details...</p>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="p-6">
              <p className="text-gray-600">Timeline details...</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end items-center p-6 border-t bg-white">
          <button
            onClick={handleStartExperiment}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center text-sm font-medium"
          >
            Start Experiment
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>

      {/* Analysis Panel */}
      {showAnalysis && (
        <div className="w-[500px] border-l border-gray-200 overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-medium text-gray-900">Behavior Analysis</h2>
          </div>
          <div className="p-6">
            <SegmentBehaviorComparison />
          </div>
        </div>
      )}
    </div>
  );
};

export default ExperimentDetails;