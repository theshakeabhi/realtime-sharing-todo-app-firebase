import { Routes, Route } from "react-router";
import Login from "./pages/auth/LoginPage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
