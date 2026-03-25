import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "@/lib/router";
// import { AuthProvider } from "@/contextes/auth"; // migrate to zustand
import { useAuthStore } from "@/stores/authStore";
import ThemeController from "@/components/ThemeController";
import { useEffect } from "react";

const App = () => {
  // initialize auth check when app loads
  useEffect(() => {
    useAuthStore.getState().checkAuth();
  }, []);

  return (
    <ThemeController>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
    </ThemeController>
  );
};

export default App;
