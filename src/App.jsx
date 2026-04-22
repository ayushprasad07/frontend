import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { BrowserRouter as Router, Route, Routes, useSearchParams } from "react-router-dom";
import Login from './components/Login';
import SignUp from './components/SignUp'
import Dashboard from './components/Dashboard'

function App() {

  return (
    <Router>
      {/* <Navbar />
      <LoadingBar
        color="#03045e"
        height={4}
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <ToastContainer
        position="top-center"
        autoClose={2000}
        theme="colored"
        pauseOnHover
      /> */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />
        {/* <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } /> */}
      </Routes>
    </Router>
  )
}

export default App
