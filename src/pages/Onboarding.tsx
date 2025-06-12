import React, { useState, useRef, FC } from 'react';
import { 
  IonPage, 
  IonContent, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonButton, 
  IonInput, 
  IonItem, 
  IonLabel, 
  IonIcon,
  IonAvatar,
  IonProgressBar,
  useIonToast
} from '@ionic/react';
import { camera, arrowForward } from 'ionicons/icons';
import { useHistory } from 'react-router';
import { db } from '../services/database';
import './Onboarding.css';

interface OnboardingProps {
  onComplete: () => void;
}

const Onboarding: FC<OnboardingProps> = ({ onComplete }) => {
  const history = useHistory();
  const [present] = useIonToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim()) {
      present({
        message: 'Please fill in all fields',
        duration: 2000,
        color: 'warning',
        position: 'top'
      });
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      present({
        message: 'Please enter a valid email address',
        duration: 2000,
        color: 'warning',
        position: 'top'
      });
      return;
    }

    try {
      setIsLoading(true);
      
      // Create user in database
      await db.createUser({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        avatar: avatar || undefined
      });
      
      // Call the onComplete callback to notify parent component
      onComplete();
    } catch (error) {
      console.error('Error creating user:', error);
      present({
        message: 'Failed to create account. Please try again.',
        duration: 3000,
        color: 'danger',
        position: 'top'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Welcome to Habit Tracker</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="onboarding-container">
          <h1>Let's get started</h1>
          <p className="subtitle">Create your account to start building better habits</p>
          
          <form onSubmit={handleSubmit} className="onboarding-form">
            <div className="avatar-upload" onClick={handleAvatarClick}>
              <IonAvatar className="profile-avatar">
                {avatar ? (
                  <img src={avatar} alt="Profile" />
                ) : (
                  <IonIcon icon={camera} className="camera-icon" />
                )}
              </IonAvatar>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: 'none' }}
              />
              <div className="avatar-edit-overlay">
                <IonIcon icon={camera} />
              </div>
            </div>
            
            <IonItem className="form-item" lines="none">
              <IonLabel position="floating">Full Name</IonLabel>
              <IonInput
                fill="solid"
                type="text"
                value={name}
                onIonChange={(e) => setName(e.detail.value!)}
                required
                autocomplete="name"
                style={{
                  '--padding-start': '12px',
                  '--padding-end': '12px',
                  '--background': 'var(--ion-color-light)',
                  '--border-radius': '8px',
                  '--padding-top': '16px',
                  '--padding-bottom': '16px',
                }}
              />
            </IonItem>
            
            <IonItem className="form-item" lines="none">
              <IonLabel position="floating">Email</IonLabel>
              <IonInput
                fill="solid"
                type="email"
                value={email}
                onIonChange={(e) => setEmail(e.detail.value!)}
                required
                inputMode="email"
                autocomplete="email"
                style={{
                  '--padding-start': '12px',
                  '--padding-end': '12px',
                  '--background': 'var(--ion-color-light)',
                  '--border-radius': '8px',
                  '--padding-top': '16px',
                  '--padding-bottom': '16px',
                }}
              />
            </IonItem>
            
            <IonButton 
              type="submit" 
              expand="block" 
              fill="solid"
              className="submit-button"
              disabled={isLoading}
              style={{
                '--border-radius': '8px',
                '--padding-top': '16px',
                '--padding-bottom': '16px',
                'margin-top': '24px',
                'height': '48px',
                'font-weight': '600',
              }}
            >
              {isLoading ? 'Creating Account...' : 'Get Started'}
              {!isLoading && <IonIcon icon={arrowForward} slot="end" />}
            </IonButton>
            
            {isLoading && (
              <IonProgressBar type="indeterminate" color="primary" />
            )}
          </form>
          
          <div className="terms">
            <p>By signing up, you agree to our Terms of Service and Privacy Policy</p>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Onboarding;
