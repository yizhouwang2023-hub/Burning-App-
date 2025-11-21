import { GoogleGenAI, Type, Schema } from "@google/genai";
import { WorkoutPlan } from '../types';

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const workoutPlanSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    description: { type: Type.STRING },
    difficulty: { type: Type.STRING, enum: ['Beginner', 'Intermediate', 'Advanced'] },
    durationWeeks: { type: Type.INTEGER },
    schedule: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          week: { type: Type.INTEGER },
          days: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.STRING },
                activity: { type: Type.STRING },
                focus: { type: Type.STRING },
                durationMin: { type: Type.INTEGER }
              },
              required: ['day', 'activity', 'focus', 'durationMin']
            }
          }
        },
        required: ['week', 'days']
      }
    }
  },
  required: ['title', 'description', 'difficulty', 'durationWeeks', 'schedule']
};

export const generateWorkoutPlan = async (goal: string, fitnessLevel: string, daysPerWeek: number): Promise<WorkoutPlan | null> => {
  try {
    const prompt = `
      Create a structured running workout plan for a user with the following details:
      Goal: ${goal}
      Fitness Level: ${fitnessLevel}
      Available Days Per Week: ${daysPerWeek}
      
      The plan should cover 2 weeks as a sample.
      Focus on heart rate zones and pacing suited for smart audio coaching.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: workoutPlanSchema,
        systemInstruction: "You are an elite running coach designing plans for users with advanced biometric earphones. Be precise, encouraging, and scientific."
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as WorkoutPlan;
    }
    return null;

  } catch (error) {
    console.error("Error generating workout plan:", error);
    return null;
  }
};

export const analyzePostWorkout = async (stats: { distance: number; avgHr: number; avgPace: string; duration: number }): Promise<string> => {
  try {
    const prompt = `
      Analyze this workout session data captured by smart earphones:
      Distance: ${stats.distance.toFixed(2)} km
      Duration: ${(stats.duration / 60).toFixed(1)} minutes
      Avg Heart Rate: ${stats.avgHr} bpm
      Avg Pace: ${stats.avgPace} /km
      
      Give a brief, 2-sentence summary of performance and 1 specific tip for next time.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Great workout! Keep pushing your limits.";
  } catch (error) {
    console.error("Analysis error", error);
    return "Unable to analyze workout at this time.";
  }
};