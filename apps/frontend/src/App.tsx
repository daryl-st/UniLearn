import { BrowserRouter } from "react-router-dom";
import AppRouter from "@/app/router";
import { AuthProvider } from "@/auth/AuthProvider";
import ThemeController from "@/components/ThemeController";

const App = () => {
  return (
    <ThemeController>
      <AuthProvider>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </AuthProvider>
    </ThemeController>
  );
};

export default App;
