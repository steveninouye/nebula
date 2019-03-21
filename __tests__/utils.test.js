const Queue = require('queue-fifo');
const { createQueues } = require('../q/utils');

describe('Utils', () => {
  describe('#createQueues', () => {
    it('should be defined', () => {
      expect(createQueues).toBeDefined();
    });

    it('should return an array of 5 instances of Queues', () => {
      const queues = createQueues();
      expect(queues).toHaveLength(5);
      expect(queues[0]).toBeInstanceOf(Queue);
      expect(queues[1]).toBeInstanceOf(Queue);
      expect(queues[2]).toBeInstanceOf(Queue);
      expect(queues[3]).toBeInstanceOf(Queue);
      expect(queues[4]).toBeInstanceOf(Queue);
    });
  });
});
