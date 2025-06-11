import React, { useState, useEffect, useRef } from 'react';
import { 
  IonContent, 
  IonHeader, 
  IonPage, 
  IonTitle, 
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
  IonIcon,
  IonButton,
  IonLoading,
  IonAvatar,
  IonItem,
  IonLabel,
  IonInput,
  IonText,
  useIonToast,
  IonButtons,
  IonBackButton
} from '@ionic/react';
import { logOutOutline, trophyOutline, calendarOutline, checkmarkCircleOutline, camera, save } from 'ionicons/icons';
import { db, User } from '../services/database';
import './Profile.css';

interface ProfileProps {
  tab?: string;
}

const Profile: React.FC<ProfileProps> = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<Omit<User, 'id' | 'createdAt'>>({ 
    name: '', 
    email: '',
    avatar: ''
  });
  const [totalPoints, setTotalPoints] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [activeHabits, setActiveHabits] = useState(0);
  const [level, setLevel] = useState(1);
  const [present] = useIonToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load user data
        const currentUser = await db.getCurrentUser();
        if (currentUser) {
          const { id, createdAt, ...userData } = currentUser;
          setUser(userData);
        }
        
        // Load user stats from database
        const habits = await db.getHabits();
        const points = await db.getTotalPoints();
        
        setTotalPoints(points);
        setActiveHabits(habits.length);
        // Simple level calculation: 1 level per 100 points
        setLevel(Math.floor(points / 100) + 1);
        
        // In a real app, you would calculate the streak from the database
        // For now, we'll use a placeholder
        setCurrentStreak(7);
      } catch (error) {
        console.error('Error loading profile data:', error);
        present({
          message: 'Failed to load profile data',
          duration: 2000,
          color: 'danger',
          position: 'top'
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleAvatarClick = () => {
    if (isEditing) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser({ ...user, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (field: keyof typeof user, value: string) => {
    setUser(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const currentUser = await db.getCurrentUser();
      if (!currentUser?.id) {
        throw new Error('User not found');
      }
      
      await db.updateUser(currentUser.id, {
        name: user.name,
        email: user.email,
        avatar: user.avatar
      });
      
      present({
        message: 'Profile updated successfully',
        duration: 2000,
        color: 'success',
        position: 'top'
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      present({
        message: 'Failed to update profile',
        duration: 2000,
        color: 'danger',
        position: 'top'
      });
    }
  };

  const handleSignOut = () => {
    // In a real app, you would sign out the user here
    // For now, we'll just reload the app which will show the onboarding screen
    window.location.reload();
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/dashboard" />
          </IonButtons>
          <IonTitle>Profile</IonTitle>
          {isEditing ? (
            <IonButtons slot="end">
              <IonButton onClick={handleSave}>
                <IonIcon icon={save} slot="icon-only" />
              </IonButton>
            </IonButtons>
          ) : (
            <IonButtons slot="end">
              <IonButton onClick={() => setIsEditing(true)}>Edit</IonButton>
            </IonButtons>
          )}
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonLoading isOpen={isLoading} message="Loading profile..." />
        
        <div className="ion-text-center ion-margin-vertical">
          <div className="avatar-upload" onClick={handleAvatarClick}>
            <IonAvatar className="profile-avatar">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} />
              ) : (
                <IonIcon icon={trophyOutline} className="profile-icon" />
              )}
            </IonAvatar>
            {isEditing && (
              <div className="avatar-edit-overlay">
                <IonIcon icon={camera} />
              </div>
            )}
          </div>
          
          {isEditing ? (
            <>
              <IonItem className="ion-margin-vertical">
                <IonLabel position="floating">Name</IonLabel>
                <IonInput 
                  value={user.name} 
                  onIonChange={e => handleInputChange('name', e.detail.value!)} 
                  required 
                />
              </IonItem>
              <IonItem className="ion-margin-vertical">
                <IonLabel position="floating">Email</IonLabel>
                <IonInput 
                  type="email" 
                  value={user.email} 
                  onIonChange={e => handleInputChange('email', e.detail.value!)} 
                  required 
                />
              </IonItem>
            </>
          ) : (
            <>
              <h2>{user.name || 'User Name'}</h2>
              <IonText color="medium">{user.email}</IonText>
              <p>Level {level} Habit Master</p>
            </>
          )}
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <IonIcon icon={trophyOutline} className="stat-icon" color="warning" />
            <div className="stat-value">{totalPoints}</div>
            <div className="stat-label">Total Points</div>
          </div>
          <div className="stat-card">
            <IonIcon icon={calendarOutline} className="stat-icon" color="success" />
            <div className="stat-value">{currentStreak} {currentStreak === 1 ? 'day' : 'days'}</div>
            <div className="stat-label">Current Streak</div>
          </div>
          <div className="stat-card">
            <IonIcon icon={checkmarkCircleOutline} className="stat-icon" color="primary" />
            <div className="stat-value">{activeHabits}</div>
            <div className="stat-label">Active Habits</div>
          </div>
        </div>

        <div className="ion-padding">
          <IonButton 
            expand="block" 
            className="ion-margin-top" 
            onClick={handleSignOut}
            fill="outline"
          >
            <IonIcon icon={logOutOutline} slot="start" />
            Sign Out
          </IonButton>
        </div>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          style={{ display: 'none' }}
        />
      </IonContent>
    </IonPage>
  );
};

export default Profile;
