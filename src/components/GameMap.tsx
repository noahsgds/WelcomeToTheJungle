import React, { useContext, useState, useEffect, useRef } from 'react';
import { GameContext } from '../context/GameContext';
import UserAvatar from './shared/UserAvatar';
import { Monitor } from 'lucide-react';

const jungleBg = '/assets/pixel-jungle-bg.jpg'; // Utilise l'image fournie
const AVATAR_SIZE = 48; // ou la taille utilisée dans UserAvatar

// Définition des zones de déplacement
const getZone = (workMode, mapDimensions) => {
  if (!mapDimensions.width || !mapDimensions.height) {
    // Zone nulle tant que la carte n'est pas prête
    return { xMin: 0, xMax: 0, yMin: 0, yMax: 0 };
  }
  if (workMode === 'teletravail') {
    return {
      xMin: 0,
      xMax: Math.max(0, mapDimensions.width * 0.25 - AVATAR_SIZE),
      yMin: Math.max(0, mapDimensions.height * 0.75),
      yMax: Math.max(0, mapDimensions.height - AVATAR_SIZE),
    };
  }
  // Présentiel : toute la carte, en tenant compte de la taille de l'avatar
  return {
    xMin: 0,
    xMax: Math.max(0, mapDimensions.width - AVATAR_SIZE),
    yMin: 0,
    yMax: Math.max(0, mapDimensions.height - AVATAR_SIZE),
  };
};

// Génère une nouvelle position cible aléatoire dans la zone, à une distance max
const getRandomTarget = (zone, fromPos = null) => {
  const maxDelta = 120; // distance max d'un saut en px
  if (fromPos) {
    // Calculer une cible dans la zone, mais à maxDelta du point de départ
    let angle = Math.random() * 2 * Math.PI;
    let dist = 40 + Math.random() * (maxDelta - 40);
    let x = fromPos.x + Math.cos(angle) * dist;
    let y = fromPos.y + Math.sin(angle) * dist;
    // Clamp dans la zone
    x = Math.max(zone.xMin, Math.min(zone.xMax, x));
    y = Math.max(zone.yMin, Math.min(zone.yMax, y));
    return { x, y };
  }
  // Premier saut : random dans la zone
  return {
    x: Math.random() * (zone.xMax - zone.xMin) + zone.xMin,
    y: Math.random() * (zone.yMax - zone.yMin) + zone.yMin,
  };
};

const useJumpingPosition = (user, mapDimensions) => {
  const zone = getZone(user.workMode || 'presentiel', mapDimensions);
  const [pos, setPos] = useState(() =>
    zone.xMax > 0 && zone.yMax > 0 ? getRandomTarget(zone) : { x: 0, y: 0 }
  );
  const posRef = useRef(pos); // nouvelle ref pour la position courante
  const [isJumping, setIsJumping] = useState(false);
  const jumpTimeout = useRef<NodeJS.Timeout | null>(null);
  const animFrame = useRef<number | null>(null);

  // Toujours garder la ref à jour
  useEffect(() => {
    posRef.current = pos;
  }, [pos]);

  useEffect(() => {
    let cancelled = false;
    const jump = () => {
      if (cancelled) return;
      setIsJumping(true);
      setTimeout(() => {
        const target = getRandomTarget(zone, posRef.current); // toujours partir de la dernière position
        const duration = 300; // ms
        const start = { ...posRef.current };
        const startTime = performance.now();
        const animate = (now: number) => {
          const t = Math.min((now - startTime) / duration, 1);
          setPos({
            x: start.x + (target.x - start.x) * t,
            y: start.y + (target.y - start.y) * t,
          });
          if (t < 1) {
            animFrame.current = requestAnimationFrame(animate);
          } else {
            setIsJumping(false);
            jumpTimeout.current = setTimeout(jump, 1000 + Math.random() * 3000) as unknown as NodeJS.Timeout;
          }
        };
        animFrame.current = requestAnimationFrame(animate);
      }, 0);
    };
    if (zone.xMax > 0 && zone.yMax > 0) {
      jumpTimeout.current = setTimeout(jump, 1000 + Math.random() * 3000) as unknown as NodeJS.Timeout;
    }
    return () => {
      cancelled = true;
      if (jumpTimeout.current) clearTimeout(jumpTimeout.current);
      if (animFrame.current) cancelAnimationFrame(animFrame.current);
    };
    // eslint-disable-next-line
  }, [user.id, user.workMode, mapDimensions.width, mapDimensions.height]);
  return [pos, isJumping] as const;
};

