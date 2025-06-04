import React, { createContext, useState, ReactNode } from 'react';

interface Position {
  x: number;
  y: number;
}

interface User {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'busy' | 'away';
  position: Position;
  workMode?: 'presentiel' | 'teletravail';
  presenceRate?: number;
  team?: string;
  location?: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  members: string[];
  status: 'active' | 'planning' | 'completed';
  lastUpdate: string;
}

interface Activity {
  id: string;
  title: string;
  description: string;
  date: string;
  organizer: string;
  participants: string[];
  location: string;
}

interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  className: string;
  content?: React.ReactNode;
}

interface DayStatus {
  date: string;
  status: 'presentiel' | 'teletravail' | 'conge' | 'non-declare';
  colleagues: User[];
}

interface DashboardData {
  week: DayStatus[];
  totalTeletravail: number;
  totalPresentiel: number;
  totalConge: number;
  totalHeures: number;
  teamAverage: {
    teletravail: number;
    presentiel: number;
    conge: number;
    heures: number;
  };
}

interface GameContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  onlineUsers: User[];
  setOnlineUsers: React.Dispatch<React.SetStateAction<User[]>>;
  projects: Project[];
  activities: Activity[];
  mapDimensions: { width: number; height: number };
  isPresenceDeclarationOpen: boolean;
  setIsPresenceDeclarationOpen: (open: boolean) => void;
  playerPosition: Position;
  obstacles: Obstacle[];
  dashboardData: DashboardData;
  setDashboardData: (data: DashboardData) => void;
}

export const GameContext = createContext<GameContextType>({} as GameContextType);

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);

  const [isPresenceDeclarationOpen, setIsPresenceDeclarationOpen] = useState(false);

  const mapDimensions = {
    width: window.innerWidth,
    height: window.innerHeight
  };

  // Player position derived from current user
  const playerPosition = currentUser?.position || { x: 0, y: 0 };

  // Projets en cours
  const projects: Project[] = [
    {
      id: '1',
      title: 'Refonte Site Web',
      description: 'Modernisation de la plateforme client',
      members: ['Marie', 'Thomas', 'Julie'],
      status: 'active',
      lastUpdate: 'Il y a 2h'
    },
    {
      id: '2',
      title: 'Migration Cloud',
      description: 'Transition vers AWS',
      members: ['Alex', 'Sophie', 'David'],
      status: 'planning',
      lastUpdate: 'Hier'
    }
  ];

  // Activités proposées
  const activities: Activity[] = [
    {
      id: '1',
      title: 'Escalade en équipe',
      description: 'Session escalade pour renforcer la cohésion',
      date: '2025-06-05',
      organizer: 'Marie',
      participants: ['Thomas', 'Julie'],
      location: 'Salle d\'escalade - République'
    },
    {
      id: '2',
      title: 'Afterwork Jungle',
      description: 'Apéro décontracté au bureau',
      date: '2025-06-03',
      organizer: 'David',
      participants: ['Sophie', 'Alex', 'Marie'],
      location: 'Terrasse du bureau'
    }
  ];

  const [dashboardData, setDashboardData] = useState<DashboardData>({
    week: [
      // Exemple de structure pour 7 jours
      { date: '2025-06-02', status: 'non-declare', colleagues: [] },
      { date: '2025-06-03', status: 'non-declare', colleagues: [] },
      { date: '2025-06-04', status: 'non-declare', colleagues: [] },
      { date: '2025-06-05', status: 'non-declare', colleagues: [] },
      { date: '2025-06-06', status: 'non-declare', colleagues: [] },
      { date: '2025-06-07', status: 'non-declare', colleagues: [] },
      { date: '2025-06-08', status: 'non-declare', colleagues: [] },
    ],
    totalTeletravail: 0,
    totalPresentiel: 0,
    totalConge: 0,
    totalHeures: 0,
    teamAverage: {
      teletravail: 0,
      presentiel: 0,
      conge: 0,
      heures: 0,
    },
  });

  return (
    <GameContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        onlineUsers,
        setOnlineUsers,
        projects,
        activities,
        mapDimensions,
        isPresenceDeclarationOpen,
        setIsPresenceDeclarationOpen,
        playerPosition,
        obstacles: [],
        dashboardData,
        setDashboardData,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
