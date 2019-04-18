const {isValidUuidV4} = require('../isValidUuidV4');

describe('isValidUuidV4()', () => {
  it('invalid string input should be invalid UUID v4 #1', () => {
    expect(isValidUuidV4()).to.equal(false);
  });

  it('invalid string input should be invalid UUID v4 #2', () => {
    expect(isValidUuidV4(undefined)).to.equal(false);
  });

  it('invalid string input should be invalid UUID v4 #3', () => {
    expect(isValidUuidV4(7)).to.equal(false);
  });

  it('invalid string input should be invalid UUID v4 #4', () => {
    expect(isValidUuidV4({})).to.equal(false);
  });

  it('invalid string input should be invalid UUID v4 #5', () => {
    expect(isValidUuidV4(new Date())).to.equal(false);
  });

  it('random string should be invalid UUID v4 #1', () => {
    expect(isValidUuidV4('test')).to.equal(false);
  });

  it('random string should be invalid UUID v4 #2', () => {
    expect(isValidUuidV4('test@')).to.equal(false);
  });

  it('random string should be invalid UUID v4 #3', () => {
    expect(isValidUuidV4('test@test')).to.equal(false);
  });

  it('random string should be invalid UUID v4 #4', () => {
    expect(isValidUuidV4('test@test.')).to.equal(false);
  });

  it('common UUID v4 should be valid', () => {
    expect(isValidUuidV4('e7d9f232-dc49-41eb-9c8d-b13a99ea9d94')).to.equal(true);
  });
});
