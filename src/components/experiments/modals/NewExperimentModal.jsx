import React, { useState } from 'react';
import { X, AlertCircle, Wand2, Eye, Paintbrush, Layout, Target } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const EXPERIMENT_TYPES = {
  VISUAL: {
    id: 'visual',
    label: 'Visual Changes',
    description: 'Test different colors, typography, and visual elements',
    fields: ['color', 'backgroundColor', 'fontSize', 'spacing'],
    examples: ['Button colors', 'Heading styles', 'Text contrast'],
    icon: Paintbrush
  },
  LAYOUT: {
    id: 'layout',
    label: 'Layout & Structure',
    description: 'Test different layouts and content arrangements',
    fields: ['position', 'order', 'visibility', 'structure'],
    examples: ['Content order', 'Section arrangement', 'Navigation structure'],
    icon: Layout
  },
  TARGETING: {
    id: 'targeting',
    label: 'Audience Targeting',
    description: 'Test different content for different audience segments',
    fields: ['segment', 'location', 'device', 'userType'],
    examples: ['Geographic targeting', 'Device-specific content', 'User segment tests'],
    icon: Target
  }
};

const OPTIMIZATION_TYPES = {
  CONTENT: "Content",
  VISUAL_DESIGN: "Visual Design",
  LAYOUT: "Layout/Structure",
  FUNCTIONALITY: "Functionality",
  NAVIGATION: "Navigation",
  TRUST: "Trust Building"
};

const DEVICE_TYPES = {
  ALL: "All Devices",
  DESKTOP: "Desktop",
  MOBILE: "Mobile",
  TABLET: "Tablet"
};

