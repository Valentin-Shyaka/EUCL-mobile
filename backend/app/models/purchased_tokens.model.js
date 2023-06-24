const mongoose = require("mongoose");
const Joi = require('joi');
const mongoosePaginate = require('mongoose-paginate-v2');

/**
 * @swagger
 * definitions:
 *   Purchased_tokens:
 *     properties:
 *       _id:
 *         type: number
 *       meter_number:
 *         type: string
 *       token:
 *         type: string
 *       token_status:
 *         type: string
 *         enum: ['USED', 'NEW', 'EXPIRED']
 *       token_value_days:
 *         type: number
 *       purchased_date:
 *         type: date
 *       amount:
 *         type: number
 *     required:
 *       - meter_number
 *       - token
 *       - token_status
 *       - token_value_days
 *       - purchased_date
 *       - amount
 */

var schema = mongoose.Schema({
  meter_number: {
    type: String,
    required: true
  },
  token: {
    type: String,
    required: true,
  },
  token_status: {
    type: String,
    required: true,
    enum: ['USED', 'NEW', 'EXPIRED']
  },
  token_value_days: {
    type: Number,
    required: true,
  },
  purchased_date: {
    type: Date,
    required: true
  },
  amount: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});
schema.plugin(mongoosePaginate);

const Model = mongoose.model("purchased_tokens", schema);

module.exports.PurchasedTokens = Model;
module.exports.validatePurchasedTokens = (body) => {
  return Joi.object({
    meter_number: Joi.string().length(6).required(),
    token: Joi.string().length(8).required(),
    token_status: Joi.string().valid('USED', 'NEW', 'EXPIRED').required(),
    token_value_days: Joi.string().length(11).required(),
    purchased_date: Joi.date().required(),
    amount: Joi.number(11)
  }).validate(body);
};

module.exports.validatePurchasingToken = (body) => {
  return Joi.object({
    meter_number: Joi.string().length(6).required(),
    amount: Joi.number().max(182500).required()
  }).validate(body);
}