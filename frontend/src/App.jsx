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
import ProblemPage from "./pages/ProblemPage.jsx";
import { Toaster } from "react-hot-toast";


function App() {
  const {isSignedIn} = useUser();

  return (
    <>
    
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/problems" element={isSignedIn ? <ProblemPage /> : <Navigate to={"/"} />} />
    </Routes>
    <Toaster  toastOptions={{duration:3000}}/>
    </>
  );
}

export default App;

//tailwind,daisy ui,react-router,navigatiob,react-hot-toast,
//todo: react-query aka tanstack query,axios