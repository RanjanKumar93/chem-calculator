import React, { useState } from "react";
import "./ChemistryCalculator.css";

const ChemistryCalculator = () => {
  const [reactantsCount, setReactantsCount] = useState(2);
  const [productsCount, setProductsCount] = useState(2);
  const [reactantCoefficients, setReactantCoefficients] = useState([1, 1]);
  const [productCoefficients, setProductCoefficients] = useState([1, 1]);
  const [reactantExponents, setReactantExponents] = useState([1, 1]);
  const [productExponents, setProductExponents] = useState([0, 0]);
  const [reactantInitialAmounts, setReactantInitialAmounts] = useState([1, 1]);
  const [productInitialAmounts, setProductInitialAmounts] = useState([0, 0]);
  const [customK, setCustomK] = useState(1);
  const [showCustomRate, setShowCustomRate] = useState(false);
  const [customRateLaw, setCustomRateLaw] = useState("");
  const [reactionGenerated, setReactionGenerated] = useState(false);
  const [showStoichiometricTable, setShowStoichiometricTable] = useState(false);

  const generateReaction = () => {
    // Initialize coefficients
    const newReactantCoefficients = Array(parseInt(reactantsCount)).fill(1);
    const newProductCoefficients = Array(parseInt(productsCount)).fill(1);

    // Initialize exponents (reactants start at 1, products at 0)
    const newReactantExponents = Array(parseInt(reactantsCount)).fill(1);
    const newProductExponents = Array(parseInt(productsCount)).fill(0);

    // Initialize initial amounts
    const newReactantInitialAmounts = Array(parseInt(reactantsCount)).fill(1);
    const newProductInitialAmounts = Array(parseInt(productsCount)).fill(0);

    setReactantCoefficients(newReactantCoefficients);
    setProductCoefficients(newProductCoefficients);
    setReactantExponents(newReactantExponents);
    setProductExponents(newProductExponents);
    setReactantInitialAmounts(newReactantInitialAmounts);
    setProductInitialAmounts(newProductInitialAmounts);
    setShowCustomRate(false);
    setShowStoichiometricTable(false);
    setReactionGenerated(true);
  };

  const handleCoefficientChange = (type, index, value) => {
    const valueNum = parseInt(value) || 0;
    if (type === "reactant") {
      const newCoefficients = [...reactantCoefficients];
      newCoefficients[index] = valueNum;
      setReactantCoefficients(newCoefficients);

      // Update exponents to match coefficients by default
      const newExponents = [...reactantExponents];
      newExponents[index] = valueNum;
      setReactantExponents(newExponents);
    } else {
      const newCoefficients = [...productCoefficients];
      newCoefficients[index] = valueNum;
      setProductCoefficients(newCoefficients);
    }
  };

  const handleInitialAmountChange = (type, index, value) => {
    const valueNum = parseFloat(value) || 0;
    if (type === "reactant") {
      const newAmounts = [...reactantInitialAmounts];
      newAmounts[index] = valueNum;
      setReactantInitialAmounts(newAmounts);
    } else {
      const newAmounts = [...productInitialAmounts];
      newAmounts[index] = valueNum;
      setProductInitialAmounts(newAmounts);
    }
  };

  const handleExponentChange = (type, index, value) => {
    const valueNum = parseFloat(value) || 0;
    if (type === "reactant") {
      const newExponents = [...reactantExponents];
      newExponents[index] = valueNum;
      setReactantExponents(newExponents);
    } else {
      const newExponents = [...productExponents];
      newExponents[index] = valueNum;
      setProductExponents(newExponents);
    }
  };

  const calculateCustomRate = () => {
    const allTerms = [];

    // Add reactant terms
    reactantExponents.forEach((exp, index) => {
      if (exp !== 0) {
        allTerms.push({
          species: `A<sub>${index + 1}</sub>`,
          exponent: exp,
          amount: reactantInitialAmounts[index],
        });
      }
    });

    // Add product terms
    productExponents.forEach((exp, index) => {
      if (exp !== 0) {
        allTerms.push({
          species: `B<sub>${index + 1}</sub>`,
          exponent: exp,
          amount: productInitialAmounts[index],
        });
      }
    });

    const rateLaw =
      `Rate = ${customK} ` +
      allTerms
        .map((term) => `[${term.species}]<sup>${term.exponent}</sup>`)
        .join(" × ");

    // Calculate actual rate value
    let rateValue = customK;
    allTerms.forEach((term) => {
      rateValue *= Math.pow(term.amount, term.exponent);
    });

    setCustomRateLaw(`${rateLaw} = ${rateValue.toFixed(4)} M/s`);
    setShowCustomRate(true);
  };

  const resetToOriginal = () => {
    const newReactantExponents = [...reactantCoefficients];
    const newProductExponents = Array(productCoefficients.length).fill(0);

    setReactantExponents(newReactantExponents);
    setProductExponents(newProductExponents);
    setCustomK(1);
    setShowCustomRate(false);
  };

  const generateStoichiometricTable = () => {
    setShowStoichiometricTable(true);
  };

  const renderStoichiometricTable = () => {
    if (!showStoichiometricTable) return null;

    return (
      <div className="stoichiometric-table">
        <h3>Stoichiometric Table</h3>
        <table>
          <thead>
            <tr>
              <th>Species</th>
              <th>Initial Amount (M)</th>
              <th>Change (M)</th>
              <th>Final Amount (M)</th>
            </tr>
          </thead>
          <tbody>
            {/* Reactants */}
            {reactantCoefficients.map((coeff, index) => (
              <tr key={`reactant-row-${index}`}>
                <td>A<sub>{index + 1}</sub></td>
                <td>{reactantInitialAmounts[index].toFixed(2)}</td>
                <td>-{coeff}ξ</td>
                <td>
                  {reactantInitialAmounts[index] >= coeff
                    ? `${(reactantInitialAmounts[index] - coeff).toFixed(2)} - ξ`
                    : "0 (limiting)"}
                </td>
              </tr>
            ))}
            
            {/* Products */}
            {productCoefficients.map((coeff, index) => (
              <tr key={`product-row-${index}`}>
                <td>B<sub>{index + 1}</sub></td>
                <td>{productInitialAmounts[index].toFixed(2)}</td>
                <td>+{coeff}ξ</td>
                <td>
                  {productInitialAmounts[index] > 0
                    ? `${(productInitialAmounts[index] + coeff).toFixed(2)} + ξ`
                    : `${coeff}ξ`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="table-note">
          Note: ξ represents the extent of reaction (in moles per liter).
        </p>
      </div>
    );
  };

  const renderReaction = () => {
    const reactantParts = [];
    const productParts = [];

    for (let i = 0; i < reactantCoefficients.length; i++) {
      const coeff =
        reactantCoefficients[i] === 1 ? "" : reactantCoefficients[i];
      reactantParts.push(
        <React.Fragment key={`reactant-${i}`}>
          <input
            type="number"
            className="reaction-input"
            value={reactantCoefficients[i]}
            min="1"
            onChange={(e) =>
              handleCoefficientChange("reactant", i, e.target.value)
            }
          />
          A<sub>{i + 1}</sub>
          {i < reactantCoefficients.length - 1 && " + "}
        </React.Fragment>
      );
    }

    for (let i = 0; i < productCoefficients.length; i++) {
      const coeff = productCoefficients[i] === 1 ? "" : productCoefficients[i];
      productParts.push(
        <React.Fragment key={`product-${i}`}>
          <input
            type="number"
            className="reaction-input"
            value={productCoefficients[i]}
            min="1"
            onChange={(e) =>
              handleCoefficientChange("product", i, e.target.value)
            }
          />
          B<sub>{i + 1}</sub>
          {i < productCoefficients.length - 1 && " + "}
        </React.Fragment>
      );
    }

    return (
      <div className="reaction-container">
        {reactantParts}
        <span className="arrow">→</span>
        {productParts}
      </div>
    );
  };

  const renderFullReaction = () => {
    const reactantParts = [];
    const productParts = [];

    for (let i = 0; i < reactantCoefficients.length; i++) {
      const coeff =
        reactantCoefficients[i] === 1 ? "" : reactantCoefficients[i];
      reactantParts.push(
        <React.Fragment key={`reactant-display-${i}`}>
          {coeff}A<sub>{i + 1}</sub>
          {i < reactantCoefficients.length - 1 && " + "}
        </React.Fragment>
      );
    }

    for (let i = 0; i < productCoefficients.length; i++) {
      const coeff = productCoefficients[i] === 1 ? "" : productCoefficients[i];
      productParts.push(
        <React.Fragment key={`product-display-${i}`}>
          {coeff}B<sub>{i + 1}</sub>
          {i < productCoefficients.length - 1 && " + "}
        </React.Fragment>
      );
    }

    return (
      <div className="reaction-display">
        {reactantParts} → {productParts}
      </div>
    );
  };

  const renderInitialAmountControls = () => {
    return (
      <div className="initial-amount-controls">
        <h3>Initial Amounts (Molarity)</h3>

        <h4>Reactants</h4>
        {reactantInitialAmounts.map((amount, index) => (
          <div className="input-group" key={`reactant-amount-${index}`}>
            <label htmlFor={`reactant-amount-${index}`}>
              Initial [A<sub>{index + 1}</sub>]:
            </label>
            <input
              type="number"
              id={`reactant-amount-${index}`}
              step="0.1"
              min="0"
              value={amount}
              onChange={(e) =>
                handleInitialAmountChange("reactant", index, e.target.value)
              }
            />
          </div>
        ))}

        <h4>Products</h4>
        {productInitialAmounts.map((amount, index) => (
          <div className="input-group" key={`product-amount-${index}`}>
            <label htmlFor={`product-amount-${index}`}>
              Initial [B<sub>{index + 1}</sub>]:
            </label>
            <input
              type="number"
              id={`product-amount-${index}`}
              step="0.1"
              min="0"
              value={amount}
              onChange={(e) =>
                handleInitialAmountChange("product", index, e.target.value)
              }
            />
          </div>
        ))}
      </div>
    );
  };

  const renderRateLawControls = () => {
    return (
      <div className="rate-law-section">
        <h3>Rate Law Parameters</h3>
        <div className="input-group">
          <label htmlFor="custom-k">Rate Constant (k):</label>
          <input
            type="number"
            id="custom-k"
            step="0.01"
            value={customK}
            onChange={(e) => setCustomK(parseFloat(e.target.value) || 0)}
          />
        </div>

        <h4>Reactant Exponents</h4>
        {reactantExponents.map((exp, index) => (
          <div className="input-group" key={`reactant-exp-${index}`}>
            <label htmlFor={`reactant-exp-${index}`}>
              Exponent for A<sub>{index + 1}</sub>:
            </label>
            <input
              type="number"
              id={`reactant-exp-${index}`}
              step="0.1"
              value={exp}
              onChange={(e) =>
                handleExponentChange("reactant", index, e.target.value)
              }
            />
          </div>
        ))}

        <h4>Product Exponents</h4>
        {productExponents.map((exp, index) => (
          <div className="input-group" key={`product-exp-${index}`}>
            <label htmlFor={`product-exp-${index}`}>
              Exponent for B<sub>{index + 1}</sub>:
            </label>
            <input
              type="number"
              id={`product-exp-${index}`}
              step="0.1"
              value={exp}
              onChange={(e) =>
                handleExponentChange("product", index, e.target.value)
              }
            />
          </div>
        ))}

        <button className="calculate-button" onClick={calculateCustomRate}>
          Calculate Rate Law
        </button>
        <button className="small-button" onClick={resetToOriginal}>
          Reset Exponents
        </button>

        {showCustomRate && (
          <div
            className="rate-law-result"
            dangerouslySetInnerHTML={{ __html: customRateLaw }}
          />
        )}
      </div>
    );
  };

  return (
    <div id="chemistry-calculator">
      <div className="calculator-title">Chemistry Reaction Calculator</div>

      <div className="input-group">
        <label htmlFor="reactants">Number of Reactants</label>
        <input
          type="number"
          id="reactants"
          min="1"
          max="5"
          value={reactantsCount}
          onChange={(e) => setReactantsCount(parseInt(e.target.value) || 1)}
        />
      </div>

      <div className="input-group">
        <label htmlFor="products">Number of Products</label>
        <input
          type="number"
          id="products"
          min="1"
          max="5"
          value={productsCount}
          onChange={(e) => setProductsCount(parseInt(e.target.value) || 1)}
        />
      </div>

      <button onClick={generateReaction}>Generate Reaction</button>

      {reactionGenerated && (
        <>
          {renderReaction()}
          {reactantCoefficients.length > 0 && productCoefficients.length > 0 && (
            <>
              {renderFullReaction()}
              {renderInitialAmountControls()}
              {renderRateLawControls()}
              
              {showCustomRate && (
                <button 
                  className="stoichiometric-button"
                  onClick={generateStoichiometricTable}
                >
                  Generate Stoichiometric Table
                </button>
              )}
              
              {renderStoichiometricTable()}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ChemistryCalculator;

// import React, { useState } from "react";
// import "./ChemistryCalculator.css";

// const ChemistryCalculator = () => {
//   const [reactantsCount, setReactantsCount] = useState(2);
//   const [productsCount, setProductsCount] = useState(2);
//   const [reactantCoefficients, setReactantCoefficients] = useState([1, 1]);
//   const [productCoefficients, setProductCoefficients] = useState([1, 1]);
//   const [reactantExponents, setReactantExponents] = useState([1, 1]);
//   const [productExponents, setProductExponents] = useState([0, 0]);
//   const [reactantInitialAmounts, setReactantInitialAmounts] = useState([1, 1]);
//   const [productInitialAmounts, setProductInitialAmounts] = useState([0, 0]);
//   const [customK, setCustomK] = useState(1);
//   const [showCustomRate, setShowCustomRate] = useState(false);
//   const [customRateLaw, setCustomRateLaw] = useState("");
//   const [reactionGenerated, setReactionGenerated] = useState(false);
//   const [showStoichiometricTable, setShowStoichiometricTable] = useState(false);

//   const generateReaction = () => {
//     // Initialize coefficients
//     const newReactantCoefficients = Array(parseInt(reactantsCount)).fill(1);
//     const newProductCoefficients = Array(parseInt(productsCount)).fill(1);

//     // Initialize exponents (reactants start at 1, products at 0)
//     const newReactantExponents = Array(parseInt(reactantsCount)).fill(1);
//     const newProductExponents = Array(parseInt(productsCount)).fill(0);

//     // Initialize initial amounts
//     const newReactantInitialAmounts = Array(parseInt(reactantsCount)).fill(1);
//     const newProductInitialAmounts = Array(parseInt(productsCount)).fill(0);

//     setReactantCoefficients(newReactantCoefficients);
//     setProductCoefficients(newProductCoefficients);
//     setReactantExponents(newReactantExponents);
//     setProductExponents(newProductExponents);
//     setReactantInitialAmounts(newReactantInitialAmounts);
//     setProductInitialAmounts(newProductInitialAmounts);
//     setShowCustomRate(false);
//     setShowStoichiometricTable(false);
//     setReactionGenerated(true);
//   };

//   const handleCoefficientChange = (type, index, value) => {
//     const valueNum = parseInt(value) || 0;
//     if (type === "reactant") {
//       const newCoefficients = [...reactantCoefficients];
//       newCoefficients[index] = valueNum;
//       setReactantCoefficients(newCoefficients);

//       // Update exponents to match coefficients by default
//       const newExponents = [...reactantExponents];
//       newExponents[index] = valueNum;
//       setReactantExponents(newExponents);
//     } else {
//       const newCoefficients = [...productCoefficients];
//       newCoefficients[index] = valueNum;
//       setProductCoefficients(newCoefficients);
//     }
//   };

//   const handleInitialAmountChange = (type, index, value) => {
//     const valueNum = parseFloat(value) || 0;
//     if (type === "reactant") {
//       const newAmounts = [...reactantInitialAmounts];
//       newAmounts[index] = valueNum;
//       setReactantInitialAmounts(newAmounts);
//     } else {
//       const newAmounts = [...productInitialAmounts];
//       newAmounts[index] = valueNum;
//       setProductInitialAmounts(newAmounts);
//     }
//   };

//   const handleExponentChange = (type, index, value) => {
//     const valueNum = parseFloat(value) || 0;
//     if (type === "reactant") {
//       const newExponents = [...reactantExponents];
//       newExponents[index] = valueNum;
//       setReactantExponents(newExponents);
//     } else {
//       const newExponents = [...productExponents];
//       newExponents[index] = valueNum;
//       setProductExponents(newExponents);
//     }
//   };

//   const calculateCustomRate = () => {
//     const allTerms = [];

//     // Add reactant terms
//     reactantExponents.forEach((exp, index) => {
//       if (exp !== 0) {
//         allTerms.push({
//           species: `A<sub>${index + 1}</sub>`,
//           exponent: exp,
//           amount: reactantInitialAmounts[index],
//         });
//       }
//     });

//     // Add product terms
//     productExponents.forEach((exp, index) => {
//       if (exp !== 0) {
//         allTerms.push({
//           species: `B<sub>${index + 1}</sub>`,
//           exponent: exp,
//           amount: productInitialAmounts[index],
//         });
//       }
//     });

//     const rateLaw =
//       `Custom Rate = ${customK} ` +
//       allTerms
//         .map((term) => `[${term.species}]<sup>${term.exponent}</sup>`)
//         .join(" × ");

//     // Calculate actual rate value
//     let rateValue = customK;
//     allTerms.forEach((term) => {
//       rateValue *= Math.pow(term.amount, term.exponent);
//     });

//     setCustomRateLaw(`${rateLaw} = ${rateValue.toFixed(4)} M/s`);
//     setShowCustomRate(true);
//   };

//   const resetToOriginal = () => {
//     const newReactantExponents = [...reactantCoefficients];
//     const newProductExponents = Array(productCoefficients.length).fill(0);

//     setReactantExponents(newReactantExponents);
//     setProductExponents(newProductExponents);
//     setCustomK(1);
//     setShowCustomRate(false);
//   };

//   const generateStoichiometricTable = () => {
//     setShowStoichiometricTable(true);
//   };

//   const renderStoichiometricTable = () => {
//     if (!showStoichiometricTable) return null;

//     return (
//       <div className="stoichiometric-table">
//         <h3>Stoichiometric Table</h3>
//         <table>
//           <thead>
//             <tr>
//               <th>Species</th>
//               <th>Initial Amount (M)</th>
//               <th>Change (M)</th>
//               <th>Final Amount (M)</th>
//             </tr>
//           </thead>
//           <tbody>
//             {/* Reactants */}
//             {reactantCoefficients.map((coeff, index) => (
//               <tr key={`reactant-row-${index}`}>
//                 <td>A<sub>{index + 1}</sub></td>
//                 <td>{reactantInitialAmounts[index].toFixed(2)}</td>
//                 <td>-{coeff}ξ</td>
//                 <td>
//                   {reactantInitialAmounts[index] >= coeff
//                     ? `${(reactantInitialAmounts[index] - coeff).toFixed(2)} - ξ`
//                     : "0 (limiting)"}
//                 </td>
//               </tr>
//             ))}
            
//             {/* Products */}
//             {productCoefficients.map((coeff, index) => (
//               <tr key={`product-row-${index}`}>
//                 <td>B<sub>{index + 1}</sub></td>
//                 <td>{productInitialAmounts[index].toFixed(2)}</td>
//                 <td>+{coeff}ξ</td>
//                 <td>
//                   {productInitialAmounts[index] > 0
//                     ? `${(productInitialAmounts[index] + coeff).toFixed(2)} + ξ`
//                     : `${coeff}ξ`}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         <p className="table-note">
//           Note: ξ represents the extent of reaction (in moles per liter).
//         </p>
//       </div>
//     );
//   };

//   const renderReaction = () => {
//     const reactantParts = [];
//     const productParts = [];

//     for (let i = 0; i < reactantCoefficients.length; i++) {
//       const coeff =
//         reactantCoefficients[i] === 1 ? "" : reactantCoefficients[i];
//       reactantParts.push(
//         <React.Fragment key={`reactant-${i}`}>
//           <input
//             type="number"
//             className="reaction-input"
//             value={reactantCoefficients[i]}
//             min="1"
//             onChange={(e) =>
//               handleCoefficientChange("reactant", i, e.target.value)
//             }
//           />
//           A<sub>{i + 1}</sub>
//           {i < reactantCoefficients.length - 1 && " + "}
//         </React.Fragment>
//       );
//     }

//     for (let i = 0; i < productCoefficients.length; i++) {
//       const coeff = productCoefficients[i] === 1 ? "" : productCoefficients[i];
//       productParts.push(
//         <React.Fragment key={`product-${i}`}>
//           <input
//             type="number"
//             className="reaction-input"
//             value={productCoefficients[i]}
//             min="1"
//             onChange={(e) =>
//               handleCoefficientChange("product", i, e.target.value)
//             }
//           />
//           B<sub>{i + 1}</sub>
//           {i < productCoefficients.length - 1 && " + "}
//         </React.Fragment>
//       );
//     }

//     return (
//       <div className="reaction-container">
//         {reactantParts}
//         <span className="arrow">→</span>
//         {productParts}
//       </div>
//     );
//   };

//   const renderFullReaction = () => {
//     const reactantParts = [];
//     const productParts = [];

//     for (let i = 0; i < reactantCoefficients.length; i++) {
//       const coeff =
//         reactantCoefficients[i] === 1 ? "" : reactantCoefficients[i];
//       reactantParts.push(
//         <React.Fragment key={`reactant-display-${i}`}>
//           {coeff}A<sub>{i + 1}</sub>
//           {i < reactantCoefficients.length - 1 && " + "}
//         </React.Fragment>
//       );
//     }

//     for (let i = 0; i < productCoefficients.length; i++) {
//       const coeff = productCoefficients[i] === 1 ? "" : productCoefficients[i];
//       productParts.push(
//         <React.Fragment key={`product-display-${i}`}>
//           {coeff}B<sub>{i + 1}</sub>
//           {i < productCoefficients.length - 1 && " + "}
//         </React.Fragment>
//       );
//     }

//     return (
//       <div className="reaction-display">
//         {reactantParts} → {productParts}
//       </div>
//     );
//   };

//   const renderRateLaw = () => {
//     const allTerms = [];

//     // Add reactant terms
//     for (let i = 0; i < reactantExponents.length; i++) {
//       if (reactantExponents[i] !== 0) {
//         allTerms.push({
//           species: `A<sub>${i + 1}</sub>`,
//           exponent: reactantExponents[i],
//         });
//       }
//     }

//     // Add product terms
//     for (let i = 0; i < productExponents.length; i++) {
//       if (productExponents[i] !== 0) {
//         allTerms.push({
//           species: `B<sub>${i + 1}</sub>`,
//           exponent: productExponents[i],
//         });
//       }
//     }

//     const rateLaw =
//       `Rate = k ` +
//       allTerms
//         .map((term) => `[${term.species}]<sup>${term.exponent}</sup>`)
//         .join(" × ");

//     return (
//       <div
//         className="rate-law-display"
//         dangerouslySetInnerHTML={{ __html: rateLaw }}
//       />
//     );
//   };

//   const renderInitialAmountControls = () => {
//     return (
//       <div className="initial-amount-controls">
//         <h3>Initial Amounts (Molarity)</h3>

//         <h4>Reactants</h4>
//         {reactantInitialAmounts.map((amount, index) => (
//           <div className="input-group" key={`reactant-amount-${index}`}>
//             <label htmlFor={`reactant-amount-${index}`}>
//               Initial [A<sub>{index + 1}</sub>]:
//             </label>
//             <input
//               type="number"
//               id={`reactant-amount-${index}`}
//               step="0.1"
//               min="0"
//               value={amount}
//               onChange={(e) =>
//                 handleInitialAmountChange("reactant", index, e.target.value)
//               }
//             />
//           </div>
//         ))}

//         <h4>Products</h4>
//         {productInitialAmounts.map((amount, index) => (
//           <div className="input-group" key={`product-amount-${index}`}>
//             <label htmlFor={`product-amount-${index}`}>
//               Initial [B<sub>{index + 1}</sub>]:
//             </label>
//             <input
//               type="number"
//               id={`product-amount-${index}`}
//               step="0.1"
//               min="0"
//               value={amount}
//               onChange={(e) =>
//                 handleInitialAmountChange("product", index, e.target.value)
//               }
//             />
//           </div>
//         ))}
//       </div>
//     );
//   };

//   const renderCustomRateControls = () => {
//     return (
//       <div className="custom-rate-controls">
//         <h3>Customize Rate Law</h3>
//         <div className="input-group">
//           <label htmlFor="custom-k">Rate Constant (k):</label>
//           <input
//             type="number"
//             id="custom-k"
//             step="0.01"
//             value={customK}
//             onChange={(e) => setCustomK(parseFloat(e.target.value) || 0)}
//           />
//         </div>

//         <h4>Reactant Exponents</h4>
//         {reactantExponents.map((exp, index) => (
//           <div className="input-group" key={`reactant-exp-${index}`}>
//             <label htmlFor={`reactant-exp-${index}`}>
//               Exponent for A<sub>{index + 1}</sub>:
//             </label>
//             <input
//               type="number"
//               id={`reactant-exp-${index}`}
//               step="0.1"
//               value={exp}
//               onChange={(e) =>
//                 handleExponentChange("reactant", index, e.target.value)
//               }
//             />
//           </div>
//         ))}

//         <h4>Product Exponents</h4>
//         {productExponents.map((exp, index) => (
//           <div className="input-group" key={`product-exp-${index}`}>
//             <label htmlFor={`product-exp-${index}`}>
//               Exponent for B<sub>{index + 1}</sub>:
//             </label>
//             <input
//               type="number"
//               id={`product-exp-${index}`}
//               step="0.1"
//               value={exp}
//               onChange={(e) =>
//                 handleExponentChange("product", index, e.target.value)
//               }
//             />
//           </div>
//         ))}

//         <button className="small-button" onClick={calculateCustomRate}>
//           Calculate Custom Rate
//         </button>
//         <button className="small-button" onClick={resetToOriginal}>
//           Reset to Original
//         </button>
//       </div>
//     );
//   };

//   return (
//     <div id="chemistry-calculator">
//       <div className="calculator-title">Chemistry Reaction Calculator</div>

//       <div className="input-group">
//         <label htmlFor="reactants">Number of Reactants</label>
//         <input
//           type="number"
//           id="reactants"
//           min="1"
//           max="5"
//           value={reactantsCount}
//           onChange={(e) => setReactantsCount(parseInt(e.target.value) || 1)}
//         />
//       </div>

//       <div className="input-group">
//         <label htmlFor="products">Number of Products</label>
//         <input
//           type="number"
//           id="products"
//           min="1"
//           max="5"
//           value={productsCount}
//           onChange={(e) => setProductsCount(parseInt(e.target.value) || 1)}
//         />
//       </div>

//       <button onClick={generateReaction}>Generate Reaction</button>

//       {reactionGenerated && (
//         <>
//           {renderReaction()}
//           {reactantCoefficients.length > 0 && productCoefficients.length > 0 && (
//             <>
//               {renderFullReaction()}
//               {renderRateLaw()}
//               {renderInitialAmountControls()}
              
//               <button 
//                 className="stoichiometric-button"
//                 onClick={generateStoichiometricTable}
//               >
//                 Generate Stoichiometric Table
//               </button>
              
//               {renderStoichiometricTable()}
//               {renderCustomRateControls()}
//               {showCustomRate && (
//                 <div
//                   className="custom-rate-result"
//                   dangerouslySetInnerHTML={{ __html: customRateLaw }}
//                 />
//               )}
//             </>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default ChemistryCalculator;

