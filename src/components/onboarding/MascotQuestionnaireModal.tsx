import React, { useState, useContext } from 'react';
import { GameContext } from '../../context/GameContext';
import { X } from 'lucide-react';

// Interfaces et types
interface UserForm {
  name: string;
  team: string;
  manager: string;
  mascot: string;
  workMode: 'presentiel' | 'teletravail';
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
  workMode: 'presentiel' | 'teletravail';
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

const collaborators = [
  { id: '1', name: 'Alice', team: 'Engineering' },
  { id: '2', name: 'Bob', team: 'Marketing' },
  { id: '3', name: 'Charlie', team: 'Design' },
  { id: '4', name: 'David', team: 'Sales' },
  { id: '5', name: 'Eve', team: 'HR' },
];

const teams = [
  'Editorial & Marketing',
  'Operations',
  'Engineering',
  'Design',
  'Sales',
  'HR',
];

const managers = [
  'Alice',
  'Bob',
  'Charlie',
  'David',
  'Eve',
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

const MascotQuestionnaireModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const { setCurrentUser, setOnlineUsers } = useContext(GameContext);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<UserForm>({
    name: '',
    team: '',
    manager: '',
    mascot: '',
    workMode: 'presentiel',
    hobbies: [] as string[],
    location: '',
    days: [] as string[],
    collaborators: '',
    notifications: [] as string[]
  });

  const handleChange = (field: keyof UserForm, value: string) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCheckbox = (field: 'hobbies' | 'days' | 'notifications', value: string) => {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].includes(value) 
        ? prev[field].filter(f => f !== value)
        : [...prev[field], value]
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
      form.notifications.length === 0 ||
      !form.workMode
    ) {
      return;
    }

    const newUser: CompleteUser = {
      id: Date.now().toString(),
      name: form.name,
      avatar: mascots.find(m => m.id === form.mascot)?.img ?? '',
      status: 'online',
      position: { x: 400, y: 300 },
      workMode: form.workMode,
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

  const handleNext = () => {
    if (step === 1 && !form.name) return;
    if (step === 2 && !form.team) return;
    if (step === 3 && !form.manager) return;
    if (step === 4 && form.hobbies.length === 0) return;
    if (step === 5 && !form.mascot) return;
    if (step === 6 && !form.location) return;
    if (step === 7 && form.days.length === 0) return;
    if (step === 8 && !form.collaborators) return;
    if (step === 9 && form.notifications.length === 0) return;
    if (step === 10 && !form.workMode) return;
    
    setStep(s => s + 1);
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(s => s - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-[400px] max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Questionnaire d'onboarding</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* Progression */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Étape {step}</span>
            <span>sur 10</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-green-500 h-2.5 rounded-full"
              style={{ width: `${(step / 10) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Contenu des étapes */}
        <div className="space-y-6">
          {step === 1 && (
            <div>
              <div className="mb-4 text-lg font-semibold">Quel est ton nom ?</div>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="Entrez votre nom"
                value={form.name}
                onChange={e => handleChange('name', e.target.value)}
              />
            </div>
          )}
          {step === 2 && (
            <div>
              <div className="mb-4 text-lg font-semibold">Dans quelle équipe travailles-tu ?</div>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                value={form.team}
                onChange={e => handleChange('team', e.target.value)}
              >
                <option value="">Sélectionner...</option>
                {teams.map(team => (
                  <option key={team} value={team}>{team}</option>
                ))}
              </select>
            </div>
          )}
          {step === 3 && (
            <div>
              <div className="mb-4 text-lg font-semibold">Qui est ton manager ?</div>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                value={form.manager}
                onChange={e => handleChange('manager', e.target.value)}
              >
                <option value="">Sélectionner...</option>
                {managers.map(manager => (
                  <option key={manager} value={manager}>{manager}</option>
                ))}
              </select>
            </div>
          )}
          {step === 4 && (
            <div>
              <div className="mb-4 text-lg font-semibold">Quels sont tes hobbies ?</div>
              <div className="flex flex-wrap gap-2">
                {hobbies.map(hobby => (
                  <label key={hobby} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.hobbies.includes(hobby)}
                      onChange={() => handleCheckbox('hobbies', hobby)}
                    />
                    {hobby}
                  </label>
                ))}
              </div>
            </div>
          )}
          {step === 5 && (
            <div>
              <div className="mb-4 text-lg font-semibold">Choisis ton avatar !</div>
              <div className="grid grid-cols-3 gap-4">
                {mascots.map(mascot => (
                  <label key={mascot.id} className="flex flex-col items-center space-y-2">
                    <img
                      src={mascot.img}
                      alt={mascot.label}
                      className={`w-20 h-20 rounded-full ${form.mascot === mascot.id ? 'ring-2 ring-green-500' : ''}`}
                      onClick={() => handleChange('mascot', mascot.id)}
                    />
                    <span className="text-sm">{mascot.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
          {step === 6 && (
            <div>
              <div className="mb-4 text-lg font-semibold">Où travailles-tu ?</div>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                value={form.location}
                onChange={e => handleChange('location', e.target.value)}
              >
                <option value="">Sélectionner...</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>
          )}
          {step === 7 && (
            <div>
              <div className="mb-4 text-lg font-semibold">Quels jours es-tu le plus susceptible de venir au bureau ?</div>
              <div className="grid grid-cols-3 gap-4">
                {days.map(day => (
                  <label key={day} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={form.days.includes(day)}
                      onChange={() => handleCheckbox('days', day)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>{day}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
          {step === 8 && (
            <div className="mb-6">
              <div className="mb-4 text-lg font-semibold">Qui sont tes collaborateurs ?</div>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                value={form.collaborators}
                onChange={e => handleChange('collaborators', e.target.value)}
              >
                <option value="">Sélectionner...</option>
                {collaborators.map(collaborator => (
                  <option key={collaborator.id} value={collaborator.name}>{collaborator.name}</option>
                ))}
              </select>
            </div>
          )}
          {step === 9 && (
            <div className="mb-6">
              <div className="mb-4 text-lg font-semibold">Quel type de notifications souhaites-tu recevoir ?</div>
              <div className="flex flex-col gap-2">
                {notifications.map(notification => (
                  <label key={notification} className="flex items-center gap-2">
                    <input type="checkbox" checked={form.notifications.includes(notification)} onChange={() => handleCheckbox('notifications', notification)} />
                    <span>{notification}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
          {step === 10 && (
            <div className="mb-6">
              <div className="mb-4 text-lg font-semibold">Quel est ton mode de travail ?</div>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="workMode"
                    value="presentiel"
                    checked={form.workMode === 'presentiel'}
                    onChange={() => handleChange('workMode', 'presentiel')}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span>Présentiel</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="workMode"
                    value="teletravail"
                    checked={form.workMode === 'teletravail'}
                    onChange={() => handleChange('workMode', 'teletravail')}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Teletravail</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          {step > 1 ? (
            <button className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300" onClick={handlePrev}>
              Précédent
            </button>
          ) : (
            <span></span>
          )}
          {step < 10 ? (
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
                (step === 9 && form.notifications.length === 0) ||
                (step === 10 && form.workMode !== 'presentiel' && form.workMode !== 'teletravail')
              }
            >
              {step === 10 ? 'Valider' : 'Suivant'}
            </button>
          ) : (
            <button
              className="px-4 py-2 rounded bg-green-600 text-white font-bold hover:bg-green-700"
              onClick={handleSubmit}
              disabled={form.workMode !== 'presentiel' && form.workMode !== 'teletravail'}
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