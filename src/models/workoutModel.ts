import mongoose from 'mongoose';

// Exercise Schema
const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  sets: {
    type: Number,
    required: true,
  },
  reps: {
    type: Number,
    required: true,
  },
  weight: {
    type: Number, // Optional: if user tracks weights
    default: 0,
  },
  duration: {
    type: Number, // Optional: if tracking time-based exercises like cardio
    default: 0,
  },
});

// Workout Schema
const workoutSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  exercises: [exerciseSchema], // Array of exercises
  notes: {
    type: String, // Optional field for users to add workout notes
    default: '',
  },
});

// Export Workout Model
const Workout  = mongoose.models.workout || mongoose.model('workout', workoutSchema);

export default Workout
