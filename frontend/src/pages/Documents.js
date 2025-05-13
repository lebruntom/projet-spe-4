import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../store/AuthContext';
import Button from '../components/ui/Button';

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser?.id) return;

    axios
      .get(`http://localhost:8000/documents/user/${currentUser.id}`, {
        withCredentials: true,
      })
      .then((res) => {
        setDocuments(res.data);
      })
      .catch((err) => {
        console.error('Erreur récupération documents', err);
      });
  }, [currentUser]);

  const openDocument = (id) => {
    navigate(`/documents/${id}`);
  };

  return (
    <div>
      <h2>Mes documents</h2>
      <Button className="bg-green-500 hover:bg-green-700 text-white" onClick={() => navigate('/create')}>Créer un document</Button>
      {documents.length === 0 ? (
        <p>Aucun document partagé avec vous.</p>
      ) : (
        <ul>
          {documents.map((doc) => (
            <li key={doc.id}>
              <strong>{doc.id}</strong>
              <button onClick={() => openDocument(doc.id)}>Ouvrir</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
