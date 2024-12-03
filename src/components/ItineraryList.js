import React from 'react';

function ItineraryList({ itineraries }) {
  return (
    <div>
      <h3>Planned Itineraries</h3>
      <ul>
        {itineraries.map((itinerary, index) => (
          <li key={index}>{itinerary}</li>
        ))}
      </ul>
    </div>
  );
}

export default ItineraryList;
