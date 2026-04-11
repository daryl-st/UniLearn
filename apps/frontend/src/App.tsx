import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "@/lib/router";
// import { AuthProvider } from "@/contextes/auth"; // migrated to zustand
import { useAuthStore } from "@/stores/authStore";
import { useEffect } from "react";

const App = () => {
  // initialize auth check when app loads
  useEffect(() => {
    useAuthStore.getState().checkAuth();
  }, []);

  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
};

export default App;
