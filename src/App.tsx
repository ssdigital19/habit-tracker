import { Redirect, Route } from 'react-router-dom';
import React from 'react';
import { IonApp, IonRouterOutlet, setupIonicReact, IonLoading } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Tabs from './components/Tabs';
import Onboarding from './pages/Onboarding';
import { db } from './services/database';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const AppContent: React.FC = () => {
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const hasCompletedOnboarding = await db.hasCompletedOnboarding();
        setShowOnboarding(!hasCompletedOnboarding);
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        // Default to showing onboarding on error
        setShowOnboarding(true);
      } finally {
        setIsLoading(false);
      }
    };

    checkOnboardingStatus();
  }, []);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    history.push('/tabs/dashboard');
  };

  if (isLoading) {
    return (
      <IonLoading
        isOpen={true}
        message={'Loading...'}
      />
    );
  }

  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <IonRouterOutlet>
      <Route path="/tabs" component={Tabs} />
      <Redirect exact from="/" to="/tabs/dashboard" />
    </IonRouterOutlet>
  );
};

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <AppContent />
    </IonReactRouter>
  </IonApp>
);

export default App;
