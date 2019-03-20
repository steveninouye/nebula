const Queue = require('queue-fifo');
const { bitwiseNegate, createHashValue, reverseStr } = require('./services');

class MessageDeliveryService {
  constructor() {
    this.queues = [];
    this.createQueues();
    this.sequences = {};
  }

  /**
   *
   *
   * @memberof MessageDeliveryService
   */
  createQueues() {
    for (let i = 0; i < 5; i++) {
      this.queues.push(new Queue());
    }
  }

  /**
   * Take a JSON message, alters the message and adds message to proper queue
   *
   * @param {Object} msg (JSON message)
   * @memberof MessageDeliveryService
   */
  enqueue(msg) {
    let queueNum = 4;
    for (let key in msg) {
      this.alterMessage(msg, key);
      let keyQueueNum = this.delegateQueue(msg, key);
      if (keyQueueNum < queueNum) queueNum = keyQueueNum;
    }
    this.queues[queueNum].enqueue(msg);
  }

  /**
   * Takes a queue number and returns a message
   *
   * @param {Number} queueNumber
   * @returns {Object} (JSON message)
   * @memberof MessageDeliveryService
   */
  next(queueNumber) {
    const queue = this.queues[queueNumber];
    if (queue.isEmpty()) throw `There is nothing in in queue ${queueNumber}`;
    return queue.dequeue();
  }

  /**
   * Alters message received from #enqueue
   *
   * @param {Object} msg
   * @param {String} key
   * @memberof MessageDeliveryService
   */
  alterMessage(msg, key) {
    const value = msg[key];
    if (typeof value === 'string') {
      if (key[0] !== '_' && value.includes('Nebula')) reverseStr(msg, key);
      if (key === '_hash') createHashValue(msg);
    } else if (key[0] !== '_' && Number.isInteger(value)) {
      msg[key] = bitwiseNegate(value);
    }
  }

  /**
   * Determines which queue to place message in depending on
   * the current key being examined
   *
   * @param {Object} msg
   * @param {String} key
   * @returns {Number}
   * @memberof MessageDeliveryService
   */
  delegateQueue(msg, key) {
    const value = msg[key];
    if (key === '_special') return 0;
    if (key === '_hash') return 1;
    if (key[0] !== '_' && value.includes('alubeN')) return 2;
    if (key[0] !== '_' && Number.isInteger(value)) return 3;
    return 4;
  }
}

// Regardless of how you choose to implement your solution, please do something
// like this so that we can get a clean instance of your solution by calling
// solution.getMessageService().
const getMessageService = () => {
  return new MessageDeliveryService();
};

module.exports = {
  getMessageService
};
