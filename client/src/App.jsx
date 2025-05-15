import AppRoutes from "./routes/routes.jsx";
import { Suspense } from "react";
import { Toaster} from "./components/ui/sonner.jsx";

function App() {
  return (
    <>
    <Suspense fallback={<div>Loading...</div>}>
      <AppRoutes />
    </Suspense>
    <Toaster /></>
  );
}

export default App;
