import React from 'react'
import { useNavigate } from "react-router-dom";

const Dashboard = () => {

  const navigate = useNavigate();

  const handleLogout = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/auth/logout", {
      method: "GET",
      credentials: "include",
    });

    const data = await response.json(); 

    if (data.success) {
      navigate("/");
    } else {
      console.log("Logout failed");
    }
  } catch (error) {
    console.log(error);
  }
};
  return (
    <div>
      This is Dashboard
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Dashboard
