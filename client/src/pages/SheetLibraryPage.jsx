import React from "react";
import Navbar from "../components/landing/Navbar.jsx";

const SheetLibraryPage = () => {
  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold">Sheets Library</h1>
        <p>Coming soon: Browse public and featured sheets.</p>
        {/* Add sheet list component here */}
      </div>
    </div>
  );
};

export default SheetLibraryPage;