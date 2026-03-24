import { BrowserRouter } from "react-router-dom";
import AppRouter from "@/lib/router";
import { AuthProvider } from "@/contextes/auth";
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
