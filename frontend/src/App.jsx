import { useState } from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";

import { Navigate,Routes,Route } from "react-router";
import HomePage from "./pages/HomePage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import ProblemsPage from "./pages/ProblemsPage.jsx";
import { Toaster } from "react-hot-toast";
import ProblemPage from "./pages/ProblemPage.jsx";


function App() {

// Wait until Clerk finishes resolving authentication state
// Prevents rendering incorrect UI during initial load
  const {isSignedIn,isLoaded} = useUser();//to check if user auth state is loaded
  if(!isLoaded){//to prevent flickering
    return null;
  }

  return (
    <>
    
    <Routes>
      <Route path="/" element={!isSignedIn ? <HomePage /> : <Navigate to={"/dashboard"} />} />
      <Route path="/dashboard" element={isSignedIn ? <DashboardPage /> : <Navigate to={"/"} />} />
      <Route path="/problems" element={isSignedIn ? <ProblemsPage /> : <Navigate to={"/"} />} />
       <Route path="/problem/:id" element={isSignedIn ? <ProblemPage /> : <Navigate to={"/"} />} />
    </Routes>
    <Toaster  toastOptions={{duration:3000}}/>
    </>
  );
}

export default App;

//tailwind,daisy ui,react-router,navigatiob,react-hot-toast,
//todo: react-query aka tanstack query,axios