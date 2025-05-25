// client/src/pages/ContributePage.jsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, Link } from "react-router-dom";
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
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { HoverEffect } from "../components/ui/card-hover-effect.jsx"; // Adjust path as needed
import { toast } from "sonner";
import { apiFetch } from "../lib/utils";
import { useAuth } from "../lib/auth";

// Zod schema
const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  countryCode: z.string().regex(/^\+\d{1,3}$/, { message: "Invalid country code." }),
  contactNumber: z
    .string()
    .optional()
    .refine((val) => !val || /^\d{6,14}$/.test(val), {
      message: "Phone number must be 6-14 digits.",
    }),
  contributionType: z.string().min(1, { message: "Please select a contribution type." }),
  experience: z.string(),
  portfolio: z.string(),
  message: z.string().optional(),
});

const contributionTypes = [
  {
    title: "Add Problems",
    description: "Craft challenging coding problems to test and teach problem-solving skills.",
    link: "/problems", // Placeholder, can link to a guide
  },
  {
    title: "Create Test Cases",
    description: "Design test cases to ensure the accuracy and robustness of coding problems.",
    link: "/problems",
  },
  {
    title: "Curate Sheets",
    description: "Build curated problem sets to guide learners through specific topics.",
    link: "/sheets/public",
  },
  {
    title: "Write Blogs",
    description: "Share tutorials, tips, and insights to help coders learn and grow.",
    link: "/blogs",
  },
  {
    title: "Create Roadmaps",
    description: "Develop structured learning paths to help users master coding concepts.",
    link: "/roadmaps",
  },
  {
    title: "Add Glossary Terms",
    description: "Contribute technical terms to expand our educational glossary.",
    link: "/glossary",
  },
  {
    title: "Other Contributions",
    description: "Propose creative ideas to enhance the LeetLabs platform.",
    link: "#",
  },
];

const ContributePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const countryCodes = [
    { code: "+1", label: "United States (+1)" },
    { code: "+91", label: "India (+91)" },
    { code: "+44", label: "United Kingdom (+44)" },
    { code: "+86", label: "China (+86)" },
    { code: "+81", label: "Japan (+81)" },
    { code: "+49", label: "Germany (+49)" },
    { code: "+33", label: "France (+33)" },
    { code: "+61", label: "Australia (+61)" },
  ];

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      countryCode: "+91",
      contactNumber: "",
      contributionType: "",
      experience: "",
      portfolio: "",
      message: "",
    },
  });

  const onSubmit = async (values) => {
    if (!isAuthenticated) {
      toast.error("Please log in to submit the contribution form.");
      navigate("/login");
      return;
    }

    setError("");
    setIsSubmitting(true);
    try {
      const fullContactNumber = values.contactNumber
        ? `${values.countryCode}${values.contactNumber}`
        : "";
      const payload = {
        ...values,
        contactNumber: fullContactNumber || undefined,
      };
      console.log("Submitting payload:", payload); // For debugging
      await apiFetch("/contribute", "POST", payload);
      toast.success("Application submitted!", {
        description: "We'll review your application and get back to you soon.",
      });
      navigate("/");
    } catch (err) {
      const errorMessage = err.message || "Failed to submit contribution. Please try again.";
      setError(errorMessage);
      toast.error("Submission failed", {
        description: errorMessage,
        action: {
          label: "Try again",
          onClick: () => form.handleSubmit(onSubmit)(),
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-12 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-12">
          <h1
            className="text-5xl font-bold text-gray-900 dark:text-white arp-display tracking-tight mt-10"
          >
            Contribute to LeetLabs
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 satoshi mt-4 max-w-2xl mx-auto">
             As a LeetLabs contributor, you’ll play a vital role in empowering learners worldwide. Whether you’re crafting coding problems, writing insightful blogs, or curating learning paths, your work will inspire and educate thousands.
          </p>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row items-start gap-12">
          {/* Left: Contribution Types */}
          <div className="w-full lg:w-2/3">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white satoshi">
              Ways to Contribute
            </h2>
            <HoverEffect
              items={contributionTypes}
              className="mt-0 grid-cols-1 md:grid-cols-2 lg:grid-cols-2"
            />
          </div>

          {/* Right: Contribution Form */}
          <div className="w-full lg:w-1/2 max-w-2xl">
            <Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white satoshi">
                  Apply to Contribute
                </CardTitle>
                <p className="text-gray-600 dark:text-gray-300 satoshi">
                  Share your expertise with the LeetLabs community.
                </p>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <p className="text-gray-600 dark:text-gray-300 satoshi">Loading...</p>
                ) : !isAuthenticated ? (
                  <p className="text-red-500 mb-4 satoshi">
                    Please{" "}
                    <Link
                      to="/login"
                      className="underline text-[#fec60b] hover:text-[#ec9913]"
                    >
                      log in
                    </Link>{" "}
                    to submit the form.
                  </p>
                ) : null}
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 dark:text-gray-300 satoshi">
                            Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your Name"
                              className="border-gray-300 dark:border-gray-600 focus:border-[#fec60b] focus:ring-[#fec60b] rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 dark:text-gray-300 satoshi">
                            Email
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="you@example.com"
                              className="border-gray-300 dark:border-gray-600 focus:border-[#fec60b] focus:ring-[#fec60b] rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />
                    <div className="flex space-x-2">
                      <FormField
                        control={form.control}
                        name="countryCode"
                        render={({ field }) => (
                          <FormItem className="w-1/3">
                            <FormLabel className="text-gray-700 dark:text-gray-300 satoshi">
                              Code
                            </FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <SelectTrigger className="border-gray-300 dark:border-gray-600 focus:border-[#fec60b] focus:ring-[#fec60b] rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                                  <SelectValue placeholder="Code" />
                                </SelectTrigger>
                                <SelectContent>
                                  {countryCodes.map(({ code, label }) => (
                                    <SelectItem key={code} value={code}>
                                      {label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage className="text-red-500" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="contactNumber"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel className="text-gray-700 dark:text-gray-300 satoshi">
                              Contact Number (Optional)
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="9876543210"
                                className="border-gray-300 dark:border-gray-600 focus:border-[#fec60b] focus:ring-[#fec60b] rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
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
                      name="contributionType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 dark:text-gray-300 satoshi">
                            Contribution Type
                          </FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <SelectTrigger className="border-gray-300 dark:border-gray-600 focus:border-[#fec60b] focus:ring-[#fec60b] rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                                <SelectValue placeholder="Select Contribution Type" />
                              </SelectTrigger>
                              <SelectContent>
                                {contributionTypes.map((item) => (
                                  <SelectItem key={item.title} value={item.title}>
                                    {item.title}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="experience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 dark:text-gray-300 satoshi">
                            Experience 
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us about your experience or skills"
                              className="border-gray-300 dark:border-gray-600 focus:border-[#fec60b] focus:ring-[#fec60b] rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                              rows={4}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="portfolio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 dark:text-gray-300 satoshi">
                            Github/Portfolio Link 
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://github.com/yourprofile"
                              className="border-gray-300 dark:border-gray-600 focus:border-[#fec60b] focus:ring-[#fec60b] rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 dark:text-gray-300 satoshi">
                            Message (Optional)
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Anything else you’d like to share?"
                              className="border-gray-300 dark:border-gray-600 focus:border-[#fec60b] focus:ring-[#fec60b] rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                              rows={4}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />
                    {error && (
                      <div className="text-red-500 text-sm text-center satoshi">{error}</div>
                    )}
                    <Button
                      type="submit"
                      className="w-full bg-[#fec60b] hover:bg-[#ec9913] text-gray-900 font-semibold rounded-md transition-colors satoshi"
                      disabled={isSubmitting || !isAuthenticated}
                    >
                      {isSubmitting ? "Submitting..." : "Submit Application"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContributePage;