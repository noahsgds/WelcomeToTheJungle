
import React from 'react';
import JungleGatherGame from '../components/JungleGatherGame';
import DustChatbot from '../components/chatbot/DustChatbot';
import { GameContext } from '../context/GameContext';

const Index: React.FC = () => {
  const { currentUser } = React.useContext(GameContext);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-400 to-green-600">
      <JungleGatherGame />
      {currentUser && <DustChatbot />}
    </div>
  );
};

export default Index;
