const Queue = require('queue-fifo');

// This is an example of a terrible "solution" to the Q problem.

// You may delete all of the contents of this file to start fresh.
// Please do be sure, however, that your solution provides at least these
// functions so that we can test it.
class MessageDeliveryService {
  constructor() {
    this.queues = [];
    this.createQueues();
  }

  createQueues() {
    for (let i = 0; i < 5; i++) {
      this.queues.push(new Queue());
    }
  }

  enqueue(msg) {
    this.msgQueue.push(msg);
  }
  next(queueNumber) {
    return this.msgQueue.shift();
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
