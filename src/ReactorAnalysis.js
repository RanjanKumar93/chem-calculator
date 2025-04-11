import React, { useContext, useState } from "react";
import { ChemistryContext } from "./ChemistryContext";
import "./ReactorAnalysis.css";

const ReactorAnalysis = () => {
  const [activeTab, setActiveTab] = useState(0);
  
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
    volume: 0,
    numberOfReactors: 1
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
    productInitialAmounts,
    initialVolumetricFlow,
    customK,
    reactantExponents
  } = useContext(ChemistryContext);

  // Enhanced reaction rate calculation
  const reactionRate = (conversion) => {
    // Calculate all reactant concentrations based on conversion
    const concentrations = reactantCoefficients.map((coeff, i) => {
      const C0 = reactantInitialAmounts[i] * initialVolumetricFlow;
      return C0 * (1 - (coeff/reactantCoefficients[0]) * conversion);
    });

    // Calculate rate using all reactants with their exponents
    let rate = isNaN(parseFloat(customK)) ? 1 : parseFloat(customK);
    reactantExponents.forEach((exp, i) => {
      rate *= Math.pow(concentrations[i], exp || 0);
    });
    
    return rate;
  };

  const integrate = (f, a, b, n = 100) => {
    const h = (b - a) / n;
    let sum = 0;
    for (let i = 0; i < n; i++) {
      const x = a + (i + 0.5) * h;
      sum += f(x);
    }
    return sum * h;
  };

  const calculatePFR = () => {
    const { initialConversion, finalConversion } = pfrState;
    
    if (finalConversion <= initialConversion) {
      alert("Final conversion must be greater than initial conversion");
      return;
    }

    const integrand = (X) => 1 / reactionRate(X);
    const integral = integrate(integrand, initialConversion, finalConversion);
    const volume = (reactantInitialAmounts[0] * initialVolumetricFlow) * integral;
    const residenceTime = volume / initialVolumetricFlow;

    setPfrState(prev => ({
      ...prev,
      residenceTime,
      volume
    }));
  };

  const calculateCSTR = () => {
    const { initialConversion, finalConversion, numberOfReactors } = cstrState;
    
    if (finalConversion <= initialConversion) {
      alert("Final conversion must be greater than initial conversion");
      return;
    }

    // Calculate for each reactor in series
    const deltaX = (finalConversion - initialConversion) / numberOfReactors;
    let currentX = initialConversion;
    let totalVolume = 0;

    for (let i = 0; i < numberOfReactors; i++) {
      const nextX = currentX + deltaX;
      const exitRate = reactionRate(nextX);
      totalVolume += (reactantInitialAmounts[0] * initialVolumetricFlow) * deltaX / exitRate;
      currentX = nextX;
    }

    const avgResidenceTime = totalVolume / (initialVolumetricFlow * numberOfReactors);

    setCstrState(prev => ({
      ...prev,
      residenceTime: avgResidenceTime,
      volume: totalVolume / numberOfReactors
    }));
  };

  const calculateBatch = () => {
    const { initialConversion, finalConversion } = batchState;
    
    if (finalConversion <= initialConversion) {
      alert("Final conversion must be greater than initial conversion");
      return;
    }

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
      [e.target.name]: parseFloat(e.target.value) || 0,
    });
  };

  const handleCstrChange = (e) => {
    setCstrState({
      ...cstrState,
      [e.target.name]: parseFloat(e.target.value) || 0,
    });
  };

  const handleBatchChange = (e) => {
    setBatchState({
      ...batchState,
      [e.target.name]: parseFloat(e.target.value) || 0,
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
          <p>
            Conversion Range: {pfrState.initialConversion.toFixed(2)} to{" "}
            {pfrState.finalConversion.toFixed(2)}
          </p>
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

      <div className="input-group">
        <label>Number of CSTRs in Series:</label>
        <input
          type="number"
          name="numberOfReactors"
          min="1"
          max="10"
          value={cstrState.numberOfReactors || 1}
          onChange={handleCstrChange}
        />
      </div>

      <button onClick={calculateCSTR}>Calculate CSTR Parameters</button>

      {cstrState.volume > 0 && (
        <div className="results">
          <h5>Results</h5>
          <p>
            Residence Time per Reactor: {cstrState.residenceTime.toFixed(4)} s
          </p>
          <p>Volume per Reactor: {cstrState.volume.toFixed(4)} m³</p>
          <p>
            Total Volume:{" "}
            {(cstrState.volume * (cstrState.numberOfReactors || 1)).toFixed(4)}{" "}
            m³
          </p>
          <p>
            Conversion Range: {cstrState.initialConversion.toFixed(2)} →{" "}
            {cstrState.finalConversion.toFixed(2)}
          </p>
          <p>
            Exit Reaction Rate:{" "}
            {reactionRate(cstrState.finalConversion).toExponential(4)} mol/m³s
          </p>
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
          <p>
            Conversion Range: {batchState.initialConversion.toFixed(2)} to{" "}
            {batchState.finalConversion.toFixed(2)}
          </p>
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
      <div className="tab-content-container">
        {activeTab === 0 && <Tab1Content />}
        {activeTab === 1 && <Tab2Content />}
        {activeTab === 2 && <Tab3Content />}
      </div>
    </div>
  );
};

export default ReactorAnalysis;

// import React, { useContext, useState } from "react";
// import { ChemistryContext } from "./ChemistryContext";
// import "./ReactorAnalysis.css";

// const ReactorAnalysis = () => {
//   const [activeTab, setActiveTab] = useState(0);

//   // Separate states for each reactor type
//   const [pfrState, setPfrState] = useState({
//     initialConversion: 0,
//     finalConversion: 0.9,
//     residenceTime: 0,
//     volume: 0
//   });

//   const [cstrState, setCstrState] = useState({
//     initialConversion: 0,
//     finalConversion: 0.9,
//     residenceTime: 0,
//     volume: 0,
//     numberOfReactors: 1 // New field
//   });

//   const [batchState, setBatchState] = useState({
//     initialConversion: 0,
//     finalConversion: 0.9,
//     reactionTime: 0
//   });

//   // Get data from context
//   const {
//     reactantCoefficients,
//     reactantInitialAmounts,
//     initialVolumetricFlow,
//     customK,
//     reactantExponents
//   } = useContext(ChemistryContext);

//   // Calculate reaction rate constant
//   const k = isNaN(parseFloat(customK)) ? 1 : parseFloat(customK);

//   // Calculate initial concentration of limiting reactant
//   const CA0 = reactantInitialAmounts[0] * initialVolumetricFlow;

//   // Reaction rate function (simplified for demonstration)
//   const reactionRate = (conversion) => {
//     const CA = CA0 * (1 - conversion);
//     return k * Math.pow(CA, reactantExponents[0] || 1);
//   };

//   // Numerical integration function
//   const integrate = (f, a, b, n = 100) => {
//     const h = (b - a) / n;
//     let sum = 0;
//     for (let i = 0; i < n; i++) {
//       const x = a + (i + 0.5) * h;
//       sum += f(x);
//     }
//     return sum * h;
//   };

//   // PFR Calculations
//   const calculatePFR = () => {
//     const { initialConversion, finalConversion } = pfrState;

//     // Design equation for PFR: V = F_A0 * ∫(dX/-rA) from X_initial to X_final
//     const integrand = (X) => 1 / reactionRate(X);
//     const integral = integrate(integrand, initialConversion, finalConversion);
//     const volume = CA0 * integral;
//     const residenceTime = volume / initialVolumetricFlow;

//     setPfrState(prev => ({
//       ...prev,
//       residenceTime,
//       volume
//     }));
//   };

//   // CSTR Calculations
//   const calculateCSTR = () => {
//     const { initialConversion, finalConversion } = cstrState;

//     // Get rate AT EXIT CONVERSION (X₂)
//     const exitRate = reactionRate(finalConversion);

//     // V = F_A0 * (X₂ - X₁) / (-rA)|X₂
//     const volume = CA0 * (finalConversion - initialConversion) / exitRate;
//     const residenceTime = volume / initialVolumetricFlow;

//     setCstrState(prev => ({
//       ...prev,
//       residenceTime,
//       volume
//     }));
//   };

//   // Batch Reactor Calculations
//   const calculateBatch = () => {
//     const { initialConversion, finalConversion } = batchState;

//     // Design equation for Batch: t = ∫(dX/-rA) from X_initial to X_final
//     const integrand = (X) => 1 / reactionRate(X);
//     const reactionTime = integrate(integrand, initialConversion, finalConversion);

//     setBatchState(prev => ({
//       ...prev,
//       reactionTime
//     }));
//   };

//   // Handle input changes for each reactor
//   const handlePfrChange = (e) => {
//     setPfrState({
//       ...pfrState,
//       [e.target.name]: parseFloat(e.target.value) || 0
//     });
//   };

//   const handleCstrChange = (e) => {
//     setCstrState({
//       ...cstrState,
//       [e.target.name]: parseFloat(e.target.value) || 0
//     });
//   };

//   const handleBatchChange = (e) => {
//     setBatchState({
//       ...batchState,
//       [e.target.name]: parseFloat(e.target.value) || 0
//     });
//   };

//   // Tab content components
//   const Tab1Content = () => (
//     <div className="tab-content">
//       <h4>Plug Flow Reactor (PFR)</h4>
//       <div className="input-group">
//         <label>Initial Conversion (X₀):</label>
//         <input
//           type="number"
//           name="initialConversion"
//           min="0"
//           max="0.99"
//           step="0.01"
//           value={pfrState.initialConversion}
//           onChange={handlePfrChange}
//         />
//       </div>
//       <div className="input-group">
//         <label>Final Conversion (X):</label>
//         <input
//           type="number"
//           name="finalConversion"
//           min={pfrState.initialConversion + 0.01}
//           max="0.99"
//           step="0.01"
//           value={pfrState.finalConversion}
//           onChange={handlePfrChange}
//         />
//       </div>
//       <button onClick={calculatePFR}>Calculate PFR Parameters</button>

//       {pfrState.volume > 0 && (
//         <div className="results">
//           <h5>Results</h5>
//           <p>Residence Time (τ): {pfrState.residenceTime.toFixed(4)} s</p>
//           <p>Required Volume: {pfrState.volume.toFixed(4)} m³</p>
//           <p>Conversion Range: {pfrState.initialConversion.toFixed(2)} to {pfrState.finalConversion.toFixed(2)}</p>
//         </div>
//       )}
//     </div>
//   );

//   const Tab2Content = () => (
//     <div className="tab-content">
//       <h4>Continuous Stirred-Tank Reactor (CSTR)</h4>

//       <div className="input-group">
//         <label>Initial Conversion (X₀):</label>
//         <input
//           type="number"
//           name="initialConversion"
//           min="0"
//           max="0.99"
//           step="0.01"
//           value={cstrState.initialConversion}
//           onChange={handleCstrChange}
//         />
//       </div>

//       <div className="input-group">
//         <label>Final Conversion (X):</label>
//         <input
//           type="number"
//           name="finalConversion"
//           min={cstrState.initialConversion + 0.01}
//           max="0.99"
//           step="0.01"
//           value={cstrState.finalConversion}
//           onChange={handleCstrChange}
//         />
//       </div>

//       <div className="input-group">
//         <label>Number of CSTRs in Series:</label>
//         <input
//           type="number"
//           name="numberOfReactors"
//           min="1"
//           max="10"
//           value={cstrState.numberOfReactors || 1}
//           onChange={handleCstrChange}
//         />
//       </div>

//       <button onClick={calculateCSTR}>Calculate CSTR Parameters</button>

//       {cstrState.volume > 0 && (
//         <div className="results">
//           <h5>Results</h5>
//           <p>Residence Time per Reactor: {cstrState.residenceTime.toFixed(4)} s</p>
//           <p>Volume per Reactor: {cstrState.volume.toFixed(4)} m³</p>
//           <p>Total Volume: {(cstrState.volume * (cstrState.numberOfReactors || 1)).toFixed(4)} m³</p>
//           <p>Conversion Range: {cstrState.initialConversion.toFixed(2)} → {cstrState.finalConversion.toFixed(2)}</p>
//           <p>Exit Reaction Rate: {reactionRate(cstrState.finalConversion).toExponential(4)} mol/m³s</p>
//         </div>
//       )}
//     </div>
//   );

//   const Tab3Content = () => (
//     <div className="tab-content">
//       <h4>Batch Reactor</h4>
//       <div className="input-group">
//         <label>Initial Conversion (X₀):</label>
//         <input
//           type="number"
//           name="initialConversion"
//           min="0"
//           max="0.99"
//           step="0.01"
//           value={batchState.initialConversion}
//           onChange={handleBatchChange}
//         />
//       </div>
//       <div className="input-group">
//         <label>Final Conversion (X):</label>
//         <input
//           type="number"
//           name="finalConversion"
//           min={batchState.initialConversion + 0.01}
//           max="0.99"
//           step="0.01"
//           value={batchState.finalConversion}
//           onChange={handleBatchChange}
//         />
//       </div>
//       <button onClick={calculateBatch}>Calculate Batch Parameters</button>

//       {batchState.reactionTime > 0 && (
//         <div className="results">
//           <h5>Results</h5>
//           <p>Required Reaction Time: {batchState.reactionTime.toFixed(4)} s</p>
//           <p>Conversion Range: {batchState.initialConversion.toFixed(2)} to {batchState.finalConversion.toFixed(2)}</p>
//         </div>
//       )}
//     </div>
//   );

//   const tabs = [
//     { title: "PFR", content: <Tab1Content /> },
//     { title: "CSTR", content: <Tab2Content /> },
//     { title: "Batch Reactor", content: <Tab3Content /> },
//   ];

//   return (
//     <div className="reactor-analysis">
//       <h3>Reactor Analysis</h3>
//       <div className="tabs">
//         {tabs.map((tab, index) => (
//           <button
//             key={index}
//             className={`tab-button ${activeTab === index ? "active" : ""}`}
//             onClick={() => setActiveTab(index)}
//           >
//             {tab.title}
//           </button>
//         ))}
//       </div>
//       <div className="tab-content-container">{tabs[activeTab].content}</div>
//     </div>
//   );
// };

// export default ReactorAnalysis;
