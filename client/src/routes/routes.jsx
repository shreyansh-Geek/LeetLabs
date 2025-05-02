import { lazy } from "react";
import { useRoutes } from "react-router-dom";

const LandingPage = lazy(() => import("../pages/LandingPage.jsx"));

const AppRoutes = () =>
    useRoutes([
      {
        path: "/",
        element: <LandingPage />,
      },
      // Add more routes here 
    ]);
  
  export default AppRoutes;