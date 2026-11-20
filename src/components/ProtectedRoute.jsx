import { Navigate, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext.jsx";

// only hides the page in the ui, this is not real security
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // remember where the user wanted to go, Login sends them back there
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

export default ProtectedRoute;
