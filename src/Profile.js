import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase'; // Ensure Firebase is properly configured
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({
    name: '',
    bio: '',
    profilePicture: '',
    preferredDestinations: '',
    budgetRange: { min: '', max: '' },
  });

  useEffect(() => {
    // Listen for auth changes
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDoc = doc(db, 'users', currentUser.uid);
        const userData = await getDoc(userDoc);
        if (userData.exists()) {
          setProfile(userData.data());
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSave = async () => {
    if (user) {
      try {
        const userDoc = doc(db, 'users', user.uid);
        await setDoc(userDoc, profile, { merge: true });
        alert('Profile updated successfully!');
      } catch (error) {
        console.error('Error saving profile:', error);
      }
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your Profile</h1>
      <div className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={profile.name}
          onChange={handleInputChange}
          className="w-full p-3 border rounded"
        />
        <textarea
          name="bio"
          placeholder="Bio"
          value={profile.bio}
          onChange={handleInputChange}
          className="w-full p-3 border rounded"
        />
        <input
          type="text"
          name="profilePicture"
          placeholder="Profile Picture URL"
          value={profile.profilePicture}
          onChange={handleInputChange}
          className="w-full p-3 border rounded"
        />
        <input
          type="text"
          name="preferredDestinations"
          placeholder="Preferred Destinations (comma-separated)"
          value={profile.preferredDestinations}
          onChange={(e) =>
            setProfile({ ...profile, preferredDestinations: e.target.value.split(',') })
          }
          className="w-full p-3 border rounded"
        />
        <div className="flex space-x-4">
          <input
            type="number"
            name="budgetRange.min"
            placeholder="Min Budget"
            value={profile.budgetRange.min}
            onChange={(e) =>
              setProfile({
                ...profile,
                budgetRange: { ...profile.budgetRange, min: e.target.value },
              })
            }
            className="w-full p-3 border rounded"
          />
          <input
            type="number"
            name="budgetRange.max"
            placeholder="Max Budget"
            value={profile.budgetRange.max}
            onChange={(e) =>
              setProfile({
                ...profile,
                budgetRange: { ...profile.budgetRange, max: e.target.value },
              })
            }
            className="w-full p-3 border rounded"
          />
        </div>
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Profile
        </button>
      </div>
    </div>
  );
};

export default Profile;
