import React from "react";
import Navbar from "../components/landing/Navbar.jsx";

const ProblemsPage = () => {
  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold">Practice Problems</h1>
        <p>Coming soon: List of coding problems to practice.</p>
        {/* Add problem list component here */}
      </div>
    </div>
  );
};

export default ProblemsPage;