import { Routes, Route, Navigate } from "react-router";
import Login from "./pages/auth/LoginPage";
import SignUp from "./pages/auth/SignupPage";
import BaseLayout from "./components/ui/layout/BaseLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Dashboard from "./pages/dashboard/DashBoard";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />

      <Route
        element={
          <ProtectedRoute>
            <BaseLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />s
      </Route>
    </Routes>
  );
}

export default App;
