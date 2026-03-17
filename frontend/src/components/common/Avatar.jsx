const roleClasses = {
  admin: 'bg-amber-500 text-white',
  faculty: 'bg-teal-600 text-white',
  student: 'bg-indigo-600 text-white',
  default: 'bg-slate-600 text-white',
};

const getInitials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('') || 'U';

const Avatar = ({ name, role = 'default', imageUrl = '', className = '' }) => {
  const initials = getInitials(name);
  const toneClass = roleClasses[role] || roleClasses.default;
  const showImage = typeof imageUrl === 'string' && imageUrl.trim().length > 0;

  if (showImage) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className={className}
        onError={(event) => {
          event.currentTarget.style.display = 'none';
          const fallback = event.currentTarget.nextElementSibling;
          if (fallback) fallback.style.display = 'flex';
        }}
      />
    );
  }

  return (
    <div className={`${toneClass} ${className} flex items-center justify-center font-semibold uppercase`}>
      {initials}
    </div>
  );
};

export const AvatarWithFallback = ({ name, role = 'default', imageUrl = '', className = '' }) => {
  const initials = getInitials(name);
  const toneClass = roleClasses[role] || roleClasses.default;
  const showImage = typeof imageUrl === 'string' && imageUrl.trim().length > 0;

  return (
    <div className="relative">
      {showImage && (
        <img
          src={imageUrl}
          alt={name}
          className={className}
          onError={(event) => {
            event.currentTarget.style.display = 'none';
            const fallback = event.currentTarget.parentElement?.querySelector('[data-avatar-fallback]');
            if (fallback) fallback.style.display = 'flex';
          }}
        />
      )}
      <div
        data-avatar-fallback
        className={`${toneClass} ${className} ${showImage ? 'hidden' : 'flex'} items-center justify-center font-semibold uppercase`}
      >
        {initials}
      </div>
    </div>
  );
};

export default Avatar;
