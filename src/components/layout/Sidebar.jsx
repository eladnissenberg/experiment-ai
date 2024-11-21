// src/components/layout/Sidebar.jsx

import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Beaker,
  BarChart3,
  Sparkles,
  Settings
} from "lucide-react";

const NAV_ITEMS = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    path: "/dashboard",
    description: "Overview and key metrics"
  },
  {
    icon: Sparkles,
    label: "Suggested Experiments",
    path: "/suggested-experiments",
    description: "AI-powered experiment suggestions"
  },
  {
    icon: Beaker,
    label: "Experiments",
    path: "/experiments",
    description: "Manage and monitor experiments"
  },
  {
    icon: BarChart3,
    label: "Analytics",
    path: "/analytics",
    description: "Detailed data analysis"
  },
  {
    icon: Settings,
    label: "Onboarding",
    path: "/onboarding",
    description: "Setup your account"
  }
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="w-64 bg-white border-r min-h-screen p-4">
      <nav className="space-y-2">
        {NAV_ITEMS.map(({ icon: Icon, label, path, description }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`flex items-center justify-between w-full px-4 py-3 rounded-lg transition-colors duration-150 ${
              location.pathname === path
                ? "bg-blue-50 text-blue-600"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center space-x-3">
              <Icon className="w-5 h-5" />
              <div className="text-left">
                <span className="block font-medium">{label}</span>
                <span className="text-xs text-gray-500">{description}</span>
              </div>
            </div>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;