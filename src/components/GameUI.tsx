import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, TreePine } from 'lucide-react';

const GameUI = () => {
  const { playerPosition } = useContext(GameContext);

  return (
    <div className="absolute inset-0 pointer-events-none z-30">
      {/* Header */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 pointer-events-auto">
        <div className="bg-black bg-opacity-50 text-white px-6 py-3 rounded-lg backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <TreePine className="w-5 h-5 text-green-400" />
            <h1 className="text-xl font-bold">Jungle Gather</h1>
          </div>
        </div>
      </div>

      {/* Welcome message */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
        <div className="bg-green-600 bg-opacity-90 text-white p-6 rounded-lg backdrop-blur-sm text-center max-w-md animate-fade-in">
          <h2 className="text-2xl font-bold mb-2">Welcome to the Jungle!</h2>
          <p className="text-sm mb-4">Use the arrow keys to move around and explore interaction zones.</p>
          <p className="text-xs text-green-200">Find the meeting spots and chat areas to connect with others!</p>
        </div>
      </div>
    </div>
  );
};

export default GameUI;
