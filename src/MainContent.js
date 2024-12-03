import React, { useState, useEffect, useRef } from 'react';
import './index.css';
import { auth, db } from './firebase';
import Auth from './Auth';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, where } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

function App() {
  const [itinerary, setItinerary] = useState({
    location: '',
    date: '',
    activities: '',
    budget: '',
    actualBudget: '',
    isShared: false,
  });
  const [itineraries, setItineraries] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchItineraries(currentUser.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchItineraries = async (userId) => {
    try {
      setLoading(true);
      const itinerariesCollection = collection(db, 'itineraries');

      // Fetch user's itineraries
      const userQuery = query(itinerariesCollection, where('owner', '==', userId));
      const userItinerariesSnapshot = await getDocs(userQuery);
      const userItineraries = userItinerariesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Fetch shared itineraries
      const sharedQuery = query(itinerariesCollection, where('isShared', '==', true));
      const sharedItinerariesSnapshot = await getDocs(sharedQuery);
      const sharedItineraries = sharedItinerariesSnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((itinerary) => itinerary.owner !== userId); // Exclude user's itineraries

      setItineraries([...userItineraries, ...sharedItineraries]);
    } catch (error) {
      console.error('Error fetching itineraries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.uid) {
      alert('You must be logged in to save itineraries.');
      return;
    }

    setLoading(true);
    try {
      if (editIndex !== null) {
        // Update itinerary
        const itineraryDoc = doc(db, 'itineraries', itineraries[editIndex].id);
        await updateDoc(itineraryDoc, itinerary);
        setItineraries((prev) =>
          prev.map((item, index) =>
            index === editIndex ? { ...item, ...itinerary } : item
          )
        );
        alert('Itinerary updated successfully!');
      } else {
        // Add new itinerary
        const docRef = await addDoc(collection(db, 'itineraries'), {
          ...itinerary,
          owner: user.uid,
        });
        setItineraries((prev) => [...prev, { ...itinerary, id: docRef.id }]);
        alert('Itinerary saved successfully!');
      }

      // Reset form
      setItinerary({
        location: '',
        date: '',
        activities: '',
        budget: '',
        actualBudget: '',
        isShared: false,
      });
      setEditIndex(null);
    } catch (error) {
      console.error('Error saving itinerary:', error);
      alert('Failed to save itinerary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (index) => {
    if (itineraries[index].owner !== user.uid) {
      alert("You can only edit your own itineraries.");
      return;
    }
    setItinerary(itineraries[index]);
    setEditIndex(index);
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDelete = async (index) => {
    try {
      const itineraryDoc = doc(db, 'itineraries', itineraries[index].id);
      await deleteDoc(itineraryDoc);
      setItineraries((prev) => prev.filter((_, i) => i !== index));
      alert('Itinerary deleted successfully!');
    } catch (error) {
      console.error('Error deleting itinerary:', error);
      alert('Failed to delete itinerary.');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setItineraries([]);
      alert('Logged out successfully!');
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  return (
    <div className="App text-center min-h-screen py-8 px-4">
      <header className="mb-12">
        <h1>🌟 Crowdsourced Itinerary Planner</h1>
        <p>Your ultimate travel companion.</p>
        {user && (
          <div className="flex items-center justify-center space-x-4">
            <span className="text-lg font-semibold">{user.displayName || user.email}</span> {/* Display user's name or email */}
            <button
              onClick={handleLogout}
              className="px-6 py-3 font-bold text-white bg-gradient-to-r from-red-400 to-red-600 rounded-full shadow-lg transform transition hover:scale-105 hover:shadow-xl active:scale-95"
            >
              Logout
            </button>
          </div>
        )}
      </header>
      <Auth user={user} />

      {user && (
        <div className="max-w-3xl mx-auto">
          {loading && <p>Loading...</p>}
          <form onSubmit={handleSubmit} ref={formRef} className="bg-glass shadow-lg space-y-4">
            <h2>{editIndex !== null ? 'Edit Itinerary' : 'Create New Itinerary'}</h2>
            <input
              type="text"
              placeholder="Location"
              value={itinerary.location}
              onChange={(e) => setItinerary({ ...itinerary, location: e.target.value })}
              required
              className="input-glass"
            />
            <input
              type="date"
              value={itinerary.date}
              onChange={(e) => setItinerary({ ...itinerary, date: e.target.value })}
              required
              className="input-glass"
            />
            <textarea
              placeholder="Activities"
              value={itinerary.activities}
              onChange={(e) => setItinerary({ ...itinerary, activities: e.target.value })}
              required
              className="input-glass"
            />
            <input
              type="number"
              placeholder="Estimated Budget"
              value={itinerary.budget}
              onChange={(e) => setItinerary({ ...itinerary, budget: e.target.value })}
              required
              className="input-glass"
            />
            <input
              type="number"
              placeholder="Actual Budget"
              value={itinerary.actualBudget}
              onChange={(e) => setItinerary({ ...itinerary, actualBudget: e.target.value })}
              required
              className="input-glass"
            />
            <label>
              <input
                type="checkbox"
                checked={itinerary.isShared}
                onChange={(e) => setItinerary({ ...itinerary, isShared: e.target.checked })}
              />
              Share this itinerary
            </label>
            <button type="submit" className="button-modern w-full bg-gradient-to-r from-green-400 to-teal-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transform transition hover:scale-105 hover:shadow-xl active:scale-95">
              {editIndex !== null ? 'Update Itinerary' : 'Save Itinerary'}
            </button> 
          </form>

          <div className="mt-8">
            <h2>Your Itineraries</h2>
            {itineraries.length === 0 && <p>No itineraries found. Start adding some!</p>}
            <ul>
              {itineraries.map((itinerary, index) => (
                <li key={itinerary.id} className="border p-4 mb-2 bg-gray rounded-lg">
                  <h3>📍{itinerary.location}</h3>
                  <p>Date: {new Date(itinerary.date).toLocaleDateString()}</p>
                  <p>Activities: {itinerary.activities}</p>
                  <p>Budget: {itinerary.budget}</p>
                  <p>Actual Budget: {itinerary.actualBudget}</p>
                  <p>{itinerary.isShared ? 'This itinerary is shared.' : 'This itinerary is private.'}</p>
                  {itinerary.owner === user.uid && ( // Check if the current user is the owner
                    <div className="flex justify-end space-x-4 mt-4">
                      <button onClick={() => handleEdit(index)}  className="px-6 py-3 font-bold text-white bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full shadow-lg transform transition hover:scale-105 hover:shadow-xl active:scale-95">
                      ✏️  Edit
                      </button>
                      <button onClick={() => handleDelete(index)} className="px-6 py-3 font-bold text-white bg-gradient-to-r from-red-400 to-red-600 rounded-full shadow-lg transform transition hover:scale-105 hover:shadow-xl active:scale-95">
                      🗑️ Delete
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
