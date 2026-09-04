import React from 'react';

const CreatorTag = ({ name, avatar }) => {
  if (!name || !avatar) return null;
  return (
    <div className="creator-tag">
      <span className="creator-avatar">{avatar}</span>
      <span className="creator-name">{name}</span>
    </div>
  );
};

export default CreatorTag;
