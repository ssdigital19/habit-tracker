import React from 'react';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet } from '@ionic/react';
import { Route, Redirect } from 'react-router-dom';
import { homeOutline, listOutline, calendarOutline, personOutline, giftOutline } from 'ionicons/icons';
import Dashboard from '../pages/Dashboard';
import Settings from '../pages/Settings';
import Calendar from '../pages/Calendar';
import Profile from '../pages/Profile';

const Tabs: React.FC = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/tabs/dashboard">
          <Dashboard />
        </Route>
        <Route exact path="/tabs/habits">
          <Settings />
        </Route>
        <Route exact path="/tabs/rewards">
          <Settings />
        </Route>
        <Route exact path="/tabs/calendar">
          <Calendar />
        </Route>
        <Route exact path="/tabs/profile">
          <Profile />
        </Route>
        <Route exact path="/tabs/settings">
          <Settings />
        </Route>
        <Route exact path="/tabs">
          <Redirect to="/tabs/dashboard" />
        </Route>
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="dashboard" href="/tabs/dashboard">
          <IonIcon icon={homeOutline} />
          <IonLabel>Home</IonLabel>
        </IonTabButton>
        <IonTabButton tab="habits" href="/tabs/habits">
          <IonIcon icon={listOutline} />
          <IonLabel>Habits</IonLabel>
        </IonTabButton>
        <IonTabButton tab="rewards" href="/tabs/rewards">
          <IonIcon icon={giftOutline} />
          <IonLabel>Rewards</IonLabel>
        </IonTabButton>
        <IonTabButton tab="profile" href="/tabs/profile">
          <IonIcon icon={personOutline} />
          <IonLabel>Profile</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default Tabs;