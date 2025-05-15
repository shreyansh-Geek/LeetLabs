import React from "react";
import Navbar from "../components/landing/Navbar.jsx";
import { useParams } from "react-router-dom";

const SheetDetailPage = () => {
  const { id } = useParams();
  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold">Sheet {id}</h1>
        <p>Coming soon: Sheet details and problems.</p>
        {/* Add sheet details component here */}
      </div>
    </div>
  );
};

export default SheetDetailPage;