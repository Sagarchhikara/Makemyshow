import React from 'react';

const ComingSoonCard = ({ movie }) => {
  const placeholderImage = 'data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==';

  return (
    <div className="coming-soon-card">
      <div className="coming-soon-poster">
        <img src={movie.poster || placeholderImage} alt={movie.title} />
      </div>
      <div className="coming-soon-info">
        <h3>{movie.title}</h3>
        <p>{movie.releaseDate}</p>
      </div>
    </div>
  );
};

export default ComingSoonCard;
