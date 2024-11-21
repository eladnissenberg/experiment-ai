import React, { useState, useCallback, useEffect } from 'react';
import {
  Palette, Monitor, Smartphone, Tablet, RefreshCw, Loader2,
  AlertTriangle, Eye, EyeOff, Save, Trash2, 
  Columns, Sparkles, BarChart2, Plus
} from 'lucide-react';
import PreviewFrame from "../editor/components/Preview/PreviewFrame";
import { safeBrowserAction } from "../../../utils/browser";

const DEVICE_MODES = {
  DESKTOP: { id: 'desktop', icon: Monitor, width: 'w-full', label: 'Desktop View' },
  TABLET: { id: 'tablet', icon: Tablet, width: 'w-[768px]', label: 'Tablet View' },
  MOBILE: { id: 'mobile', icon: Smartphone, width: 'w-[375px]', label: 'Mobile View' }
};

const AI_GENERATED_VARIANTS = [
  {
    id: 'ai-1',
    name: 'High Impact',
    confidence: 92,
    styles: {
      color: '#2563EB',
      fontSize: '64px',
      fontWeight: '700',
      fontFamily: 'Inter'
    }
  },
  {
    id: 'ai-2',
    name: 'Professional',
    confidence: 87,
    styles: {
      color: '#1E293B',
      fontSize: '48px',
      fontWeight: '600',
      fontFamily: 'Playfair Display'
    }
  },
  {
    id: 'ai-3',
    name: 'Modern Tech',
    confidence: 84,
    styles: {
      color: '#7C3AED',
      fontSize: '56px',
      fontWeight: '700',
      fontFamily: 'Montserrat'
    }
  }
];

const DEFAULT_VARIANTS = [
  { 
    id: 'control', 
    name: 'Control', 
    styles: {
      color: '#000000',
      fontSize: '48px',
      fontWeight: '600',
      fontFamily: 'Inter'
    }
  }
];

const COLOR_PRESETS = [
  { name: 'Blue', value: '#2563EB' },
  { name: 'Green', value: '#059669' },
  { name: 'Purple', value: '#7C3AED' },
  { name: 'Red', value: '#DC2626' },
  { name: 'Orange', value: '#EA580C' }
];

const FONT_SIZES = [
  { label: 'Small', value: '16px' },
  { label: 'Medium', value: '24px' },
  { label: 'Large', value: '32px' },
  { label: 'XL', value: '48px' },
  { label: '2XL', value: '64px' }
];

const FONT_WEIGHTS = [
  { label: 'Regular', value: '400' },
  { label: 'Medium', value: '500' },
  { label: 'Semi Bold', value: '600' },
  { label: 'Bold', value: '700' },
  { label: 'Extra Bold', value: '800' }
];

const FONT_FAMILIES = [
  { label: 'Inter', value: 'Inter' },
  { label: 'Roboto', value: 'Roboto' },
  { label: 'Open Sans', value: 'Open Sans' },
  { label: 'Playfair Display', value: 'Playfair Display' },
  { label: 'Montserrat', value: 'Montserrat' }
];

