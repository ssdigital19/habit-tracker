import React, { useState, useEffect } from 'react';
import { 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent,
  IonLoading
} from '@ionic/react';
import CalendarView from '../components/CalendarView';
import { db } from '../services/database';

interface CalendarProps {
  tab?: string;
}

const CalendarPage: React.FC<CalendarProps> = ({ tab = 'calendar' }) => {
  const [completedHabits, setCompletedHabits] = useState<{[key: string]: number}>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCompletedHabits = async () => {
      try {
        setLoading(true);
        
        // Get all daily points
        const allPoints = await db.dailyPoints.toArray();
        
        // Transform to the format expected by CalendarView
        const habitsByDate: {[key: string]: number} = {};
        
        allPoints.forEach(day => {
          // Count the number of habits completed each day
          habitsByDate[day.date] = day.habitsCompleted.length;
        });
        
        setCompletedHabits(habitsByDate);
      } catch (error) {
        console.error('Error loading completed habits:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCompletedHabits();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Calendar</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <CalendarView completedHabits={completedHabits} />
        <IonLoading isOpen={loading} message="Loading calendar data..." />
      </IonContent>
    </IonPage>
  );
};

export default CalendarPage;
