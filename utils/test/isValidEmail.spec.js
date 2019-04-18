const {isValidEmail} = require('../isValidEmail');

describe('isValidEmail()', () => {
  it('invalid string input should be invalid email #1', () => {
    expect(isValidEmail()).to.equal(false);
  });

  it('invalid string input should be invalid email #2', () => {
    expect(isValidEmail(undefined)).to.equal(false);
  });

  it('invalid string input should be invalid email #3', () => {
    expect(isValidEmail(7)).to.equal(false);
  });

  it('invalid string input should be invalid email #4', () => {
    expect(isValidEmail({})).to.equal(false);
  });

  it('invalid string input should be invalid email #5', () => {
    expect(isValidEmail(new Date())).to.equal(false);
  });

  it('incomplete email should be invalid #1', () => {
    expect(isValidEmail('test')).to.equal(false);
  });

  it('incomplete email should be invalid #2', () => {
    expect(isValidEmail('test@')).to.equal(false);
  });

  it('incomplete email should be invalid #3', () => {
    expect(isValidEmail('test@test')).to.equal(false);
  });

  it('incomplete email should be invalid #4', () => {
    expect(isValidEmail('test@test.')).to.equal(false);
  });

  it('common email should be valid', () => {
    expect(isValidEmail('test@test.com')).to.equal(true);
  });
});
