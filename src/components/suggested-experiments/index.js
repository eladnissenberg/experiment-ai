// File path: /src/components/suggested-experiments/index.js

// Import the components first
import SuggestedExperiments from './SuggestedExperiments';
import ExperimentCard from './cards/ExperimentCard';
import AiInsights from './insights/AiInsights';
import SmartBundles from './insights/SmartBundles';
import ProgressChart from './charts/ProgressChart';
import ImpactChart from './charts/ImpactChart';
import FilterBar from './filters/FilterBar';
import SortOptions from './filters/SortOptions';

// Then export them
export { 
    ExperimentCard,
    AiInsights,
    SmartBundles,
    ProgressChart,
    ImpactChart,
    FilterBar,
    SortOptions
};

// Default export should be separate
export default SuggestedExperiments;