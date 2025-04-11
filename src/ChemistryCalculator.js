import React from "react";
import "./ChemistryCalculator.css";
import { ChemistryContext } from "./ChemistryContext";
import ReactorAnalysis from "./ReactorAnalysis";

const ChemistryCalculator = () => {
  const {
    reactantsCount,
    setReactantsCount,
    productsCount,
    setProductsCount,
    nonReactingCount,
    setNonReactingCount,
    reactantCoefficients,
    setReactantCoefficients,
    productCoefficients,
    setProductCoefficients,
    reactantExponents,
    setReactantExponents,
    productExponents,
    setProductExponents,
    reactantInitialAmounts,
    setReactantInitialAmounts,
    productInitialAmounts,
    setProductInitialAmounts,
    nonReactingInitialAmounts,
    setNonReactingInitialAmounts,
    customK,
    setCustomK,
    showCustomRate,
    setShowCustomRate,
    customRateLaw,
    setCustomRateLaw,
    reactionGenerated,
    setReactionGenerated,
    showStoichiometricTable,
    setShowStoichiometricTable,
    initialVolumetricFlow,
    setInitialVolumetricFlow,
    initialPressure,
    setInitialPressure,
    initialTemperature,
    setInitialTemperature,
    finalPressure,
    setFinalPressure,
    finalTemperature,
    setFinalTemperature,
    numericalExtent,
    setNumericalExtent,
    numericalInitialPressure,
    setNumericalInitialPressure,
    numericalInitialTemperature,
    setNumericalInitialTemperature,
    numericalFinalPressure,
    setNumericalFinalPressure,
    numericalFinalTemperature,
    setNumericalFinalTemperature,
    showNumericalTable,
    setShowNumericalTable,
    useNumericalValues,
    setUseNumericalValues,
  } = React.useContext(ChemistryContext);

  // Helper function to check if a value is numeric
  const isNumeric = (value) => {
    return !isNaN(parseFloat(value)) && isFinite(value);
  };

  // Helper function to format values - shows expression if not numeric
  const formatValue = (value, defaultValue = "") => {
    if (value === undefined || value === null) return defaultValue;
    if (isNumeric(value)) return parseFloat(value).toFixed(4);
    return value.toString();
  };

  // Helper function to multiply values while preserving symbols
  const multiplyValues = (a, b) => {
    const numA = parseFloat(a);
    const numB = parseFloat(b);

    if (!isNaN(numA) && !isNaN(numB)) {
      return (numA * numB).toString();
    }

    if (a === "0" || b === "0") return "0";
    if (a === "1") return b;
    if (b === "1") return a;

    // Special case: if one is a number and the other is symbolic
    if (!isNaN(numA)) return `${numA}×${b}`;
    if (!isNaN(numB)) return `${a}×${numB}`;

    return `${a}×${b}`;
  };

  const addValues = (a, b) => {
    const numA = parseFloat(a);
    const numB = parseFloat(b);

    if (!isNaN(numA) && !isNaN(numB)) {
      return (numA + numB).toString();
    }

    if (a === "0") return b;
    if (b === "0") return a;

    // Special case: if one is a number and the other is symbolic
    if (!isNaN(numA)) return `${numA}+${b}`;
    if (!isNaN(numB)) return `${a}+${numB}`;

    return `${a}+${b}`;
  };

  // Helper function to divide values while preserving symbols
  const divideValues = (a, b) => {
    const numA = parseFloat(a);
    const numB = parseFloat(b);

    if (!isNaN(numA) && !isNaN(numB)) {
      if (numB === 0) return "∞";
      return (numA / numB).toString();
    }

    if (a === "0") return "0";
    if (b === "1") return a;

    return `${a}/${b}`;
  };

  const generateReaction = () => {
    const newReactantCoefficients = Array(parseInt(reactantsCount)).fill(1);
    const newProductCoefficients = Array(parseInt(productsCount)).fill(1);
    const newReactantExponents = Array(parseInt(reactantsCount)).fill(1);
    const newProductExponents = Array(parseInt(productsCount)).fill(0);
    const newReactantInitialAmounts = Array(parseInt(reactantsCount)).fill(1);
    const newProductInitialAmounts = Array(parseInt(productsCount)).fill(0);
    const newNonReactingInitialAmounts = Array(parseInt(nonReactingCount)).fill(
      0
    );

    setReactantCoefficients(newReactantCoefficients);
    setProductCoefficients(newProductCoefficients);
    setReactantExponents(newReactantExponents);
    setProductExponents(newProductExponents);
    setReactantInitialAmounts(newReactantInitialAmounts);
    setProductInitialAmounts(newProductInitialAmounts);
    setNonReactingInitialAmounts(newNonReactingInitialAmounts);
    setShowCustomRate(false);
    setShowStoichiometricTable(false);
    setReactionGenerated(true);
  };

  const calculateWithExtent = () => {
    setShowNumericalTable(true);
  };

  const handleCoefficientChange = (type, index, value) => {
    const valueNum = parseFloat(value) || 0;
    if (type === "reactant") {
      const newCoefficients = [...reactantCoefficients];
      newCoefficients[index] = valueNum;
      setReactantCoefficients(newCoefficients);

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
    } else if (type === "product") {
      const newAmounts = [...productInitialAmounts];
      newAmounts[index] = valueNum;
      setProductInitialAmounts(newAmounts);
    } else {
      const newAmounts = [...nonReactingInitialAmounts];
      newAmounts[index] = valueNum;
      setNonReactingInitialAmounts(newAmounts);
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

    reactantExponents.forEach((exp, index) => {
      if (exp !== 0) {
        allTerms.push({
          species: `A<sub>${index + 1}</sub>`,
          exponent: exp,
        });
      }
    });

    productExponents.forEach((exp, index) => {
      if (exp !== 0) {
        allTerms.push({
          species: `B<sub>${index + 1}</sub>`,
          exponent: exp,
        });
      }
    });

    const rateLaw =
      `Rate = ${customK} ` +
      allTerms
        .map((term) => `[${term.species}]<sup>${term.exponent}</sup>`)
        .join(" × ");

    setCustomRateLaw(rateLaw);
    setShowCustomRate(true);
  };

  const resetToOriginal = () => {
    const newReactantExponents = [...reactantCoefficients];
    const newProductExponents = Array(productCoefficients.length).fill(0);

    setReactantExponents(newReactantExponents);
    setProductExponents(newProductExponents);
    setCustomK("k");
    setShowCustomRate(false);
  };

  const generateStoichiometricTable = () => {
    setShowStoichiometricTable(true);
  };

  const renderStoichiometricTable = () => {
    if (!showStoichiometricTable) return null;

    // Use either symbolic or numerical values based on useNumericalValues flag
    const currentInitialPressure = useNumericalValues
      ? numericalInitialPressure.toString()
      : initialPressure;
    const currentFinalPressure = useNumericalValues
      ? numericalFinalPressure.toString()
      : finalPressure;
    const currentInitialTemperature = useNumericalValues
      ? numericalInitialTemperature.toString()
      : initialTemperature;
    const currentFinalTemperature = useNumericalValues
      ? numericalFinalTemperature.toString()
      : finalTemperature;
    const currentExtent = useNumericalValues ? numericalExtent.toString() : "ξ";

    const pressureRatio = divideValues(initialPressure, finalPressure);
    const temperatureRatio = divideValues(finalTemperature, initialTemperature);

    // Calculate total initial molar flow rate (sum of all initial flows)
    const totalInitialMolarFlow =
      (reactantInitialAmounts.reduce((sum, amount) => sum + amount, 0) +
        productInitialAmounts.reduce((sum, amount) => sum + amount, 0) +
        nonReactingInitialAmounts.reduce((sum, amount) => sum + amount, 0)) *
      initialVolumetricFlow;

    // Calculate the coefficient for ξ in total molar flow
    const xiCoefficient =
      productCoefficients.reduce((sum, coeff) => sum + coeff, 0) -
      reactantCoefficients.reduce((sum, coeff) => sum + coeff, 0);

    const finalVolumetricFlow = multiplyValues(
      multiplyValues(
        multiplyValues(initialVolumetricFlow, pressureRatio),
        temperatureRatio
      ),
      divideValues(
        totalInitialMolarFlow.toString(),
        addValues(
          totalInitialMolarFlow.toString(),
          multiplyValues(xiCoefficient.toString(), currentExtent)
        )
      )
    );

    return (
      <div className="stoichiometric-table">
        <h3>Stoichiometric Table (Molar Flow Rates in mol/s)</h3>
        <table>
          <thead>
            <tr>
              <th>Species</th>
              <th>Initial Flow Rate (F₀)</th>
              <th>Change (ΔF)</th>
              <th>Final Flow Rate (F)</th>
            </tr>
          </thead>
          <tbody>
            {/* Reactants */}
            {reactantCoefficients.map((coeff, index) => {
              const initialFlow = (
                reactantInitialAmounts[index] * initialVolumetricFlow
              ).toFixed(4);
              const change = `-${coeff}${currentExtent}`;
              const finalFlow = `${initialFlow} - ${coeff}${currentExtent}`;
              return (
                <tr key={`reactant-row-${index}`}>
                  <td>
                    A<sub>{index + 1}</sub>
                  </td>
                  <td>{initialFlow}</td>
                  <td>{change}</td>
                  <td>{finalFlow}</td>
                </tr>
              );
            })}

            {/* Products */}
            {productCoefficients.map((coeff, index) => {
              const initialFlow = (
                productInitialAmounts[index] * initialVolumetricFlow
              ).toFixed(4);
              const change = `+${coeff}${currentExtent}`;
              const finalFlow = `${initialFlow} + ${coeff}${currentExtent}`;
              return (
                <tr key={`product-row-${index}`}>
                  <td>
                    B<sub>{index + 1}</sub>
                  </td>
                  <td>{initialFlow}</td>
                  <td>{change}</td>
                  <td>{finalFlow}</td>
                </tr>
              );
            })}

            {/* Non-reacting elements */}
            {nonReactingInitialAmounts.map((amount, index) => {
              const initialFlow = (amount * initialVolumetricFlow).toFixed(4);
              return (
                <tr key={`nonreacting-row-${index}`}>
                  <td>
                    I<sub>{index + 1}</sub>
                  </td>
                  <td>{initialFlow}</td>
                  <td>0</td>
                  <td>{initialFlow}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="total-flow-section">
          <h4>Total Molar Flow Rate Calculations</h4>
          <p>
            <strong>
              Total Initial Molar Flow Rate (F<sub>total,0</sub>):
            </strong>{" "}
            {totalInitialMolarFlow.toFixed(4)} mol/s
          </p>
          <p>
            <strong>
              Total Final Molar Flow Rate (F<sub>total</sub>):
            </strong>
            <br />F<sub>total</sub> = F<sub>total,0</sub> + (Σproduct
            coefficients - Σreactant coefficients){currentExtent}
          </p>
          <p>
            F<sub>total</sub> = {totalInitialMolarFlow.toFixed(4)} + (
            {xiCoefficient}){currentExtent}
          </p>
        </div>

        <div className="volumetric-flow-calculation">
          <h4>Final Volumetric Flow Rate Calculation</h4>
          <p>
            V = {initialVolumetricFlow} × ({currentInitialPressure}/
            {currentFinalPressure}) × ({currentFinalTemperature}/
            {currentInitialTemperature}) × {totalInitialMolarFlow.toFixed(4)}/(
            {totalInitialMolarFlow.toFixed(4)} + ({xiCoefficient})
            {currentExtent})
          </p>
        </div>
      </div>
    );
  };

  const renderReaction = () => {
    const reactantParts = [];
    const productParts = [];

    for (let i = 0; i < reactantCoefficients.length; i++) {
      reactantParts.push(
        <React.Fragment key={`reactant-${i}`}>
          <input
            type="number"
            className="reaction-input"
            value={reactantCoefficients[i]}
            step="0.1"
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
      productParts.push(
        <React.Fragment key={`product-${i}`}>
          <input
            type="number"
            className="reaction-input"
            value={productCoefficients[i]}
            step="0.1"
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

  const renderNumericalStoichiometricTable = () => {
    if (!showNumericalTable || !showStoichiometricTable) return null;

    // Use numerical values for calculation
    const pressureRatio = numericalInitialPressure / numericalFinalPressure;
    const temperatureRatio =
      numericalFinalTemperature / numericalInitialTemperature;
    // Calculate total initial molar flow rate
    const totalInitialMolarFlow =
      (reactantInitialAmounts.reduce((sum, amount) => sum + amount, 0) +
        productInitialAmounts.reduce((sum, amount) => sum + amount, 0) +
        nonReactingInitialAmounts.reduce((sum, amount) => sum + amount, 0)) *
      initialVolumetricFlow;

    // Calculate the coefficient for ξ in total molar flow
    const xiCoefficient =
      productCoefficients.reduce((sum, coeff) => sum + coeff, 0) -
      reactantCoefficients.reduce((sum, coeff) => sum + coeff, 0);

    // Calculate total final molar flow rate with numerical extent
    const totalFinalMolarFlow =
      totalInitialMolarFlow + xiCoefficient * numericalExtent;

    const finalVolumetricFlow =
      initialVolumetricFlow *
      pressureRatio *
      temperatureRatio *
      (totalInitialMolarFlow / totalFinalMolarFlow);

    return (
      <div className="numerical-stoichiometric-table">
        <h3>
          Stoichiometric Table with Numerical Values (ξ = {numericalExtent})
        </h3>
        <table>
          <thead>
            <tr>
              <th>Species</th>
              <th>Initial Flow Rate (F₀)</th>
              <th>Change (ΔF)</th>
              <th>Final Flow Rate (F)</th>
            </tr>
          </thead>
          <tbody>
            {/* Reactants */}
            {reactantCoefficients.map((coeff, index) => {
              const initialFlow = (
                reactantInitialAmounts[index] * initialVolumetricFlow
              ).toFixed(4);
              const change = -coeff * numericalExtent;
              const finalFlow = (
                reactantInitialAmounts[index] * initialVolumetricFlow -
                coeff * numericalExtent
              ).toFixed(4);
              return (
                <tr key={`numerical-reactant-row-${index}`}>
                  <td>
                    A<sub>{index + 1}</sub>
                  </td>
                  <td>{initialFlow}</td>
                  <td>{change.toFixed(4)}</td>
                  <td>{finalFlow}</td>
                </tr>
              );
            })}

            {/* Products */}
            {productCoefficients.map((coeff, index) => {
              const initialFlow = (
                productInitialAmounts[index] * initialVolumetricFlow
              ).toFixed(4);
              const change = coeff * numericalExtent;
              const finalFlow = (
                productInitialAmounts[index] * initialVolumetricFlow +
                coeff * numericalExtent
              ).toFixed(4);
              return (
                <tr key={`numerical-product-row-${index}`}>
                  <td>
                    B<sub>{index + 1}</sub>
                  </td>
                  <td>{initialFlow}</td>
                  <td>+{change.toFixed(4)}</td>
                  <td>{finalFlow}</td>
                </tr>
              );
            })}

            {/* Non-reacting elements */}
            {nonReactingInitialAmounts.map((amount, index) => {
              const initialFlow = (amount * initialVolumetricFlow).toFixed(4);
              return (
                <tr key={`numerical-nonreacting-row-${index}`}>
                  <td>
                    I<sub>{index + 1}</sub>
                  </td>
                  <td>{initialFlow}</td>
                  <td>0</td>
                  <td>{initialFlow}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="total-flow-section">
          <h4>Total Molar Flow Rate Calculations</h4>
          <p>
            <strong>
              Total Initial Molar Flow Rate (F<sub>total,0</sub>):
            </strong>{" "}
            {totalInitialMolarFlow.toFixed(4)} mol/s
          </p>
          <p>
            <strong>
              Total Final Molar Flow Rate (F<sub>total</sub>):
            </strong>{" "}
            {totalFinalMolarFlow.toFixed(4)} mol/s
          </p>
          <p>
            F<sub>total</sub> = {totalInitialMolarFlow.toFixed(4)} + (
            {xiCoefficient}) × {numericalExtent} ={" "}
            {totalFinalMolarFlow.toFixed(4)} mol/s
          </p>
        </div>

        <div className="volumetric-flow-calculation">
          <h4>Final Volumetric Flow Rate Calculation</h4>
          <p>
            V = {initialVolumetricFlow} × ({numericalInitialPressure}/
            {numericalFinalPressure}) × ({numericalFinalTemperature}/
            {numericalInitialTemperature}) × {totalInitialMolarFlow.toFixed(4)}/
            {totalFinalMolarFlow.toFixed(4)}
          </p>
          <p>
            <strong>
              Final Volumetric Flow Rate: {finalVolumetricFlow.toFixed(4)} dm³/s
            </strong>
          </p>
        </div>
      </div>
    );
  };

  const renderProcessConditions = () => {
    return (
      <div className="process-conditions">
        <h3>Process Conditions</h3>

        <div className="input-group">
          <label htmlFor="initial-flow">Initial Volumetric Flow (dm³/s):</label>
          <input
            type="number"
            id="initial-flow"
            step="0.1"
            min="0"
            value={initialVolumetricFlow}
            onChange={(e) =>
              setInitialVolumetricFlow(parseFloat(e.target.value) || 0)
            }
          />
        </div>

        <div className="input-group">
          <label>Initial Pressure (atm):</label>
          <span className="symbolic-value-display">{initialPressure}</span>
        </div>

        <div className="input-group">
          <label>Initial Temperature (K):</label>
          <span className="symbolic-value-display">{initialTemperature}</span>
        </div>

        <div className="input-group">
          <label>Final Pressure (atm):</label>
          <span className="symbolic-value-display">{finalPressure}</span>
        </div>

        <div className="input-group">
          <label>Final Temperature (K):</label>
          <span className="symbolic-value-display">{finalTemperature}</span>
        </div>

        <div className="input-group">
          <label>Extent of Reaction:</label>
          <span className="symbolic-value-display">ξ</span>
        </div>
      </div>
    );
  };

  const renderFullReaction = () => {
    const reactantParts = [];
    const productParts = [];

    for (let i = 0; i < reactantCoefficients.length; i++) {
      reactantParts.push(
        <React.Fragment key={`reactant-display-${i}`}>
          {reactantCoefficients[i]}A<sub>{i + 1}</sub>
          {i < reactantCoefficients.length - 1 && " + "}
        </React.Fragment>
      );
    }

    for (let i = 0; i < productCoefficients.length; i++) {
      productParts.push(
        <React.Fragment key={`product-display-${i}`}>
          {productCoefficients[i]}B<sub>{i + 1}</sub>
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

        {nonReactingCount > 0 && (
          <>
            <h4>Non-Reacting Elements</h4>
            {nonReactingInitialAmounts.map((amount, index) => (
              <div className="input-group" key={`nonreacting-amount-${index}`}>
                <label htmlFor={`nonreacting-amount-${index}`}>
                  Initial [I<sub>{index + 1}</sub>]:
                </label>
                <input
                  type="number"
                  id={`nonreacting-amount-${index}`}
                  step="0.1"
                  min="0"
                  value={amount}
                  onChange={(e) =>
                    handleInitialAmountChange(
                      "nonreacting",
                      index,
                      e.target.value
                    )
                  }
                />
              </div>
            ))}
          </>
        )}
      </div>
    );
  };

  const renderRateLawControls = () => {
    return (
      <div className="rate-law-section">
        <h3>Rate Law Parameters</h3>
        <div className="input-group">
          <label htmlFor="custom-k">Rate Constant:</label>
          <input
            type="text"
            id="custom-k"
            value={customK}
            onChange={(e) => setCustomK(e.target.value)}
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

  const renderNonReactingSection = () => {
    return (
      <div className="input-group">
        <label htmlFor="nonreacting">Number of Non-Reacting Elements</label>
        <input
          type="number"
          id="nonreacting"
          min="0"
          max="5"
          value={nonReactingCount}
          onChange={(e) => setNonReactingCount(parseInt(e.target.value) || 0)}
        />
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

      {renderNonReactingSection()}
      {renderProcessConditions()}

      <button onClick={generateReaction}>Generate Reaction</button>

      {reactionGenerated && (
        <>
          {renderReaction()}
          {reactantCoefficients.length > 0 &&
            productCoefficients.length > 0 && (
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

                {/* This will always show symbolic calculations */}
                {renderStoichiometricTable()}

                {showStoichiometricTable && (
                  <div className="numerical-extent-section">
                    <h3>Calculate with Numerical Values</h3>
                    <div className="numerical-inputs-grid">
                      <div className="input-group">
                        <label>Extent of Reaction:</label>
                        <span className="symbolic-value-display">ξ</span>
                      </div>

                      <div className="input-group">
                        <label htmlFor="numerical-initial-pressure">
                          Initial Pressure (atm):
                        </label>
                        <input
                          type="number"
                          id="numerical-initial-pressure"
                          step="0.1"
                          min="0"
                          value={numericalInitialPressure}
                          onChange={(e) =>
                            setNumericalInitialPressure(
                              parseFloat(e.target.value) || 0
                            )
                          }
                        />
                      </div>

                      <div className="input-group">
                        <label htmlFor="numerical-initial-temperature">
                          Initial Temperature (K):
                        </label>
                        <input
                          type="number"
                          id="numerical-initial-temperature"
                          step="1"
                          min="0"
                          value={numericalInitialTemperature}
                          onChange={(e) =>
                            setNumericalInitialTemperature(
                              parseFloat(e.target.value) || 0
                            )
                          }
                        />
                      </div>

                      <div className="input-group">
                        <label htmlFor="numerical-final-pressure">
                          Final Pressure (atm):
                        </label>
                        <input
                          type="number"
                          id="numerical-final-pressure"
                          step="0.1"
                          min="0"
                          value={numericalFinalPressure}
                          onChange={(e) =>
                            setNumericalFinalPressure(
                              parseFloat(e.target.value) || 0
                            )
                          }
                        />
                      </div>

                      <div className="input-group">
                        <label htmlFor="numerical-final-temperature">
                          Final Temperature (K):
                        </label>
                        <input
                          type="number"
                          id="numerical-final-temperature"
                          step="1"
                          min="0"
                          value={numericalFinalTemperature}
                          onChange={(e) =>
                            setNumericalFinalTemperature(
                              parseFloat(e.target.value) || 0
                            )
                          }
                        />
                      </div>
                    </div>

                    <button
                      className="calculate-button"
                      onClick={calculateWithExtent}
                    >
                      Calculate with Numerical Values
                    </button>

                    {/* This will only show when numerical values are calculated */}
                    {showNumericalTable && renderNumericalStoichiometricTable()}

                    {reactionGenerated && <ReactorAnalysis />}
                  </div>
                )}
              </>
            )}
        </>
      )}
    </div>
  );
};

export default ChemistryCalculator;

// import React from "react";
// import "./ChemistryCalculator.css";
// import { ChemistryContext } from "./ChemistryContext";
// import ReactorAnalysis from "./ReactorAnalysis";

// const ChemistryCalculator = () => {
//   const {
//     reactantsCount,
//     setReactantsCount,
//     productsCount,
//     setProductsCount,
//     nonReactingCount,
//     setNonReactingCount,
//     reactantCoefficients,
//     setReactantCoefficients,
//     productCoefficients,
//     setProductCoefficients,
//     reactantExponents,
//     setReactantExponents,
//     productExponents,
//     setProductExponents,
//     reactantInitialAmounts,
//     setReactantInitialAmounts,
//     productInitialAmounts,
//     setProductInitialAmounts,
//     nonReactingInitialAmounts,
//     setNonReactingInitialAmounts,
//     customK,
//     setCustomK,
//     showCustomRate,
//     setShowCustomRate,
//     customRateLaw,
//     setCustomRateLaw,
//     reactionGenerated,
//     setReactionGenerated,
//     showStoichiometricTable,
//     setShowStoichiometricTable,
//     initialVolumetricFlow,
//     setInitialVolumetricFlow,
//     initialPressure,
//     setInitialPressure,
//     initialTemperature,
//     setInitialTemperature,
//     finalPressure,
//     setFinalPressure,
//     finalTemperature,
//     setFinalTemperature,
//     numericalExtent,
//     setNumericalExtent,
//     numericalInitialPressure,
//     setNumericalInitialPressure,
//     numericalInitialTemperature,
//     setNumericalInitialTemperature,
//     numericalFinalPressure,
//     setNumericalFinalPressure,
//     numericalFinalTemperature,
//     setNumericalFinalTemperature,
//     showNumericalTable,
//     setShowNumericalTable,
//     useNumericalValues,
//     setUseNumericalValues,
//   } = React.useContext(ChemistryContext);

//   // Helper function to check if a value is numeric
//   const isNumeric = (value) => {
//     return !isNaN(parseFloat(value)) && isFinite(value);
//   };

//   // Helper function to format values - shows expression if not numeric
//   const formatValue = (value, defaultValue = "") => {
//     if (value === undefined || value === null) return defaultValue;
//     if (isNumeric(value)) return parseFloat(value).toFixed(4);
//     return value.toString();
//   };

//   // Helper function to multiply values while preserving symbols
//   const multiplyValues = (a, b) => {
//     const numA = parseFloat(a);
//     const numB = parseFloat(b);

//     if (!isNaN(numA) && !isNaN(numB)) {
//       return (numA * numB).toString();
//     }

//     if (a === "0" || b === "0") return "0";
//     if (a === "1") return b;
//     if (b === "1") return a;

//     // Special case: if one is a number and the other is symbolic
//     if (!isNaN(numA)) return `${numA}×${b}`;
//     if (!isNaN(numB)) return `${a}×${numB}`;

//     return `${a}×${b}`;
//   };

//   const addValues = (a, b) => {
//     const numA = parseFloat(a);
//     const numB = parseFloat(b);

//     if (!isNaN(numA) && !isNaN(numB)) {
//       return (numA + numB).toString();
//     }

//     if (a === "0") return b;
//     if (b === "0") return a;

//     // Special case: if one is a number and the other is symbolic
//     if (!isNaN(numA)) return `${numA}+${b}`;
//     if (!isNaN(numB)) return `${a}+${numB}`;

//     return `${a}+${b}`;
//   };

//   // Helper function to divide values while preserving symbols
//   const divideValues = (a, b) => {
//     const numA = parseFloat(a);
//     const numB = parseFloat(b);

//     if (!isNaN(numA) && !isNaN(numB)) {
//       if (numB === 0) return "∞";
//       return (numA / numB).toString();
//     }

//     if (a === "0") return "0";
//     if (b === "1") return a;

//     return `${a}/${b}`;
//   };

//   const generateReaction = () => {
//     const newReactantCoefficients = Array(parseInt(reactantsCount)).fill(1);
//     const newProductCoefficients = Array(parseInt(productsCount)).fill(1);
//     const newReactantExponents = Array(parseInt(reactantsCount)).fill(1);
//     const newProductExponents = Array(parseInt(productsCount)).fill(0);
//     const newReactantInitialAmounts = Array(parseInt(reactantsCount)).fill(1);
//     const newProductInitialAmounts = Array(parseInt(productsCount)).fill(0);
//     const newNonReactingInitialAmounts = Array(parseInt(nonReactingCount)).fill(
//       0
//     );

//     setReactantCoefficients(newReactantCoefficients);
//     setProductCoefficients(newProductCoefficients);
//     setReactantExponents(newReactantExponents);
//     setProductExponents(newProductExponents);
//     setReactantInitialAmounts(newReactantInitialAmounts);
//     setProductInitialAmounts(newProductInitialAmounts);
//     setNonReactingInitialAmounts(newNonReactingInitialAmounts);
//     setShowCustomRate(false);
//     setShowStoichiometricTable(false);
//     setReactionGenerated(true);
//   };

//   const calculateWithExtent = () => {
//     setShowNumericalTable(true);
//   };

//   const handleCoefficientChange = (type, index, value) => {
//     const valueNum = parseFloat(value) || 0;
//     if (type === "reactant") {
//       const newCoefficients = [...reactantCoefficients];
//       newCoefficients[index] = valueNum;
//       setReactantCoefficients(newCoefficients);

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
//     } else if (type === "product") {
//       const newAmounts = [...productInitialAmounts];
//       newAmounts[index] = valueNum;
//       setProductInitialAmounts(newAmounts);
//     } else {
//       const newAmounts = [...nonReactingInitialAmounts];
//       newAmounts[index] = valueNum;
//       setNonReactingInitialAmounts(newAmounts);
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

//     reactantExponents.forEach((exp, index) => {
//       if (exp !== 0) {
//         allTerms.push({
//           species: `A<sub>${index + 1}</sub>`,
//           exponent: exp,
//         });
//       }
//     });

//     productExponents.forEach((exp, index) => {
//       if (exp !== 0) {
//         allTerms.push({
//           species: `B<sub>${index + 1}</sub>`,
//           exponent: exp,
//         });
//       }
//     });

//     const rateLaw =
//       `Rate = ${customK} ` +
//       allTerms
//         .map((term) => `[${term.species}]<sup>${term.exponent}</sup>`)
//         .join(" × ");

//     setCustomRateLaw(rateLaw);
//     setShowCustomRate(true);
//   };

//   const resetToOriginal = () => {
//     const newReactantExponents = [...reactantCoefficients];
//     const newProductExponents = Array(productCoefficients.length).fill(0);

//     setReactantExponents(newReactantExponents);
//     setProductExponents(newProductExponents);
//     setCustomK("k");
//     setShowCustomRate(false);
//   };

//   const generateStoichiometricTable = () => {
//     setShowStoichiometricTable(true);
//   };

//   const renderStoichiometricTable = () => {
//     if (!showStoichiometricTable) return null;

//     // Use either symbolic or numerical values based on useNumericalValues flag
//     const currentInitialPressure = useNumericalValues
//       ? numericalInitialPressure.toString()
//       : initialPressure;
//     const currentFinalPressure = useNumericalValues
//       ? numericalFinalPressure.toString()
//       : finalPressure;
//     const currentInitialTemperature = useNumericalValues
//       ? numericalInitialTemperature.toString()
//       : initialTemperature;
//     const currentFinalTemperature = useNumericalValues
//       ? numericalFinalTemperature.toString()
//       : finalTemperature;
//     const currentExtent = useNumericalValues ? numericalExtent.toString() : "ξ";

//     const pressureRatio = divideValues(initialPressure, finalPressure);
//     const temperatureRatio = divideValues(finalTemperature, initialTemperature);

//     // Calculate total initial molar flow rate (sum of all initial flows)
//     const totalInitialMolarFlow =
//       (reactantInitialAmounts.reduce((sum, amount) => sum + amount, 0) +
//         productInitialAmounts.reduce((sum, amount) => sum + amount, 0) +
//         nonReactingInitialAmounts.reduce((sum, amount) => sum + amount, 0)) *
//       initialVolumetricFlow;

//     // Calculate the coefficient for ξ in total molar flow
//     const xiCoefficient =
//       productCoefficients.reduce((sum, coeff) => sum + coeff, 0) -
//       reactantCoefficients.reduce((sum, coeff) => sum + coeff, 0);

//     const finalVolumetricFlow = multiplyValues(
//       multiplyValues(
//         multiplyValues(initialVolumetricFlow, pressureRatio),
//         temperatureRatio
//       ),
//       divideValues(
//         totalInitialMolarFlow.toString(),
//         addValues(
//           totalInitialMolarFlow.toString(),
//           multiplyValues(xiCoefficient.toString(), currentExtent)
//         )
//       )
//     );

//     return (
//       <div className="stoichiometric-table">
//         <h3>Stoichiometric Table (Molar Flow Rates in mol/s)</h3>
//         <table>
//           <thead>
//             <tr>
//               <th>Species</th>
//               <th>Initial Flow Rate (F₀)</th>
//               <th>Change (ΔF)</th>
//               <th>Final Flow Rate (F)</th>
//             </tr>
//           </thead>
//           <tbody>
//             {/* Reactants */}
//             {reactantCoefficients.map((coeff, index) => {
//               const initialFlow = (
//                 reactantInitialAmounts[index] * initialVolumetricFlow
//               ).toFixed(4);
//               const change = `-${coeff}${currentExtent}`;
//               const finalFlow = `${initialFlow} - ${coeff}${currentExtent}`;
//               return (
//                 <tr key={`reactant-row-${index}`}>
//                   <td>
//                     A<sub>{index + 1}</sub>
//                   </td>
//                   <td>{initialFlow}</td>
//                   <td>{change}</td>
//                   <td>{finalFlow}</td>
//                 </tr>
//               );
//             })}

//             {/* Products */}
//             {productCoefficients.map((coeff, index) => {
//               const initialFlow = (
//                 productInitialAmounts[index] * initialVolumetricFlow
//               ).toFixed(4);
//               const change = `+${coeff}${currentExtent}`;
//               const finalFlow = `${initialFlow} + ${coeff}${currentExtent}`;
//               return (
//                 <tr key={`product-row-${index}`}>
//                   <td>
//                     B<sub>{index + 1}</sub>
//                   </td>
//                   <td>{initialFlow}</td>
//                   <td>{change}</td>
//                   <td>{finalFlow}</td>
//                 </tr>
//               );
//             })}

//             {/* Non-reacting elements */}
//             {nonReactingInitialAmounts.map((amount, index) => {
//               const initialFlow = (amount * initialVolumetricFlow).toFixed(4);
//               return (
//                 <tr key={`nonreacting-row-${index}`}>
//                   <td>
//                     I<sub>{index + 1}</sub>
//                   </td>
//                   <td>{initialFlow}</td>
//                   <td>0</td>
//                   <td>{initialFlow}</td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>

//         <div className="total-flow-section">
//           <h4>Total Molar Flow Rate Calculations</h4>
//           <p>
//             <strong>
//               Total Initial Molar Flow Rate (F<sub>total,0</sub>):
//             </strong>{" "}
//             {totalInitialMolarFlow.toFixed(4)} mol/s
//           </p>
//           <p>
//             <strong>
//               Total Final Molar Flow Rate (F<sub>total</sub>):
//             </strong>
//             <br />F<sub>total</sub> = F<sub>total,0</sub> + (Σproduct
//             coefficients - Σreactant coefficients){currentExtent}
//           </p>
//           <p>
//             F<sub>total</sub> = {totalInitialMolarFlow.toFixed(4)} + (
//             {xiCoefficient}){currentExtent}
//           </p>
//         </div>

//         <div className="volumetric-flow-calculation">
//           <h4>Final Volumetric Flow Rate Calculation</h4>
//           <p>
//             V = {initialVolumetricFlow} × ({currentInitialPressure}/
//             {currentFinalPressure}) × ({currentFinalTemperature}/
//             {currentInitialTemperature}) × {totalInitialMolarFlow.toFixed(4)}/(
//             {totalInitialMolarFlow.toFixed(4)} + ({xiCoefficient})
//             {currentExtent})
//           </p>
//         </div>
//       </div>
//     );
//   };

//   const renderReaction = () => {
//     const reactantParts = [];
//     const productParts = [];

//     for (let i = 0; i < reactantCoefficients.length; i++) {
//       reactantParts.push(
//         <React.Fragment key={`reactant-${i}`}>
//           <input
//             type="number"
//             className="reaction-input"
//             value={reactantCoefficients[i]}
//             step="0.1"
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
//       productParts.push(
//         <React.Fragment key={`product-${i}`}>
//           <input
//             type="number"
//             className="reaction-input"
//             value={productCoefficients[i]}
//             step="0.1"
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

//   const renderNumericalStoichiometricTable = () => {
//     if (!showNumericalTable || !showStoichiometricTable) return null;

//     // Use numerical values for calculation
//     const pressureRatio = numericalInitialPressure / numericalFinalPressure;
//     const temperatureRatio =
//       numericalFinalTemperature / numericalInitialTemperature;
//     // Calculate total initial molar flow rate
//     const totalInitialMolarFlow =
//       (reactantInitialAmounts.reduce((sum, amount) => sum + amount, 0) +
//         productInitialAmounts.reduce((sum, amount) => sum + amount, 0) +
//         nonReactingInitialAmounts.reduce((sum, amount) => sum + amount, 0)) *
//       initialVolumetricFlow;

//     // Calculate the coefficient for ξ in total molar flow
//     const xiCoefficient =
//       productCoefficients.reduce((sum, coeff) => sum + coeff, 0) -
//       reactantCoefficients.reduce((sum, coeff) => sum + coeff, 0);

//     // Calculate total final molar flow rate with numerical extent
//     const totalFinalMolarFlow =
//       totalInitialMolarFlow + xiCoefficient * numericalExtent;

//     const finalVolumetricFlow =
//       initialVolumetricFlow *
//       pressureRatio *
//       temperatureRatio *
//       (totalInitialMolarFlow / totalFinalMolarFlow);

//     return (
//       <div className="numerical-stoichiometric-table">
//         <h3>
//           Stoichiometric Table with Numerical Values (ξ = {numericalExtent})
//         </h3>
//         <table>
//           <thead>
//             <tr>
//               <th>Species</th>
//               <th>Initial Flow Rate (F₀)</th>
//               <th>Change (ΔF)</th>
//               <th>Final Flow Rate (F)</th>
//             </tr>
//           </thead>
//           <tbody>
//             {/* Reactants */}
//             {reactantCoefficients.map((coeff, index) => {
//               const initialFlow = (
//                 reactantInitialAmounts[index] * initialVolumetricFlow
//               ).toFixed(4);
//               const change = -coeff * numericalExtent;
//               const finalFlow = (
//                 reactantInitialAmounts[index] * initialVolumetricFlow -
//                 coeff * numericalExtent
//               ).toFixed(4);
//               return (
//                 <tr key={`numerical-reactant-row-${index}`}>
//                   <td>
//                     A<sub>{index + 1}</sub>
//                   </td>
//                   <td>{initialFlow}</td>
//                   <td>{change.toFixed(4)}</td>
//                   <td>{finalFlow}</td>
//                 </tr>
//               );
//             })}

//             {/* Products */}
//             {productCoefficients.map((coeff, index) => {
//               const initialFlow = (
//                 productInitialAmounts[index] * initialVolumetricFlow
//               ).toFixed(4);
//               const change = coeff * numericalExtent;
//               const finalFlow = (
//                 productInitialAmounts[index] * initialVolumetricFlow +
//                 coeff * numericalExtent
//               ).toFixed(4);
//               return (
//                 <tr key={`numerical-product-row-${index}`}>
//                   <td>
//                     B<sub>{index + 1}</sub>
//                   </td>
//                   <td>{initialFlow}</td>
//                   <td>+{change.toFixed(4)}</td>
//                   <td>{finalFlow}</td>
//                 </tr>
//               );
//             })}

//             {/* Non-reacting elements */}
//             {nonReactingInitialAmounts.map((amount, index) => {
//               const initialFlow = (amount * initialVolumetricFlow).toFixed(4);
//               return (
//                 <tr key={`numerical-nonreacting-row-${index}`}>
//                   <td>
//                     I<sub>{index + 1}</sub>
//                   </td>
//                   <td>{initialFlow}</td>
//                   <td>0</td>
//                   <td>{initialFlow}</td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>

//         <div className="total-flow-section">
//           <h4>Total Molar Flow Rate Calculations</h4>
//           <p>
//             <strong>
//               Total Initial Molar Flow Rate (F<sub>total,0</sub>):
//             </strong>{" "}
//             {totalInitialMolarFlow.toFixed(4)} mol/s
//           </p>
//           <p>
//             <strong>
//               Total Final Molar Flow Rate (F<sub>total</sub>):
//             </strong>{" "}
//             {totalFinalMolarFlow.toFixed(4)} mol/s
//           </p>
//           <p>
//             F<sub>total</sub> = {totalInitialMolarFlow.toFixed(4)} + (
//             {xiCoefficient}) × {numericalExtent} ={" "}
//             {totalFinalMolarFlow.toFixed(4)} mol/s
//           </p>
//         </div>

//         <div className="volumetric-flow-calculation">
//           <h4>Final Volumetric Flow Rate Calculation</h4>
//           <p>
//             V = {initialVolumetricFlow} × ({numericalInitialPressure}/
//             {numericalFinalPressure}) × ({numericalFinalTemperature}/
//             {numericalInitialTemperature}) × {totalInitialMolarFlow.toFixed(4)}/
//             {totalFinalMolarFlow.toFixed(4)}
//           </p>
//           <p>
//             <strong>
//               Final Volumetric Flow Rate: {finalVolumetricFlow.toFixed(4)} dm³/s
//             </strong>
//           </p>
//         </div>
//       </div>
//     );
//   };

//   const renderProcessConditions = () => {
//     return (
//       <div className="process-conditions">
//         <h3>Process Conditions</h3>

//         <div className="input-group">
//           <label htmlFor="initial-flow">Initial Volumetric Flow (dm³/s):</label>
//           <input
//             type="number"
//             id="initial-flow"
//             step="0.1"
//             min="0"
//             value={initialVolumetricFlow}
//             onChange={(e) =>
//               setInitialVolumetricFlow(parseFloat(e.target.value) || 0)
//             }
//           />
//         </div>

//         <div className="input-group">
//           <label>Initial Pressure (atm):</label>
//           <span className="symbolic-value-display">{initialPressure}</span>
//         </div>

//         <div className="input-group">
//           <label>Initial Temperature (K):</label>
//           <span className="symbolic-value-display">{initialTemperature}</span>
//         </div>

//         <div className="input-group">
//           <label>Final Pressure (atm):</label>
//           <span className="symbolic-value-display">{finalPressure}</span>
//         </div>

//         <div className="input-group">
//           <label>Final Temperature (K):</label>
//           <span className="symbolic-value-display">{finalTemperature}</span>
//         </div>

//         <div className="input-group">
//           <label>Extent of Reaction:</label>
//           <span className="symbolic-value-display">ξ</span>
//         </div>
//       </div>
//     );
//   };

//   const renderFullReaction = () => {
//     const reactantParts = [];
//     const productParts = [];

//     for (let i = 0; i < reactantCoefficients.length; i++) {
//       reactantParts.push(
//         <React.Fragment key={`reactant-display-${i}`}>
//           {reactantCoefficients[i]}A<sub>{i + 1}</sub>
//           {i < reactantCoefficients.length - 1 && " + "}
//         </React.Fragment>
//       );
//     }

//     for (let i = 0; i < productCoefficients.length; i++) {
//       productParts.push(
//         <React.Fragment key={`product-display-${i}`}>
//           {productCoefficients[i]}B<sub>{i + 1}</sub>
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

//         {nonReactingCount > 0 && (
//           <>
//             <h4>Non-Reacting Elements</h4>
//             {nonReactingInitialAmounts.map((amount, index) => (
//               <div className="input-group" key={`nonreacting-amount-${index}`}>
//                 <label htmlFor={`nonreacting-amount-${index}`}>
//                   Initial [I<sub>{index + 1}</sub>]:
//                 </label>
//                 <input
//                   type="number"
//                   id={`nonreacting-amount-${index}`}
//                   step="0.1"
//                   min="0"
//                   value={amount}
//                   onChange={(e) =>
//                     handleInitialAmountChange(
//                       "nonreacting",
//                       index,
//                       e.target.value
//                     )
//                   }
//                 />
//               </div>
//             ))}
//           </>
//         )}
//       </div>
//     );
//   };

//   const renderRateLawControls = () => {
//     return (
//       <div className="rate-law-section">
//         <h3>Rate Law Parameters</h3>
//         <div className="input-group">
//           <label htmlFor="custom-k">Rate Constant:</label>
//           <input
//             type="text"
//             id="custom-k"
//             value={customK}
//             onChange={(e) => setCustomK(e.target.value)}
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

//         <button className="calculate-button" onClick={calculateCustomRate}>
//           Calculate Rate Law
//         </button>
//         <button className="small-button" onClick={resetToOriginal}>
//           Reset Exponents
//         </button>

//         {showCustomRate && (
//           <div
//             className="rate-law-result"
//             dangerouslySetInnerHTML={{ __html: customRateLaw }}
//           />
//         )}
//       </div>
//     );
//   };

//   const renderNonReactingSection = () => {
//     return (
//       <div className="input-group">
//         <label htmlFor="nonreacting">Number of Non-Reacting Elements</label>
//         <input
//           type="number"
//           id="nonreacting"
//           min="0"
//           max="5"
//           value={nonReactingCount}
//           onChange={(e) => setNonReactingCount(parseInt(e.target.value) || 0)}
//         />
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

//       {renderNonReactingSection()}
//       {renderProcessConditions()}

//       <button onClick={generateReaction}>Generate Reaction</button>

//       {reactionGenerated && (
//         <>
//           {renderReaction()}
//           {reactantCoefficients.length > 0 &&
//             productCoefficients.length > 0 && (
//               <>
//                 {renderFullReaction()}
//                 {renderInitialAmountControls()}
//                 {renderRateLawControls()}

//                 {showCustomRate && (
//                   <button
//                     className="stoichiometric-button"
//                     onClick={generateStoichiometricTable}
//                   >
//                     Generate Stoichiometric Table
//                   </button>
//                 )}

//                 {/* This will always show symbolic calculations */}
//                 {renderStoichiometricTable()}

//                 {showStoichiometricTable && (
//                   <div className="numerical-extent-section">
//                     <h3>Calculate with Numerical Values</h3>
//                     <div className="numerical-inputs-grid">
//                       <div className="input-group">
//                         <label htmlFor="numerical-extent">
//                           Extent of Reaction (ξ):
//                         </label>
//                         <input
//                           type="number"
//                           id="numerical-extent"
//                           step="0.1"
//                           min="0"
//                           value={numericalExtent}
//                           onChange={(e) =>
//                             setNumericalExtent(parseFloat(e.target.value) || 0)
//                           }
//                         />
//                       </div>

//                       <div className="input-group">
//                         <label htmlFor="numerical-initial-pressure">
//                           Initial Pressure (atm):
//                         </label>
//                         <input
//                           type="number"
//                           id="numerical-initial-pressure"
//                           step="0.1"
//                           min="0"
//                           value={numericalInitialPressure}
//                           onChange={(e) =>
//                             setNumericalInitialPressure(
//                               parseFloat(e.target.value) || 0
//                             )
//                           }
//                         />
//                       </div>

//                       <div className="input-group">
//                         <label htmlFor="numerical-initial-temperature">
//                           Initial Temperature (K):
//                         </label>
//                         <input
//                           type="number"
//                           id="numerical-initial-temperature"
//                           step="1"
//                           min="0"
//                           value={numericalInitialTemperature}
//                           onChange={(e) =>
//                             setNumericalInitialTemperature(
//                               parseFloat(e.target.value) || 0
//                             )
//                           }
//                         />
//                       </div>

//                       <div className="input-group">
//                         <label htmlFor="numerical-final-pressure">
//                           Final Pressure (atm):
//                         </label>
//                         <input
//                           type="number"
//                           id="numerical-final-pressure"
//                           step="0.1"
//                           min="0"
//                           value={numericalFinalPressure}
//                           onChange={(e) =>
//                             setNumericalFinalPressure(
//                               parseFloat(e.target.value) || 0
//                             )
//                           }
//                         />
//                       </div>

//                       <div className="input-group">
//                         <label htmlFor="numerical-final-temperature">
//                           Final Temperature (K):
//                         </label>
//                         <input
//                           type="number"
//                           id="numerical-final-temperature"
//                           step="1"
//                           min="0"
//                           value={numericalFinalTemperature}
//                           onChange={(e) =>
//                             setNumericalFinalTemperature(
//                               parseFloat(e.target.value) || 0
//                             )
//                           }
//                         />
//                       </div>
//                     </div>

//                     <button
//                       className="calculate-button"
//                       onClick={calculateWithExtent}
//                     >
//                       Calculate with Numerical Values
//                     </button>

//                     {/* This will only show when numerical values are calculated */}
//                     {showNumericalTable && renderNumericalStoichiometricTable()}

//                     {reactionGenerated && <ReactorAnalysis />}
//                   </div>
//                 )}
//               </>
//             )}
//         </>
//       )}
//     </div>
//   );
// };

// export default ChemistryCalculator;
