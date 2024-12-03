import React, { useState } from 'react';

function AddItineraryForm({ addItinerary }) {
  const [itinerary, setItinerary] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (itinerary) {
      addItinerary(itinerary); // Call the addItinerary function passed from App.js
      setItinerary(''); // Clear the input field
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={itinerary}
        onChange={(e) => setItinerary(e.target.value)}
        placeholder="Add a new itinerary"
      />
      <button type="submit">Add Itinerary</button>
    </form>
  );
}

export default AddItineraryForm;
