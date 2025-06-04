import React, { useState, useContext } from 'react';
import { GameContext } from '../context/GameContext';
import UserAvatar from './shared/UserAvatar';
import { Menu, X, Settings } from 'lucide-react';
import type { MainPanelTab } from './MainPanel';

interface SidebarDashboardProps {
  activeTab: MainPanelTab;
  onTabChange: (tab: MainPanelTab) => void;
}

const SidebarDashboard: React.FC<SidebarDashboardProps> = ({ activeTab, onTabChange }) => {
  const { currentUser, onlineUsers } = useContext(GameContext);
  const [open, setOpen] = useState(false);

  const navItems = [
    { label: "Calendrier", tab: 'calendar' },
    // { label: "Events", tab: 'events' },
    // { label: "Planning", tab: 'planning' },
  ];

  // Gestion du menu burger : referme si déjà ouvert
  const handleBurgerClick = () => setOpen((prev) => !prev);

  // Fonction utilitaire d'export CSV
  const exportListCSV = (list, filename = 'presentiel.csv') => {
    const csv = list.join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className={`fixed top-0 left-0 h-full z-40 transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'} bg-white shadow-lg w-64 flex flex-col`}>
        <nav className="flex-1 px-4 py-6 space-y-4 flex flex-col items-center mt-20">
          {navItems.map((item) => (
            <button
              key={item.tab}
              className={`w-full py-3 rounded-xl text-lg font-medium transition bg-gradient-to-b from-green-100 to-green-50 hover:from-green-200 hover:to-green-100 text-green-900 shadow ${activeTab === item.tab ? 'ring-2 ring-green-400' : ''}`}
              onClick={() => { onTabChange(item.tab as MainPanelTab); setOpen(false); }}
            >
              {item.label}
            </button>
          ))}
          {/* Bouton exporter la liste présentiel */}
          <button
            className="w-full mt-2 px-4 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700 text-sm"
            onClick={() => exportListCSV(onlineUsers.filter(u => u.workMode === 'presentiel' || !u.workMode).map(u => u.name), 'presentiel.csv')}
          >
            Exporter la liste
          </button>
        </nav>
        <div className="px-6 pb-4">
          <button className="flex items-center gap-2 w-full py-2 px-3 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition">
            <span className="w-3 h-3 bg-gray-400 rounded mr-2 inline-block"></span>
            <Settings className="w-4 h-4" />
            <span className="ml-2">Paramètres</span>
          </button>
        </div>
        <button
          className="absolute top-4 left-4 z-50 bg-white border border-green-200 rounded-lg p-2 shadow hover:bg-green-50 transition-colors"
          onClick={() => setOpen(false)}
          aria-label="Fermer le menu"
        >
          <X className="w-6 h-6 text-green-600" />
        </button>
      </div>
      {/* Bouton menu burger */}
      <button
        className="fixed top-4 left-4 z-50 bg-white border border-green-200 rounded-lg p-2 shadow hover:bg-green-50 transition-colors"
        onClick={handleBurgerClick}
        aria-label="Ouvrir le menu"
      >
        <Menu className="w-6 h-6 text-green-600" />
      </button>
    </>
  );
};

export default SidebarDashboard; 