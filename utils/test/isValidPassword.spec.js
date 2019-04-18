const {isValidPassword} = require('../isValidPassword');

describe('isValidPassword()', () => {
  it('invalid string input should be invalid password #1', () => {
    expect(isValidPassword()).to.equal(false);
  });

  it('invalid string input should be invalid password #2', () => {
    expect(isValidPassword(undefined)).to.equal(false);
  });

  it('invalid string input should be invalid password #3', () => {
    expect(isValidPassword(7)).to.equal(false);
  });

  it('invalid string input should be invalid password #4', () => {
    expect(isValidPassword({})).to.equal(false);
  });

  it('invalid string input should be invalid password #5', () => {
    expect(isValidPassword(new Date())).to.equal(false);
  });

  it('short password should be invalid #1', () => {
    expect(isValidPassword('')).to.equal(false);
  });

  it('short password should be invalid #2', () => {
    expect(isValidPassword('test')).to.equal(false);
  });

  it('long password should be valid', () => {
    expect(isValidPassword('Test-1234')).to.equal(true);
  });
});
