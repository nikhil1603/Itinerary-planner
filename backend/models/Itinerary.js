// backend/models/Itinerary.js
const itinerarySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    activities: [{ location: String, description: String, time: String }],
    votes: { type: Number, default: 0 },
    isPublic: { type: Boolean, default: true },
  });
  
  module.exports = mongoose.model('Itinerary', itinerarySchema);
  