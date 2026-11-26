
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";

function DashboardPlaceholder() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0b1120] text-white">
      <div className="text-center">
        <h1 className="text-3xl font-bold">
          TaskFlow Dashboard
        </h1>

        <p className="mt-3 text-gray-400">
          Authentication successful.
          Dashboard is coming next.
        </p>
      </div>
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route element={<ProtectedRoute />}>
            <Route
              path="/dashboard"
              element={<DashboardPlaceholder />}
            />
          </Route>

          <Route
            path="/"
            element={<Navigate to="/dashboard" replace />}
          />

          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
