import { SignedOut,SignedIn,SignOutButton,SignInButton,UserButton } from '@clerk/clerk-react'
import { toast } from 'react-hot-toast'
import React from 'react'

function HomePage() {
    //fetch some data -without using tanstack query for now
    
  return (
    <div>
       <button className="btn btn-primary"onClick={()=>toast.success("This is a success toast")}>click me</button>
      <SignedOut>
        <SignInButton mode="modal">
          <button>Login</button>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <SignOutButton />
      </SignedIn>

      <UserButton />
    </div>
  )
}

export default HomePage
