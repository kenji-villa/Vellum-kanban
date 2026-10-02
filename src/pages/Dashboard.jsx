import React from "react";
import Sidebar from "../components/Sidebar";
import DashboardTopbar from "../components/Dashboard/DashboardTopbar";
import Calendar from "../components/Calendar/Calendar";
import UrgentTasks from "../components/Dashboard/UrgentTasks";
import ProjectDirectory from "../components/Dashboard/ProjectDirectory";
import NewComments from "../components/Dashboard/NewComments";
import TeamDirectory from "../components/Dashboard/TeamDirectory";

const Dashboard = () => {
  return (
    <div className="flex min-h-screen bg-[#f4f4f4]">
      <Sidebar />

      <div className="flex-1 flex flex-col p-8 overflow-y-auto">
        <DashboardTopbar />

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* ---- Column 1 ---- */}
          <div className="space-y-5">
            <Calendar />
            <ProjectDirectory />
          </div>

          {/* ---- Column 2 ---- */}
          <div className="space-y-5">
            <UrgentTasks />
            {/* Empty spacer to visually align with the reference layout */}
            <div className="hidden lg:block bg-white/40 rounded-2xl h-40" />
          </div>

          {/* ---- Column 3 ---- */}
          <div className="space-y-5">
            <NewComments />
            <TeamDirectory />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
