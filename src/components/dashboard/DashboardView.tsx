import React, { useContext } from 'react';
import { GameContext } from '../../context/GameContext';
import UserAvatar from '../shared/UserAvatar';

const DashboardView = () => {
  const { dashboardData, setDashboardData, currentUser } = useContext(GameContext);

  // Actions rapides
  const handleQuickAction = (status: 'presentiel' | 'teletravail' | 'conge') => {
    // Met à jour le statut du jour courant dans dashboardData
    const today = new Date().toISOString().slice(0, 10);
    const week = dashboardData.week.map(day =>
      day.date === today ? { ...day, status } : day
    );
    setDashboardData({ ...dashboardData, week });
    // TODO: Intégrer update Slack/Google Calendar ici
  };

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Colonne principale */}
      <div className="col-span-8 space-y-6">
        {/* Titre et résumé */}
        <div className="bg-blue-600 rounded-xl p-6 text-white shadow flex flex-col gap-2">
          <h2 className="text-2xl font-bold">Tableau de bord</h2>
          <p className="text-base">Aperçu de votre planning hybride pour Juin 2025</p>
        </div>
        {/* Statistiques principales */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 shadow flex flex-col items-center">
            <span className="text-sm text-gray-500 mb-1">Jours télétravail</span>
            <span className="text-2xl font-bold">{dashboardData.totalTeletravail}</span>
            <span className="text-xs text-gray-400">{dashboardData.totalTeletravail * 100 / 7}% du temps de travail</span>
          </div>
          <div className="bg-white rounded-xl p-4 shadow flex flex-col items-center">
            <span className="text-sm text-gray-500 mb-1">Jours présentiel</span>
            <span className="text-2xl font-bold">{dashboardData.totalPresentiel}</span>
            <span className="text-xs text-gray-400">{dashboardData.totalPresentiel * 100 / 7}% du temps de travail</span>
          </div>
          <div className="bg-white rounded-xl p-4 shadow flex flex-col items-center">
            <span className="text-sm text-gray-500 mb-1">Jours de congé</span>
            <span className="text-2xl font-bold">{dashboardData.totalConge}</span>
            <span className="text-xs text-gray-400">Congés prévus ce mois</span>
          </div>
        </div>
        {/* Total heures */}
        <div className="bg-white rounded-xl p-4 shadow flex flex-col items-center">
          <span className="text-sm text-gray-500 mb-1">Total heures</span>
          <span className="text-2xl font-bold">{dashboardData.totalHeures}h</span>
          <span className="text-xs text-gray-400">Temps de travail planifié</span>
        </div>
        {/* Planning de la semaine */}
        <div className="bg-white rounded-xl p-4 shadow">
          <h3 className="font-semibold text-gray-800 mb-2">Planning de la semaine</h3>
          <div className="flex gap-2">
            {dashboardData.week.map((day, i) => (
              <div key={i} className="flex flex-col items-center w-14 group cursor-pointer">
                <span className="text-xs text-gray-500">{new Date(day.date).toLocaleDateString('fr-FR', { weekday: 'short' })}</span>
                <span className={`text-lg font-bold ${day.status === 'presentiel' ? 'text-green-600' : day.status === 'teletravail' ? 'text-blue-600' : day.status === 'conge' ? 'text-yellow-600' : 'text-gray-400'}`}>●</span>
                {/* Avatars collègues */}
                <div className="flex -space-x-2 mt-1">
                  {day.colleagues.slice(0, 3).map(col => <UserAvatar key={col.id} user={col} size={24} />)}
                  {day.colleagues.length > 3 && <span className="text-xs text-gray-400">+{day.colleagues.length - 3}</span>}
                </div>
                {/* Tooltip liste collègues */}
                {day.colleagues.length > 0 && (
                  <div className="hidden group-hover:block absolute mt-8 bg-white border rounded shadow p-2 z-50 text-xs text-gray-700">
                    {day.colleagues.map(col => <div key={col.id}>{col.name}</div>)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        {/* Actions rapides */}
        <div className="flex gap-4 mt-4">
          <button className="bg-green-100 text-green-700 font-semibold py-2 px-4 rounded-lg hover:bg-green-200 transition" onClick={() => handleQuickAction('presentiel')}>Je viens aujourd'hui</button>
          <button className="bg-blue-100 text-blue-700 font-semibold py-2 px-4 rounded-lg hover:bg-blue-200 transition" onClick={() => handleQuickAction('teletravail')}>Je télétravaille</button>
          <button className="bg-yellow-100 text-yellow-700 font-semibold py-2 px-4 rounded-lg hover:bg-yellow-200 transition" onClick={() => handleQuickAction('conge')}>Je pose un congé</button>
        </div>
      </div>
      {/* Colonne latérale */}
      <div className="col-span-4 space-y-6">
        {/* Statistiques du mois */}
        <div className="bg-white rounded-xl p-4 shadow">
          <h3 className="font-semibold text-gray-800 mb-3">Statistiques du mois</h3>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Télétravail</span>
              <span className="font-bold">{dashboardData.totalTeletravail}</span>
              <span className="text-gray-400">{dashboardData.totalTeletravail * 100 / 7}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Présentiel</span>
              <span className="font-bold">{dashboardData.totalPresentiel}</span>
              <span className="text-gray-400">{dashboardData.totalPresentiel * 100 / 7}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total jours</span>
              <span className="font-bold">7</span>
              <span className="text-purple-500">100%</span>
            </div>
          </div>
        </div>
        {/* Répartition mensuelle */}
        <div className="bg-white rounded-xl p-4 shadow">
          <h3 className="font-semibold text-gray-800 mb-3">Répartition mensuelle</h3>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Télétravail</span>
              <span className="font-bold">{dashboardData.totalTeletravail * 100 / 7}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Présentiel</span>
              <span className="font-bold">{dashboardData.totalPresentiel * 100 / 7}%</span>
            </div>
          </div>
        </div>
        {/* Suggestions sociales (exemple) */}
        <div className="bg-green-50 rounded-xl p-4 shadow">
          <h3 className="font-semibold text-green-800 mb-2">Suggestion sociale</h3>
          <p className="text-green-700 text-sm">3 collègues de ton équipe seront là mardi – tu viens aussi ?</p>
        </div>
        {/* Mini-feed activités (exemple) */}
        <div className="bg-white rounded-xl p-4 shadow">
          <h3 className="font-semibold text-gray-800 mb-3">Activités récentes</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>Récap projets partagés</li>
            <li>Nouvelle activité jeudi (foot)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardView; 