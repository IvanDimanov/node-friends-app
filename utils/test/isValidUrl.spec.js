const {isValidUrl} = require('../isValidUrl');

describe('isValidUrl()', () => {
  it('invalid string input should be invalid URL #1', () => {
    expect(isValidUrl()).to.equal(false);
  });

  it('invalid string input should be invalid URL #2', () => {
    expect(isValidUrl(undefined)).to.equal(false);
  });

  it('invalid string input should be invalid URL #3', () => {
    expect(isValidUrl(7)).to.equal(false);
  });

  it('invalid string input should be invalid URL #4', () => {
    expect(isValidUrl({})).to.equal(false);
  });

  it('invalid string input should be invalid URL #5', () => {
    expect(isValidUrl(new Date())).to.equal(false);
  });

  it('incomplete URL should be invalid #1', () => {
    expect(isValidUrl('http://')).to.equal(false);
  });

  it('incomplete URL should be invalid #2', () => {
    expect(isValidUrl('http://www.')).to.equal(false);
  });

  it('incomplete URL should be invalid #3', () => {
    expect(isValidUrl('http://www.test.')).to.equal(false);
  });

  it('incomplete URL should be invalid #4', () => {
    expect(isValidUrl('www.test.')).to.equal(false);
  });

  it('common URL should be valid #1', () => {
    expect(isValidUrl('http://www.test.com')).to.equal(true);
  });

  it('common URL should be valid #2', () => {
    expect(isValidUrl('www.test.com')).to.equal(true);
  });
});
