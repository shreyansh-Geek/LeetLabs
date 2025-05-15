import React from "react";
import Navbar from "../components/landing/Navbar.jsx";
import { useParams } from "react-router-dom";

const ProblemDetailPage = () => {
  const { id } = useParams();
  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold">Problem {id}</h1>
        <p>Coming soon: Problem details and code editor.</p>
        {/* Add problem details and code editor here */}
      </div>
    </div>
  );
};

export default ProblemDetailPage;