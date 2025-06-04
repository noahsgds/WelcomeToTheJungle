import React, { useContext, useState } from 'react';
import { GameContext } from '../context/GameContext';
import { TreePine, Users, Calendar, MessageSquare, MapPin, Coffee, Zap } from 'lucide-react';

const CoworkingUI = () => {
  const { currentUser, onlineUsers, projects, activities, setIsPresenceDeclarationOpen } = useContext(GameContext);
  const [activePanel, setActivePanel] = useState<'presence' | 'projects' | 'activities' | null>(null);

  return (
    <div className="absolute inset-0 pointer-events-none z-30">
      {/* Header professionnel */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 pointer-events-auto">
        <div className="bg-white bg-opacity-95 backdrop-blur-sm shadow-lg rounded-lg px-6 py-3 border border-green-200">
          <div className="flex items-center gap-3">
            <TreePine className="w-6 h-6 text-green-600" />
            <h1 className="text-xl font-bold text-gray-800">Jungle Gather</h1>
            <span className="text-sm text-gray-600">• Espace Coworking</span>
          </div>
          </div>
        </div>

        {/* Panneau des projets */}
        {activePanel === 'projects' && (
          <div className="mt-3 bg-white bg-opacity-95 backdrop-blur-sm shadow-lg rounded-lg p-4 border border-green-200 w-80">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-green-600" />
              Projets en cours
            </h3>
            <div className="space-y-3">
              {projects.map((project) => (
                <div key={project.id} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-800">{project.title}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      project.status === 'active' ? 'bg-green-100 text-green-700' :
                      project.status === 'planning' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{project.description}</p>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>{project.members.length} membres</span>
                    <span>{project.lastUpdate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Panneau des activités */}
        {activePanel === 'activities' && (
          <div className="mt-3 bg-white bg-opacity-95 backdrop-blur-sm shadow-lg rounded-lg p-4 border border-green-200 w-80">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-green-600" />
              Activités proposées
            </h3>
            <div className="space-y-3">
              {activities.map((activity) => (
                <div key={activity.id} className="border border-gray-200 rounded-lg p-3">
                  <h4 className="font-medium text-gray-800 mb-1">{activity.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                  <div className="text-xs text-gray-500 space-y-1">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {activity.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {activity.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {activity.participants.length} participants
                    </div>
                  </div>
                  <button className="mt-2 text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 transition-colors">
                    Participer
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
    </div>
  );
};

export default CoworkingUI;
