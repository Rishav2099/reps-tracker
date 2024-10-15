import { NextRequest, NextResponse } from "next/server";
import Workout from "@/models/workoutModel";
import { connect } from "@/dbConfig/dbConfig";

import { auth } from "@clerk/nextjs/server";

connect();

export async function POST(request: NextRequest) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    console.log("Request body:", body); // Log the request body to verify its structure

    const { exercises, notes, date } = body;

    if (!exercises || exercises.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newWorkout = new Workout({
      userId,
      exercises,
      notes,
      date
    });

    await newWorkout.save();

    return NextResponse.json(
      { message: "Workout saved successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving workout:", error);
    return NextResponse.json(
      { error: "Failed to save workout" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    // finding workout by userid
    const workouts = await Workout.find({ userId });

    const workoutsPlain = workouts.map((workout) => workout.toObject())

    //returning the workouts of a user
    return NextResponse.json(workoutsPlain, { status: 200 });
  } catch (error) {
    console.error("Error fetching workouts:", error);
    return NextResponse.json(
      { error: "Failed to fetch workouts" },
      { status: 500 }
    );
  }
}
