import React from 'react';
import { 
  IonIcon, 
  IonLabel, 
  IonRouterOutlet, 
  IonTabBar, 
  IonTabButton, 
  IonTabs,
  IonAvatar,
  useIonViewWillEnter,
  useIonViewDidEnter
} from '@ionic/react';
import { calendar, home, settings, person } from 'ionicons/icons';
import { useState } from 'react';
import { db } from '../services/database';
import { Redirect, Route } from 'react-router-dom';

import Dashboard from '../pages/Dashboard';
import Calendar from '../pages/Calendar';
import Settings from '../pages/Settings';
import Profile from '../pages/Profile';

const Tabs: React.FC = () => {
  const [userAvatar, setUserAvatar] = useState<string | undefined>(undefined);

  const loadUserAvatar = async () => {
    const user = await db.getCurrentUser();
    if (user?.avatar) {
      setUserAvatar(user.avatar);
    }
  };

  // Load user avatar when the tabs component is first loaded
  useIonViewDidEnter(() => {
    loadUserAvatar();
  });

  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/tabs/dashboard">
          <Dashboard />
        </Route>
        <Route exact path="/tabs/calendar">
          <Calendar />
        </Route>
        <Route exact path="/tabs/settings">
          <Settings />
        </Route>
        <Route exact path="/tabs/profile">
          <Profile />
        </Route>
        <Route exact path="/tabs">
          <Redirect to="/tabs/dashboard" />
        </Route>
      </IonRouterOutlet>

      <IonTabBar slot="bottom">
        <IonTabButton tab="dashboard" href="/tabs/dashboard">
          <IonIcon icon={home} />
          <IonLabel>Home</IonLabel>
        </IonTabButton>
        <IonTabButton tab="calendar" href="/tabs/calendar">
          <IonIcon icon={calendar} />
          <IonLabel>Calendar</IonLabel>
        </IonTabButton>
        <IonTabButton tab="settings" href="/tabs/settings">
          <IonIcon icon={settings} />
          <IonLabel>Settings</IonLabel>
        </IonTabButton>
        <IonTabButton tab="profile" href="/tabs/profile">
          {userAvatar ? (
            <IonAvatar className="tab-avatar">
              <img src={userAvatar} alt="Profile" />
            </IonAvatar>
          ) : (
            <IonIcon icon={person} />
          )}
          <IonLabel>Profile</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default Tabs;
