const { FEES_CONFIG_SPEC_REGEX } = require("./constants");
const { validateSetFeesInput } = require("./validators");
const FeeConfig = require("./models/fee_config");

/**
 * Sets fee configuration spec
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
module.exports.setFees = async (req, res) => {
  const inputIsValid = validateSetFeesInput(req.body, res);

  if (!inputIsValid) {
    res.end();
    return;
  }

  const feesConfig = parseSetFeesInput(req.body);

  for (let i = 0; i < feesConfig.length; i++) {
    const conf = feesConfig[i];
    await FeeConfig.updateOrCreate(conf);
  }

  res.status(200).json({ status: "ok" });
};

/**
 * @param { SetFeesInput } requestBody
 * @returns { FeeConfigInterface[] }
 */
const parseSetFeesInput = (requestBody) => {
  const { FeeConfigurationSpec: feeConfigurationSpec } = requestBody;
  const feeConfigs = feeConfigurationSpec.trim().split("\n");
  return feeConfigs.map((conf) => {
    const regexMatches = FEES_CONFIG_SPEC_REGEX.exec(conf).splice(2);
    const specificity = regexMatches.slice(2, 5).reduce((accumulator, value) => (accumulator + (value.trim() !== "*" ? 1 : 0)) , 0);

    return {
      id: regexMatches[0],
      currency: regexMatches[1],
      locale: regexMatches[2],
      entity: regexMatches[3],
      entity_property: regexMatches[4],
      type: regexMatches[5],
      value: regexMatches[6],
      specificity,
    };
  });
}

/**
 * @typedef { object } SetFeesInput
 * @property { string } FeeConfigurationSpec
 */

/**
 * @typedef { object } FeeConfigInterface
 * @property { string } id
 * @property { string } currency
 * @property { string } locale
 * @property { string } entity
 * @property { string } entity_property
 * @property { string } type
 * @property { string } value
 */