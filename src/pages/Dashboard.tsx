import React, { useState, useEffect } from 'react';
import { 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonList, 
  IonItem, 
  IonLabel,
  IonBadge,
  IonLoading,
  IonAvatar,
  IonIcon,
  IonButton,
  useIonViewWillEnter
} from '@ionic/react';
import { person } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { db, Habit } from '../services/database';
import HabitCard from '../components/HabitCard';

// Type for the habit that will be passed to HabitCard
type HabitForDisplay = Omit<Habit, 'id'> & { id: string };

interface DashboardProps {
  tab?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ tab = 'dashboard' }) => {
  const [habits, setHabits] = useState<HabitForDisplay[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [todayPoints, setTodayPoints] = useState(0);
  const [loading, setLoading] = useState(true);

  // Convert database habit to display habit
  const toDisplayHabit = (habit: Habit): HabitForDisplay => ({
    ...habit,
    id: habit.id?.toString() || ''
  });

  const [user, setUser] = useState<{ name: string; avatar?: string } | null>(null);
  const history = useHistory();

  useIonViewWillEnter(() => {
    const loadUser = async () => {
      const currentUser = await db.getCurrentUser();
      if (currentUser) {
        setUser({
          name: currentUser.name,
          avatar: currentUser.avatar
        });
      }
    };
    loadUser();
    return () => {}; // Cleanup function
  });

  // Load habits and points
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Load habits
        const dbHabits = await db.getHabits();
        setHabits(dbHabits.map(toDisplayHabit));
        
        // Load points
        const total = await db.getTotalPoints();
        setTotalPoints(total);
        
        const today = await db.getTodaysPoints();
        setTodayPoints(today?.totalPoints || 0);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const toggleHabit = async (habit: HabitForDisplay) => {
    try {
      // Convert string ID back to number for database
      const habitId = parseInt(habit.id, 10);
      if (isNaN(habitId)) {
        throw new Error('Invalid habit ID');
      }
      
      await db.toggleHabit(habitId, !habit.completed);
      
      // Refresh data
      const updatedHabits = await db.getHabits();
      setHabits(updatedHabits.map(toDisplayHabit));
      
      const total = await db.getTotalPoints();
      setTotalPoints(total);
      
      const today = await db.getTodaysPoints();
      setTodayPoints(today?.totalPoints || 0);
    } catch (error) {
      console.error('Error toggling habit:', error);
    }
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonTitle>Habit Tracker</IonTitle>
          <IonButton 
            slot="end" 
            fill="clear" 
            className="profile-button"
            routerLink="/tabs/profile"
            routerDirection="forward"
          >
            {user?.avatar ? (
              <IonAvatar className="header-avatar">
                <img src={user.avatar} alt={user.name} />
              </IonAvatar>
            ) : (
              <IonAvatar className="header-avatar">
                <IonIcon icon={person} className="profile-placeholder" />
              </IonAvatar>
            )}
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonItem>
            <IonLabel>Today's Points</IonLabel>
            <IonBadge color="primary" slot="end">{todayPoints}</IonBadge>
          </IonItem>
          <IonItem>
            <IonLabel>Total Points</IonLabel>
            <IonBadge color="success" slot="end">{totalPoints}</IonBadge>
          </IonItem>
        </IonList>
        
        {habits.map((habit) => (
          <HabitCard 
            key={habit.id} 
            habit={habit}
            onToggle={toggleHabit} 
          />
        ))}
        
        <IonLoading isOpen={loading} message="Loading..." />
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;
