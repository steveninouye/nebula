var sha256 = require('hash.js/lib/hash/sha/256');

/**
 * Returns bitwise negation of integer
 *
 * @param {Number} number
 * @returns {Number}
 */
const bitwiseNegate = (number) => ~number;

/**
 * Creates a hash key on message object with hashed _hash value
 *
 * @param {Object} msg
 */
const createHashValue = (msg) => {
  const str = msg._hash;
  msg['hash'] = sha256()
    .update(str)
    .digest('hex');
};

/**
 * Reverses the value of the string and reassigns key in message to
 * reversed value
 *
 * @param {Object} msg
 * @param {String} key
 */
const reverseStr = (msg, key) => {
  const str = msg[key];
  let newStr = '';
  for (var i = str.length - 1; i >= 0; i--) {
    newStr += str[i];
  }
  msg[key] = newStr;
};

module.exports = { bitwiseNegate, createHashValue, reverseStr };
