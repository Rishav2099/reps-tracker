'use client';
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import axios from "axios";

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight: number;
  duration: number;
}

interface Workout {
  _id: string;
  exercises: Exercise[];
  notes: string;
  date: string;
}

const UserProfile = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  // Function to group workouts by date
  const groupWorkoutsByDate = (workouts: Workout[]) => {
    return workouts.reduce((groupedWorkouts, workout) => {
      const date = new Date(workout.date).toLocaleDateString();
      if (!groupedWorkouts[date]) {
        groupedWorkouts[date] = [];
      }
      groupedWorkouts[date].push(workout);
      return groupedWorkouts;
    }, {} as Record<string, Workout[]>);
  };

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await axios.get('/api/workout');
        setWorkouts(response.data);
      } catch (error) {
        console.error("Error fetching workouts:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isLoaded && isSignedIn) {
      fetchWorkouts();
    }
  }, [isLoaded, isSignedIn]);

  if (!isLoaded || !isSignedIn) {
    return <p>Loading...</p>;
  }

  const groupedWorkouts = groupWorkoutsByDate(workouts);

  return (
    <div className="h-full p-8 bg-gray-900 text-white"> {/* Dark theme */}
      <h2 className="text-2xl font-bold mb-4">Welcome, {user.firstName}</h2>

      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Your Workouts</h3>
        {loading ? (
          <p>Loading workouts...</p>
        ) : (
          <div className="space-y-4">
            {Object.keys(groupedWorkouts).length > 0 ? (
              Object.entries(groupedWorkouts).map(([date, workouts]) => (
                <div key={date} className="p-4 bg-gray-800 rounded shadow">
                  <h4 className="text-lg font-medium">
                    Workouts on {date}
                  </h4>
                  {workouts.map((workout) => (
                    <div key={workout._id} className="mt-2">
                      <ul className="list-disc list-inside">
                        {workout.exercises.map((exercise, index) => (
                          <li key={index}>
                            {exercise.name} - {exercise.sets} sets, {exercise.reps} reps
                            {exercise.weight > 0 && `, ${exercise.weight} kg`}
                            {exercise.duration > 0 && `, ${exercise.duration} mins`}
                          </li>
                        ))}
                      </ul>
                      {workout.notes && <p className="mt-2 text-sm text-gray-400">Notes: {workout.notes}</p>}
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <p>No workouts found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
