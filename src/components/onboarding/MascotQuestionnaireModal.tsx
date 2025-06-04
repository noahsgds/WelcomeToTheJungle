import React, { useState, useContext } from 'react';
import { GameContext } from '../../context/GameContext';

// Interfaces et types
interface UserForm {
  name: string;
  team: string;
  manager: string;
  mascot: string;
  hobbies: string[];
  location: string;
  days: string[];
  collaborators: string;
  notifications: string[];
}

interface CompleteUser {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'busy' | 'away';
  position: { x: number; y: number };
  location: string;
  days: string[];
  collaborators: string;
  notifications: string[];
  team: string;
  manager: string;
  hobbies: string[];
  mascot: string;
}

// Constantes
const mascots = [
  { id: 'parrot', label: 'Perroquet', img: '/assets/avatars/parrot.png' },
  { id: 'frog', label: 'Grenouille', img: '/assets/avatars/frog.png' },
  { id: 'tiger', label: 'Tigre', img: '/assets/avatars/tiger.png' },
  { id: 'monkey', label: 'Singe', img: '/assets/avatars/monkey.png' },
  { id: 'elephant', label: 'Éléphant', img: '/assets/avatars/elephant.png' },
  { id: 'snake', label: 'Serpent', img: '/assets/avatars/snake.png' },
];

const locations = ['Paris (Head office)', 'Lyon', 'Full Remote', 'Autre'];
const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
const notifications = [
  'Présence de collègues favoris',
  'Événements bien-être (Yoga, petit-déj...)',
  'Missions / challenges d\'équipe',
  'Résumé hebdo de ma présence',
  'Je préfère éviter les notifications',
];
const teams = [
  'Editorial & Marketing',
  'Operations',
  'Brand & Creative',
  'Czech Republic',
  'Growth Marketing',
  'Marketing UK',
  'Media Expansion US',
  'Strategy Operations',
  'Product & Data',
  'Customer Success',
  'Finance',
  'People',
  'Revenue - France',
  'UK - Team',
  'dotConferences',
  'B2C & Monitezation Marketing',
  'Business - CZ',
  'Content - CZ',
  'Marketing - CZ',
  'People & Office Management - CZ'
];

const managers = [
  { id: 'emma', name: 'Emma Wilson', team: 'Editorial & Marketing' },
  { id: 'robert', name: 'Robert Chen', team: 'Operations' },
  { id: 'daniel', name: 'Daniel Martinez', team: 'Brand & Creative' },
  { id: 'david', name: 'David Kim', team: 'Czech Republic' },
  { id: 'benjamin', name: 'Benjamin Scott', team: 'Product & Data' },
  { id: 'alexander', name: 'Alexander Brown', team: 'Strategy Operations' },
  { id: 'nobody', name: 'Aucun', team: '' }
];

const hobbies = [
  'Sport',
  'Musique',
  'Lecture',
  'Cuisine',
  'Voyages',
  'Jeux vidéo',
  'Photographie',
  'Dessin',
  'Autre'
];

