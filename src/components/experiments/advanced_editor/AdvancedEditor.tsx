import React, { useState, useEffect } from 'react';
import DOMExplorer from './components/DOMExplorer';
import ElementEditor from './components/ElementEditor';
import PreviewFrame from './components/PreviewFrame';
import StyleEditor from './components/StyleEditor';
import VariantManager from './components/VariantManager';
import { useAdvancedEditor } from './hooks';
import { ExperimentConfig, Variant } from './types';
import { Monitor, Columns } from 'lucide-react';

interface AdvancedEditorProps {
  experimentId: string;
  initialConfig: ExperimentConfig;
}

const AdvancedEditor = ({
  experimentId,
  initialConfig
}: AdvancedEditorProps) => {
  // Initialize with control variant
  const [activeVariant, setActiveVariant] = useState(() => {
    const controlVariant = initialConfig.variants.find(v => v.id === 'control');
    console.log('Setting initial control variant:', controlVariant);
    return controlVariant || null;
  });

  // Track all experiment data
  const [experimentData, setExperimentData] = useState(initialConfig);
  
  const [splitView, setSplitView] = useState(false);
  const [showElementEditor, setShowElementEditor] = useState(true);

  const {
    loading,
    error,
    data,
    extractDOM,
    selectedElement,
    hoveredElement,
    selectElement,
    setHoveredElement,
    updateElement
  } = useAdvancedEditor(initialConfig.targetURL);

  useEffect(() => {
    console.log('AdvancedEditor mounted with config:', initialConfig);
    extractDOM(initialConfig.targetURL);
  }, [initialConfig.targetURL, extractDOM]);

  // Log variant changes
  useEffect(() => {
    console.log('Active variant changed:', activeVariant);
  }, [activeVariant]);

  const handleVariantCreate = () => {
    console.log('Creating new variant');
    const variantCount = experimentData.variants.length;
    
    const newVariant = {
      id: `variant-${Date.now()}`,
      name: `Variant ${variantCount}`,
      elements: [],
      traffic: 50,
      status: 'draft',
      views: 0,
      conversions: 0,
      conversionRate: '0.00'
    };

    setExperimentData(prev => ({
      ...prev,
      variants: [...prev.variants, newVariant]
    }));

    // Set the new variant as active
    setActiveVariant(newVariant);
    console.log('New variant created:', newVariant);
  };

  const handleVariantUpdate = (variantId: string, updates: Partial<Variant>) => {
    console.log('Updating variant:', variantId, updates);
    
    setExperimentData(prev => ({
      ...prev,
      variants: prev.variants.map(v => 
        v.id === variantId ? { ...v, ...updates } : v
      )
    }));

    // Update active variant if it's the one being modified
    if (activeVariant?.id === variantId) {
      setActiveVariant(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const handleVariantDelete = (variantId: string) => {
    console.log('Deleting variant:', variantId);
    if (variantId === 'control') return;

    setExperimentData(prev => ({
      ...prev,
      variants: prev.variants.filter(v => v.id !== variantId)
    }));

    // Switch to control variant if the active variant is being deleted
    if (activeVariant?.id === variantId) {
      const controlVariant = experimentData.variants.find(v => v.id === 'control');
      setActiveVariant(controlVariant || null);
    }
  };

  const handleElementUpdate = (elementId: string, updates: any) => {
    console.log('Updating element:', elementId, updates);
    
    if (!activeVariant || activeVariant.id === 'control') return;

    const updatedElement = updateElement(elementId, updates);
    if (updatedElement) {
      handleVariantUpdate(activeVariant.id, {
        elements: activeVariant.elements.map(el =>
          el.id === elementId ? { ...el, ...updates } : el
        )
      });
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading editor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <p className="text-red-600">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <div className="h-14 bg-white border-b px-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Visual Editor</h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowElementEditor(!showElementEditor)}
            className="p-2 text-gray-400 hover:text-gray-600 rounded"
            title={showElementEditor ? 'Hide Element Editor' : 'Show Element Editor'}
          >
            <Monitor className="w-5 h-5" />
          </button>
          <button
            onClick={() => setSplitView(!splitView)}
            className="p-2 text-gray-400 hover:text-gray-600 rounded"
            title={splitView ? 'Single View' : 'Split View'}
          >
            <Columns className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-64 bg-white border-r">
          <VariantManager
            experiment={experimentData}
            onVariantUpdate={handleVariantUpdate}
            onVariantCreate={handleVariantCreate}
            onVariantDelete={handleVariantDelete}
          />
        </div>

        <div className="flex-1 flex">
          {showElementEditor && selectedElement && (
            <div className="w-80 bg-white border-r overflow-y-auto">
              <ElementEditor
                element={selectedElement}
                variant={activeVariant}
                onUpdate={handleElementUpdate}
              />
            </div>
          )}

          <div className="flex-1 p-4">
            <div className={`h-full flex ${splitView ? 'space-x-4' : ''}`}>
              <div className={splitView ? 'w-1/2' : 'w-full'}>
                <PreviewFrame
                  variant={activeVariant}
                  targetURL={initialConfig.targetURL}
                  onError={(error) => console.error('Preview error:', error)}
                />
              </div>
              {splitView && (
                <div className="w-1/2">
                  <PreviewFrame
                    variant={experimentData.variants.find(v => v.id === 'control')}
                    targetURL={initialConfig.targetURL}
                    onError={(error) => console.error('Control preview error:', error)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedEditor;