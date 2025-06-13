import Dexie, { Table } from 'dexie';

export interface User {
  id?: number;
  name: string;
  email: string;
  avatar?: string;
  createdAt: Date;
}

export interface Habit {
  id?: number;
  name: string;
  description: string;
  points: number;
  completed: boolean;
  lastCompleted?: Date;
  createdAt: Date;
}

export interface DailyPoints {
  id?: number;
  date: string; // YYYY-MM-DD format
  totalPoints: number;
  habitsCompleted: number[]; // Array of habit IDs completed that day
}

class HabitTrackerDB extends Dexie {
  users!: Table<User, number>;
  habits!: Table<Habit, number>;
  dailyPoints!: Table<DailyPoints, number>;
  private currentUser: User | null = null;

  constructor() {
    super('HabitTrackerDB');
    this.version(2).stores({
      users: '++id, email',
      habits: '++id, name, completed',
      dailyPoints: '++id, date',
    });
  }

  // User management
  async createUser(userData: Omit<User, 'id' | 'createdAt'>) {
    const existingUser = await this.users.where('email').equals(userData.email).first();
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    const userId = await this.users.add({
      ...userData,
      createdAt: new Date()
    });
    
    this.currentUser = await this.users.get(userId) || null;
    return userId;
  }

  async getCurrentUser() {
    if (!this.currentUser) {
      // Try to get the first user (for demo purposes)
      this.currentUser = await this.users.orderBy('id').first() || null;
    }
    return this.currentUser;
  }

  async updateUser(userId: number, updates: Partial<Omit<User, 'id' | 'createdAt'>>) {
    await this.users.update(userId, updates);
    this.currentUser = await this.users.get(userId) || null;
    return this.currentUser;
  }

  async hasCompletedOnboarding() {
    const user = await this.getCurrentUser();
    return !!user;
  }

  // Habit methods
  async addHabit(habit: Omit<Habit, 'id' | 'createdAt' | 'completed'>) {
    return this.habits.add({
      ...habit,
      completed: false,
      createdAt: new Date(),
    });
  }

  async getHabits() {
    return this.habits.toArray();
  }

  async toggleHabit(id: number, completed: boolean) {
    await this.habits.update(id, { 
      completed,
      lastCompleted: completed ? new Date() : undefined
    });
    
    // Update daily points
    if (completed) {
      await this.updateDailyPoints(id);
    }
    
    return this.habits.get(id);
  }

  // Daily points methods
  private async updateDailyPoints(habitId: number) {
    const today = new Date().toISOString().split('T')[0];
    const habit = await this.habits.get(habitId);
    
    if (!habit) return;
    
    const existingEntry = await this.dailyPoints
      .where('date')
      .equals(today)
      .first();

    if (existingEntry) {
      // Update existing entry
      if (!existingEntry.habitsCompleted.includes(habitId)) {
        await this.dailyPoints.update(existingEntry.id!, {
          totalPoints: existingEntry.totalPoints + habit.points,
          habitsCompleted: [...existingEntry.habitsCompleted, habitId]
        });
      }
    } else {
      // Create new entry
      await this.dailyPoints.add({
        date: today,
        totalPoints: habit.points,
        habitsCompleted: [habitId]
      });
    }
  }

  async getTodaysPoints() {
    const today = new Date().toISOString().split('T')[0];
    return this.dailyPoints
      .where('date')
      .equals(today)
      .first();
  }

  async getTotalPoints() {
    const points = await this.dailyPoints.toArray();
    return points.reduce((sum, day) => sum + day.totalPoints, 0);
  }
}

export const db = new HabitTrackerDB();

// Initialize with default habits if none exist
db.getHabits().then(async habits => {
  if (habits.length === 0) {
    const defaultHabits = [
      {
        name: 'Make Bed',
        description: 'Complete by 8:00 AM',
        points: 5,
      },
      {
        name: 'Brush Teeth',
        description: 'Complete by 8:30 AM',
        points: 5,
      },
      {
        name: 'Get Dressed',
        description: 'Complete by 9:00 AM',
        points: 5,
      },
      {
        name: 'Eat Breakfast',
        description: 'Complete by 9:30 AM',
        points: 10,
      },
      {
        name: 'Pack Lunch',
        description: 'Complete by 10:00 AM',
        points: 5,
      },
      {
        name: 'Tidy Room',
        description: 'Complete by 10:30 AM',
        points: 10,
      },
      {
        name: 'Homework',
        description: 'Complete by 11:00 AM',
        points: 15,
      },
      {
        name: 'Practice Instrument',
        description: 'Complete by 11:30 AM',
        points: 10,
      },
      {
        name: 'Read Book',
        description: 'Complete by 12:00 PM',
        points: 10,
      },
      {
        name: 'Water Plants',
        description: 'Complete by 12:30 PM',
        points: 5,
      },
    ];

    defaultHabits.forEach(habit => db.addHabit(habit));
  }
});
