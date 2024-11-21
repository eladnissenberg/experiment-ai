import React from 'react';
import { VariantManagerProps, Variant } from '../../types';
import { 
  Beaker, 
  Trash2, 
  Plus, 
  Play, 
  Pause, 
  BarChart2, 
  AlertTriangle,
  Lock
} from 'lucide-react';

interface AlertProps {
  type: 'warning' | 'error';
  message: string;
}

const Alert = ({ type, message }: AlertProps) => (
  <div className={`
    border rounded-md p-3 mb-4 flex items-start
    ${type === 'warning' ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'}
  `}>
    <AlertTriangle className={`
      w-4 h-4 mt-0.5 mr-2 flex-shrink-0
      ${type === 'warning' ? 'text-yellow-500' : 'text-red-500'}
    `} />
    <div className={`text-sm ${type === 'warning' ? 'text-yellow-700' : 'text-red-700'}`}>
      {message}
    </div>
  </div>
);

const MAX_VARIANTS = 4;
const MIN_TRAFFIC_PER_VARIANT = 5;

const validateVariant = (variant: Variant) => {
  console.log('Validating variant:', variant);
  const errors: string[] = [];

  if (variant.id === 'control') {
    return errors;
  }

  if (!variant?.id) {
    errors.push('Variant ID is required');
  }

  if (typeof variant?.name !== 'string' || !variant.name.trim()) {
    errors.push('Variant name is required');
  }

  if (typeof variant?.traffic !== 'number' || variant.traffic < 0 || variant.traffic > 100) {
    errors.push('Traffic allocation must be between 0 and 100');
  }

  if (!Array.isArray(variant?.elements)) {
    errors.push('Variant elements must be an array');
  }

  if (variant.status === 'active' && (!variant.elements || variant.elements.length === 0)) {
    errors.push('Active variant must have at least one modified element');
  }

  return errors;
};

