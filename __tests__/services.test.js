const {
  bitwiseNegate,
  createHashValue,
  reverseStr,
  getQueueNumber
} = require('../q/services');

describe('Services', () => {
  describe('#bitwiseNegate', () => {
    it('should be defined', () => {
      expect(bitwiseNegate).toBeDefined();
    });
    it('should return the bitwise negation of the input integer', () => {
      expect(bitwiseNegate(512)).toBe(-513);
      expect(bitwiseNegate(0)).toBe(-1);
      expect(bitwiseNegate(1)).toBe(-2);
    });
  });
  describe('#createHashValue', () => {
    let hashedMsg;
    beforeEach(() => {
      const msg = { _hash: 'test' };
      createHashValue(msg);
      hashedMsg = msg;
    });
    it('should be defined', () => {
      expect(createHashValue).toBeDefined();
    });
    it('should hash the _hash key in the message and assign the hashed value to key of hash', () => {
      expect(hashedMsg.hash).toBeDefined();
      expect(typeof hashedMsg.hash).toBe('string');
      expect(hashedMsg.hash).toHaveLength(64);
    });
  });
});
