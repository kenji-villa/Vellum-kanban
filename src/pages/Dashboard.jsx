import React from "react";

const Dashboard = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800">Vellum Dashboard</h1>
      <p className="mt-2 text-gray-600">Your boards will appear here.</p>
      <div className="mt-6">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          Create New Board
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
