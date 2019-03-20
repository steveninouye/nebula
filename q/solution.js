const Queue = require('queue-fifo');

const bitNegate = (number) => ~number;
const hash = (str) => {
  
}

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
    for (let key in msg) {
      const value = msg[key];
      if (typeof value === 'string') {
        if (value.includes('Nebula')) msg[key] = value.reverse();
        if (key === '_hash') hash(msg);
      } else if (Number.isInteger(value)) {
        msg[key] = bitNegate(value);
      }
    }
  }

  next(queueNumber) {
    const queue = this.queues[queueNumber];
    if (queue.isEmpty()) throw `There is nothing in in queue ${queueNumber}`;
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
