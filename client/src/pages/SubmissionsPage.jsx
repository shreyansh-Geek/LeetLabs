import React from "react";
import Navbar from "../components/landing/Navbar.jsx";

const SubmissionsPage = () => {
  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold">Submissions</h1>
        <p>Coming soon: View your submission history.</p>
        {/* Add submissions list component here */}
      </div>
    </div>
  );
};

export default SubmissionsPage;