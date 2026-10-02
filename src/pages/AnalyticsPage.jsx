import React from "react";
import Sidebar from "../components/Sidebar";

const AnalyticsPage = () => (
  <div className="flex min-h-screen bg-[#f4f4f4]">
    <Sidebar />
    <div className="flex-1 p-8 overflow-y-auto">
      <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
      <p className="text-gray-500 mt-2">Coming soon.</p>
    </div>
  </div>
);

export default AnalyticsPage;
