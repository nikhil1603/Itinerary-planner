import React from 'react';
import Login from './pages/Login';   
import Register from './pages/Register'; 
import { auth } from './firebase'; 

function Auth({ user, setUser, loading, setLoading }) {
  const handleLogout = async () => {
    try {
      await auth.signOut();
      setUser(null); // Clear the user state
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  function Auth({ user, setUser, setLoading }) {
    return (
      <div>
        {user ? (
          <p>Welcome, {user.email}!</p>
        ) : (
          <>
            <h2>Login</h2>
            <Login setUser={setUser} setLoading={setLoading} />
            <h2>Register</h2>
            <Register setUser={setUser} setLoading={setLoading} />
          </>
        )}
      </div>
    );
  }
}  

export default Auth;
