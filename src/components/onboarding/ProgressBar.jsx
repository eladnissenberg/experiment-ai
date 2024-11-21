// File: C:\Users\eladn\Desktop\Bussiness\Initiatives\Benji\app3\src\components\onboarding\ProgressBar.jsx

import React from 'react';
import { CheckCircle } from 'lucide-react';

const STEP_LABELS = [
  'Welcome',
  'Company Details',
  'Role & Team',
  'Integrations',
  'Summary'
];

const ProgressBar = ({ currentStep, totalSteps }) => {
  return (
    <div className="mb-8">
      <div className="relative">
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-gray-100">
          <div
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600 transition-all duration-500 ease-in-out"
          />
        </div>
        <div className="flex justify-between">
          {STEP_LABELS.map((label, index) => (
            <div
              key={label}
              className={`flex flex-col items-center ${
                index === currentStep
                  ? 'text-blue-600'
                  : index < currentStep
                  ? 'text-green-600'
                  : 'text-gray-400'
              }`}
            >
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 mb-2 transition-all duration-200 ${
                  index === currentStep
                    ? 'border-blue-600 bg-blue-50'
                    : index < currentStep
                    ? 'border-green-600 bg-green-50'
                    : 'border-gray-300 bg-white'
                }`}
              >
                {index < currentStep ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <span className="text-sm">{index + 1}</span>
                )}
              </div>
              <span className="text-xs font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;