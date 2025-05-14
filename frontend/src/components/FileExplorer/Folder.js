import React from 'react';

export default function Folder({ folder }) {
  return (
    <div className="folder-item">
      <strong>{folder.name}</strong>
      {/* Ici, vous pouvez ajouter des liens ou des boutons pour naviguer à l'intérieur du dossier */}
    </div>
  );
}
