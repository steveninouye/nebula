const {
  alterMessage,
  bitwiseNegate,
  createHashValue,
  reverseStr,
  getQueueNumber
} = require('../q/services');

describe('Services', () => {
  describe('#alterMessage', () => {
    it('should be defined', () => {
      expect(alterMessage).toBeDefined();
    });

    it('should reverse the value if the value contains "Nebula"', () => {
      const msg1 = { val: 'Nebula' };
      const msg2 = { val: 'NNNebulaaaa' };
      alterMessage(msg1);
      expect(msg1.val).toBe('alubeN');
      alterMessage(msg2);
      expect(msg2.val).toBe('aaaalubeNNN');
    });

    it('should hash value under _hash key and assign it to hash key in message', () => {
      const msg1 = { _hash: 'Nebula' };
      const msg2 = { _hash: 'NNNebulaaaa' };
      alterMessage(msg1);
      expect(msg1._hash).toBe('Nebula');
      expect(typeof msg1.hash).toBe('string');
      expect(msg1.hash).toHaveLength(64);
      alterMessage(msg2);
      expect(msg2._hash).toBe('NNNebulaaaa');
      expect(typeof msg2.hash).toBe('string');
      expect(msg2.hash).toHaveLength(64);
    });

    it('should bitwise negate values that are integers', () => {
      const msg1 = { val: 15 };
      const msg2 = { val: 512 };
      alterMessage(msg1);
      expect(msg1.val).toBe(-16);
      alterMessage(msg2);
      expect(msg2.val).toBe(-513);
    });

    it('should ignore keys that start with underscore (except _hash)', () => {
      const msg1 = { _val: 15, _test: 'Nebula' };
      const msg2 = { _val: 512 };
      alterMessage(msg1);
      expect(msg1._val).toBe(15);
      expect(msg1._test).toBe('Nebula');
      alterMessage(msg2);
      expect(msg2._val).toBe(512);
    });
  });

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

  describe('#getQueueNumber', () => {
    it('should be defined', () => {
      expect(getQueueNumber).toBeDefined();
    });

    it('should return 0 if there is a key _special in the message', () => {
      const msg = { _special: 1, _hash: 4, nebula: 'alubeN' };
      expect(getQueueNumber(msg)).toBe(0);
    });

    it('should return 1 if there is a key of _hash in the message', () => {
      const msg1 = { special: 1, _hash: 4 };
      const msg2 = { special: 'alubeN', _hash: 4 };
      expect(getQueueNumber(msg1)).toBe(1);
      expect(getQueueNumber(msg2)).toBe(1);
    });

    it('should return 2 if a value includes the string "alubeN"', () => {
      const msg1 = { special: 'alubeN', test: 4 };
      const msg2 = { special: 'dgalubeNgdfg', test: 4 };
      expect(getQueueNumber(msg1)).toBe(2);
      expect(getQueueNumber(msg2)).toBe(2);
    });

    it('should return 3 if a value is an integer', () => {
      const msg1 = { special: 'algdubeN', test: 4 };
      const msg2 = { special: 'dgalugdbeNgdfg', test: 4 };
      expect(getQueueNumber(msg1)).toBe(3);
      expect(getQueueNumber(msg2)).toBe(3);
    });

    it('should return 4 if it does not meet any of the cases for 0,1,2,or 3', () => {
      const msg1 = { special: 3.52, nebula: [123, 4] };
      const msg2 = { special: '', nebula: { a: 1, b: 2 } };
      expect(getQueueNumber(msg1)).toBe(4);
      expect(getQueueNumber(msg2)).toBe(4);
    });

    it('should ignore keys with _ at the beginning (except _special and _hash)', () => {
      const msg1 = { _test: 'alubeN', _nebula: 4 };
      expect(getQueueNumber(msg1)).toBe(4);
    });
  });
});