const MascotQuestionnaireModal = ({ onClose }: { onClose: () => void }) => {
  const { setCurrentUser, setOnlineUsers } = useContext(GameContext);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<UserForm>({
    name: '',
    team: '',
    manager: '',
    mascot: '',
    hobbies: [] as string[],
    location: '',
    days: [] as string[],
    collaborators: '',
    notifications: [] as string[]
  });

  // Handlers
  const handleChange = (field: keyof UserForm, value: string) => {
    setForm(f => ({ ...f, [field]: value }));
  };

  const handleCheckbox = (field: keyof UserForm, value: string) => {
    setForm(f => ({
      ...f,
      [field]: (f[field] as string[]).includes(value) 
        ? (f[field] as string[]).filter((v: string) => v !== value) 
        : [...(f[field] as string[]), value]
    }));
  };

  const handleSubmit = () => {
    if (
      !form.name ||
      !form.team ||
      !form.manager ||
      form.hobbies.length === 0 ||
      !form.mascot ||
      !form.location ||
      form.days.length === 0 ||
      !form.collaborators ||
      form.notifications.length === 0
    ) {
      return;
    }

    const newUser: CompleteUser = {
      id: Date.now().toString(),
      name: form.name,
      avatar: mascots.find(m => m.id === form.mascot)?.img ?? '',
      status: 'online',
      position: { x: 400, y: 300 },
      location: form.location,
      days: form.days,
      collaborators: form.collaborators,
      notifications: form.notifications,
      team: form.team,
      manager: form.manager,
      hobbies: form.hobbies,
      mascot: form.mascot
    };

    setCurrentUser(newUser);
    setOnlineUsers((users) => [...users, newUser]);
    onClose();
  };

  const handleNext = () => setStep(s => s + 1);
  const handlePrev = () => setStep(s => s - 1);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-lg relative">
        <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-700" onClick={onClose}>✕</button>
        <h2 className="text-2xl font-bold mb-6 text-center">Créer ma mascotte</h2>
        {/* Étapes du questionnaire */}
        {step === 1 && (
          <div className="mb-6">
            <div className="mb-4 text-lg font-semibold">Nom de l'employé :</div>
            <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1" placeholder="Nom de l'employé" value={form.name} onChange={e => handleChange('name', e.target.value)} />
          </div>
        )}
        {step === 2 && (
          <div className="mb-6">
            <div className="mb-4 text-lg font-semibold">À quelle équipe/secteur appartiens-tu ?</div>
            <select className="w-full border rounded px-2 py-2" value={form.team} onChange={e => handleChange('team', e.target.value)}>
              <option value="">Sélectionner...</option>
              {teams.map(team => <option key={team} value={team}>{team}</option>)}
            </select>
          </div>
        )}
        {step === 3 && (
          <div className="mb-6">
            <div className="mb-4 text-lg font-semibold">Qui est ton manager ?</div>
            <select className="w-full border rounded px-2 py-2" value={form.manager} onChange={e => handleChange('manager', e.target.value)}>
              <option value="">Sélectionner...</option>
              {managers.map(manager => (
                <option key={manager.id} value={manager.id}>
                  {manager.name} ({manager.team})
                </option>
              ))}
            </select>
          </div>
        )}
        {step === 4 && (
          <div className="mb-6">
            <div className="mb-4 text-lg font-semibold">Quels sont tes passe-temps et activités en dehors du travail ?</div>
            <div className="flex flex-wrap gap-3">
              {hobbies.map(hobby => (
                <label key={hobby} className="flex items-center gap-2">
                  <input type="checkbox" checked={form.hobbies.includes(hobby)} onChange={() => handleCheckbox('hobbies', hobby)} />
                  {hobby}
                </label>
              ))}
            </div>
          </div>
        )}
        {step === 5 && (
          <div className="mb-6">
            <div className="mb-4 text-lg font-semibold">Choisis ta mascotte préférée :</div>
            <div className="flex flex-wrap gap-4 justify-center mb-4">
              {mascots.map(m => (
                <button
                  key={m.id}
                  className={`rounded-xl border-2 p-2 transition ${form.mascot === m.id ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'}`}
                  onClick={() => handleChange('mascot', m.id)}
                >
                  <img src={m.img} alt={m.label} className="w-16 h-16 mx-auto" />
                  <div className="text-xs mt-1 font-medium text-gray-700">{m.label}</div>
                </button>
              ))}
            </div>
          </div>
        )}
        {step === 6 && (
          <div className="mb-6">
            <div className="mb-4 text-lg font-semibold">Où travailles-tu principalement ?</div>
            <div className="flex flex-col gap-2">
              {locations.map(loc => (
                <label key={loc} className="flex items-center gap-2">
                  <input type="radio" name="location" value={loc} checked={form.location === loc} onChange={() => handleChange('location', loc)} />
                  {loc}
                </label>
              ))}
              {form.location === 'Autre' && (
                <input className="mt-2 border rounded px-2 py-1" placeholder="Précise..." value={form.location} onChange={e => handleChange('location', e.target.value)} />
              )}
            </div>
          </div>
        )}
        {step === 7 && (
          <div className="mb-6">
            <div className="mb-4 text-lg font-semibold">Quels jours es-tu le plus susceptible de venir au bureau ?</div>
            <div className="flex flex-wrap gap-3">
              {days.map(day => (
                <label key={day} className="flex items-center gap-2">
                  <input type="checkbox" checked={form.days.includes(day)} onChange={() => handleCheckbox('days', day)} />
                  {day}
                </label>
              ))}
            </div>
          </div>
        )}
        {step === 8 && (
          <div className="mb-6">
            <div className="mb-4 text-lg font-semibold">Avec qui collabores-tu le plus souvent ?</div>
            <input className="w-full border rounded px-2 py-2" placeholder="Noms ou équipes (séparés par des virgules)" value={form.collaborators} onChange={e => handleChange('collaborators', e.target.value)} />
            <div className="text-xs text-gray-500 mt-2">(Sélectionner jusqu'à 5 collègues ou équipes)</div>
          </div>
        )}
        {step === 9 && (
          <div className="mb-6">
            <div className="mb-4 text-lg font-semibold">Quel type de notifications souhaites-tu recevoir ?</div>
            <div className="flex flex-col gap-2">
              {notifications.map(notif => (
                <label key={notif} className="flex items-center gap-2">
                  <input type="checkbox" checked={form.notifications.includes(notif)} onChange={() => handleCheckbox('notifications', notif)} />
                  {notif}
                </label>
              ))}
            </div>
          </div>
        )}
        {/* Navigation */}
        <div className="flex justify-between mt-8">
          {step > 1 ? (
            <button className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300" onClick={handlePrev}>
              Précédent
            </button>
          ) : (
            <span></span>
          )}
          {step < 9 ? (
            <button
              className="px-4 py-2 rounded bg-green-600 text-white font-bold hover:bg-green-700"
              onClick={handleNext}
              disabled={
                (step === 1 && !form.name) ||
                (step === 2 && !form.team) ||
                (step === 3 && !form.manager) ||
                (step === 4 && form.hobbies.length === 0) ||
                (step === 5 && !form.mascot) ||
                (step === 6 && !form.location) ||
                (step === 7 && form.days.length === 0) ||
                (step === 8 && !form.collaborators) ||
                (step === 9 && form.notifications.length === 0)
              }
            >
              {step === 9 ? 'Valider' : 'Suivant'}
            </button>
          ) : (
            <button
              className="px-4 py-2 rounded bg-green-600 text-white font-bold hover:bg-green-700"
              onClick={handleSubmit}
              disabled={form.notifications.length === 0}
            >
              Valider
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MascotQuestionnaireModal;