const NewExperimentModal = ({ isOpen, onClose, onExperimentCreated }) => {
  const [step, setStep] = useState(1);
  const [experimentType, setExperimentType] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetURL: '',
    priority: 'high',
    successProbability: 75,
    upliftPotential: '10-15%',
    timeToImplement: '1-2 weeks',
    stage: 'proposed',
    status: 'proposed',
    type: '',
    optimizationType: OPTIMIZATION_TYPES.CONTENT,
    device: DEVICE_TYPES.ALL,
    variations: {
      control: {
        id: 'control',
        name: 'Original Version',
        elements: [],
        traffic: 50,
        status: 'active',
        views: 0,
        conversions: 0,
        conversionRate: '0.00'
      },
      variant: {
        id: 'variant-1',
        name: 'Test Version',
        elements: [],
        traffic: 50,
        status: 'active',
        views: 0,
        conversions: 0,
        conversionRate: '0.00'
      }
    },
    metrics: {
      primary: 'conversion_rate',
      secondary: ['engagement', 'bounce_rate']
    },
    audience: {
      targeting: 'all_visitors',
      percentage: 50
    },
    insight: '',
    hypothesis: '',
    recommendation: '',
    expectedOutcome: '',
    results: {
      visitors: 0,
      conversions: 0,
      variantVisitors: 0,
      variantConversions: 0,
      controlConversionRate: 0,
      variantConversionRate: 0,
      improvement: 0
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNestedInputChange = (category, field, value) => {
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Title is required');
      return false;
    }
    if (!formData.targetURL.trim()) {
      setError('Target URL is required');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Description is required');
      return false;
    }
    if (!formData.hypothesis.trim()) {
      setError('Hypothesis is required');
      return false;
    }
    return true;
  };

  const handleCreateExperiment = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setError(null);

    try {
      const experimentData = {
        ...formData,
        confidence: formData.successProbability,
        duration: {
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (experimentType?.id === 'visual') {
        experimentData.variations.variant.elements = [{
          selector: formData.targetElement || 'h1',
          originalStyles: {},
          variantStyles: {
            color: formData.variations.variant.color || '#4A90E2'
          }
        }];
      }

      await onExperimentCreated(experimentData);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create experiment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderTypeSelection = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Choose Experiment Type</h3>
      <div className="grid grid-cols-1 gap-4">
        {Object.values(EXPERIMENT_TYPES).map((type) => {
          const Icon = type.icon;
          return (
            <button
              key={type.id}
              onClick={() => {
                setExperimentType(type);
                setFormData(prev => ({
                  ...prev,
                  type: type.id,
                  optimizationType: type.id === 'visual' ? OPTIMIZATION_TYPES.VISUAL_DESIGN :
                                  type.id === 'layout' ? OPTIMIZATION_TYPES.LAYOUT :
                                  OPTIMIZATION_TYPES.CONTENT
                }));
                setStep(2);
              }}
              className={`p-4 border rounded-lg text-left hover:border-blue-200 hover:bg-blue-50 transition-colors ${
                experimentType?.id === type.id ? 'border-blue-500 bg-blue-50' : ''
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-white rounded-lg border">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{type.label}</h4>
                  <p className="mt-1 text-sm text-gray-500">{type.description}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {type.examples.map((example, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-xs text-gray-600"
                      >
                        {example}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderVariationFields = () => {
    switch (experimentType?.id) {
      case 'visual':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Select Element
              </label>
              <select
                name="targetElement"
                value={formData.targetElement || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select element to modify</option>
                <option value="h1">Main Heading (H1)</option>
                <option value="button">Buttons</option>
                <option value="link">Links</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Color Change
              </label>
              <div className="mt-1 flex items-center space-x-3">
                <div className="flex-1">
                  <input
                    type="color"
                    value={formData.variations.variant.color || '#4A90E2'}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      variations: {
                        ...prev.variations,
                        variant: {
                          ...prev.variations.variant,
                          color: e.target.value
                        }
                      }
                    }))}
                    className="h-10 w-20 rounded border"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const suggestedColors = ['#4A90E2', '#27AE60', '#E74C3C', '#F1C40F'];
                    const randomColor = suggestedColors[Math.floor(Math.random() * suggestedColors.length)];
                    setFormData(prev => ({
                      ...prev,
                      variations: {
                        ...prev.variations,
                        variant: {
                          ...prev.variations.variant,
                          color: randomColor
                        }
                      }
                    }));
                  }}
                  className="flex items-center px-3 py-1.5 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
                >
                  <Wand2 className="w-4 h-4 mr-2" />
                  Suggest Colors
                </button>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mt-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Preview</h4>
              <div className="bg-white border rounded-lg p-4">
                <div style={{ color: formData.variations.variant.color }}>
                  Sample Text
                </div>
              </div>
            </div>
          </div>
        );

      case 'layout':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Layout Change
              </label>
              <select
                name="layoutType"
                value={formData.layoutType || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select layout type</option>
                <option value="single">Single Column</option>
                <option value="two-col">Two Columns</option>
                <option value="grid">Grid Layout</option>
              </select>
            </div>
          </div>
        );

      case 'targeting':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Target Audience
              </label>
              <select
                name="targetAudience"
                value={formData.audience.targeting}
                onChange={(e) => handleNestedInputChange('audience', 'targeting', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="all_visitors">All Visitors</option>
                <option value="new_visitors">New Visitors</option>
                <option value="returning_visitors">Returning Visitors</option>
                <option value="mobile_users">Mobile Users</option>
              </select>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderExperimentDetails = () => (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div>
        <h3 className="text-lg font-medium text-gray-900">Experiment Details</h3>
        <p className="mt-1 text-sm text-gray-500">
          {experimentType?.description}
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Experiment Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="e.g., Homepage Heading Color Test"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Describe what you're testing and why"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Target URL
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
              https://
            </span>
            <input
              type="text"
              name="targetURL"
              value={formData.targetURL}
              onChange={handleInputChange}
              className="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="www.example.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Hypothesis
          </label>
          <textarea
            name="hypothesis"
            value={formData.hypothesis}
            onChange={handleInputChange}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500focus:ring-blue-500"
            placeholder="We believe that... will result in... because..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Priority
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Success Probability (%)
            </label>
            <input
              type="number"
              name="successProbability"
              value={formData.successProbability}
              onChange={handleInputChange}
              min="0"
              max="100"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Uplift Potential
            </label>
            <input
              type="text"
              name="upliftPotential"
              value={formData.upliftPotential}
              onChange={handleInputChange}
              placeholder="e.g., 10-15%"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Time to Implement
            </label>
            <input
              type="text"
              name="timeToImplement"
              value={formData.timeToImplement}
              onChange={handleInputChange}
              placeholder="e.g., 1-2 weeks"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Expected Outcome
          </label>
          <textarea
            name="expectedOutcome"
            value={formData.expectedOutcome}
            onChange={handleInputChange}
            rows={2}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="What results do you expect to see?"
          />
        </div>

        {renderVariationFields()}
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Create New Experiment
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          {/* Progress indicator */}
          <div className="mt-4 flex items-center space-x-4">
            <div className={`flex items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 1 ? 'bg-blue-100' : 'bg-gray-100'
              }`}>
                1
              </div>
              <span className="ml-2 text-sm font-medium">Type</span>
            </div>
            <div className="w-8 h-px bg-gray-200" />
            <div className={`flex items-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 2 ? 'bg-blue-100' : 'bg-gray-100'
              }`}>
                2
              </div>
              <span className="ml-2 text-sm font-medium">Details</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-grow">
          {step === 1 && renderTypeSelection()}
          {step === 2 && renderExperimentDetails()}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-between flex-shrink-0">
          <button
            onClick={() => step > 1 && setStep(prev => prev - 1)}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${
              step > 1
                ? 'text-gray-700 hover:bg-gray-100'
                : 'text-gray-400 cursor-not-allowed'
            }`}
            disabled={step === 1 || isSubmitting}
          >
            Back
          </button>
          <button
            onClick={() => {
              if (step === 1 && experimentType) {
                setStep(2);
              } else if (step === 2) {
                handleCreateExperiment();
              }
            }}
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </>
            ) : (
              step === 1 ? 'Next' : 'Create Experiment'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewExperimentModal;