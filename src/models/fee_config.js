const { Model } = require('objection');
const Knex = require('knex');
const knexconf = require("../../knexfile");

Model.knex(Knex(knexconf));

class FeeConfig extends Model {
  static get tableName() {
    return 'fee_configurations';
  }

  /**
   * @param { import("../handlers").FeeConfigInterface } input
   * @returns { import("objection").QueryBuilder<FeeConfig> }
   */
  static async updateOrCreate(input) {
    const res = await this.query().findById(input.id);
    if (res) return this.query().updateAndFetchById(input.id, input);
    return this.query().insertAndFetch(input)
  }

  /**
   * @param { import("../handlers").ComputeFeeInput } input 
   * @returns { import("objection").QueryBuilder<FeeConfig> }
   */
  static async getFeeConfigs(input) {
    let query = this.query().where({ currency: input.Currency });
    
    if (input.CurrencyCountry == input.PaymentEntity.Country) {
      query = query.andWhere((query) => {
        return query.whereIn("locale", [ "LOCL", "*" ])
      });
    } else {
      query = query.andWhere((query) => {
        return query.whereIn("locale", [ "INTL", "*" ])
      });
    }
  
    if (input.PaymentEntity.Type) {
      query = query.andWhere((query) => {
        return query.whereIn("entity", [input.PaymentEntity.Type, "*"]);
      });
    }
    
    query = query.andWhere((query) => {
      query = query.whereIn(
        "entity_property",
        [
          "*",
          input.PaymentEntity.Brand,
          input.PaymentEntity.Issuer,
          input.PaymentEntity.Number,
          input.PaymentEntity.SixID,
        ]
      );
    });

    return query;
  }
}

module.exports = FeeConfig;