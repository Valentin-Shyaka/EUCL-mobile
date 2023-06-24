const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const crypto = require('crypto');

/***
 * @param id
 * @returns {boolean}
 */
exports.validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 *  Encrypt password
 * @param {String} password 
 */
exports.hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10)
  const hashed = await bcrypt.hash(password, salt)
  return hashed;
}

exports.generateToken = async (meter_number, amount, token_value_days) => {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + token_value_days);

  const tokenValue = generateRandomToken();

  const hmac = crypto.createHmac('sha256', process.env.TOKEN_SECRET);
  hmac.update(meter_number + amount + expirationDate.toISOString() + tokenValue);
  const token = hmac.digest('hex');

  return {
    meter_number,
    amount,
    expirationDate,
    tokenValue,
    token,
  };
};

function generateRandomToken() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';

  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    token += characters.charAt(randomIndex);
  }

  return token;
}

exports.verifyToken = async (token) => {
  const { meter_number, amount, expirationDate, tokenValue } = token;

  const hmac = crypto.createHmac('sha256', process.env.TOKEN_SECRET);
  hmac.update(meter_number + amount + expirationDate.toISOString() + tokenValue);
  const calculatedToken = hmac.digest('hex');

  if (calculatedToken === token.token) {
    return true;
  } else {
    return false;
  }
};

exports.generateMeterNumber = async() => {
  // Generate a random number between 100,000 and 999,999
  const randomNumber = Math.floor(Math.random() * 900000) + 100000;
  
  return randomNumber;
}