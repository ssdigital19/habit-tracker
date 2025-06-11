import React from 'react';
import { 
  IonCard, 
  IonCardContent, 
  IonCheckbox, 
  IonLabel, 
  IonItem, 
  IonBadge 
} from '@ionic/react';
import { Habit } from '../services/database';

interface HabitCardProps {
  habit: Omit<Habit, 'id'> & { id: string };
  onToggle: (habit: Omit<Habit, 'id'> & { id: string }) => void;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, onToggle }) => {
  return (
    <IonCard>
      <IonItem>
        <IonCheckbox
          slot="start"
          checked={habit.completed}
          onIonChange={() => onToggle(habit)}
        />
        <IonLabel>
          <h2>{habit.name}</h2>
          <p>{habit.description}</p>
        </IonLabel>
        <IonBadge color="primary" slot="end">
          {habit.points} pts
        </IonBadge>
      </IonItem>
    </IonCard>
  );
};

export default HabitCard;
