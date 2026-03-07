import ThemeController from "./components/ThemeController";
import LoginPage from "./pages/LoginPage";
import Register from "./pages/Register";

const App = () => {
  return (
    <ThemeController>
      <LoginPage />
      {/* <Register /> */}
    </ThemeController>
  );
};

export default App;
