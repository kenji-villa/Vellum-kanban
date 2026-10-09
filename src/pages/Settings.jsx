import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import TabProfile from "../components/Settings/TabProfile";
import TabAppearance from "../components/Settings/TabAppearance";
import TabBoardDefaults from "../components/Settings/TabBoardDefaults";
import TabData from "../components/Settings/TabData";
import TabShortcuts from "../components/Settings/TabShortcuts";
import TabAbout from "../components/Settings/TabAbout";

const TABS = [
  { id: "profile", label: "Profile" },
  { id: "appearance", label: "Appearance" },
  { id: "board", label: "Board Defaults" },
  { id: "data", label: "Data" },
  { id: "shortcuts", label: "Shortcuts" },
  { id: "about", label: "About" },
];

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="flex min-h-screen bg-[#f4f4f4] dark:bg-[#0f172a]">
      <Sidebar />
      <div className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Settings
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage your account, appearance, and data.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 dark:border-slate-700 mb-8">
          <div className="flex gap-1 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors -mb-px ${
                  activeTab === tab.id
                    ? "border-orange-500 text-gray-900 dark:text-gray-100"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm max-w-4xl">
          {activeTab === "profile" && <TabProfile />}
          {activeTab === "appearance" && <TabAppearance />}
          {activeTab === "board" && <TabBoardDefaults />}
          {activeTab === "data" && <TabData />}
          {activeTab === "shortcuts" && <TabShortcuts />}
          {activeTab === "about" && <TabAbout />}
        </div>
      </div>
    </div>
  );
};

export default Settings;
