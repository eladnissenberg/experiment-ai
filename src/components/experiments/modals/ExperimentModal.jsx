import React, { useState } from 'react';
import { 
  X, 
  ArrowRight, 
  Users, 
  Clock, 
  Target, 
  Lightbulb, 
  Beaker, 
  Rocket, 
  Share2, 
  CheckCircle, 
  BarChart2 
} from 'lucide-react';
import { SegmentBehaviorComparison } from '@/components/shared/analysis/analysis.index';

const ExperimentModal = ({ experiment, onClose, onStartExperiment }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [copied, setCopied] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);

  if (!experiment) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/experiments/${experiment.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'technical', label: 'Technical Details' },
    { id: 'timeline', label: 'Timeline' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b sticky top-0 bg-white">
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-semibold text-gray-900">{experiment.title}</h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                  {experiment.priority} priority
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={handleCopyLink}
                  className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 flex items-center space-x-1"
                  title="Share experiment"
                >
                  {copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"
                >
                  <X className="w-5 h-5" />
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
                    onClick={() => setShowAnalysis(true)}
                    className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
                  >
                    <BarChart2 className="w-4 h-4" />
                    <span>View Data</span>
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
              <p className="text-gray-600">Technical implementation details and requirements...</p>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="p-6">
              <p className="text-gray-600">Timeline and scheduling information...</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t sticky bottom-0 bg-white">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm"
          >
            Close
          </button>
          <button
            onClick={() => onStartExperiment(experiment)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center text-sm font-medium"
          >
            Start Experiment
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>

      {/* Analysis Slide-over */}
      {showAnalysis && (
        <div className="fixed inset-0 z-[60] overflow-hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowAnalysis(false)} />
          
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <div className="pointer-events-auto w-screen max-w-2xl">
              <div className="flex h-full flex-col overflow-y-auto bg-white">
                <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between bg-white">
                  <div className="flex items-center space-x-2">
                    <BarChart2 className="w-5 h-5 text-blue-500" />
                    <h2 className="text-lg font-medium text-gray-900">Behavior Analysis</h2>
                  </div>
                  <button
                    onClick={() => setShowAnalysis(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-1 p-6">
                  <SegmentBehaviorComparison />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExperimentModal;