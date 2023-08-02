import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { HashRouter as Router } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // <React.StrictMode>
  <AuthProvider>
    <ThemeProvider>
      <Router>
        <App />
        <Toaster />
      </Router>
    </ThemeProvider>
  </AuthProvider>
  // </React.StrictMode>
);
