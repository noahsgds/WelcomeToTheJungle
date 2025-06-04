import React from 'react';
import CalendarView from './CalendarView';
// import DashboardView from './dashboard/DashboardView';
// import StatsView from './dashboard/StatsView';
// import HoursView from './dashboard/HoursView';
// import PreferencesView from './dashboard/PreferencesView';

export type MainPanelTab = 'dashboard' | 'calendar' | 'stats' | 'hours' | 'preferences';

interface MainPanelProps {
  activeTab: MainPanelTab;
  onCloseCalendar?: () => void;
}

const MainPanel: React.FC<MainPanelProps> = ({ activeTab, onCloseCalendar }) => {
  switch (activeTab) {
    case 'calendar':
      return <CalendarView onClose={onCloseCalendar} />;
    // case 'dashboard':
    //   return <DashboardView />;
    // case 'stats':
    //   return <StatsView />;
    // case 'hours':
    //   return <HoursView />;
    // case 'preferences':
    //   return <PreferencesView />;
    default:
      return null;
  }
};

export default MainPanel; 