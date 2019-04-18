const jsonSafeStringify = require('../jsonSafeStringify');

describe('jsonSafeStringify()', () => {
  it('should not throw on any invalid input #1', () => {
    expect(() => jsonSafeStringify()).to.not.throw();
  });

  it('should not throw on any invalid input #2', () => {
    expect(() => jsonSafeStringify(undefined)).to.not.throw();
  });

  it('should not throw on any invalid input #3', () => {
    expect(() => jsonSafeStringify(11)).to.not.throw();
  });

  it('should not throw on any invalid input #4', () => {
    expect(() => jsonSafeStringify('')).to.not.throw();
  });

  it('should not throw on any invalid input #5', () => {
    expect(() => jsonSafeStringify(new RegExp())).to.not.throw();
  });

  it('should not throw on any invalid input #6', () => {
    const test = {};
    expect(() => jsonSafeStringify(test)).to.not.throw();
  });

  it('should not throw on circular reference', () => {
    const test = {key: 1};
    test.link = test;
    expect(() => jsonSafeStringify(test)).to.not.throw();
  });

  it('should return string equivalent of `JSON.stringify()` #1', () => {
    const test = {};
    expect(jsonSafeStringify(test)).to.equal(JSON.stringify(test));
  });

  it('should return string equivalent of `JSON.stringify()` #2', () => {
    const test = {key: 1};
    expect(jsonSafeStringify(test)).to.equal(JSON.stringify(test));
  });

  it('should return string equivalent of `JSON.stringify()` #3', () => {
    const test = {key: [1, 2]};
    expect(jsonSafeStringify(test)).to.equal(JSON.stringify(test));
  });

  it('should return string equivalent of `JSON.stringify()` #4', () => {
    const test = {key: {key: {key: 1}}};
    expect(jsonSafeStringify(test)).to.equal(JSON.stringify(test));
  });
});
