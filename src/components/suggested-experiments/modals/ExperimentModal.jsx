import React, { useState } from 'react';
import { X } from 'lucide-react';
import ExperimentDetails from '@/components/suggested-experiments/components/ExperimentDetails';
import Modal from '@/components/suggested-experiments/components/Modal';
import { SegmentBehaviorComparison } from '@/components/shared/analysis/analysis.index';

const ExperimentModal = ({ isOpen, onClose, experiment, onStartExperiment }) => {
  const [showAnalysis, setShowAnalysis] = useState(false);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={`flex transition-all duration-300 ease-in-out ${showAnalysis ? 'w-full max-w-6xl' : 'w-full max-w-4xl'}`}>
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <ExperimentDetails 
            experiment={experiment} 
            onClose={onClose}
            onStartExperiment={onStartExperiment}
            showAnalysis={showAnalysis}
            onToggleAnalysis={() => setShowAnalysis(!showAnalysis)}
          />
        </div>

        {/* Analysis Panel */}
        {showAnalysis && (
          <div className="w-[500px] border-l border-gray-200 bg-gray-50">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">Behavior Analysis</h2>
                <button
                  onClick={() => setShowAnalysis(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(100vh-200px)]">
              <SegmentBehaviorComparison experiment={experiment} />
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ExperimentModal;