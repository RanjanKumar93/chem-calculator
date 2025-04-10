import React, { useContext, useState } from "react";
import { ChemistryContext } from "./ChemistryContext";
import "./ReactorAnalysis.css";

const ReactorAnalysis = () => {
  const [activeTab, setActiveTab] = useState(0);
  
  // Separate states for each reactor type
  const [pfrState, setPfrState] = useState({
    initialConversion: 0,
    finalConversion: 0.9,
    residenceTime: 0,
    volume: 0
  });

  const [cstrState, setCstrState] = useState({
    initialConversion: 0,
    finalConversion: 0.9,
    residenceTime: 0,
    volume: 0
  });

  const [batchState, setBatchState] = useState({
    initialConversion: 0,
    finalConversion: 0.9,
    reactionTime: 0
  });

  // Get data from context
  const {
    reactantCoefficients,
    reactantInitialAmounts,
    initialVolumetricFlow,
    customK,
    reactantExponents
  } = useContext(ChemistryContext);

  // Calculate reaction rate constant
  const k = isNaN(parseFloat(customK)) ? 1 : parseFloat(customK);

  // Calculate initial concentration of limiting reactant
  const CA0 = reactantInitialAmounts[0] * initialVolumetricFlow;

  // Reaction rate function (simplified for demonstration)
  const reactionRate = (conversion) => {
    const CA = CA0 * (1 - conversion);
    return k * Math.pow(CA, reactantExponents[0] || 1);
  };

  // Numerical integration function
  const integrate = (f, a, b, n = 100) => {
    const h = (b - a) / n;
    let sum = 0;
    for (let i = 0; i < n; i++) {
      const x = a + (i + 0.5) * h;
      sum += f(x);
    }
    return sum * h;
  };

  // PFR Calculations
  const calculatePFR = () => {
    const { initialConversion, finalConversion } = pfrState;
    
    // Design equation for PFR: V = F_A0 * ∫(dX/-rA) from X_initial to X_final
    const integrand = (X) => 1 / reactionRate(X);
    const integral = integrate(integrand, initialConversion, finalConversion);
    const volume = CA0 * integral;
    const residenceTime = volume / initialVolumetricFlow;

    setPfrState(prev => ({
      ...prev,
      residenceTime,
      volume
    }));
  };

  // CSTR Calculations
  const calculateCSTR = () => {
    const { initialConversion, finalConversion } = cstrState;
    
    // For multiple CSTRs in series (approximation)
    const deltaX = (finalConversion - initialConversion) / 1; // Using 1 CSTR for simplicity
    const X_avg = initialConversion + deltaX / 2;
    const rate = reactionRate(X_avg);
    const volume = CA0 * deltaX / rate;
    const residenceTime = volume / initialVolumetricFlow;

    setCstrState(prev => ({
      ...prev,
      residenceTime,
      volume
    }));
  };

  // Batch Reactor Calculations
  const calculateBatch = () => {
    const { initialConversion, finalConversion } = batchState;
    
    // Design equation for Batch: t = ∫(dX/-rA) from X_initial to X_final
    const integrand = (X) => 1 / reactionRate(X);
    const reactionTime = integrate(integrand, initialConversion, finalConversion);

    setBatchState(prev => ({
      ...prev,
      reactionTime
    }));
  };

  // Handle input changes for each reactor
  const handlePfrChange = (e) => {
    setPfrState({
      ...pfrState,
      [e.target.name]: parseFloat(e.target.value) || 0
    });
  };

  const handleCstrChange = (e) => {
    setCstrState({
      ...cstrState,
      [e.target.name]: parseFloat(e.target.value) || 0
    });
  };

  const handleBatchChange = (e) => {
    setBatchState({
      ...batchState,
      [e.target.name]: parseFloat(e.target.value) || 0
    });
  };

  // Tab content components
  const Tab1Content = () => (
    <div className="tab-content">
      <h4>Plug Flow Reactor (PFR)</h4>
      <div className="input-group">
        <label>Initial Conversion (X₀):</label>
        <input
          type="number"
          name="initialConversion"
          min="0"
          max="0.99"
          step="0.01"
          value={pfrState.initialConversion}
          onChange={handlePfrChange}
        />
      </div>
      <div className="input-group">
        <label>Final Conversion (X):</label>
        <input
          type="number"
          name="finalConversion"
          min={pfrState.initialConversion + 0.01}
          max="0.99"
          step="0.01"
          value={pfrState.finalConversion}
          onChange={handlePfrChange}
        />
      </div>
      <button onClick={calculatePFR}>Calculate PFR Parameters</button>
      
      {pfrState.volume > 0 && (
        <div className="results">
          <h5>Results</h5>
          <p>Residence Time (τ): {pfrState.residenceTime.toFixed(4)} s</p>
          <p>Required Volume: {pfrState.volume.toFixed(4)} m³</p>
          <p>Conversion Range: {pfrState.initialConversion.toFixed(2)} to {pfrState.finalConversion.toFixed(2)}</p>
        </div>
      )}
    </div>
  );

  const Tab2Content = () => (
    <div className="tab-content">
      <h4>Continuous Stirred-Tank Reactor (CSTR)</h4>
      <div className="input-group">
        <label>Initial Conversion (X₀):</label>
        <input
          type="number"
          name="initialConversion"
          min="0"
          max="0.99"
          step="0.01"
          value={cstrState.initialConversion}
          onChange={handleCstrChange}
        />
      </div>
      <div className="input-group">
        <label>Final Conversion (X):</label>
        <input
          type="number"
          name="finalConversion"
          min={cstrState.initialConversion + 0.01}
          max="0.99"
          step="0.01"
          value={cstrState.finalConversion}
          onChange={handleCstrChange}
        />
      </div>
      <button onClick={calculateCSTR}>Calculate CSTR Parameters</button>
      
      {cstrState.volume > 0 && (
        <div className="results">
          <h5>Results</h5>
          <p>Residence Time (τ): {cstrState.residenceTime.toFixed(4)} s</p>
          <p>Required Volume: {cstrState.volume.toFixed(4)} m³</p>
          <p>Conversion Range: {cstrState.initialConversion.toFixed(2)} to {cstrState.finalConversion.toFixed(2)}</p>
        </div>
      )}
    </div>
  );

  const Tab3Content = () => (
    <div className="tab-content">
      <h4>Batch Reactor</h4>
      <div className="input-group">
        <label>Initial Conversion (X₀):</label>
        <input
          type="number"
          name="initialConversion"
          min="0"
          max="0.99"
          step="0.01"
          value={batchState.initialConversion}
          onChange={handleBatchChange}
        />
      </div>
      <div className="input-group">
        <label>Final Conversion (X):</label>
        <input
          type="number"
          name="finalConversion"
          min={batchState.initialConversion + 0.01}
          max="0.99"
          step="0.01"
          value={batchState.finalConversion}
          onChange={handleBatchChange}
        />
      </div>
      <button onClick={calculateBatch}>Calculate Batch Parameters</button>
      
      {batchState.reactionTime > 0 && (
        <div className="results">
          <h5>Results</h5>
          <p>Required Reaction Time: {batchState.reactionTime.toFixed(4)} s</p>
          <p>Conversion Range: {batchState.initialConversion.toFixed(2)} to {batchState.finalConversion.toFixed(2)}</p>
        </div>
      )}
    </div>
  );

  const tabs = [
    { title: "PFR", content: <Tab1Content /> },
    { title: "CSTR", content: <Tab2Content /> },
    { title: "Batch Reactor", content: <Tab3Content /> },
  ];

  return (
    <div className="reactor-analysis">
      <h3>Reactor Analysis</h3>
      <div className="tabs">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`tab-button ${activeTab === index ? "active" : ""}`}
            onClick={() => setActiveTab(index)}
          >
            {tab.title}
          </button>
        ))}
      </div>
      <div className="tab-content-container">{tabs[activeTab].content}</div>
    </div>
  );
};

export default ReactorAnalysis;