import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    fetch("https://lost-found-uapb.onrender.com/api/auth/check-access", {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setIsAuth(true);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <h2>Loading...</h2>;

  return isAuth ? children : <Navigate to="/" />;
};

export default ProtectedRoute;