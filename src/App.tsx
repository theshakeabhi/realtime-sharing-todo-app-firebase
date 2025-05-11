import { Routes, Route } from "react-router";
import Login from "./pages/auth/LoginPage";
import SignUp from "./pages/auth/SignupPage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  );
}

export default App;
