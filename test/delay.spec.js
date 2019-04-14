const delay = require('../utils/delay');

describe('delay()', () => {
  it('should resolve in 100[ms] by default, within +/- 20ms margin', async () => {
    const margin = 20;
    const start = Date.now();

    await delay();

    expect(Date.now() - start - margin).to.be.below(100);
  });

  it('should explicitly resolve in 1000[ms], within +/- 20ms margin', async () => {
    const margin = 20;
    const timeout = 1000;
    const start = Date.now();

    await delay(timeout);

    expect(Date.now() - start - margin).to.be.below(timeout);
  });

  it('should resolve in expected result', async () => {
    const result = 'test';

    const resolvedResult = await delay(100, result);

    expect(resolvedResult).to.equal(result);
  });

  it('should reject in expected result', async () => {
    const result = new Error('Test error');
    let rejectedError;

    try {
      await delay(100, result, false);
    } catch (error) {
      rejectedError = error;
    }

    expect(rejectedError).to.equal(result);
  });
});
