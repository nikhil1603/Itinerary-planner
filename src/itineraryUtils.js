export function saveItinerary(itinerary) {
    const itineraries = JSON.parse(localStorage.getItem('itineraries')) || [];
    itineraries.push(itinerary);
    localStorage.setItem('itineraries', JSON.stringify(itineraries));
  }
  
  export function getItineraries() {
    return JSON.parse(localStorage.getItem('itineraries')) || [];
  }
  