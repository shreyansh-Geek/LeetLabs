import React from "react";
import Navbar from "../components/landing/Navbar.jsx";
import { useParams } from "react-router-dom";

const ResetPasswordPage = () => {
  const { resetPasswordToken } = useParams();
  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold">Reset Password</h1>
        <p>Coming soon: Reset password with token {resetPasswordToken}.</p>
        {/* Add reset password form here */}
      </div>
    </div>
  );
};

export default ResetPasswordPage;