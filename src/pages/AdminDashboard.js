import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const user = auth.currentUser;

        if (!user) {
          navigate('/login'); // Redirect to login if not logged in
          return;
        }

        // Fetch user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.role === 'admin') {
            setIsAdmin(true);
          } else {
            navigate('/not-authorized'); // Redirect non-admin users
          }
        } else {
          console.error('No user data found.');
          navigate('/login');
        }
      } catch (error) {
        console.error('Error checking admin role:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login'); // Redirect to login page after logout
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAdmin) {
    return null; // Prevent unauthorized content from flashing
  }

  return (
    <div className="admin-dashboard p-6 max-w-screen-lg mx-auto">
      <button
        onClick={handleLogout}
        className="px-6 py-3 font-bold text-white bg-gradient-to-r from-red-400 to-red-600 rounded-full shadow-lg transform transition hover:scale-105 hover:shadow-xl active:scale-95"
      >
        Logout
      </button>
      <h1 className="text-4xl font-bold mb-4">Admin Dashboard</h1>
      <p className="text-lg text-gray-600 mb-6">Welcome, Admin! Here you can manage the application.</p>
      <div className="features grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-100 p-4 rounded shadow">
          <h2 className="text-xl font-semibold">View All Users</h2>
          <p>Check and manage all registered users.</p>
        </div>
        <div className="bg-gray-100 p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Manage User Roles</h2>
          <p>Assign or revoke admin privileges.</p>
        </div>
        <div className="bg-gray-100 p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Track Statistics</h2>
          <p>View app usage and performance metrics.</p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
