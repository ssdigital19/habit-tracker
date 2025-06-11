export interface Habit {
  id: string;
  name: string;
  description: string;
  points: number;
  completed: boolean;
  createdAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  totalPoints: number;
  streak: number;
}
