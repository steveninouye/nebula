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
});