const VariantManager = ({
  experiment,
  onVariantUpdate,
  onVariantCreate,
  onVariantDelete
}: VariantManagerProps) => {
  const [isCreatingVariant, setIsCreatingVariant] = React.useState(false);
  const [showTrafficWarning, setShowTrafficWarning] = React.useState(false);
  const [error, setError] = React.useState(null);

  const calculateRemainingTraffic = (excludeVariantId?: string) => {
    return 100 - experiment.variants
      .filter(v => v.id !== 'control' && v.id !== excludeVariantId)
      .reduce((sum, v) => sum + v.traffic, 0);
  };

  const handleTrafficChange = (variant: Variant, traffic: number) => {
    console.log('Handling traffic change:', { variant, traffic });
    if (variant.id === 'control') return;

    const remainingTraffic = calculateRemainingTraffic(variant.id);
    const maxAllowedTraffic = remainingTraffic + variant.traffic;

    if (traffic <= maxAllowedTraffic && traffic >= MIN_TRAFFIC_PER_VARIANT) {
      onVariantUpdate(variant.id, { traffic });
      setShowTrafficWarning(false);
      setError(null);
    } else if (traffic < MIN_TRAFFIC_PER_VARIANT) {
      setError(`Minimum traffic allocation is ${MIN_TRAFFIC_PER_VARIANT}%`);
    } else {
      setShowTrafficWarning(true);
    }
  };

  const handleStatusToggle = (variant: Variant) => {
    console.log('Handling status toggle:', variant);
    if (variant.id === 'control') return;

    const errors = validateVariant(variant);
    if (errors.length > 0) {
      setError(errors[0]);
      return;
    }

    const newStatus = variant.status === 'active' ? 'paused' : 'active';
    onVariantUpdate(variant.id, { status: newStatus });
    setError(null);
  };

  const handleVariantNameChange = (event: { target: { value: string } }, variant: Variant) => {
    if (variant.id === 'control') return;
    const name = event.target.value.trim();
    onVariantUpdate(variant.id, { name });
  };

  const handleCreateVariant = () => {
    console.log('Creating new variant', { 
      currentCount: experiment.variants.length,
      maxAllowed: MAX_VARIANTS 
    });

    if (experiment.variants.length >= MAX_VARIANTS) {
      setError(`Maximum ${MAX_VARIANTS} variants allowed`);
      return;
    }

    const remainingTraffic = calculateRemainingTraffic();
    if (remainingTraffic < MIN_TRAFFIC_PER_VARIANT) {
      setError(`Not enough traffic available for new variant (min ${MIN_TRAFFIC_PER_VARIANT}%)`);
      return;
    }

    const newVariant: Variant = {
      id: `variant-${Date.now()}`,
      name: `Variant ${experiment.variants.length}`,
      elements: [],
      traffic: remainingTraffic > 50 ? 50 : remainingTraffic,
      status: 'draft',
      views: 0,
      conversions: 0,
      conversionRate: '0.00'
    };

    if (onVariantCreate) {
  onVariantCreate();
}
    setIsCreatingVariant(false);
    setError(null);
  };

  return (
    <div className="h-full bg-white border rounded-lg flex flex-col">
      <div className="p-3 border-b flex items-center justify-between">
        <h3 className="text-sm font-medium">Variants</h3>
        <button
          onClick={handleCreateVariant}
          disabled={isCreatingVariant || experiment.variants.length >= MAX_VARIANTS}
          className="px-2 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 
                   flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4 mr-1" />
          New Variant
        </button>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {showTrafficWarning && (
          <Alert 
            type="warning"
            message="Total traffic allocation cannot exceed 100%"
          />
        )}

        {error && (
          <Alert 
            type="error"
            message={error}
          />
        )}

        <div className="space-y-3">
          {experiment.variants.map((variant) => {
            const errors = validateVariant(variant);
            const isInvalid = errors.length > 0 && variant.id !== 'control';
            const isControl = variant.id === 'control';

            return (
              <div
                key={variant.id}
                className={`border rounded-lg p-3 ${
                  isControl ? 'bg-gray-50' :
                  isInvalid ? 'border-red-200 bg-red-50' : 
                  'hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {isControl ? (
                      <Lock className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Beaker className="w-4 h-4 text-gray-400" />
                    )}
                    <input
                      type="text"
                      value={variant.name}
                      onChange={(e) => handleVariantNameChange(e, variant)}
                      placeholder="Enter variant name"
                      disabled={isControl}
                      className={`text-sm font-medium bg-transparent border-b 
                        ${!variant.name.trim() && !isControl ? 'border-red-300' : 'border-transparent'}
                        ${isControl ? 'cursor-not-allowed' : 'focus:border-blue-300'}
                        focus:outline-none
                      `}
                      aria-invalid={!variant.name.trim() && !isControl}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    {!isControl && (
                      <>
                        <button
                          onClick={() => handleStatusToggle(variant)}
                          disabled={isInvalid}
                          className={`p-1 rounded ${
                            variant.status === 'active'
                              ? 'text-green-600 hover:bg-green-50'
                              : 'text-gray-400 hover:bg-gray-100'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {variant.status === 'active' ? (
                            <Pause className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => onVariantDelete(variant.id)}
                          className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">
                      Traffic Allocation
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="range"
                        min={MIN_TRAFFIC_PER_VARIANT}
                        max="100"
                        value={variant.traffic}
                        onChange={(e) => handleTrafficChange(variant, parseInt(e.target.value))}
                        disabled={isControl}
                        className="flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <span className="text-sm text-gray-600 w-12">{variant.traffic}%</span>
                    </div>
                  </div>

                  {variant.status === 'active' && (
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center">
                        <BarChart2 className="w-3 h-3 mr-1" />
                        <span>Views: {variant.views?.toLocaleString() || 0}</span>
                      </div>
                      <div>
                        Conversions: {variant.conversions?.toLocaleString() || 0} 
                        {variant.conversionRate ? ` (${variant.conversionRate}%)` : ' (0.00%)'}
                      </div>
                    </div>
                  )}

                  {isInvalid && (
                    <div className="text-xs text-red-600 mt-2">
                      {errors.map((error, i) => (
                        <div key={i}>{error}</div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default VariantManager;