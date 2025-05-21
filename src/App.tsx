import { Routes, Route } from "react-router";
import Login from "./pages/auth/LoginPage";
import SignUp from "./pages/auth/SignupPage";
import BaseLayout from "./components/ui/layout/BaseLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { useAuth } from "./hooks/useAuth";
import LoadingScreen from "./components/ui/LoadingScreen";
import TodoPage from "./pages/tasks/TodoPage";
import Dashboard from "./pages/dashboard/DashBoard";

function App() {
  const { initializing } = useAuth();

  if (initializing) {
    return <LoadingScreen />;
  }

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
        <Route path="/" element={<Dashboard />} />
        <Route path="/:taskId" element={<TodoPage />} />
      </Route>
    </Routes>
  );
}

export default App;
