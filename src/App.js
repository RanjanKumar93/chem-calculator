import React from 'react';
import './App.css';
import ChemistryCalculator from './ChemistryCalculator';
import { ChemistryProvider } from './ChemistryContext';

function App() {
  return (
    <div className="App">
      <ChemistryProvider>
        <ChemistryCalculator />
      </ChemistryProvider>
    </div>
  );
}

export default App;