const { FEES_CONFIG_SPEC_REGEX } = require("./constants");

/**
 * @param { SetFeesInput } input 
 * @param {import("express").Response} res
 * @returns { boolean }
 */
 const validateSetFeesInput = (input, res) => {
  if (!input) {
    setValidationMessage("input cannot be empty", res);
    return false;
  }

  const { FeeConfigurationSpec : feeConfigurationSpec } = input;
  if (!feeConfigurationSpec) {
    setValidationMessage("FeeConfigurationSpec is required", res);
    return false;
  }

  const feeConfigs = feeConfigurationSpec.trim().split("\n");
  if (!validateFeeConfigs(feeConfigs)) {
    setValidationMessage("FeeConfigurationSpec is invalid", res);
    return false;
  }

  return true;
}

/**
 * @param { string[] } feeConfigs
 * @returns { boolean }
 */
 const validateFeeConfigs = (feeConfigs) => {
  return feeConfigs.every(
    (feeConfigString) => FEES_CONFIG_SPEC_REGEX.test(feeConfigString)
  );
}

/**
 * @param {*} msg
 * @param {import("express").Response} res 
 */
const setValidationMessage = (msg, res) => {
  res.json({ message: msg, status: "request validation failed" });
}

module.exports = {
  validateSetFeesInput,
}