function VariantCard({ variant, isSelected, onSelect, onDelete, isControl = false, onAddAsVariant = null, expandedView = false, onStyleChange }) {
  const [showControls, setShowControls] = useState(false);

  return (
    <div 
      className={`relative group rounded-lg border transition-all ${
        isSelected ? 'border-blue-200 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <div 
        className="p-3 cursor-pointer"
        onClick={() => {
          onSelect(variant);
          setShowControls(!showControls);
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {variant.id.startsWith('ai-') ? (
              <Sparkles className="w-4 h-4 text-yellow-500" />
            ) : (
              <Palette className="w-4 h-4 text-gray-400" />
            )}
            <span className="text-sm font-medium text-gray-900">{variant.name}</span>
          </div>
          <div className="flex items-center space-x-2">
            {variant.confidence && (
              <span className="text-xs font-medium text-green-600">{variant.confidence}%</span>
            )}
            <div
              className="w-4 h-4 rounded-full border border-gray-200"
              style={{ backgroundColor: variant.styles.color }}
            />
          </div>
        </div>
      </div>

      {showControls && expandedView && (
        <div className="p-3 border-t bg-gray-50">
          <StyleControls variant={variant} onStyleChange={(property, value) => onStyleChange(variant.id, property, value)} />
        </div>
      )}

      {onAddAsVariant && (
        <button
          onClick={() => onAddAsVariant(variant)}
          className="absolute right-2 top-2 p-1 text-gray-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Plus className="w-4 h-4" />
        </button>
      )}

      {!isControl && !variant.id.startsWith('ai-') && !onAddAsVariant && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(variant.id);
          }}
          className="absolute right-2 top-2 p-1 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

function StyleControls({ variant, onStyleChange }) {
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs text-gray-500 mb-1">Color</label>
        <input
          type="color"
          value={variant.styles.color}
          onChange={(e) => onStyleChange('color', e.target.value)}
          className="w-full h-8 rounded cursor-pointer"
        />
      </div>
      
      <div>
        <label className="block text-xs text-gray-500 mb-1">Font Size</label>
        <select
          value={variant.styles.fontSize}
          onChange={(e) => onStyleChange('fontSize', e.target.value)}
          className="w-full px-2 py-1 text-sm border rounded"
        >
          {FONT_SIZES.map(size => (
            <option key={size.value} value={size.value}>{size.label} ({size.value})</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">Font Weight</label>
        <select
          value={variant.styles.fontWeight}
          onChange={(e) => onStyleChange('fontWeight', e.target.value)}
          className="w-full px-2 py-1 text-sm border rounded"
        >
          {FONT_WEIGHTS.map(weight => (
            <option key={weight.value} value={weight.value}>{weight.label} ({weight.value})</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">Font Family</label>
        <select
          value={variant.styles.fontFamily}
          onChange={(e) => onStyleChange('fontFamily', e.target.value)}
          className="w-full px-2 py-1 text-sm border rounded"
        >
          {FONT_FAMILIES.map(font => (
            <option key={font.value} value={font.value}>{font.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default function VisualEditor() {
  const [deviceMode, setDeviceMode] = useState(DEVICE_MODES.DESKTOP.id);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [variants, setVariants] = useState([...DEFAULT_VARIANTS]);
  const [aiVariants, setAiVariants] = useState(AI_GENERATED_VARIANTS);
  const [isPreviewVisible, setIsPreviewVisible] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [editingVariant, setEditingVariant] = useState(null);
  const [splitView, setSplitView] = useState(false);
  const [previewError, setPreviewError] = useState(null);

  useEffect(() => {
    const loadExperiment = async () => {
      try {
        setSelectedVariant(DEFAULT_VARIANTS[0]);
      } catch (err) {
        setError('Failed to load experiment data');
      }
    };
    loadExperiment();
  }, []);

  const handleVariantSelect = useCallback((variant) => {
    setSelectedVariant(variant);
    setEditingVariant(variant);
  }, []);

  const handleVariantUpdate = useCallback((variantId, updates) => {
    setVariants(currentVariants =>
      currentVariants.map(variant =>
        variant.id === variantId
          ? { ...variant, ...updates }
          : variant
      )
    );
  }, []);

  const handleStyleChange = useCallback((variantId, property, value) => {
    const updatedVariants = variants.map(variant => {
      if (variant.id === variantId) {
        return {
          ...variant,
          styles: { ...variant.styles, [property]: value }
        };
      }
      return variant;
    });
    setVariants(updatedVariants);

    if (selectedVariant?.id === variantId) {
      setSelectedVariant({
        ...selectedVariant,
        styles: { ...selectedVariant.styles, [property]: value }
      });
    }
    if (editingVariant?.id === variantId) {
      setEditingVariant({
        ...editingVariant,
        styles: { ...editingVariant.styles, [property]: value }
      });
    }
  }, [variants, selectedVariant, editingVariant]);

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Saved variants:', variants);
    } catch (err) {
      setError('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteVariant = useCallback((variantId) => {
    if (variants.length <= 1) {
      setError("Can't delete the last variant");
      return;
    }

    const updatedVariants = variants.filter(v => v.id !== variantId);
    setVariants(updatedVariants);

    if (selectedVariant?.id === variantId) {
      const newSelectedVariant = updatedVariants[0] || null;
      setSelectedVariant(newSelectedVariant);
      setEditingVariant(newSelectedVariant);
    }
  }, [variants, selectedVariant]);

  const handleAddVariant = useCallback(() => {
    const newVariant = {
      id: `variant-${variants.length + 1}`,
      name: `Variant ${variants.length + 1}`,
      styles: {
        color: '#000000',
        fontSize: '48px',
        fontWeight: '600',
        fontFamily: 'Inter'
      }
    };

    setVariants(currentVariants => [...currentVariants, newVariant]);
    setSelectedVariant(newVariant);
    setEditingVariant(newVariant);
  }, [variants]);

  const handleAddAiVariant = (aiVariant) => {
    const newVariant = {
      ...aiVariant,
      id: `variant-${variants.length + 1}`,
      name: `Variant ${variants.length + 1}`,
      confidence: undefined // Remove confidence from custom variant
    };
    setVariants(current => [...current, newVariant]);
    setSelectedVariant(newVariant);
    setEditingVariant(newVariant);
  };

  const targetURL = "https://www.supporteam.io";
  const controlVariant = variants.find(v => v.id === 'control') || DEFAULT_VARIANTS[0];

  return (
    <div className="h-screen bg-gray-50 flex">
      <div className="w-80 border-r bg-white p-4 flex flex-col">
        <div className="border-b pb-4 mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Visual Editor</h2>
          <p className="text-sm text-gray-500">Edit and preview variants</p>
        </div>

        {/* Custom Variants Section */}
        <div className="space-y-2 mb-4">
          {variants.map(variant => (
            <VariantCard
              key={variant.id}
              variant={variant}
              isSelected={selectedVariant?.id === variant.id}
              onSelect={handleVariantSelect}
              onDelete={handleDeleteVariant}
              isControl={variant.id === 'control'}
              expandedView={true}
              onStyleChange={handleStyleChange}
            />
          ))}

          <button
            onClick={handleAddVariant}
            className="w-full px-4 py-2 border border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-gray-400 hover:text-gray-900"
          >
            + Add Variant
          </button>
        </div>

        {/* AI Recommendations Section */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900">AI Recommendations</h3>
            <span className="text-xs text-gray-500 flex items-center">
              <Sparkles className="w-3 h-3 mr-1" />
              AI Generated
            </span>
          </div>

          <div className="space-y-2">
            {aiVariants.map(variant => (
              <VariantCard
                key={variant.id}
                variant={variant}
                isSelected={selectedVariant?.id === variant.id}
                onSelect={handleVariantSelect}
                onAddAsVariant={handleAddAiVariant}
                expandedView={false}
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
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

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
              onClick={() => safeBrowserAction(() => window.location.reload())}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
              title="Refresh preview"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4">
          <div className={`flex ${splitView ? 'space-x-4' : ''}`}>
            <div className={`mx-auto transition-all duration-300 ${
              splitView ? 'w-1/2' : DEVICE_MODES[deviceMode.toUpperCase()].width
            }`}>
              <div className="bg-white rounded-lg border shadow-sm h-[calc(100vh-12rem)] overflow-hidden">
                <PreviewFrame
                  targetURL={targetURL}
                  selectedVariant={selectedVariant}
                  onError={setPreviewError}
                />
              </div>
            </div>

            {splitView && (
              <div className="w-1/2">
                <div className="bg-white rounded-lg border shadow-sm h-[calc(100vh-12rem)] overflow-hidden">
                  <PreviewFrame
                    targetURL={targetURL}
                    selectedVariant={controlVariant}
                    onError={setPreviewError}
                  />
                </div>
              </div>
            )}
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