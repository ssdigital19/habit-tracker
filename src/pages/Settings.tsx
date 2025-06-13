
import React, { useState, useEffect } from 'react';
import { 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonItem, 
  IonLabel, 
  IonInput, 
  IonButton, 
  IonList,
  IonLoading,
  IonText,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
  useIonToast,
  IonButtons,
  IonBackButton
} from '@ionic/react';
import { db } from '../services/database';
import './Settings.css';

interface HabitFormData {
  name: string;
  description: string;
  points: string;
}

const Settings: React.FC = () => {
  const [formData, setFormData] = useState<HabitFormData>({
    name: '',
    description: '',
    points: '5'
  });
  const [loading, setLoading] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);
  const [present] = useIonToast();

  useEffect(() => {
    const loadPoints = async () => {
      const points = await db.getTotalPoints();
      setTotalPoints(points);
    };
    loadPoints();
  }, []);

  const handleInputChange = (field: keyof HabitFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      present({
        message: 'Please enter a habit name',
        duration: 2000,
        color: 'warning',
        position: 'top'
      });
      return;
    }

    setLoading(true);
    
    try {
      await db.addHabit({
        name: formData.name,
        description: formData.description,
        points: parseInt(formData.points) || 5
      });

      present({
        message: 'Habit added successfully!',
        duration: 2000,
        color: 'success',
        position: 'top'
      });

      // Reset form
      setFormData({
        name: '',
        description: '',
        points: '5'
      });
    } catch (error) {
      console.error('Error adding habit:', error);
      present({
        message: 'Failed to add habit',
        duration: 2000,
        color: 'danger',
        position: 'top'
      });
    } finally {
      setLoading(false);
    }
  };

  const rewards = [
    { id: 1, name: 'Sticker 1', image: '🦊', cost: 50, unlocked: totalPoints >= 50 },
    { id: 2, name: 'Sticker 2', image: '🐰', cost: 100, unlocked: totalPoints >= 100 },
    { id: 3, name: 'Sticker 3', image: '🦄', cost: 150, unlocked: totalPoints >= 150 }
  ];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/dashboard" />
          </IonButtons>
          <IonTitle>Add Habit</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="settings-content">
        <form onSubmit={handleSubmit} className="habit-form">
          <IonList>
            <IonItem>
              <IonLabel position="floating">Habit Name</IonLabel>
              <IonInput
                value={formData.name}
                onIonChange={e => handleInputChange('name', e.detail.value!)}
                required
                disabled={loading}
              />
            </IonItem>
            
            <IonItem>
              <IonLabel position="floating">Description</IonLabel>
              <IonInput
                value={formData.description}
                onIonChange={e => handleInputChange('description', e.detail.value!)}
                disabled={loading}
              />
            </IonItem>
            
            <IonItem>
              <IonLabel position="floating">Points</IonLabel>
              <IonInput
                type="number"
                value={formData.points}
                onIonChange={e => handleInputChange('points', e.detail.value!)}
                min="1"
                max="100"
                disabled={loading}
              />
            </IonItem>
          </IonList>

          <div className="ion-padding">
            <IonButton 
              expand="block" 
              type="submit"
              disabled={!formData.name.trim() || loading}
            >
              {loading ? 'Adding...' : 'Add Habit'}
            </IonButton>
          </div>
        </form>

        <div className="rewards-section">
          <IonText>
            <h2>Rewards</h2>
          </IonText>
          
          <IonGrid>
            <IonRow>
              {rewards.map((reward) => (
                <IonCol size="6" key={reward.id}>
                  <IonCard className={`reward-card ${reward.unlocked ? 'unlocked' : 'locked'}`}>
                    <IonCardContent className="reward-content">
                      <div className="reward-image">
                        {reward.unlocked ? reward.image : '🔒'}
                      </div>
                      <div className="reward-name">{reward.name}</div>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
              ))}
            </IonRow>
          </IonGrid>
          
          <div className="points-info">
            <IonText color="medium">
              <p>Total Brownie Points: {totalPoints}</p>
            </IonText>
          </div>
        </div>
        
        <IonLoading isOpen={loading} message="Adding habit..." />
      </IonContent>
    </IonPage>
  );
};

export default Settings;
