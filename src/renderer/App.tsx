import React, { useState, useEffect } from 'react';
import { usePetStore } from './stores/petStore';
import Dashboard from './components/Dashboard';
import CharacterSetup from './components/CharacterSetup';
import './styles/App.css';

const App: React.FC = () => {
  const { currentPet, loadPets } = usePetStore();
  const [showSetup, setShowSetup] = useState(false);

  useEffect(() => {
    loadPets();
  }, []);

  return (
    <div className="app-container">
      {!currentPet || showSetup ? (
        <CharacterSetup onComplete={() => setShowSetup(false)} />
      ) : (
        <Dashboard onNewPet={() => setShowSetup(true)} />
      )}
    </div>
  );
};

export default App;
