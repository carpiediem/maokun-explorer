import React from 'react';

export default (url) => (...chunks) => (
  <a href={url} target="_blank" rel="noopener noreferrer" className="external">
    {chunks}
  </a>
);
