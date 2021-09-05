import React from 'react';

export default (url, disabled) =>
  (...chunks) =>
    disabled ? (
      chunks
    ) : (
      <a href={url} target="_blank" rel="noopener noreferrer" className="external">
        {chunks}
      </a>
    );
