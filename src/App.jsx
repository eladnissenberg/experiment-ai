import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./components/dashboard/Dashboard";
import ExperimentManagement from "./components/experiments/management/ExperimentManagement";
import Analytics from "./components/analytics/Analytics";
import SuggestedExperiments from "./components/suggested-experiments/SuggestedExperiments";
import OnboardingFlow from "./components/onboarding/OnboardingFlow";
import VisualEditor from "./components/experiments/editor/VisualEditor";
import VisualEditorTestimonials from "./components/experiments/editor-testimonials/VisualEditorTestimonials";
import AdvancedEditor from "./components/experiments/advanced_editor/AdvancedEditor";

// Initial variant configurations
const CONTROL_VARIANT = {
  id: 'control',
  name: 'Original Website',
  elements: [],
  traffic: 50,
  status: 'active',
  views: 0,
  conversions: 0,
  conversionRate: '0.00'
};

const TEST_VARIANT = {
  id: 'test-variant-1',
  name: 'Blue Heading Test',
  elements: [
    {
      id: 'test-element-1',
      selector: 'h1',
      originalStyles: {},
      variantStyles: {
        color: '#4A90E2',
        fontWeight: 'bold'
      }
    }
  ],
  traffic: 50,
  status: 'active',
  views: 0,
  conversions: 0,
  conversionRate: '0.00'
};

// Initial experiment configuration
const INITIAL_EXPERIMENT = {
  id: 'test-123',
  name: 'Homepage Heading Test',
  description: 'Testing blue heading color for better visibility',
  targetURL: 'http://www.supporteam.io',
  variants: [CONTROL_VARIANT, TEST_VARIANT],
  schedule: {
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
  },
  status: 'draft',
  metrics: {
    primary: 'conversion_rate',
    secondary: ['click_rate', 'time_on_page']
  },
  targeting: {
    device: 'all',
    browser: 'all',
    location: 'all'
  }
};

function App() {
  console.log('Initializing App with experiment config:', INITIAL_EXPERIMENT);

  return (
    <Router>
      <Routes>
        <Route path="/onboarding" element={<OnboardingFlow />} />
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          
          <Route path="dashboard" element={<Dashboard />} />
          
          <Route path="experiments" element={<ExperimentManagement />} />
          
          <Route path="suggested-experiments" element={<SuggestedExperiments />} />
          
          <Route path="analytics" element={<Analytics />} />
          
          <Route path="experiments/editor" element={<VisualEditor />} />
          
          <Route 
            path="experiments/editor-testimonials" 
            element={<VisualEditorTestimonials />} 
          />
          
          <Route 
            path="experiments/advanced-editor" 
            element={
              <AdvancedEditor
                experimentId={INITIAL_EXPERIMENT.id}
                initialConfig={INITIAL_EXPERIMENT}
              />
            } 
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;