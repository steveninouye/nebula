const Queue = require('queue-fifo');
var sha256 = require('hash.js/lib/hash/sha/256');

const bitNegate = (number) => ~number;
const createHashValue = (msg) => {
  const str = msg._hash;
  msg['hash'] = sha256()
    .update(str)
    .digest('hex');
};
const reverseStr = (msg, key) => {
  const str = msg[key];
  let newStr = '';
  for (var i = str.length - 1; i >= 0; i--) {
    newStr += str[i];
  }
  msg[key] = newStr;
};

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
    let queueNum = 4;
    for (let key in msg) {
      this.alterMessage(msg, key);
      let keyQueueNum = this.delegateQueue(msg, key);
      if (keyQueueNum < queueNum) queueNum = keyQueueNum;
    }
    this.queues[queueNum].enqueue(msg);
  }

  next(queueNumber) {
    const queue = this.queues[queueNumber];
    if (queue.isEmpty()) throw `There is nothing in in queue ${queueNumber}`;
    return queue.dequeue();
  }

  alterMessage(msg, key) {
    const value = msg[key];
    if (typeof value === 'string') {
      if (key[0] !== '_' && value.includes('Nebula')) reverseStr(msg, key);
      if (key === '_hash') createHashValue(msg);
    } else if (key[0] !== '_' && Number.isInteger(value)) {
      msg[key] = bitNegate(value);
    }
  }

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
