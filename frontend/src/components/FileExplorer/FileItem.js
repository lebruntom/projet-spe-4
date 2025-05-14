import React from 'react';

export default function FileItem({ file }) {
  return (
    <div className="file-item">
      <strong>{file.title}</strong>
      {/* Ici vous pouvez ajouter un bouton pour ouvrir ou télécharger le fichier */}
    </div>
  );
}
