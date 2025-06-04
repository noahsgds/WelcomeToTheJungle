import React from 'react';

const MascotProfileModal = ({ mascot, onClose }: { mascot: any, onClose: () => void }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md relative">
        <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-700" onClick={onClose}>✕</button>
        <div className="flex flex-col items-center">
          <img src={`/assets/avatars/${mascot.avatar}.png`} alt={mascot.avatar} className="w-24 h-24 mb-2" />
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