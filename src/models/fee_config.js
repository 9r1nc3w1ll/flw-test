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
   */
  static async updateOrCreate(input) {
    const res = await this.query().findById(input.id);
    if (res) return this.query().updateAndFetchById(input.id, input);
    return this.query().insertAndFetch(input)
  }
}

module.exports = FeeConfig;