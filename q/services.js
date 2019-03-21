const sha256 = require('hash.js/lib/hash/sha/256');

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

/**
 * Determines which queue to place message in
 *
 * @param {Object} msg
 * @returns {Number}
 */
const getQueueNumber = (msg) => {
  let queueNum = 4;
  if (msg['_special'] !== undefined) {
    queueNum = 0;
  } else if (msg['_hash'] !== undefined) {
    queueNum = 1;
  } else {
    for (let key in msg) {
      const value = msg[key];
      if (key[0] !== '_') {
        if (value.includes('alubeN')) {
          queueNum = 2;
          break;
        }
        if (Number.isInteger(value)) {
          queueNum = 3;
        }
      }
    }
  }
  return queueNum;
};

module.exports = {
  bitwiseNegate,
  createHashValue,
  reverseStr,
  getQueueNumber,
  createQueues
};
