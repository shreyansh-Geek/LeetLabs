import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../components/landing/Navbar.jsx";
import { toast } from "sonner"; // Add Sonner
import { apiFetch } from "../lib/utils";

const VerifyEmailPage = () => {
  const { verificationToken } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState(verificationToken ? "verifying" : "pending");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (verificationToken) {
      const verifyEmail = async () => {
        toast("Verifying your email...");
        try {
          await apiFetch(`/auth/verifyUser/${verificationToken}`, "GET");
          setStatus("success");
          setMessage("Email verified successfully!");
          toast.success("Email verified successfully!", {
            description: "Redirecting to login...",
          });
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        } catch (error) {
          setStatus("error");
          const errorMessage = error.message || "Failed to verify email. Please try again.";
          setMessage(errorMessage);
          toast.error("Verification failed", {
            description: errorMessage,
            action: {
              label: "Try again",
              onClick: () => navigate("/signup"),
            },
          });
        }
      };
      verifyEmail();
    } else {
      toast("Please check your inbox for the verification email.");
    }
  }, [verificationToken, navigate]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-md mx-auto px-4 py-12 text-center mt-20">
        {verificationToken ? (
          <>
            <h1 className="text-3xl font-bold text-gray-900 satoshi">
              {status === "verifying" && "Verifying Your Email"}
              {status === "success" && "Email Verified"}
              {status === "error" && "Verification Failed"}
            </h1>
            <p className="mt-4 text-md text-gray-600">
              {status === "verifying" && "Please wait while we verify your email..."}
              {status === "success" && message}
              {status === "error" && (
                <>
                  {message}{" "}
                  <Link to="/signup" className="text-[#fec60b] hover:text-[#ec9913] font-semibold">
                    Try again
                  </Link>.
                </>
              )}
            </p>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-gray-900 satoshi">Verify Your Email</h1>
            <p className="mt-4 text-md text-gray-600">
              We’ve sent a verification email to your inbox. Please click the link to verify your account.
            </p>
            <p className="mt-2 text-md text-gray-600">
              Didn’t receive the email? Check your spam folder or{" "}
              <Link to="/signup" className="text-[#fec60b] hover:text-[#ec9913] font-semibold">
                try again
              </Link>.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;