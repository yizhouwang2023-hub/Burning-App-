export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  PLANNER = 'PLANNER',
  ANALYSIS = 'ANALYSIS',
  SETTINGS = 'SETTINGS'
}

export interface BiometricData {
  heartRate: number;
  pace: string; // mm:ss / km
  cadence: number;
  distance: number; // km
  duration: number; // seconds
  calories: number;
  zone: number; // 1-5
}

export interface WorkoutPlan {
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  durationWeeks: number;
  schedule: WeeklySchedule[];
}

export interface WeeklySchedule {
  week: number;
  days: DailyWorkout[];
}

export interface DailyWorkout {
  day: string;
  activity: string;
  focus: string;
  durationMin: number;
}

export interface UserProfile {
  name: string;
  age: number;
  weight: number;
  height: number;
  maxHr: number;
}

export enum ConnectionStatus {
  DISCONNECTED = 'DISCONNECTED',
  SEARCHING = 'SEARCHING',
  CONNECTED = 'CONNECTED'
}