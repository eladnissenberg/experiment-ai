import React, { useState, useCallback } from 'react';
import {
  Monitor, Smartphone, Tablet, RefreshCw, Loader2,
  AlertTriangle, Eye, EyeOff, Save, Layout,
  Columns, BarChart2, Sparkles
} from 'lucide-react';

const DEVICE_MODES = {
  DESKTOP: { id: 'desktop', icon: Monitor, width: 'w-full', label: 'Desktop View' },
  TABLET: { id: 'tablet', icon: Tablet, width: 'w-[768px]', label: 'Tablet View' },
  MOBILE: { id: 'mobile', icon: Smartphone, width: 'w-[375px]', label: 'Mobile View' }
};

const CONTROL_VARIANT = {
  id: 'control',
  name: 'No Testimonials',
  description: 'Original version without testimonials',
  url: 'https://www.supporteam.io/home-no-testimonials'
};

const TEST_VARIANTS = [
  {
    id: 'variant-1',
    name: 'Basic Testimonials',
    description: 'Version with standard testimonial section',
    url: 'https://www.supporteam.io/home-yes-testimonials',
    confidence: 92
  },
  {
    id: 'variant-2',
    name: 'Trust Side by Side',
    description: 'Hero section with adjacent testimonials',
    url: 'https://www.supporteam.io/home-yes-testimonials-2',
    confidence: 87
  }
];

function VariantCard({ variant, isSelected, onSelect }) {
  return (
    <div
      className={`relative group rounded-lg border transition-all cursor-pointer ${
        isSelected ? 'border-blue-200 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={() => onSelect(variant)}
    >
      <div className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {variant.confidence ? (
              <Sparkles className="w-4 h-4 text-yellow-500" />
            ) : (
              <Layout className="w-4 h-4 text-gray-400" />
            )}
            <span className="text-sm font-medium text-gray-900">{variant.name}</span>
          </div>
          {variant.confidence && (
            <span className="text-xs font-medium text-green-600">{variant.confidence}%</span>
          )}
        </div>
        <p className="mt-1 text-xs text-gray-500">{variant.description}</p>
      </div>
    </div>
  );
}

function PreviewFrame({ url, onError, deviceMode }) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative w-full h-full flex justify-center">
      {isLoading && (
        <div className="absolute inset-0 bg-white/90 flex items-center justify-center z-10">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      )}

      <div className={`h-full transition-all duration-300 ${DEVICE_MODES[deviceMode.toUpperCase()].width}`}>
        <iframe
          src={url}
          className="w-full h-full border-0"
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            onError?.('Failed to load preview');
          }}
          title="Preview"
        />
      </div>
    </div>
  );
}

export default function VisualEditorTestimonials() {
  const [deviceMode, setDeviceMode] = useState(DEVICE_MODES.DESKTOP.id);
  const [selectedVariant, setSelectedVariant] = useState(TEST_VARIANTS[0]);
  const [isPreviewVisible, setIsPreviewVisible] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [splitView, setSplitView] = useState(true);
  const [previewError, setPreviewError] = useState(null);

  const handleVariantSelect = useCallback((variant) => {
    setSelectedVariant(variant);
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Starting test with variant:', selectedVariant);
    } catch (err) {
      setError('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-80 border-r bg-white p-4 flex flex-col">
        <div className="border-b pb-4 mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Testimonials Test</h2>
          <p className="text-sm text-gray-500">Compare testimonial variations against control</p>
        </div>

        {/* Control Version */}
        <div className="mb-4">
          <h3 className="text-xs font-medium text-gray-500 mb-2">CONTROL VERSION</h3>
          <VariantCard
            variant={CONTROL_VARIANT}
            isSelected={selectedVariant?.id === CONTROL_VARIANT.id}
            onSelect={handleVariantSelect}
          />
        </div>

        {/* Test Variants */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-medium text-gray-500">AI RECOMMENDATIONS</h3>
            <span className="text-xs text-gray-500 flex items-center">
              <Sparkles className="w-3 h-3 mr-1" />
              AI Generated
            </span>
          </div>
          <div className="space-y-2">
            {TEST_VARIANTS.map(variant => (
              <VariantCard
                key={variant.id}
                variant={variant}
                isSelected={selectedVariant?.id === variant.id}
                onSelect={handleVariantSelect}
              />
            ))}
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Controls */}
        <div className="mt-auto pt-4 border-t space-y-2">
          <button
            onClick={() => setSplitView(!splitView)}
            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center justify-center"
          >
            <Columns className="w-4 h-4 mr-2" />
            {splitView ? 'Exit Split View' : 'Compare with Control'}
          </button>

          <button
            onClick={() => setIsPreviewVisible(!isPreviewVisible)}
            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center justify-center"
          >
            {isPreviewVisible ? (
              <>
                <EyeOff className="w-4 h-4 mr-2" />
                Hide Preview
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Show Preview
              </>
            )}
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`w-full px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center justify-center ${
              isSaving ? 'opacity-75 cursor-wait' : 'hover:bg-blue-700'
            }`}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <BarChart2 className="w-4 h-4 mr-2" />
                Start Test
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preview Area */}
      <div className={`flex-1 transition-all duration-300 ${isPreviewVisible ? 'block' : 'hidden'}`}>
        <div className="p-4 border-b bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {Object.values(DEVICE_MODES).map(mode => (
                <button
                  key={mode.id}
                  onClick={() => setDeviceMode(mode.id)}
                  className={`p-2 rounded-lg ${
                    deviceMode === mode.id
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                  title={mode.label}
                >
                  <mode.icon className="w-5 h-5" />
                </button>
              ))}
            </div>

            <button
              onClick={() => window.location.reload()}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
              title="Refresh preview"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4">
          <div className="flex space-x-4">
            {splitView && (
              <div className="w-1/2">
                <div className="flex items-center mb-2">
                  <Layout className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm font-medium text-gray-600">Control - No Testimonials</span>
                </div>
                <div className="bg-white rounded-lg border shadow-sm h-[calc(100vh-14rem)] overflow-hidden">
                  <PreviewFrame
                    url={CONTROL_VARIANT.url}
                    onError={setPreviewError}
                    deviceMode={deviceMode}
                  />
                </div>
              </div>
            )}

            <div className={splitView ? 'w-1/2' : 'w-full'}>
              <div className="flex items-center mb-2">
                <Layout className="w-4 h-4 text-gray-400 mr-2" />
                <span className="text-sm font-medium text-gray-600">{selectedVariant.name}</span>
              </div>
              <div className="bg-white rounded-lg border shadow-sm h-[calc(100vh-14rem)] overflow-hidden">
                <PreviewFrame
                  url={selectedVariant.url}
                  onError={setPreviewError}
                  deviceMode={deviceMode}
                />
              </div>
            </div>
          </div>
        </div>

        {previewError && (
          <div className="absolute bottom-4 right-4 p-4 bg-red-50 border border-red-200 rounded-lg shadow-lg max-w-md">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-900">Preview Error</p>
                <p className="text-sm text-red-600">{previewError}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}