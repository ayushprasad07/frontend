import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

const GuestRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3000/api/auth/check-access", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
            setIsAuth(true);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <h2>Loading...</h2>;

  // If the user IS authenticated, send them straight to the dashboard
  // Otherwise, render the children (the Login or Sign Up page)
  return isAuth ? <Navigate to="/dashboard" /> : children;
};

export default GuestRoute;
