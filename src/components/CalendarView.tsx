import React from 'react';
import { IonGrid, IonRow, IonCol } from '@ionic/react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './CalendarView.css';

interface CalendarViewProps {
  completedHabits: { [key: string]: number };
}

const CalendarView: React.FC<CalendarViewProps> = ({ completedHabits }) => {
  const getTileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') {
      return null;
    }

    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    
    // Format date as YYYY-MM-DD to match our database keys
    const pad = (n: number) => n < 10 ? `0${n}` : n;
    const dateKey = `${year}-${pad(month)}-${pad(day)}`;
    
    const completedCount = completedHabits[dateKey] || 0;

    // Determine color based on number of completed habits
    let color = 'transparent';
    if (completedCount > 0) {
      color = completedCount > 2 ? '#4caf50' : completedCount > 1 ? '#8bc34a' : '#ffc107';
    }

    // Only show indicator if there are completed habits
    return (
      <div className="day-tile">
        <div className="day-number">{day}</div>
        {completedCount > 0 && (
          <div 
            className="completion-indicator" 
            style={{ backgroundColor: color }}
            title={`${completedCount} ${completedCount === 1 ? 'habit' : 'habits'} completed`}
          />
        )}
      </div>
    );
  };

  // Custom tile class to handle current day styling
  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') return '';
    
    const today = new Date();
    return date.toDateString() === today.toDateString() ? 'current-day' : '';
  };

  return (
    <IonGrid>
      <IonRow>
        <IonCol>
          <div className="calendar-container">
            <Calendar
              locale="en-US"
              tileContent={getTileContent}
              tileClassName={tileClassName}
              className="custom-calendar"
            />
            <div className="calendar-legend">
              <div className="legend-item">
                <span className="legend-color" style={{ backgroundColor: '#4caf50' }}></span>
                <span>3+ habits</span>
              </div>
              <div className="legend-item">
                <span className="legend-color" style={{ backgroundColor: '#8bc34a' }}></span>
                <span>2 habits</span>
              </div>
              <div className="legend-item">
                <span className="legend-color" style={{ backgroundColor: '#ffc107' }}></span>
                <span>1 habit</span>
              </div>
            </div>
          </div>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default CalendarView;
