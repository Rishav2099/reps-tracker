'use client';
import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight: number;
  duration: number;
}

const WorkoutForm: React.FC = () => {
  const [exercises, setExercises] = useState<Exercise[]>([
    { name: '', sets: 1, reps: 0, weight: 0, duration: 0 },
  ]);

  const [loading, setLoading] = useState(false);

  // Get the current date in YYYY-MM-DD format
  const currentDate = new Date().toISOString().split('T')[0];

  // Function to handle changes in the exercise fields
  const handleExerciseChange = (index: number, event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    const newExercises = [...exercises];
    newExercises[index] = { ...newExercises[index], [name]: value };
    setExercises(newExercises);
  };

  // Function to add a new exercise row
  const addExercise = () => {
    setExercises([...exercises, { name: '', sets: 0, reps: 0, weight: 0, duration: 0 }]);
  };

  // Function to remove an exercise row
  const removeExercise = (index: number) => {
    const newExercises = exercises.filter((_, i) => i !== index);
    setExercises(newExercises);
  };

  // Function to handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Get the notes value from the form
    const notes = (e.target as HTMLFormElement).elements.namedItem('notes') as HTMLTextAreaElement;
    const workoutData = {
      exercises,
      notes: notes.value,
    };

    try {
      const res = await axios.post('/api/workout', workoutData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Workout submitted successfully', res.data);
      
      // Show success toast
      toast.success('Workout submitted successfully!', {
        style: {
            backgroundColor: 'black',
            color: 'white'
        },
        progressStyle: {
            backgroundColor: 'red'
        }
      });
      
    } catch (error) {
      console.error('Error submitting workout:', error);

      // Show error toast
      toast.error('Error submitting workout. Please try again.' , {
        style: {
            backgroundColor: 'black',
            color: 'white'
        },
        progressStyle: {
            backgroundColor: 'red'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-900 text-gray-200 min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-gray-100">Add Workout</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text text-gray-300">Workout Date</span>
          </label>
          <input
            type="date"
            name="date"
            className="input input-bordered bg-gray-800 text-gray-100"
            defaultValue={currentDate}
            required
          />
        </div>

        {exercises.map((exercise, index) => (
          <div key={index} className="border border-gray-700 p-4 rounded mb-4 bg-gray-800">
            <h2 className="text-lg font-semibold mb-2 text-gray-100">Exercise {index + 1}</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-gray-300">Exercise Name</span>
                </label>
                <input
                  type="text"
                  name="name"
                  className="input input-bordered bg-gray-700 text-gray-100"
                  value={exercise.name}
                  onChange={(e) => handleExerciseChange(index, e)}
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-gray-300">Sets</span>
                </label>
                <input
                  type="number"
                  name="sets"
                  className="input input-bordered bg-gray-700 text-gray-100"
                  value={exercise.sets}
                  onChange={(e) => handleExerciseChange(index, e)}
                  min="1"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-gray-300">Reps</span>
                </label>
                <input
                  type="number"
                  name="reps"
                  className="input input-bordered bg-gray-700 text-gray-100"
                  value={exercise.reps}
                  onChange={(e) => handleExerciseChange(index, e)}
                  min="1"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-gray-300">Weight (kg)</span>
                </label>
                <input
                  type="number"
                  name="weight"
                  className="input input-bordered bg-gray-700 text-gray-100"
                  value={exercise.weight}
                  onChange={(e) => handleExerciseChange(index, e)}
                  min="0"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-gray-300">Duration (mins)</span>
                </label>
                <input
                  type="number"
                  name="duration"
                  className="input input-bordered bg-gray-700 text-gray-100"
                  value={exercise.duration}
                  onChange={(e) => handleExerciseChange(index, e)}
                  min="0"
                />
              </div>
            </div>
            <button
              type="button"
              className="btn btn-error mt-4 bg-red-700 text-gray-100"
              onClick={() => removeExercise(index)}
            >
              Remove Exercise
            </button>
          </div>
        ))}

        <button type="button" className="btn btn-accent bg-blue-700 text-gray-100" onClick={addExercise}>
          Add Another Exercise
        </button>

        <div className="form-control mt-4">
          <label className="label">
            <span className="label-text text-gray-300">Notes</span>
          </label>
          <textarea
            name="notes"
            className="textarea textarea-bordered bg-gray-700 text-gray-100"
            placeholder="Any notes about this workout"
          ></textarea>
        </div>

        <button type="submit" className="btn btn-primary mt-6 bg-blue-600 text-gray-100">
         {loading ? 'Submitting ...' : 'Submit Workout'}
        </button>
      </form>

      {/* Toast container to display notifications */}
      <ToastContainer />
    </div>
  );
};

export default WorkoutForm;
