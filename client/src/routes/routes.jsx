import { lazy } from "react";
import { useRoutes } from "react-router-dom";

// Lazy-loaded page components
const LandingPage = lazy(() => import("../pages/LandingPage.jsx"));
const ProfilePage = lazy(() => import("../pages/ProfilePage.jsx"));
const AddProblemPage = lazy(() => import("../pages/AddProblemsPage.jsx"));
const ProblemsPage = lazy(() => import("../pages/ProblemsPage.jsx"));
const ProblemDetailPage = lazy(() => import("../pages/ProblemDetailPage.jsx"));
const PublicSheetsPage  = lazy(() => import("../pages/PublicSheetsPage.jsx"));
const MySheetsPage   = lazy(() => import("../pages/MySheetsPage.jsx"));
const SheetDetailPage = lazy(() => import("../pages/SheetDetailPage.jsx"));
const CoursesPage = lazy(() => import("../pages/CoursesPage.jsx"));
const ContributePage = lazy(() => import("../pages/ContributePage.jsx"));
const BlogsPage = lazy(() => import("../pages/BlogsPage.jsx"));
const BlogDetailPage = lazy(() => import("../pages/BlogDetailPage.jsx"));
const RoadmapsPage = lazy(() => import("../pages/RoadmapsPage.jsx"));
const GlossaryPage = lazy(() => import("../pages/GlossaryPage.jsx"));
const GlossaryDetailPage = lazy(() => import("../pages/GlossaryDetailPage.jsx"));
const AIDiscussionPage = lazy(() => import("../pages/AIDiscussionPage.jsx"));
const PricingPage = lazy(() => import("../pages/PricingPage.jsx"));
const LoginPage = lazy(() => import("../pages/LoginPage.jsx"));
const SignupPage = lazy(() => import("../pages/SignupPage.jsx"));
const VerifyEmailPage = lazy(() => import("../pages/VerifyEmailPage.jsx"));
const ForgotPasswordPage = lazy(() => import("../pages/ForgotPasswordPage.jsx"));
const ResetPasswordPage = lazy(() => import("../pages/ResetPasswordPage.jsx"));
const SubmissionsPage = lazy(() => import("../pages/SubmissionsPage.jsx"));

const AppRoutes = () =>
  useRoutes([
    {
      path: "/",
      element: <LandingPage />, // Home page 
    },
    {
      path: '/profile',
      element: <ProfilePage />,
    },
    { 
      path: "/profile/add-problem", 
      element: <AddProblemPage /> 
    },
    {
      path: "/problems",
      element: <ProblemsPage />, // List all problems (GET /getAllProblems)
    },
    {
      path: "/problem/:id",
      element: <ProblemDetailPage />, // View specific problem (GET /getProblem/:id)
    },
    {
      path: "/sheets/public",
      element: <PublicSheetsPage />, // List public/featured sheets (GET /public, GET /featured)
    },
    {
      path: "/sheets/my",
      element: <MySheetsPage />, // List my sheets (GET /my, )
    },
    {
      path: "/sheet/:id",
      element: <SheetDetailPage />, // View specific sheet (GET /:id)
    },
    {
      path: "/courses",
      element: <CoursesPage />, // Placeholder for featured courses (static)
    },
    {
      path: "/contribute",
      element: <ContributePage />, // Placeholder for contribution page (static)
    },
    {
      path: "/blogs",
      element: <BlogsPage />, // Placeholder for blogs 
    },
    {
      path: "/blogs/:id",
      element: <BlogDetailPage  />, // Placeholder for blogs Details 
    },
    {
      path: "/roadmaps",
      element: <RoadmapsPage />, // Placeholder for roadmaps (static)
    },
    {
      path: "/glossary",
      element: <GlossaryPage />, // Placeholder for glossary (static)
    },
    {
      path: "/glossary/:termId",
      element: <GlossaryDetailPage />, // Placeholder for glossary detail (static)
    },
    {
      path: "/ai-discussion",
      element: <AIDiscussionPage />, // Placeholder for AI discussion (static or future AI feature)
    },
    {
      path: "/pricing",
      element: <PricingPage />, // Placeholder for pricing (static)
    },
    {
      path: "/login",
      element: <LoginPage />, // Login form (POST /login)
    },
    {
      path: "/signup",
      element: <SignupPage />, // Signup form (POST /register)
    },
    {
      path: "/verify-email",
      element: <VerifyEmailPage />,
    },
    {
      path: "/verify/:verificationToken",
      element: <VerifyEmailPage />, // Verify email (GET /verifyUser/:verificationToken)
    },
    {
      path: "/forgot-password",
      element: <ForgotPasswordPage />, // Forgot password form (POST /forgotPassword)
    },
    {
      path: "/reset-password/:resetPasswordToken",
      element: <ResetPasswordPage />, // Reset password form (POST /resetPassword/:resetPasswordToken)
    },
    {
      path: "/submissions",
      element: <SubmissionsPage />, // View user submissions (GET /get-user-submissions)
    },
    // Add more routes as needed (e.g., /dashboard, /profile)
    {
      path: "*",
      element: <div>404 - Page Not Found</div>, // Fallback for unmatched routes
    },
  ]);

export default AppRoutes;