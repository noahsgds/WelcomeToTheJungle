import React from 'react';

interface UserAvatarProps {
  user: { id: string; name: string; avatar: string; presenceRate?: number };
  size?: number;
  presenceRate?: number;
  isJumping?: boolean;
}

const animalImages: Record<string, string> = {
  parrot: '/assets/avatars/parrot.png',
  frog: '/assets/avatars/frog.png',
  tiger: '/assets/avatars/tiger.png',
  monkey: '/assets/avatars/monkey.png',
  elephant: '/assets/avatars/elephant.png',
  snake: '/assets/avatars/snake.png',
};

const UserAvatar: React.FC<UserAvatarProps> = ({ user, size = 48, presenceRate, isJumping }) => {
  const imgSrc = animalImages[user.avatar] || '';
  const rate = presenceRate ?? user.presenceRate ?? 0;
  const isLevelUp = rate > 70;
  // Effet de saut : scaleY et translateY
  const jumpStyle = isJumping
    ? {
        transform: `${isLevelUp ? 'scale(1.3)' : 'scale(1)'} scaleY(1.2) translateY(-12%)`,
        transition: 'transform 0.25s cubic-bezier(.4,2,.6,1)',
      }
    : {
        transform: isLevelUp ? 'scale(1.3)' : 'scale(1)',
        transition: 'transform 0.4s cubic-bezier(.4,2,.6,1)',
      };
  return (
    <div
      style={{
        width: size,
        height: size,
        boxShadow: isLevelUp ? '0 0 16px 6px #34d399, 0 0 32px 12px #bbf7d0' : 'none',
        filter: isLevelUp ? 'brightness(1.2) drop-shadow(0 0 8px #34d399)' : 'none',
        borderRadius: 8,
        background: isLevelUp ? 'rgba(52,211,153,0.08)' : 'none',
        ...jumpStyle,
      }}
      title={user.name}
    >
      {imgSrc ? (
        <img src={imgSrc} alt={user.avatar} style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
      ) : (
        <span style={{ fontSize: size * 0.7 }}>👤</span>
      )}
    </div>
  );
};

export default UserAvatar; 