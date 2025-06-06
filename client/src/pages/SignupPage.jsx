import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, Link, useLocation } from "react-router-dom";
import Spline from "@splinetool/react-spline";
import Navbar from "../components/landing/Navbar.jsx";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { toast } from "sonner"; // Add Sonner
import { apiFetch } from "../lib/utils";
import { Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

// Error Boundary
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-white p-4">
          <h1 className="text-2xl font-bold text-red-600 satoshi">Error</h1>
          <p>{this.state.error?.message || "Something went wrong."}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

// Zod schema
const formSchema = z
  .object({
    firstName: z.string().min(1, { message: "First name is required." }),
    lastName: z.string().min(1, { message: "Last name is required." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." })
      .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
      .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter." })
      .regex(/[0-9]/, { message: "Password must contain at least one number." })
      .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character." }),
    confirmPassword: z.string().min(8, { message: "Please confirm your password." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

const SignupPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [splineError, setSplineError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  console.log("Rendering SignupPage");

   const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("error") === "auth_failed") {
      toast.error("Authentication failed", {
        description: "Please try again.",
      });
    }
  }, [location]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values) => {
    setError("");
    setIsLoading(true);
    try {
      const name = `${values.firstName} ${values.lastName}`;
      const response = await apiFetch("/auth/register", "POST", {
        email: values.email,
        password: values.password,
        name,
      });
      toast.success("Verification email sent!", {
        description: "Please check your inbox.",
      });
      navigate("/verify-email");
    } catch (err) {
      const errorMessage = err.message || "Failed to sign up. Please try again.";
      setError(errorMessage);
      toast.error("Sign up failed", {
        description: errorMessage,
        action: {
          label: "Try again",
          onClick: () => form.handleSubmit(onSubmit)(),
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuth = (provider) => {
    toast(`Redirecting to ${provider}...`);
    window.location.href = `${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/auth/${provider}`;
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-center gap-8 mt-20">
          <div className="w-full lg:w-3/5 max-w-md">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 satoshi">Join LeetLabs</h1>
              <p className="text-sm text-gray-600">
                Create an account to start practicing and learning.
              </p>
            </div>
            <div className="mt-8 bg-white shadow-md rounded-lg p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="flex space-x-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel className="text-gray-700 satoshi">First Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Shreyansh"
                              className="border-gray-300 focus:border-[#fec60b] focus:ring-[#fec60b] rounded-md"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel className="text-gray-700 satoshi">Last Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Pandit"
                              className="border-gray-300 focus:border-[#fec60b] focus:ring-[#fec60b] rounded-md"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 satoshi">Email Address</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="you@example.com"
                            className="border-gray-300 focus:border-[#fec60b] focus:ring-[#fec60b] rounded-md"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 satoshi">Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              className="border-gray-300 focus:border-[#fec60b] focus:ring-[#fec60b] rounded-md pr-10"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-[#fec60b] transition-colors"
                            >
                              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 satoshi">Confirm Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="••••••••"
                              className="border-gray-300 focus:border-[#fec60b] focus:ring-[#fec60b] rounded-md pr-10"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-[#fec60b] transition-colors"
                            >
                              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                  {error && (
                    <div className="text-red-500 text-sm text-center">{error}</div>
                  )}
                  <Button
                    type="submit"
                    className="w-full bg-[#fec60b] hover:bg-[#ec9913] text-gray-900 font-semibold rounded-md transition-colors satoshi"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing Up..." : "Sign Up"}
                  </Button>
                </form>
              </Form>
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-2 text-gray-500 satoshi">
                      Or Signup with
                    </span>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="flex items-center justify-center gap-2 border-gray-300 hover:border-[#fec60b] hover:bg-[#fec60b]/10 text-gray-900 satoshi"
                    onClick={() => handleOAuth("google")}
                  >
                    <FcGoogle size={20} />
                    Google
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center justify-center gap-2 border-gray-300 hover:border-[#fec60b] hover:bg-[#fec60b]/10 text-gray-900 satoshi"
                    onClick={() => handleOAuth("github")}
                  >
                    <FaGithub size={20} />
                    GitHub
                  </Button>
                </div>
              </div>
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-[#fec60b] hover:text-[#ec9913] font-semibold satoshi"
                  >
                    Log In
                  </Link>
                </p>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-auto flex justify-end">
            <div className="relative w-full max-w-[390px] h-[600px] overflow-hidden translate-x-1 ml-auto">
              {splineError ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
                  <p className="text-gray-600 satoshi">Failed to load 3D robot</p>
                </div>
              ) : (
                <Spline
                  scene="https://prod.spline.design/Q2858wxqhLHqjrE1/scene.splinecode"
                  onLoad={() => console.log("Spline scene loaded")}
                  onError={(err) => {
                    console.error("Spline error:", err);
                    setSplineError(true);
                  }}
                  style={{ width: "160%", height: "100%", transform: "translateX(0%)" }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default SignupPage;