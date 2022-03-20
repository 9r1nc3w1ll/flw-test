const { FEES_CONFIG_SPEC_REGEX } = require("./constants");
const { validateSetFeesInput } = require("./validators");
const FeeConfig = require("./models/fee_config");

/**
 * Sets fee configuration spec
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
const setFees = async (req, res) => {
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
 * Computes transaction fee
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
 const computeFee = async (req, res) => {
  /**
   * @type { ComputeFeeInput }
   */
  const payload = req.body;
  if (!payload) {}

  const configs = await FeeConfig.getFeeConfigs(payload);

  if (!configs.length) {
    res.status(400).json({ message: "No matching fee config found" });
    return;
  }

  const bestConfig = configs.reduce((previous, current) => {
    if (current.specificity > previous.specificity) return current;
    return previous;
  });

  const feeValue = calculateChargeAmount(bestConfig.type, payload.Amount, bestConfig.value);

  res.json({
    AppliedFeeID: bestConfig.id,
    AppliedFeeValue: feeValue,
    ChargeAmount: payload.Customer.BearsFee ? (payload.Amount + feeValue) : payload.Amount,
    SettlementAmount: !payload.Customer.BearsFee ? payload.Amount - feeValue : payload.Amount,
  });
}

/**
 * 
 * @param { string } type 
 * @param { number } total 
 * @param { string } value 
 * @returns { number }
 */
const calculateChargeAmount = (type, total, value) => {
  let split, perc, flat;

  switch (type) {
    case "PERC":
      split = value.split(":");
      perc = (split.length > 1) ? split[1] : split[0];
      return (total * Number(perc) / 100);

    case "FLAT":
      split = value.split(":");
      return split[0];

    case "FLAT_PERC":
      split = value.split(":");
      [flat, perc = 0] = value.split(":");
      return (Number(flat) + (Number(perc) * total / 100))
  
    default:
      return 0;
  }
}

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
 * @typedef { object } ComputeFeeInput
 * @property { string } ID
 * @property { number } Amount
 * @property { string } Currency
 * @property { string } CurrencyCountry
 * @property { PaymentEntity } PaymentEntity
 * @property { Customer } Customer
 */

/**
 * @typedef { object } Customer
 * @property { string } ID
 * @property { boolean } BearsFee
 */

/**
 * @typedef { object } PaymentEntity
 * @property { string } ID
 * @property { string } Issuer
 * @property { string } Brand
 * @property { string } Number
 * @property { string } SixID
 * @property { string } Type
 * @property { string } Country
 */

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

module.exports = {
  setFees,
  computeFee,
}