// Fonction utilitaire d'export CSV
const exportListCSV = (list, filename = 'remote.csv') => {
  const csv = list.join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const GameMap = () => {
  const { mapDimensions, onlineUsers } = useContext(GameContext);
  const [selectedMascot, setSelectedMascot] = useState(null as any);
  const [showRemoteList, setShowRemoteList] = useState(false);

  return (
    <div 
      className="absolute inset-0 overflow-hidden"
      style={{ 
        width: '100%',
        height: '100%',
        backgroundImage: `url(${jungleBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Date du jour */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 text-white text-2xl font-bold drop-shadow-lg z-20">
        {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: '2-digit', month: 'long' }).toUpperCase()}
      </div>
      {/* Notifications/messages (placeholder) */}
      <div className="absolute top-6 right-8 flex gap-3 z-20">
        <button className="bg-white bg-opacity-70 rounded-full p-2 shadow hover:bg-opacity-90 transition"><span role="img" aria-label="msg">💬</span></button>
        <button className="bg-white bg-opacity-70 rounded-full p-2 shadow hover:bg-opacity-90 transition"><span role="img" aria-label="notif">🔔</span></button>
      </div>
      {/* Personnages animaux sur la carte */}
      {onlineUsers.map((user) => {
        const [pos, isJumping] = useJumpingPosition(user, mapDimensions);
        return (
          <div
            key={user.id}
            className="absolute flex flex-col items-center z-10"
            style={{ left: pos.x, top: pos.y }}
          >
            <div onClick={() => setSelectedMascot(user)} className="cursor-pointer">
              <UserAvatar user={user} size={48} presenceRate={user.presenceRate} isJumping={isJumping} />
            </div>
            <span
              className="text-white text-xs font-semibold drop-shadow-lg mt-1"
            >
              {user.name}
            </span>
          </div>
        );
      })}
      {selectedMascot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40" onClick={() => setSelectedMascot(null)}>
          <div className="bg-white rounded-lg p-6 min-w-[300px] max-w-[90vw] shadow-xl relative" onClick={e => e.stopPropagation()}>
            <div className="absolute top-2 right-2 cursor-pointer text-gray-400 hover:text-gray-700 text-xl font-bold" onClick={() => setSelectedMascot(null)}>&times;</div>
            <div className="flex flex-col items-center">
              <UserAvatar user={selectedMascot} size={64} presenceRate={selectedMascot.presenceRate} isJumping={false} />
              <div className="mt-2 text-lg font-bold">{selectedMascot.name}</div>
              <div className="text-sm text-gray-500">{selectedMascot.team ? selectedMascot.team : ''}</div>
              <div className="mt-2">
                <span className="font-medium">Mode de travail :</span>
                <span className={`ml-2 ${selectedMascot.workMode === 'presentiel' ? 'text-green-600' : 'text-blue-600'}`}>
                  {selectedMascot.workMode === 'presentiel' ? 'Présentiel' : 'Remote'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Icône remote en bas à droite */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          className="bg-white rounded-full shadow-lg p-3 border border-green-200 hover:bg-green-50 transition"
          onClick={() => setShowRemoteList((v) => !v)}
          title="Voir les remotes"
        >
          <Monitor className="w-7 h-7 text-green-700" />
        </button>
        {showRemoteList && (
          <div className="mt-2 mb-2 w-72 max-h-[60vh] overflow-y-auto bg-white rounded-xl shadow-2xl border border-green-200 p-4 animate-slide-up flex flex-col gap-3">
            <div className="font-bold text-green-800 mb-2 text-lg flex items-center gap-2">
              <Monitor className="w-5 h-5" />
              En remote aujourd'hui
            </div>
            {onlineUsers.filter(u => u.workMode === 'teletravail').length === 0 ? (
              <div className="text-gray-400 text-sm">Aucun utilisateur en remote</div>
            ) : (
              onlineUsers.filter(u => u.workMode === 'teletravail').map(user => (
                <div key={user.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-green-50 transition">
                  <UserAvatar user={user} size={40} />
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-800">{user.name}</span>
                    <span className="text-xs text-gray-500">{user.team ? user.team : ''}</span>
                    <span className="text-xs text-gray-400">{user.location ? user.location : ''}</span>
                    <span className={`text-xs font-medium ${user.status === 'online' ? 'text-green-600' : user.status === 'busy' ? 'text-orange-500' : 'text-gray-400'}`}>{user.status}</span>
                  </div>
                </div>
              ))
            )}
            {/* Bouton exporter la liste */}
            <button
              className="mt-3 px-4 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700 text-sm"
              onClick={() => exportListCSV(onlineUsers.filter(u => u.workMode === 'teletravail').map(u => u.name), 'remote.csv')}
            >
              Exporter la liste
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameMap;
