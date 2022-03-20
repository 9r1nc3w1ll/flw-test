const FEES_CONFIG_SPEC_REGEX = /^((.*) ([A-Z]{2,3}) (.*) (CREDIT-CARD|DEBIT-CARD|BANK-ACCOUNT|USSD|WALLET-ID|\*)\((.*)\) : APPLY (PERC|FLAT|FLAT_PERC) (\d*\.?\d*?:?\d*?\.?\d*))$/;

module.exports = {
  FEES_CONFIG_SPEC_REGEX,
}
