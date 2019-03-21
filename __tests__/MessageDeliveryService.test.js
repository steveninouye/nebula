const Queue = require('queue-fifo');
const { MessageDeliveryService } = require('../q/MessageDeliveryService');

describe('MessageDeliveryService', () => {
  let svc, svc2;

  beforeEach(() => {
    svc = new MessageDeliveryService();
    svc2 = new MessageDeliveryService();
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

    it('should add message to the correct queue if there is no _sequence key', () => {
      const msg1 = { _special: 'test' };
      const msg2 = { _hash: 'test' };
      const msg3 = { val: 'Nebula' };
      const msg4 = { val: 3 };
      const msg5 = { val: 3.4 };
      const msg6 = { _val: 3.4 };
      svc.enqueue(msg1);
      svc.enqueue(msg2);
      svc.enqueue(msg3);
      svc.enqueue(msg4);
      svc.enqueue(msg5);
      svc2.enqueue(msg6);
      const { queues } = svc;
      expect(queues[0].peek()).toEqual(msg1);
      expect(queues[1].peek()).toEqual(msg2);
      expect(queues[2].peek()).toEqual(msg3);
      expect(queues[3].peek()).toEqual(msg4);
      expect(queues[4].peek()).toEqual(msg5);
      expect(svc2.queues[4].peek()).toEqual(msg6);
    });

    it('should not add the message to the queue if there is there key of _sequence, _part is not 0, and previous parts have not been added to the queue', () => {
      const msg1 = { _sequence: 'test', _part: 2, _special: 'test' };
      const msg2 = { _sequence: 'test', _part: 1, _hash: 'test' };
      const msg3 = { _sequence: 'test', _part: 3, val: 'Nebula' };
      const msg4 = { _sequence: 'test', _part: 4, val: 3 };
      const msg5 = { _sequence: 'test', _part: 5, val: 3.4 };
      svc.enqueue(msg1);
      svc.enqueue(msg2);
      svc.enqueue(msg3);
      svc.enqueue(msg4);
      svc.enqueue(msg5);
      const { queues } = svc;
      expect(queues[0].isEmpty()).toBe(true);
      expect(queues[1].isEmpty()).toBe(true);
      expect(queues[2].isEmpty()).toBe(true);
      expect(queues[3].isEmpty()).toBe(true);
      expect(queues[4].isEmpty()).toBe(true);
    });

    it('should add the messages with _sequence key to the queue that _part 0 enqueued to', () => {
      const msg1 = { _sequence: 'test', _part: 1, _special: 'test' };
      const msg2 = { _sequence: 'test', _part: 0, _hash: 'test' };
      const msg3 = { _sequence: 'test', _part: 2, val: 'Nebula' };
      const msg4 = { _sequence: 'test1', _part: 1, val: 3 };
      const msg5 = { _sequence: 'test1', _part: 0, val: 3.4 };
      svc.enqueue(msg1);
      svc.enqueue(msg2);
      svc.enqueue(msg3);
      svc.enqueue(msg4);
      svc.enqueue(msg5);
      const { queues } = svc;
      const queue1 = queues[1];
      const queue4 = queues[4];
      expect(queues[0].isEmpty()).toBe(true);
      expect(queues[2].isEmpty()).toBe(true);
      expect(queues[3].isEmpty()).toBe(true);
      expect(queue1.dequeue()).toBe(msg2);
      expect(queue1.dequeue()).toBe(msg1);
      expect(queue1.dequeue()).toBe(msg3);
      expect(queue4.dequeue()).toBe(msg5);
      expect(queue4.dequeue()).toBe(msg4);
    });

    it('should alter the message being inserted into the queues', () => {
      const msg = {
        _hash: 'test',
        val: 'Nebula',
        _val: 'Nebula',
        num: 4,
        _num: 5
      };
      svc.enqueue(msg);
      expect(msg._hash).toBe('test');
      expect(msg.hash).toBeDefined();
      expect(msg.hash).toHaveLength(64);
      expect(typeof msg.hash).toBe('string');
      expect(msg.val).toBe('alubeN');
      expect(msg._val).toBe('Nebula');
      expect(msg.num).toBe(-5);
      expect(msg._num).toBe(5);
    });
  });

  describe('#next', () => {
    it('should be defined', () => {
      expect(svc.next).toBeDefined();
      expect(typeof svc.next).toBe('function');
    });

    it('should return the correct message in the queue', () => {
      const msg1 = { _special: 'test1' };
      const msg2 = { _special: 'test2' };
      const msg3 = { _hash: 'test1' };
      const msg4 = { _hash: 'test2' };
      const msg5 = { val: 'Nebulaa' };
      const msg6 = { val: 'Nebulab' };
      const msg7 = { val: 3 };
      const msg8 = { val: 8 };
      const msg9 = { _val: 2 };
      const msg10 = { _val: 6 };
      [msg1, msg2, msg3, msg4, msg5, msg6, msg7, msg8, msg9, msg10].forEach(
        (msg) => svc.enqueue(msg)
      );
      expect(svc.next(0)._special).toBe('test1');
      expect(svc.next(0)._special).toBe('test2');
      expect(svc.queues[0].isEmpty()).toBe(true);
      expect(svc.next(1)._hash).toBe('test1');
      expect(svc.next(1)._hash).toBe('test2');
      expect(svc.queues[1].isEmpty()).toBe(true);
      expect(svc.next(2).val).toBe('aalubeN');
      expect(svc.next(2).val).toBe('balubeN');
      expect(svc.queues[2].isEmpty()).toBe(true);
      expect(svc.next(3).val).toBe(-4);
      expect(svc.next(3).val).toBe(-9);
      expect(svc.queues[3].isEmpty()).toBe(true);
      expect(svc.next(4)._val).toBe(2);
      expect(svc.next(4)._val).toBe(6);
      expect(svc.queues[4].isEmpty()).toBe(true);
    });

    it('should add parts of a sequence to the queue in order', () => {
      const msg1 = { _sequence: 'test', _part: 1, _special: 'test1' };
      svc.enqueue(msg1);
      expect(() => svc.next(0)).toThrow();
      const msg2 = { _sequence: 'test', _part: 0, _special: 'test2' };
      svc.enqueue(msg2);
      expect(svc.next(0)._special).toBe('test2');
      const msg3 = { _sequence: 'test', _part: 2, _special: 'test3' };
      svc.enqueue(msg3);
      expect(svc.next(0)._special).toBe('test1');
      expect(svc.next(0)._special).toBe('test3');
    });

    it('should delete the sequence from the sequences store if all the messages have been dequeued to prevent memory leak', () => {
      const msg1 = { _sequence: 'test', _part: 1, _special: 'test' };
      const msg2 = { _sequence: 'test', _part: 0, _hash: 'test' };
      const msg3 = { _sequence: 'test', _part: 2, val: 'Nebula' };
      svc.enqueue(msg1);
      svc.enqueue(msg2);
      svc.enqueue(msg3);
      svc.next(1);
      svc.next(1);
      expect(svc.sequences.test).toBeDefined();
      svc.next(1);
      expect(svc.sequences.test).not.toBeDefined();
    });

    it('should throw an error if there is nothing in the queue', () => {
      expect(() => svc.next(0)).toThrow();
      expect(() => svc.next(1)).toThrow();
      expect(() => svc.next(2)).toThrow();
      expect(() => svc.next(3)).toThrow();
      expect(() => svc.next(4)).toThrow();
    });
  });
});
