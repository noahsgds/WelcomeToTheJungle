
import React, { useContext, useState } from 'react';
import { GameContext } from '../context/GameContext';
import { X, MapPin, Clock, Users } from 'lucide-react';

const PresenceDeclaration = () => {
  const { isPresenceDeclarationOpen, setIsPresenceDeclarationOpen } = useContext(GameContext);
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [selectedLocation, setSelectedLocation] = useState('bureau-principal');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isPresenceDeclarationOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulation d'envoi
    setTimeout(() => {
      setIsSubmitting(false);
      setIsPresenceDeclarationOpen(false);
      // Ici on pourrait intégrer avec Slack/Google Calendar
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-green-600" />
            Déclarer ma présence
          </h2>
          <button 
            onClick={() => setIsPresenceDeclarationOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="w-4 h-4 inline mr-1" />
              Heure d'arrivée prévue
            </label>
            <select 
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="08:00">08:00</option>
              <option value="08:30">08:30</option>
              <option value="09:00">09:00</option>
              <option value="09:30">09:30</option>
              <option value="10:00">10:00</option>
              <option value="10:30">10:30</option>
              <option value="11:00">11:00</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              Lieu de travail
            </label>
            <select 
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="bureau-principal">Bureau Principal - Paris</option>
              <option value="coworking-republique">Coworking République</option>
              <option value="bureau-lyon">Bureau Lyon</option>
              <option value="remote">Remote (de chez moi)</option>
            </select>
          </div>

          <div className="bg-green-50 p-3 rounded-lg">
            <p className="text-sm text-green-700 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Vos collègues seront notifiés de votre présence pour faciliter les rencontres spontanées !
            </p>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsPresenceDeclarationOpen(false)}
              className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Envoi...' : 'Confirmer ma présence'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PresenceDeclaration;
