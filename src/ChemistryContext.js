import React, { createContext, useState } from 'react';

export const ChemistryContext = createContext();

export const ChemistryProvider = ({ children }) => {
  const [reactantsCount, setReactantsCount] = useState(2);
  const [productsCount, setProductsCount] = useState(2);
  const [nonReactingCount, setNonReactingCount] = useState(0);
  const [reactantCoefficients, setReactantCoefficients] = useState([1, 1]);
  const [productCoefficients, setProductCoefficients] = useState([1, 1]);
  const [reactantExponents, setReactantExponents] = useState([1, 1]);
  const [productExponents, setProductExponents] = useState([0, 0]);
  const [reactantInitialAmounts, setReactantInitialAmounts] = useState([1, 1]);
  const [productInitialAmounts, setProductInitialAmounts] = useState([0, 0]);
  const [nonReactingInitialAmounts, setNonReactingInitialAmounts] = useState([]);
  const [customK, setCustomK] = useState("k");
  const [showCustomRate, setShowCustomRate] = useState(false);
  const [customRateLaw, setCustomRateLaw] = useState("");
  const [reactionGenerated, setReactionGenerated] = useState(false);
  const [showStoichiometricTable, setShowStoichiometricTable] = useState(false);
  const [initialVolumetricFlow, setInitialVolumetricFlow] = useState(1.0);
  const [initialPressure, setInitialPressure] = useState("P₀");
  const [initialTemperature, setInitialTemperature] = useState("T₀");
  const [finalPressure, setFinalPressure] = useState("P");
  const [finalTemperature, setFinalTemperature] = useState("T");
  const [numericalExtent, setNumericalExtent] = useState(0);
  const [numericalInitialPressure, setNumericalInitialPressure] = useState(1.0);
  const [numericalInitialTemperature, setNumericalInitialTemperature] = useState(300);
  const [numericalFinalPressure, setNumericalFinalPressure] = useState(1.0);
  const [numericalFinalTemperature, setNumericalFinalTemperature] = useState(300);
  const [showNumericalTable, setShowNumericalTable] = useState(false);
  const [useNumericalValues, setUseNumericalValues] = useState(false);

  return (
    <ChemistryContext.Provider value={{
      reactantsCount, setReactantsCount,
      productsCount, setProductsCount,
      nonReactingCount, setNonReactingCount,
      reactantCoefficients, setReactantCoefficients,
      productCoefficients, setProductCoefficients,
      reactantExponents, setReactantExponents,
      productExponents, setProductExponents,
      reactantInitialAmounts, setReactantInitialAmounts,
      productInitialAmounts, setProductInitialAmounts,
      nonReactingInitialAmounts, setNonReactingInitialAmounts,
      customK, setCustomK,
      showCustomRate, setShowCustomRate,
      customRateLaw, setCustomRateLaw,
      reactionGenerated, setReactionGenerated,
      showStoichiometricTable, setShowStoichiometricTable,
      initialVolumetricFlow, setInitialVolumetricFlow,
      initialPressure, setInitialPressure,
      initialTemperature, setInitialTemperature,
      finalPressure, setFinalPressure,
      finalTemperature, setFinalTemperature,
      numericalExtent, setNumericalExtent,
      numericalInitialPressure, setNumericalInitialPressure,
      numericalInitialTemperature, setNumericalInitialTemperature,
      numericalFinalPressure, setNumericalFinalPressure,
      numericalFinalTemperature, setNumericalFinalTemperature,
      showNumericalTable, setShowNumericalTable,
      useNumericalValues, setUseNumericalValues
    }}>
      {children}
    </ChemistryContext.Provider>
  );
};