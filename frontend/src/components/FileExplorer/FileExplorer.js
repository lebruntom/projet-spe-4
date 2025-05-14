import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Folder from './Folder';
import FileItem from './FileItem';

export default function FileExplorer({ userId }) {
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (userId) {
      axios
        .get(`http://localhost:8000/documents/user/${userId}/folders`)
        .then((res) => setFolders(res.data));

      axios
        .get(`http://localhost:8000/documents/user/${userId}/files`)
        .then((res) => setFiles(res.data));
    }
  }, [userId]);

  return (
    <div>
      <h3>Mes Dossiers et Fichiers</h3>
      <div className="folder-list">
        {folders.map((folder) => (
          <Folder key={folder.id} folder={folder} />
        ))}
      </div>
      <div className="file-list">
        {files.map((file) => (
          <FileItem key={file.id} file={file} />
        ))}
      </div>
    </div>
  );
}
