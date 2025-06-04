import React, { useContext, useState } from 'react';
import GameMap from './GameMap';
import CoworkingUI from './CoworkingUI';
import PresenceDeclaration from './PresenceDeclaration';
import { GameProvider, GameContext } from '../context/GameContext';
import SidebarDashboard from './SidebarDashboard';
import MainPanel, { MainPanelTab } from './MainPanel';
import MascotQuestionnaireModal from './onboarding/MascotQuestionnaireModal';

const JungleGatherGameInner = () => {
  const { currentUser } = useContext(GameContext);
  const [activeTab, setActiveTab] = useState<MainPanelTab>('dashboard');
  const [showModal, setShowModal] = useState(false);

  if (!currentUser) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-200 via-green-300 to-green-400">
        <button
          className="bg-green-600 text-white px-6 py-3 rounded-xl text-xl font-bold shadow hover:bg-green-700 transition mb-8"
          onClick={() => setShowModal(true)}
        >
          Créer mon personnage
        </button>
        {showModal && <MascotQuestionnaireModal onClose={() => setShowModal(false)} />}
      </div>
    );
  }

  return (
      <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-green-200 via-green-300 to-green-400">
      <button
        className="fixed top-4 left-4 ml-14 z-50 bg-green-600 text-white px-4 py-2 rounded-lg font-bold shadow hover:bg-green-700 transition"
        onClick={() => setShowModal(true)}
      >
        Créer une nouvelle mascotte
      </button>
      {showModal && <MascotQuestionnaireModal onClose={() => setShowModal(false)} />}
      <SidebarDashboard activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === 'calendar' ? (
        <MainPanel activeTab={activeTab} onCloseCalendar={() => setActiveTab('dashboard')} />
      ) : (
        <>
          <GameMap />
          <CoworkingUI />
          <PresenceDeclaration />
        </>
      )}
      </div>
  );
};

const JungleGatherGame = () => (
  <GameProvider>
    <JungleGatherGameInner />
    </GameProvider>
  );

export default JungleGatherGame;
