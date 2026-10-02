import React from "react";
import Sidebar from "../components/Sidebar";
import Calendar from "../components/Calendar/Calendar";

const CalendarPage = () => (
  <div className="flex min-h-screen bg-[#f4f4f4]">
    <Sidebar />
    <div className="flex-1 p-8 overflow-y-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Calendar</h1>
      <div className="max-w-md">
        <Calendar />
      </div>
    </div>
  </div>
);

export default CalendarPage;
