const { createQueues } = require('./utils');
const { getQueueNumber, alterMessage } = require('./services');

class MessageDeliveryService {
  constructor() {
    this.queues = createQueues();
    this.sequences = {};
  }

  /**
   * Take a JSON message, alters the message and adds message to proper queue
   *
   * @param {Object} msg (JSON message)
   * @memberof MessageDeliveryService
   */
  enqueue(msg) {
    alterMessage(msg);
    if (msg['_sequence'] === undefined) {
      const queueNum = getQueueNumber(msg);
      this.queues[queueNum].enqueue(msg);
    } else {
      this.addToSequences(msg);
      this.addSequenceToQueue(msg);
    }
  }

  /**
   * Takes a queue number and returns from corresponding queue
   *
   * @param {Number} queueNum
   * @returns {Object} (JSON message)
   * @memberof MessageDeliveryService
   */
  next(queueNum) {
    const queue = this.queues[queueNum];
    if (queue.isEmpty()) throw `There is nothing in in queue ${queueNum}`;
    const msg = queue.dequeue();
    if (msg._sequence !== undefined) this.checkMaxPartNum(msg);
    return msg;
  }

  /**
   * Adds message to sequences store and alters max part number
   * in the store if part number is greater than the current max
   *
   * @param {Object} msg
   * @memberof MessageDeliveryService
   */
  addToSequences(msg) {
    const sequenceId = msg._sequence;
    const part = msg._part;
    if (this.sequences[sequenceId] === undefined) {
      this.sequences[sequenceId] = { nextPartNum: 0, maxPartNum: 0 };
    }
    const sequence = this.sequences[sequenceId];
    if (part === 0) sequence.queueNum = getQueueNumber(msg);
    if (sequence.maxPartNum < part) sequence.maxPartNum = part;
    sequence[part] = msg;
  }

  /**
   * Adds contiguous messages to the correct queue number and deletes
   * messages from sequences storage
   *
   * @param {Object} msg
   * @memberof MessageDeliveryService
   */
  addSequenceToQueue(msg) {
    const sequenceId = msg._sequence;
    const sequence = this.sequences[sequenceId];
    const { queueNum } = sequence;
    let partNum = sequence.nextPartNum;
    while (sequence[partNum] !== undefined) {
      this.queues[queueNum].enqueue(sequence[partNum]);
      delete sequence[partNum];
      sequence.nextPartNum = ++partNum;
    }
  }

  /**
   * Deletes sequence from sequences if all parts have been dequeued
   * (prevent memory leak)
   *
   * @param {Object} msg
   * @memberof MessageDeliveryService
   */
  checkMaxPartNum(msg) {
    const part = msg._part;
    const sequenceId = msg._sequence;
    const { maxPartNum } = this.sequences[sequenceId];
    if (maxPartNum === part) delete this.sequences[sequenceId];
  }
}

// Regardless of how you choose to implement your solution, please do something
// like this so that we can get a clean instance of your solution by calling
// solution.getMessageService().
const getMessageService = () => {
  return new MessageDeliveryService();
};

module.exports = {
  getMessageService,
  MessageDeliveryService
};
