const Queue = require('queue-fifo');

/**
 * Creates 5 queues for MessageDeliveryService instance
 *
 * @returns {Queue[]}
 */
const createQueues = () => {
  const queues = [];
  for (let i = 0; i < 5; i++) {
    queues.push(new Queue());
  }
  return queues;
};

module.exports = {
  createQueues
};
