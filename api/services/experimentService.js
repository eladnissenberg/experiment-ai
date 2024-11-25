const experiments = new Map();

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

const defaultExperiments = [
  {
    id: "suggested-1",
    title: "Localized Social Proof for Hesitant Regions",
    description: "Test region-specific social proof messaging for visitors from Texas and Florida",
    priority: "high",
    successProbability: 85,
    upliftPotential: "10-15%",
    timeToImplement: "1-2 weeks",
    stage: "proposed",
    status: "proposed",
    targetURL: "www.supporteam.io",
    insight: "Users from Texas and Florida have a 25% lower conversion rate compared to the national average.",
    hypothesis: "This Segment tends to prioritize trust and reassurance when making decisions. By incorporating region-specific social proof (e.g., 'Trusted by 1,000+ customers in Texas'), we can address their need for familiarity and increase their likelihood of converting",
    recommendation: "Test implementing localized customer counts, testimonials, or specific regional data for users in Texas and Florida to create a more personalized and confidence-boosting experience",
    expectedOutcome: "+10-15% lift in conversion rates for first-time visitors, especially from regions with strong brand loyalty or community identity.",
    optimizationType: OPTIMIZATION_TYPES.TRUST,
    device: DEVICE_TYPES.ALL,
    variants: [
      {
        id: 'control',
        name: 'Standard Social Proof',
        description: 'Current generic social proof messaging',
        traffic: 33.33,
        isControl: true,
        styles: {}
      },
      {
        id: 'variant-a',
        name: 'Texas-Specific Social Proof',
        description: 'Localized messaging for Texas visitors',
        traffic: 33.33,
        styles: {
          testimonialSource: "Texas",
          messageTemplate: "Trusted by {count}+ Texas businesses"
        }
      },
      {
        id: 'variant-b',
        name: 'Florida-Specific Social Proof',
        description: 'Localized messaging for Florida visitors',
        traffic: 33.33,
        styles: {
          testimonialSource: "Florida",
          messageTemplate: "Trusted by {count}+ Florida businesses"
        }
      }
    ],
    startDate: new Date().toISOString(),
    confidence: 85,
    traffic: 50,
    duration: {
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    metrics: {
      primary: "conversion",
      secondary: ["engagement"]
    },
    audience: {
      targeting: "first_time_visitors",
      percentage: 50
    },
    results: {
      visitors: 0,
      conversions: 0,
      variantVisitors: 0,
      variantConversions: 0,
      controlConversionRate: 0,
      variantConversionRate: 0,
      improvement: 0
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
},
{
    id: "suggested-2",
    title: "Dynamic Urgency for High Cart Value Users",
    description: "Implement dynamic stock indicators for high-value carts",
    priority: "high",
    successProbability: 78,
    upliftPotential: "12%",
    timeToImplement: "2-3 weeks",
    stage: "proposed",
    status: "proposed",
    targetURL: "www.supporteam.io/checkout",
    insight: "Users with high cart values (over $200) often abandon their carts more frequently than those with lower cart values. Behavioral data suggests that they may hesitate due to the larger financial commitment.",
    hypothesis: "Implementing a dynamic urgency indicator (e.g., 'Only 3 items left in stock') for users with high cart values will encourage them to complete their purchase by reducing hesitation and creating a sense of urgency.",
    recommendation: "Test adding a subtle but impactful 'low stock' message next to high-value items in the cart, dynamically triggered for users whose total cart value exceeds a certain threshold.",
    expectedOutcome: "+12% increase in checkout completion rates for high-value carts, as users are nudged toward faster decision-making without feeling pressured.",
    optimizationType: OPTIMIZATION_TYPES.CONTENT,
    device: DEVICE_TYPES.ALL,
    variants: [
      {
        id: 'control',
        name: 'Standard Cart Display',
        description: 'Current cart display without urgency indicators',
        traffic: 25,
        isControl: true,
        styles: {}
      },
      {
        id: 'variant-a',
        name: 'Stock Level Indicator',
        description: 'Shows remaining stock levels for cart items',
        traffic: 25,
        styles: {
          color: "#27AE60",
          messageType: "stock_count",
          template: "Only {count} left in stock"
        }
      },
      {
        id: 'variant-b',
        name: 'Time-Based Urgency',
        description: 'Shows time-sensitive messaging',
        traffic: 25,
        styles: {
          color: "#27AE60",
          messageType: "time_based",
          template: "Order within {time} for next-day delivery"
        }
      },
      {
        id: 'variant-c',
        name: 'Combined Indicator',
        description: 'Shows both stock and time-based messaging',
        traffic: 25,
        styles: {
          color: "#27AE60",
          messageType: "combined",
          stockTemplate: "Only {count} left",
          timeTemplate: "Order soon for next-day delivery"
        }
      }
    ],
    startDate: new Date().toISOString(),
    confidence: 78,
    traffic: 50,
    duration: {
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
    },
    metrics: {
      primary: "cart_completion",
      secondary: ["average_order_value"]
    },
    audience: {
      targeting: "high_value_carts",
      percentage: 50
    },
    results: {
      visitors: 0,
      conversions: 0,
      variantVisitors: 0,
      variantConversions: 0,
      controlConversionRate: 0,
      variantConversionRate: 0,
      improvement: 0
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
},
{
  id: "suggested-3",
  title: "Customized Value Propositions for Mobile Users",
  description: "Optimize product information display for mobile users",
  priority: "high",
  successProbability: 82,
  upliftPotential: "15%",
  timeToImplement: "2-4 weeks",
  stage: "proposed",
  status: "proposed",
  targetURL: "www.supporteam.io/products",
  insight: "Mobile users have a lower engagement rate with detailed product descriptions compared to desktop users, often scrolling past key value points. This suggests they may prefer more concise, visually engaging content.",
  hypothesis: "Displaying simplified, visual-based value propositions (e.g., icons with short descriptions) on mobile product pages will improve engagement and reduce bounce rates by catering to mobile browsing behaviors.",
  recommendation: "Test replacing lengthy product descriptions with a quick, icon-based summary on mobile, focusing on the top three benefits or features, with an option to 'read more' for details.",
  expectedOutcome: "+15% increase in engagement and +8% decrease in bounce rates on mobile, as users are able to quickly absorb product information in a format that suits mobile browsing.",
  optimizationType: OPTIMIZATION_TYPES.LAYOUT,
  device: DEVICE_TYPES.MOBILE,
  variants: [
    {
      id: 'control',
      name: 'Standard Mobile Layout',
      description: 'Current product description layout',
      traffic: 33.33,
      isControl: true,
      styles: {}
    },
    {
      id: 'variant-a',
      name: 'Icon-Based Summary',
      description: 'Key features displayed with icons',
      traffic: 33.33,
      styles: {
        displayType: "icon_summary",
        iconColor: "#9B51E0",
        maxFeatures: 3,
        showExpandOption: true
      }
    },
    {
      id: 'variant-b',
      name: 'Progressive Disclosure',
      description: 'Expandable sections with visual indicators',
      traffic: 33.33,
      styles: {
        displayType: "accordion",
        accentColor: "#9B51E0",
        defaultExpanded: false,
        animationType: "smooth"
      }
    }
  ],
  startDate: new Date().toISOString(),
  confidence: 82,
  traffic: 50,
  duration: {
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString()
  },
  metrics: {
    primary: "engagement",
    secondary: ["bounce_rate", "time_on_page"]
  },
  audience: {
    targeting: "mobile_users",
    percentage: 50
  },
  results: {
    visitors: 0,
    conversions: 0,
    variantVisitors: 0,
    variantConversions: 0,
    controlConversionRate: 0,
    variantConversionRate: 0,
    improvement: 0
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
},
{
  id: "suggested-4",
  title: "Prioritize Social Proof for First-Time Users",
  description: "Swap the order of the homepage folds to display testimonials earlier",
  priority: "high",
  successProbability: 85,
  upliftPotential: "10-15%",
  timeToImplement: "1-2 weeks",
  stage: "running",
  status: "running",
  targetURL: "www.supporteam.io/homepage",
  insight: "Users who reached the third homepage fold (Testimonials) converted 627% more than those who stopped at the second fold (Product Overview). However, only 18% scrolled that far.",
  hypothesis: "Displaying testimonials earlier will increase conversions by exposing users to social proof sooner.",
  recommendation: "Swap the order of the folds: Testimonials first, Product Overview second.",
  expectedOutcome: "+10-15% lift in conversion rates for first-time visitors.",
  optimizationType: OPTIMIZATION_TYPES.LAYOUT,
  device: DEVICE_TYPES.ALL,
  variants: [
    {
      id: 'control',
      name: 'Standard Layout',
      description: 'Current homepage fold order (Product Overview first)',
      traffic: 50,
      isControl: true,
      styles: {
        layoutOrder: "productFirst",
        sections: ["hero", "features", "testimonials", "pricing"]
      }
    },
    {
      id: 'variant-a',
      name: 'Testimonials-First Layout',
      description: 'Modified layout with testimonials above product overview',
      traffic: 50,
      styles: {
        layoutOrder: "testimonialsFirst",
        sections: ["hero", "testimonials", "features", "pricing"]
      }
    }
  ],
  startDate: new Date().toISOString(),
  confidence: 85,
  traffic: 50,
  duration: {
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  metrics: {
    primary: "conversion_rate",
    secondary: ["engagement"]
  },
  audience: {
    targeting: "first_time_visitors",
    percentage: 50
  },
  results: {
    visitors: 1250,
    conversions: 175,
    variantVisitors: 625,
    variantConversions: 100,
    controlConversionRate: 12.0,
    variantConversionRate: 16.0,
    improvement: 33.3
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
},
{
  id: "suggested-5",
  title: "Improve Header CTA Click-Through Rate",
  description: "Enlarge the header's CTA button to increase visibility",
  priority: "medium",
  successProbability: 75,
  upliftPotential: "5%",
  timeToImplement: "1 week",
  stage: "running",
  status: "running",
  targetURL: "www.supporteam.io",
  insight: "The header's CTA click-through rate is below the industry benchmark, and the button size is smaller compared to most websites in the same space.",
  hypothesis: "Enlarging the header's CTA will make it more noticeable, increasing the click-through rate and ultimately driving higher conversions.",
  recommendation: "Increase the size of the header's CTA button.",
  expectedOutcome: "+5% lift in conversion rate.",
  optimizationType: OPTIMIZATION_TYPES.VISUAL_DESIGN,
  device: DEVICE_TYPES.ALL,
  variants: [
    {
      id: 'control',
      name: 'Current CTA Size',
      description: 'Existing header CTA button size',
      traffic: 33.33,
      isControl: true,
      styles: {
        ctaSize: "small",
        padding: "8px 16px",
        fontSize: "14px"
      }
    },
    {
      id: 'variant-a',
      name: 'Medium CTA',
      description: 'Moderately enlarged CTA button',
      traffic: 33.33,
      styles: {
        ctaSize: "medium",
        padding: "12px 24px",
        fontSize: "16px"
      }
    },
    {
      id: 'variant-b',
      name: 'Large CTA',
      description: 'Significantly enlarged CTA button',
      traffic: 33.33,
      styles: {
        ctaSize: "large",
        padding: "16px 32px",
        fontSize: "18px"
      }
    }
  ],
  startDate: new Date().toISOString(),
  confidence: 75,
  traffic: 50,
  duration: {
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
  },
  metrics: {
    primary: "cta_click_rate",
    secondary: ["conversion_rate"]
  },
  audience: {
    targeting: "all_visitors",
    percentage: 50
  },
  results: {
    visitors: 2500,
    conversions: 225,
    variantVisitors: 1250,
    variantConversions: 125,
    controlConversionRate: 8.0,
    variantConversionRate: 10.0,
    improvement: 25.0
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
},
{
  id: "suggested-6",
  title: "Anchor Link Hero Section Testimonials",
  description: "Add an anchor link from the hero section testimonials to the detailed testimonials section",
  priority: "medium",
  successProbability: 70,
  upliftPotential: "4%",
  timeToImplement: "1 week",
  stage: "proposed",
  status: "proposed",
  targetURL: "www.supporteam.io",
  insight: "Data shows that 12% of your visitors attempt to click the testimonials container in the hero section, but it currently lacks any functionality.",
  hypothesis: "Adding an anchor link will create a smoother user experience, increasing engagement and improving the conversion rate.",
  recommendation: "Implement an anchor link that connects the testimonials in the hero section to the detailed testimonials section.",
  expectedOutcome: "+4% lift in conversion rate.",
  optimizationType: OPTIMIZATION_TYPES.NAVIGATION,
  device: DEVICE_TYPES.ALL,
  variants: [
    {
      id: 'control',
      name: 'Standard Testimonials',
      description: 'Current non-clickable testimonials in hero section',
      traffic: 50,
      isControl: true,
      styles: {
        heroTestimonialsClickable: false,
        displayType: "static",
        cursor: "default"
      }
    },
    {
      id: 'variant-a',
      name: 'Clickable Testimonials',
      description: 'Testimonials with smooth scroll anchor functionality',
      traffic: 50,
      styles: {
        heroTestimonialsClickable: true,
        displayType: "interactive",
        cursor: "pointer",
        scrollBehavior: "smooth",
        anchorOffset: "-80px", // Accounts for fixed header
        hoverEffect: {
          scale: 1.02,
          transition: "all 0.2s ease"
        }
      }
    }
  ],
  startDate: new Date().toISOString(),
  confidence: 70,
  traffic: 50,
  duration: {
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  metrics: {
    primary: "engagement",
    secondary: ["conversion_rate"]
  },
  audience: {
    targeting: "all_visitors",
    percentage: 50
  },
  results: {
    visitors: 0,
    conversions: 0,
    variantVisitors: 0,
    variantConversions: 0,
    controlConversionRate: 0,
    variantConversionRate: 0,
    improvement: 0
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
},
  {
    id: "suggested-7",
    title: "Reduce Container Height on Mobile",
    description: "Narrow the height of containers on mobile to reduce scrolling",
    priority: "medium",
    successProbability: 65,
    upliftPotential: "3-5%",
    timeToImplement: "1-2 weeks",
    stage: "proposed",
    status: "proposed",
    targetURL: "www.supporteam.io",
    insight: "Mobile users tend to drop off due to excessive scrolling required to view content.",
    hypothesis: "Reducing container heights on mobile will decrease scrolling fatigue, increasing engagement.",
    recommendation: "Adjust mobile styles to reduce container heights and optimize content layout.",
    expectedOutcome: "+3-5% increase in engagement metrics.",
    optimizationType: OPTIMIZATION_TYPES.LAYOUT,
    device: DEVICE_TYPES.MOBILE,
    variations: {
      control: { mobileContainerHeight: "standard" },
      variant: { mobileContainerHeight: "reduced" }
    },
    startDate: new Date().toISOString(),
    confidence: 65,
    traffic: 50,
    duration: {
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
    },
    metrics: {
      primary: "engagement",
      secondary: ["bounce_rate"]
    },
    audience: {
      targeting: "mobile_users",
      percentage: 50
    },
    results: {
      visitors: 0,
      conversions: 0,
      variantVisitors: 0,
      variantConversions: 0,
      controlConversionRate: 0,
      variantConversionRate: 0,
      improvement: 0
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "suggested-8",
    title: "Optimize Header CTA Text",
    description: "Align CTA text with industry best practices to increase click-through rate",
    priority: "medium",
    successProbability: 68,
    upliftPotential: "4%",
    timeToImplement: "1 week",
    stage: "proposed",
    status: "proposed",
    targetURL: "www.supporteam.io",
    insight: "Current header CTA text may not be as compelling as industry standards.",
    hypothesis: "Updating the CTA text to match proven phrases will increase click-through rates.",
    recommendation: "Change header CTA text to a high-converting phrase common in the industry.",
    expectedOutcome: "+4% increase in CTA click-through rate.",
    optimizationType: OPTIMIZATION_TYPES.CONTENT,
    device: DEVICE_TYPES.ALL,
    variations: {
      control: { ctaText: "Learn More" },
      variant: { ctaText: "Get Started Now" }
    },
    startDate: new Date().toISOString(),
    confidence: 68,
    traffic: 50,
    duration: {
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    metrics: {
      primary: "cta_click_rate",
      secondary: ["conversion_rate"]
    },
    audience: {
      targeting: "all_visitors",
      percentage: 50
    },
    results: {
      visitors: 0,
      conversions: 0,
      variantVisitors: 0,
      variantConversions: 0,
      controlConversionRate: 0,
      variantConversionRate: 0,
      improvement: 0
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "suggested-9",
    title: "Increase Font Size for Older Visitors",
    description: "Increase font size for users over 60 years old to reduce bounce rate",
    priority: "medium",
    successProbability: 70,
    upliftPotential: "5%",
    timeToImplement: "1-2 weeks",
    stage: "proposed",
    status: "proposed",
    targetURL: "www.supporteam.io",
    insight: "Users over 60 years old have a 40% higher bounce rate than the general population.",
    hypothesis: "Increasing font size for older users will improve readability, reducing bounce rates.",
    recommendation: "Implement larger font sizes for users identified as over 60 years old.",
    expectedOutcome: "+5% decrease in bounce rate among older visitors.",
    optimizationType: OPTIMIZATION_TYPES.VISUAL_DESIGN,
    device: DEVICE_TYPES.ALL,
    variations: {
      control: { fontSize: "standard" },
      variant: { fontSize: "large" }
    },
    startDate: new Date().toISOString(),
    confidence: 70,
    traffic: 50,
    duration: {
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString()
    },
    metrics: {
      primary: "bounce_rate",
      secondary: ["engagement"]
    },
    audience: {
      targeting: "age_over_60",
      percentage: 50
    },
    results: {
      visitors: 0,
      conversions: 0,
      variantVisitors: 0,
      variantConversions: 0,
      controlConversionRate: 0,
      variantConversionRate: 0,
      improvement: 0
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "suggested-10",
    title: "Implement Sticky Navigation Bar",
    description: "Make the navigation bar sticky to keep CTA visible during scrolling",
    priority: "medium",
    successProbability: 72,
    upliftPotential: "3%",
    timeToImplement: "1 week",
    stage: "proposed",
    status: "proposed",
    targetURL: "www.supporteam.io",
    insight: "Users often scroll past the header CTA, reducing its visibility and click-through rate.",
    hypothesis: "A sticky navbar will keep the CTA consistently visible, increasing click-through rates.",
    recommendation: "Implement a sticky navigation bar that remains at the top during scrolling.",
    expectedOutcome: "+3% increase in CTA click-through rate.",
    optimizationType: OPTIMIZATION_TYPES.NAVIGATION,
    device: DEVICE_TYPES.ALL,
    variations: {
      control: { navbarSticky: false },
      variant: { navbarSticky: true }
    },
    startDate: new Date().toISOString(),
    confidence: 72,
    traffic: 50,
    duration: {
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    metrics: {
      primary: "cta_click_rate",
      secondary: ["engagement"]
    },
    audience: {
      targeting: "all_visitors",
      percentage: 50
    },
    results: {
      visitors: 0,
      conversions: 0,
      variantVisitors: 0,
      variantConversions: 0,
      controlConversionRate: 0,
      variantConversionRate: 0,
      improvement: 0
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
    {
      id: "suggested-11",
      title: "Exit-Intent Survey for Mobile Visitors",
      description: "Display targeted survey when mobile users show exit intent",
      priority: "high",
      successProbability: 83,
      upliftPotential: "8-12%",
      timeToImplement: "2-3 weeks",
      stage: "proposed",
      status: "proposed",
      targetURL: "www.supporteam.io/mobile",
      insight: "Mobile users have a 45% higher bounce rate than desktop users, with no clear understanding of why they're leaving.",
      hypothesis: "Capturing feedback through a non-intrusive exit survey will help identify pain points and provide valuable data for future optimizations.",
      recommendation: "Implement a simple one-question survey when mobile users show exit intent (scroll up quickly or navigate away).",
      expectedOutcome: "Gather actionable feedback from 15% of exiting mobile users and identify top 3 exit reasons.",
      optimizationType: OPTIMIZATION_TYPES.USER_RESEARCH,
      device: DEVICE_TYPES.MOBILE,
      variations: {
        control: { exitSurvey: false },
        variant: { exitSurvey: true }
      },
      startDate: new Date().toISOString(),
      confidence: 83,
      traffic: 50,
      duration: {
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
      },
      metrics: {
        primary: "survey_completion",
        secondary: ["bounce_rate"]
      },
      audience: {
        targeting: "mobile_users",
        percentage: 50
      },
      results: {
        visitors: 0,
        conversions: 0,
        variantVisitors: 0,
        variantConversions: 0,
        controlConversionRate: 0,
        variantConversionRate: 0,
        improvement: 0
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "suggested-12",
      title: "Price Anchor Optimization",
      description: "Test different price anchor positions in pricing tables",
      priority: "high",
      successProbability: 88,
      upliftPotential: "15-20%",
      timeToImplement: "1 week",
      stage: "proposed",
      status: "proposed",
      targetURL: "www.supporteam.io/pricing",
      insight: "Currently, the most expensive plan is positioned last, potentially reducing its anchoring effect on mid-tier plan selection.",
      hypothesis: "Positioning the premium plan first will create a stronger price anchoring effect, making the mid-tier plan appear more attractive.",
      recommendation: "Reorder pricing table to show Premium > Pro > Basic instead of current Basic > Pro > Premium layout.",
      expectedOutcome: "+15-20% increase in mid-tier plan selection rate.",
      optimizationType: OPTIMIZATION_TYPES.PRICING,
      device: DEVICE_TYPES.ALL,
      variations: {
        control: { pricingOrder: "ascending" },
        variant: { pricingOrder: "descending" }
      },
      startDate: new Date().toISOString(),
      confidence: 88,
      traffic: 50,
      duration: {
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString()
      },
      metrics: {
        primary: "plan_selection_rate",
        secondary: ["average_order_value"]
      },
      audience: {
        targeting: "pricing_page_visitors",
        percentage: 50
      },
      results: {
        visitors: 0,
        conversions: 0,
        variantVisitors: 0,
        variantConversions: 0,
        controlConversionRate: 0,
        variantConversionRate: 0,
        improvement: 0
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "suggested-13",
      title: "Feature Discovery Through Interactive Tour",
      description: "Implement guided product tour for first-time users",
      priority: "high",
      successProbability: 85,
      upliftPotential: "12-16%",
      timeToImplement: "3-4 weeks",
      stage: "proposed",
      status: "proposed",
      targetURL: "www.supporteam.io/dashboard",
      insight: "Only 35% of new users discover key features within their first session, leading to lower perceived value and higher churn.",
      hypothesis: "An interactive product tour will increase feature discovery and user engagement during the crucial first session.",
      recommendation: "Create a 3-step guided tour highlighting the most valuable features for new users.",
      expectedOutcome: "+12-16% increase in feature adoption rates among new users.",
      optimizationType: OPTIMIZATION_TYPES.ONBOARDING,
      device: DEVICE_TYPES.ALL,
      variations: {
        control: { productTour: false },
        variant: { productTour: true }
      },
      startDate: new Date().toISOString(),
      confidence: 85,
      traffic: 50,
      duration: {
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString()
      },
      metrics: {
        primary: "feature_discovery_rate",
        secondary: ["time_to_value", "retention"]
      },
      audience: {
        targeting: "new_users",
        percentage: 50
      },
      results: {
        visitors: 0,
        conversions: 0,
        variantVisitors: 0,
        variantConversions: 0,
        controlConversionRate: 0,
        variantConversionRate: 0,
        improvement: 0
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "suggested-14",
      title: "AI-Powered Feature Recommendations",
      description: "Show personalized feature suggestions based on user behavior",
      priority: "high",
      successProbability: 86,
      upliftPotential: "18-22%",
      timeToImplement: "4-5 weeks",
      stage: "proposed",
      status: "proposed",
      targetURL: "www.supporteam.io/dashboard",
      insight: "Users who discover features relevant to their use case have 3x higher retention rates.",
      hypothesis: "Using AI to suggest relevant features based on user behavior will increase feature adoption and retention.",
      recommendation: "Implement an AI system that analyzes user behavior and suggests relevant features through in-app notifications.",
      expectedOutcome: "+18-22% increase in feature adoption and +15% in user retention.",
      optimizationType: OPTIMIZATION_TYPES.PERSONALIZATION,
      device: DEVICE_TYPES.ALL,
      variations: {
        control: { aiRecommendations: false },
        variant: { aiRecommendations: true }
      },
      startDate: new Date().toISOString(),
      confidence: 86,
      traffic: 50,
      duration: {
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      metrics: {
        primary: "feature_adoption",
        secondary: ["user_retention", "engagement"]
      },
      audience: {
        targeting: "active_users",
        percentage: 50
      },
      results: {
        visitors: 0,
        conversions: 0,
        variantVisitors: 0,
        variantConversions: 0,
        controlConversionRate: 0,
        variantConversionRate: 0,
        improvement: 0
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "suggested-15",
      title: "Progressive Feature Disclosure",
      description: "Gradually introduce advanced features based on user proficiency",
      priority: "high",
      successProbability: 82,
      upliftPotential: "14-16%",
      timeToImplement: "3 weeks",
      stage: "proposed",
      status: "proposed",
      targetURL: "www.supporteam.io/app",
      insight: "New users often feel overwhelmed by the full feature set, leading to analysis paralysis.",
      hypothesis: "Progressive feature disclosure will reduce cognitive load and improve feature adoption rates.",
      recommendation: "Implement a tiered feature revelation system based on user experience level and usage patterns.",
      expectedOutcome: "+14-16% increase in feature adoption and -25% in user reported confusion.",
      optimizationType: OPTIMIZATION_TYPES.UX,
      device: DEVICE_TYPES.ALL,
      variations: {
        control: { progressiveDisclosure: false },
        variant: { progressiveDisclosure: true }
      },
      startDate: new Date().toISOString(),
      confidence: 82,
      traffic: 50,
      duration: {
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString()
      },
      metrics: {
        primary: "feature_adoption",
        secondary: ["user_satisfaction", "time_to_value"]
      },
      audience: {
        targeting: "new_users",
        percentage: 50
      },
      results: {
        visitors: 0,
        conversions: 0,
        variantVisitors: 0,
        variantConversions: 0,
        controlConversionRate: 0,
        variantConversionRate: 0,
        improvement: 0
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "suggested-16",
      title: "Contextual Help Triggers",
      description: "Display help content based on user's current activity",
      priority: "medium",
      successProbability: 78,
      upliftPotential: "10-12%",
      timeToImplement: "2 weeks",
      stage: "proposed",
      status: "proposed",
      targetURL: "www.supporteam.io/app/*",
      insight: "Users often abandon tasks when encountering complexity, rather than seeking help.",
      hypothesis: "Proactively offering contextual help will reduce task abandonment and increase completion rates.",
      recommendation: "Implement smart help triggers that appear based on user behavior and current context.",
      expectedOutcome: "+10-12% increase in task completion rates and -20% in support tickets.",
      optimizationType: OPTIMIZATION_TYPES.USER_ASSISTANCE,
      device: DEVICE_TYPES.ALL,
      variations: {
        control: { contextualHelp: false },
        variant: { contextualHelp: true }
      },
      startDate: new Date().toISOString(),
      confidence: 78,
      traffic: 50,
      duration: {
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
      },
      metrics: {
        primary: "task_completion",
        secondary: ["support_tickets", "user_satisfaction"]
      },
      audience: {
        targeting: "all_users",
        percentage: 50
      },
      results: {
        visitors: 0,
        conversions: 0,
        variantVisitors: 0,
        variantConversions: 0,
        controlConversionRate: 0,
        variantConversionRate: 0,
        improvement: 0
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "suggested-17",
      title: "Social Proof Notification Timing",
      description: "Optimize timing of social proof notifications",
      priority: "medium",
      successProbability: 75,
      upliftPotential: "8-10%",
      timeToImplement: "1 week",
      stage: "proposed",
      status: "proposed",
      targetURL: "www.supporteam.io",
      insight: "Current social proof notifications show immediately, potentially distracting from primary CTAs.",
      hypothesis: "Delaying social proof notifications by 5 seconds will improve their effectiveness without hampering main conversions.",
      recommendation: "Implement a 5-second delay before showing social proof notifications to new visitors.",
      expectedOutcome: "+8-10% increase in notification engagement without impacting primary CTA clicks.",
      optimizationType: OPTIMIZATION_TYPES.TIMING,
      device: DEVICE_TYPES.ALL,
      variations: {
        control: { notificationDelay: 0 },
        variant: { notificationDelay: 5000 }
      },
      startDate: new Date().toISOString(),
      confidence: 75,
      traffic: 50,
      duration: {
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
      },
      metrics: {
        primary: "notification_engagement",
        secondary: ["primary_cta_clicks", "bounce_rate"]
      },
      audience: {
        targeting: "new_visitors",
        percentage: 50
      },
      results: {
        visitors: 0,
        conversions: 0,
        variantVisitors: 0,
        variantConversions: 0,
        controlConversionRate: 0,
        variantConversionRate: 0,
        improvement: 0
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
      {
        id: "suggested-18",
        title: "Seasonal Pricing Display",
        description: "Show time-limited seasonal discounts to increase conversions",
        priority: "high",
        successProbability: 84,
        upliftPotential: "20-25%",
        timeToImplement: "2 weeks",
        stage: "proposed",
        status: "proposed",
        targetURL: "www.supporteam.io/pricing",
        insight: "Historical data shows 40% higher conversion rates during promotional periods.",
        hypothesis: "Displaying seasonal pricing with clear time limitations will create urgency and boost conversions.",
        recommendation: "Implement seasonal pricing display with countdown timers and savings highlights.",
        expectedOutcome: "+20-25% increase in conversion rate during promotional periods.",
        optimizationType: OPTIMIZATION_TYPES.PRICING,
        device: DEVICE_TYPES.ALL,
        variations: {
          control: { seasonalPricing: false },
          variant: { seasonalPricing: true }
        },
        startDate: new Date().toISOString(),
        confidence: 84,
        traffic: 50,
        duration: {
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
        },
        metrics: {
          primary: "conversion_rate",
          secondary: ["average_order_value", "revenue_per_visitor"]
        },
        audience: {
          targeting: "all_visitors",
          percentage: 50
        },
        results: {
          visitors: 0,
          conversions: 0,
          variantVisitors: 0,
          variantConversions: 0,
          controlConversionRate: 0,
          variantConversionRate: 0,
          improvement: 0
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "suggested-19",
        title: "Enterprise Lead Form Optimization",
        description: "Reduce form fields for enterprise leads to increase submission rate",
        priority: "high",
        successProbability: 87,
        upliftPotential: "15-18%",
        timeToImplement: "1 week",
        stage: "proposed",
        status: "proposed",
        targetURL: "www.supporteam.io/enterprise",
        insight: "Enterprise lead form completion rate is 35% lower than industry standard due to form length.",
        hypothesis: "Reducing required fields and implementing progressive profiling will increase form submissions.",
        recommendation: "Reduce initial form fields to essential information only, gather additional data post-submission.",
        expectedOutcome: "+15-18% increase in enterprise lead form submissions.",
        optimizationType: OPTIMIZATION_TYPES.LEAD_GEN,
        device: DEVICE_TYPES.ALL,
        variations: {
          control: { formFields: "standard" },
          variant: { formFields: "minimal" }
        },
        startDate: new Date().toISOString(),
        confidence: 87,
        traffic: 50,
        duration: {
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString()
        },
        metrics: {
          primary: "form_submission_rate",
          secondary: ["lead_quality", "sales_qualification_rate"]
        },
        audience: {
          targeting: "enterprise_visitors",
          percentage: 50
        },
        results: {
          visitors: 0,
          conversions: 0,
          variantVisitors: 0,
          variantConversions: 0,
          controlConversionRate: 0,
          variantConversionRate: 0,
          improvement: 0
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "suggested-20",
        title: "Personalized Dashboard Layouts",
        description: "Customize dashboard layout based on user role and behavior",
        priority: "high",
        successProbability: 83,
        upliftPotential: "12-15%",
        timeToImplement: "3 weeks",
        stage: "proposed",
        status: "proposed",
        targetURL: "www.supporteam.io/dashboard",
        insight: "Different user roles have distinct feature usage patterns, yet all see the same dashboard layout.",
        hypothesis: "Role-based dashboard layouts will improve feature discovery and user efficiency.",
        recommendation: "Implement personalized dashboard layouts based on user role and historical usage patterns.",
        expectedOutcome: "+12-15% increase in feature engagement and user satisfaction.",
        optimizationType: OPTIMIZATION_TYPES.PERSONALIZATION,
        device: DEVICE_TYPES.ALL,
        variations: {
          control: { personalizedLayout: false },
          variant: { personalizedLayout: true }
        },
        startDate: new Date().toISOString(),
        confidence: 83,
        traffic: 50,
        duration: {
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString()
        },
        metrics: {
          primary: "feature_engagement",
          secondary: ["user_satisfaction", "time_to_action"]
        },
        audience: {
          targeting: "active_users",
          percentage: 50
        },
        results: {
          visitors: 0,
          conversions: 0,
          variantVisitors: 0,
          variantConversions: 0,
          controlConversionRate: 0,
          variantConversionRate: 0,
          improvement: 0
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "suggested-21",
        title: "Mobile-First Navigation Redesign",
        description: "Optimize navigation for mobile users with bottom bar",
        priority: "high",
        successProbability: 85,
        upliftPotential: "16-20%",
        timeToImplement: "2-3 weeks",
        stage: "proposed",
        status: "proposed",
        targetURL: "www.supporteam.io/mobile",
        insight: "Mobile users spend 45% more time navigating between features compared to desktop users.",
        hypothesis: "A bottom navigation bar with quick access to core features will improve mobile usability.",
        recommendation: "Implement a persistent bottom navigation bar for mobile users with key feature shortcuts.",
        expectedOutcome: "+16-20% improvement in mobile navigation efficiency and engagement.",
        optimizationType: OPTIMIZATION_TYPES.MOBILE_UX,
        device: DEVICE_TYPES.MOBILE,
        variations: {
          control: { bottomNav: false },
          variant: { bottomNav: true }
        },
        startDate: new Date().toISOString(),
        confidence: 85,
        traffic: 50,
        duration: {
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString()
        },
        metrics: {
          primary: "navigation_efficiency",
          secondary: ["mobile_engagement", "feature_discovery"]
        },
        audience: {
          targeting: "mobile_users",
          percentage: 50
        },
        results: {
          visitors: 0,
          conversions: 0,
          variantVisitors: 0,
          variantConversions: 0,
          controlConversionRate: 0,
          variantConversionRate: 0,
          improvement: 0
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
        {
          id: "suggested-22",
          title: "Video Onboarding Sequence",
          description: "Introduce short video tutorials in user onboarding flow",
          priority: "high",
          successProbability: 86,
          upliftPotential: "22-25%",
          timeToImplement: "3 weeks",
          stage: "proposed",
          status: "proposed",
          targetURL: "www.supporteam.io/onboarding",
          insight: "Users who watch product demo videos are 3.2x more likely to become active users.",
          hypothesis: "Integrating short, focused video tutorials into onboarding will improve feature understanding and adoption.",
          recommendation: "Create a series of 30-second video tutorials for key features, embedded in onboarding flow.",
          expectedOutcome: "+22-25% increase in onboarding completion and feature adoption rates.",
          optimizationType: OPTIMIZATION_TYPES.ONBOARDING,
          device: DEVICE_TYPES.ALL,
          variations: {
            control: { videoTutorials: false },
            variant: { videoTutorials: true }
          },
          startDate: new Date().toISOString(),
          confidence: 86,
          traffic: 50,
          duration: {
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString()
          },
          metrics: {
            primary: "onboarding_completion",
            secondary: ["feature_adoption", "time_to_value"]
          },
          audience: {
            targeting: "new_users",
            percentage: 50
          },
          results: {
            visitors: 0,
            conversions: 0,
            variantVisitors: 0,
            variantConversions: 0,
            controlConversionRate: 0,
            variantConversionRate: 0,
            improvement: 0
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: "suggested-23",
          title: "Gamified Achievement System",
          description: "Implement achievement badges for feature exploration",
          priority: "medium",
          successProbability: 79,
          upliftPotential: "15-18%",
          timeToImplement: "4 weeks",
          stage: "proposed",
          status: "proposed",
          targetURL: "www.supporteam.io/app",
          insight: "Users who explore multiple features in their first week have 2.5x higher retention rates.",
          hypothesis: "Gamifying feature discovery through achievements will motivate users to explore more functionality.",
          recommendation: "Create achievement system with badges and progress tracking for feature exploration.",
          expectedOutcome: "+15-18% increase in feature exploration and user engagement.",
          optimizationType: OPTIMIZATION_TYPES.ENGAGEMENT,
          device: DEVICE_TYPES.ALL,
          variations: {
            control: { achievements: false },
            variant: { achievements: true }
          },
          startDate: new Date().toISOString(),
          confidence: 79,
          traffic: 50,
          duration: {
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString()
          },
          metrics: {
            primary: "feature_exploration",
            secondary: ["user_engagement", "retention"]
          },
          audience: {
            targeting: "all_users",
            percentage: 50
          },
          results: {
            visitors: 0,
            conversions: 0,
            variantVisitors: 0,
            variantConversions: 0,
            controlConversionRate: 0,
            variantConversionRate: 0,
            improvement: 0
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: "suggested-24",
          title: "Smart Notification Timing",
          description: "Optimize in-app notification delivery based on user activity patterns",
          priority: "high",
          successProbability: 88,
          upliftPotential: "18-22%",
          timeToImplement: "2 weeks",
          stage: "proposed",
          status: "proposed",
          targetURL: "www.supporteam.io/app",
          insight: "Current fixed-time notifications have a 12% engagement rate, well below industry standard.",
          hypothesis: "Delivering notifications during users' peak activity periods will increase engagement.",
          recommendation: "Implement ML-based notification timing system based on individual user patterns.",
          expectedOutcome: "+18-22% increase in notification engagement rates.",
          optimizationType: OPTIMIZATION_TYPES.ENGAGEMENT,
          device: DEVICE_TYPES.ALL,
          variations: {
            control: { smartTiming: false },
            variant: { smartTiming: true }
          },
          startDate: new Date().toISOString(),
          confidence: 88,
          traffic: 50,
          duration: {
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString()
          },
          metrics: {
            primary: "notification_engagement",
            secondary: ["feature_adoption", "user_satisfaction"]
          },
          audience: {
            targeting: "active_users",
            percentage: 50
          },
          results: {
            visitors: 0,
            conversions: 0,
            variantVisitors: 0,
            variantConversions: 0,
            controlConversionRate: 0,
            variantConversionRate: 0,
            improvement: 0
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: "suggested-25",
          title: "Collaborative Onboarding",
          description: "Enable team leads to customize onboarding for their team",
          priority: "high",
          successProbability: 84,
          upliftPotential: "20-24%",
          timeToImplement: "3 weeks",
          stage: "proposed",
          status: "proposed",
          targetURL: "www.supporteam.io/team-onboarding",
          insight: "Teams with customized onboarding flows show 2.8x higher adoption rates.",
          hypothesis: "Allowing team leads to customize onboarding paths will improve team-wide adoption.",
          recommendation: "Create customizable onboarding templates for team leads to modify.",
          expectedOutcome: "+20-24% increase in team-wide feature adoption rates.",
          optimizationType: OPTIMIZATION_TYPES.TEAM_COLLABORATION,
          device: DEVICE_TYPES.ALL,
          variations: {
            control: { customOnboarding: false },
            variant: { customOnboarding: true }
          },
          startDate: new Date().toISOString(),
          confidence: 84,
          traffic: 50,
          duration: {
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString()
          },
          metrics: {
            primary: "team_adoption_rate",
            secondary: ["time_to_value", "team_engagement"]
          },
          audience: {
            targeting: "team_leads",
            percentage: 50
          },
          results: {
            visitors: 0,
            conversions: 0,
            variantVisitors: 0,
            variantConversions: 0,
            controlConversionRate: 0,
            variantConversionRate: 0,
            improvement: 0
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];

console.log('Initializing default experiments...');
defaultExperiments.forEach(exp => {
  console.log(`Adding default experiment: ${exp.id}`);
  experiments.set(exp.id, exp);
});

class ExperimentService {
  static experiments = experiments;

  static async getExperiments(status) {
    try {
      if (experiments.size === 0) {
        console.log('Experiments Map is empty, reinitializing defaults...');
        defaultExperiments.forEach(exp => experiments.set(exp.id, exp));
      }

      const allExperiments = Array.from(experiments.values());

      if (status) {
        const filteredExperiments = allExperiments.filter(exp => exp.status === status);
        console.log(`Filtered ${filteredExperiments.length} experiments with status: ${status}`);
        return filteredExperiments;
      }

      return allExperiments;
    } catch (error) {
      console.error('Error getting experiments:', error);
      throw error;
    }
  }

  static async createExperiment(data) {
    try {
      const experiment = {
        id: Date.now().toString(),
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        results: {
          visitors: 0,
          conversions: 0,
          variantVisitors: 0,
          variantConversions: 0,
          controlConversionRate: 0,
          variantConversionRate: 0,
          improvement: 0
        }
      };

      experiments.set(experiment.id, experiment);
      return experiment;
    } catch (error) {
      console.error('Error creating experiment:', error);
      throw error;
    }
  }

  static async updateExperiment(id, updatedData) {
    try {
      console.log('\nDebug - Update Experiment Called:', {
        id,
        updates: updatedData
      });
  
      const existingExperiment = experiments.get(id);
      if (!existingExperiment) {
        console.log('Debug - No existing experiment found');
        return null;
      }
  
      const updatedExperiment = {
        ...existingExperiment,
        ...updatedData,
        id,
        updatedAt: new Date().toISOString()
      };
  
      console.log('Debug - Saving updated experiment:', {
        id: updatedExperiment.id,
        status: updatedExperiment.status,
        stage: updatedExperiment.stage
      });
  
      experiments.set(id, updatedExperiment);
      return updatedExperiment;
    } catch (error) {
      console.error('Error updating experiment:', error);
      throw error;
    }
  }

  static async getExperiment(id) {
    try {
      return experiments.get(id) || null;
    } catch (error) {
      console.error('Error getting experiment:', error);
      throw error;
    }
  }

  static async updateExperimentStatus(id, status) {
    try {
      const experiment = experiments.get(id);
      if (!experiment) return null;

      experiment.status = status;
      experiment.stage = status;
      experiment.updatedAt = new Date().toISOString();
      experiments.set(id, experiment);

      return experiment;
    } catch (error) {
      console.error('Error updating experiment status:', error);
      throw error;
    }
  }

  static async deleteExperiment(id) {
    try {
      if (!experiments.has(id)) {
        throw new Error('Experiment not found');
      }
      return experiments.delete(id);
    } catch (error) {
      console.error('Error deleting experiment:', error);
      throw error;
    }
  }

  static async getExperimentsStats() {
    try {
      const allExperiments = Array.from(experiments.values());
      return {
        total: allExperiments.length,
        running: allExperiments.filter(exp => exp.status === 'running').length,
        proposed: allExperiments.filter(exp => exp.status === 'proposed').length,
        completed: allExperiments.filter(exp => exp.status === 'completed').length,
        averageConfidence: allExperiments.reduce((acc, exp) => acc + exp.confidence, 0) / allExperiments.length
      };
    } catch (error) {
      console.error('Error getting experiments stats:', error);
      throw error;
    }
  }

  static debugExperiments() {
    return {
      count: experiments.size,
      experiments: Array.from(experiments.entries()),
      timestamp: new Date().toISOString()
    };
  }
}

console.log('ExperimentService initialization complete');
console.log('Total experiments:', experiments.size);
console.log('Experiment IDs:', Array.from(experiments.keys()));

module.exports = ExperimentService;