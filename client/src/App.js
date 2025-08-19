import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { 
  ThemeProvider, 
  CssBaseline
} from "@mui/material";
import WelcomePage from "./components/WelcomePage/WelcomePage";
import MenteeLoginPage from "./components/auth/MenteeLoginPage";
import MenteeSignupPage from "./components/auth/MenteeSignupPage";
import MentorLoginPage from "./components/auth/MentorLoginPage";
import HomePage from "./components/HomePage";
import { useTheme } from "./hook/useTheme";

function App() {
  const theme = useTheme();
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/login/mentee" element={<MenteeLoginPage />} />
          <Route path="/signup/mentee" element={<MenteeSignupPage />} />
          <Route path="/login/mentor" element={<MentorLoginPage />} />
          <Route path="/mentors" element={<HomePage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
