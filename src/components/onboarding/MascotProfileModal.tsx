import React from 'react';

const mascots = [
  { id: 'parrot', label: 'Perroquet', img: '/assets/avatars/parrot.png' },
  { id: 'frog', label: 'Grenouille', img: '/assets/avatars/frog.png' },
  { id: 'tiger', label: 'Tigre', img: '/assets/avatars/tiger.png' },
  { id: 'monkey', label: 'Singe', img: '/assets/avatars/monkey.png' },
  { id: 'elephant', label: 'Éléphant', img: '/assets/avatars/elephant.png' },
  { id: 'snake', label: 'Serpent', img: '/assets/avatars/snake.png' },
];

const MascotProfileModal = ({ mascot, onClose }: { mascot: any, onClose: () => void }) => {
  const mascotImage = mascots.find(m => m.id === mascot.mascot)?.img || '/assets/avatars/frog.png';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md relative">
        <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-700" onClick={onClose}>✕</button>
        <div className="flex flex-col items-center">
          <img src={mascotImage} alt={mascot.mascot} className="w-24 h-24 mb-2" />
          <h2 className="text-2xl font-bold mb-1">{mascot.name}</h2>
          <div className="text-sm text-gray-500 mb-4">{mascot.team}</div>
        </div>
        <div className="space-y-2">
          <div><span className="font-semibold">Lieu :</span> {mascot.location}</div>
          <div><span className="font-semibold">Jours préférés :</span> {mascot.days?.join(', ')}</div>
          <div><span className="font-semibold">Collaborateurs :</span> {mascot.collaborators}</div>
          <div><span className="font-semibold">Notifications :</span> {mascot.notifications?.join(', ')}</div>
        </div>
      </div>
    </div>
  );
};

export default MascotProfileModal; 