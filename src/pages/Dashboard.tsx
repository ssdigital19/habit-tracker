
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
  IonIcon,
  IonButton,
  IonProgressBar,
  IonText,
  IonCheckbox,
  useIonViewWillEnter
} from '@ionic/react';
import { 
  settingsOutline,
  bedOutline,
  brushOutline,
  shirtOutline,
  restaurantOutline,
  bagOutline,
  homeOutline,
  bookOutline,
  musicalNoteOutline,
  libraryOutline,
  waterOutline
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { db, Habit } from '../services/database';
import './Dashboard.css';

const habitIcons: { [key: string]: string } = {
  'Make Bed': bedOutline,
  'Brush Teeth': brushOutline,
  'Get Dressed': shirtOutline,
  'Eat Breakfast': restaurantOutline,
  'Pack Lunch': bagOutline,
  'Tidy Room': homeOutline,
  'Homework': bookOutline,
  'Practice Instrument': musicalNoteOutline,
  'Read Book': libraryOutline,
  'Water Plants': waterOutline,
  'Meditate': musicalNoteOutline,
  'Exercise': shirtOutline,
  'Read': libraryOutline
};

const habitTimes: { [key: string]: string } = {
  'Make Bed': '8:00 AM',
  'Brush Teeth': '8:30 AM',
  'Get Dressed': '9:00 AM',
  'Eat Breakfast': '9:30 AM',
  'Pack Lunch': '10:00 AM',
  'Tidy Room': '10:30 AM',
  'Homework': '11:00 AM',
  'Practice Instrument': '11:30 AM',
  'Read Book': '12:00 PM',
  'Water Plants': '12:30 PM'
};

interface DashboardProps {
  tab?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ tab = 'dashboard' }) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completedCount, setCompletedCount] = useState(0);
  const history = useHistory();

  useEffect(() => {
    const loadData = async () => {
      try {
        const dbHabits = await db.getHabits();
        setHabits(dbHabits);
        const completed = dbHabits.filter(h => h.completed).length;
        setCompletedCount(completed);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, []);

  const toggleHabit = async (habit: Habit) => {
    try {
      if (habit.id) {
        await db.toggleHabit(habit.id, !habit.completed);
        const updatedHabits = await db.getHabits();
        setHabits(updatedHabits);
        const completed = updatedHabits.filter(h => h.completed).length;
        setCompletedCount(completed);
      }
    } catch (error) {
      console.error('Error toggling habit:', error);
    }
  };

  const progressPercentage = habits.length > 0 ? (completedCount / habits.length) : 0;

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonTitle>Daily Habits</IonTitle>
          <IonButton 
            slot="end" 
            fill="clear" 
            routerLink="/tabs/settings"
          >
            <IonIcon icon={settingsOutline} />
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent className="dashboard-content">
        <div className="progress-section">
          <IonText>
            <h3>Daily Progress</h3>
          </IonText>
          <IonProgressBar value={progressPercentage} className="progress-bar" />
          <IonText color="medium">
            <p>{completedCount}/{habits.length} Habits Completed</p>
          </IonText>
        </div>

        <div className="habits-section">
          <IonText>
            <h2>Habits</h2>
          </IonText>
          
          <IonList className="habits-list">
            {habits.map((habit) => (
              <IonItem key={habit.id} className="habit-item" lines="none">
                <div className="habit-icon-container">
                  <IonIcon 
                    icon={habitIcons[habit.name] || bookOutline} 
                    className="habit-icon"
                  />
                </div>
                <IonLabel className="habit-label">
                  <h3>{habit.name}</h3>
                  <p>Complete by {habitTimes[habit.name] || '12:00 PM'}</p>
                </IonLabel>
                <IonCheckbox
                  slot="end"
                  checked={habit.completed}
                  onIonChange={() => toggleHabit(habit)}
                  className="habit-checkbox"
                />
              </IonItem>
            ))}
          </IonList>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;
