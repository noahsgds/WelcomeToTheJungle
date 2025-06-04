
import React, { useContext, useEffect, useCallback, useState } from 'react';
import { GameContext } from '../context/GameContext';
import AvatarSelector from './AvatarSelector';

const getAnimalEmoji = (avatar: string) => {
  const animals: Record<string, string> = {
    'tiger': '🐅',
    'monkey': '🐒',
    'parrot': '🦜',
    'elephant': '🐘',
    'leopard': '🐆',
    'toucan': '🦜',
    'sloth': '🦥',
    'frog': '🐸'
  };
  return animals[avatar] || '🐅';
};

const Player = () => {
  const { 
    currentUser, 
    setCurrentUser,
    mapDimensions,
  } = useContext(GameContext);

  const [isAvatarSelectorOpen, setIsAvatarSelectorOpen] = useState(false);

  const MOVEMENT_SPEED = 4;
  const PLAYER_SIZE = 50;

  const checkCollision = useCallback((newX: number, newY: number) => {
    // Check boundaries
    if (newX < 0 || newX > mapDimensions.width - PLAYER_SIZE || 
        newY < 0 || newY > mapDimensions.height - PLAYER_SIZE) {
      return true;
    }

    return false;
  }, [mapDimensions]);

  const movePlayer = useCallback((direction: string) => {
    let newX = currentUser.position.x;
    let newY = currentUser.position.y;

    switch (direction) {
      case 'up':
        newY -= MOVEMENT_SPEED;
        break;
      case 'down':
        newY += MOVEMENT_SPEED;
        break;
      case 'left':
        newX -= MOVEMENT_SPEED;
        break;
      case 'right':
        newX += MOVEMENT_SPEED;
        break;
    }

    if (!checkCollision(newX, newY)) {
      setCurrentUser({
        ...currentUser,
        position: { x: newX, y: newY }
      });
    }
  }, [currentUser, setCurrentUser, checkCollision]);

  const handleAvatarSelect = (avatar: string) => {
    setCurrentUser({
      ...currentUser,
      avatar
    });
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const keyActions: Record<string, string> = {
        'ArrowUp': 'up',
        'ArrowDown': 'down',
        'ArrowLeft': 'left',
        'ArrowRight': 'right',
        'w': 'up',
        's': 'down',
        'a': 'left',
        'd': 'right'
      };

      const direction = keyActions[event.key];
      if (direction) {
        event.preventDefault();
        movePlayer(direction);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [movePlayer]);

  return (
    <>
      <div
        className="absolute transition-all duration-200 ease-out z-20 cursor-pointer"
        style={{
          left: currentUser.position.x,
          top: currentUser.position.y,
          width: PLAYER_SIZE,
          height: PLAYER_SIZE,
        }}
        onClick={() => setIsAvatarSelectorOpen(true)}
      >
        <div className="relative w-full h-full">
          {/* Ombre du joueur */}
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-4 bg-black opacity-20 rounded-full blur-sm" />
          
          {/* Avatar animal */}
          <div className="w-full h-full bg-white bg-opacity-90 rounded-full border-3 border-white shadow-lg flex items-center justify-center text-3xl hover:scale-110 transition-transform">
            {getAnimalEmoji(currentUser.avatar)}
          </div>

          {/* Indicateur de statut */}
          <div className={`absolute -top-1 -right-1 w-4 h-4 border-2 border-white rounded-full ${
            currentUser.status === 'online' ? 'bg-green-500' :
            currentUser.status === 'busy' ? 'bg-orange-500' : 'bg-gray-400'
          }`} />

          {/* Nom du joueur */}
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs bg-white bg-opacity-95 px-2 py-1 rounded shadow-sm border text-gray-800 whitespace-nowrap font-medium">
            {currentUser.name}
          </div>

          {/* Indicateur cliquable */}
          <div className="absolute -top-2 -left-2 text-xs opacity-60 hover:opacity-100 transition-opacity">
            ✏️
          </div>
        </div>
      </div>

      <AvatarSelector
        isOpen={isAvatarSelectorOpen}
        onClose={() => setIsAvatarSelectorOpen(false)}
        onSelect={handleAvatarSelect}
        currentAvatar={currentUser.avatar}
      />
    </>
  );
};

export default Player;
