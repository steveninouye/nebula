const Queue = require('queue-fifo');
const { MessageDeliveryService } = require('../q/MessageDeliveryService');

describe('MessageDeliveryService', () => {
  let svc;

  beforeEach(() => {
    svc = new MessageDeliveryService();
  });

  it('should be defined', () => {
    expect(MessageDeliveryService).toBeDefined();
  });

  describe('#constructor', () => {
    it('should initialize 5 queues', () => {
      expect(svc.queues).toHaveLength(5);
      expect(svc.queues[0]).toBeInstanceOf(Queue);
      expect(svc.queues[1]).toBeInstanceOf(Queue);
      expect(svc.queues[2]).toBeInstanceOf(Queue);
      expect(svc.queues[3]).toBeInstanceOf(Queue);
      expect(svc.queues[4]).toBeInstanceOf(Queue);
    });

    it('should initialize sequences object', () => {
      expect(svc.sequences).toEqual({});
    });
  });

  describe('#enqueue', () => {
    it('should be defined', () => {
      expect(svc.enqueue).toBeDefined();
      expect(typeof svc.enqueue).toBe('function');
    });
  });
});
