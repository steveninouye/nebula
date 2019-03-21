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
    it('should be defined', () => {
      expect(createHashValue).toBeDefined();
    });
    it('should hash the _hash key in the message and assign the hashed value to key of hash', () => {
      const msg = { _hash: 'test' };
      createHashValue(msg);
      expect(msg.hash).toBeDefined();
      expect(typeof msg.hash).toBe('string');
      expect(msg.hash).toHaveLength(64);
    });
  });
  describe('#reverseStr', () => {
    it('should be defined', () => {
      expect(reverseStr).toBeDefined();
    });
    it('should reverse the string and reassign the reversed string to the key in the message', () => {
      const msg = { a: 'abc', b: '', c: 'abcdefg' };
      reverseStr(msg, 'a');
      reverseStr(msg, 'b');
      reverseStr(msg, 'c');
      expect(msg.a).toBe('cba');
      expect(msg.b).toBe('');
      expect(msg.c).toBe('gfedcba');
    });
  });
  describe('#getQueueNumber', () => {});
});
