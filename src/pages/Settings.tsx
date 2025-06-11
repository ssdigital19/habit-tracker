import React, { useState } from 'react';
import { 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonList, 
  IonItem, 
  IonLabel, 
  IonInput, 
  IonTextarea, 
  IonButton,
  IonButtons,
  IonBackButton,
  IonLoading,
  useIonToast
} from '@ionic/react';
import { useHistory } from 'react-router';
import { db } from '../services/database';

interface HabitFormData {
  name: string;
  description: string;
  points: string;
}

const Settings: React.FC = () => {
  const history = useHistory();
  const [present] = useIonToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<HabitFormData>({
    name: '',
    description: '',
    points: '5'
  });

  const handleInputChange = (field: keyof HabitFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Add new habit to the database
      await db.addHabit({
        name: formData.name.trim(),
        description: formData.description.trim(),
        points: parseInt(formData.points, 10) || 5
      });
      
      // Show success message
      await present({
        message: 'Habit added successfully!',
        duration: 2000,
        color: 'success'
      });
      
      // Go back to dashboard
      history.push('/dashboard');
    } catch (error) {
      console.error('Error adding habit:', error);
      await present({
        message: 'Failed to add habit. Please try again.',
        duration: 3000,
        color: 'danger'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/dashboard" />
          </IonButtons>
          <IonTitle>Add New Habit</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <form onSubmit={handleSubmit}>
          <IonList>
            <IonItem>
              <IonLabel position="stacked">Habit Name</IonLabel>
              <IonInput 
                value={formData.name} 
                onIonChange={e => handleInputChange('name', e.detail.value!)}
                required 
                placeholder="e.g., Morning Run"
              />
            </IonItem>
            
            <IonItem>
              <IonLabel position="stacked">Description (Optional)</IonLabel>
              <IonTextarea 
                value={formData.description} 
                onIonChange={e => handleInputChange('description', e.detail.value!)}
                rows={3}
                placeholder="e.g., 30 minutes of running in the morning"
              />
            </IonItem>
            
            <IonItem>
              <IonLabel position="stacked">Points</IonLabel>
              <IonInput 
                type="number" 
                value={formData.points} 
                onIonChange={e => handleInputChange('points', e.detail.value!)}
                min="1"
                max="100"
                required 
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
        
        <IonLoading isOpen={loading} message="Adding habit..." />
      </IonContent>
    </IonPage>
  );
};

export default Settings;
