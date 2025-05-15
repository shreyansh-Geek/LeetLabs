import React from "react";
import Navbar from "../components/landing/Navbar.jsx";

const CoursesPage = () => {
  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold">Featured Courses</h1>
        <p>Coming soon: Explore curated coding courses.</p>
      </div>
    </div>
  );
};

export default CoursesPage;