const fs = require('fs');
const sinon = require('sinon');

const {createSwaggerIndex, INDEX_DEFAULT_PATH,
  INDEX_TEMPLATE_DEFAULT_PATH, SPEC_TEMPLATE_PLACEHOLDER,
} = require('../createSwaggerIndex');

describe('createSwaggerIndex()', () => {
  let mock;

  beforeEach(() => {
    mock = sinon.mock(fs);
  });

  afterEach(() => {
    mock.verify();
    mock.restore();
  });

  describe('when loading file', () => {
    it('should load only once', () => {
      const readFileSyncMock = mock.expects('readFileSync').returns('');
      mock.expects('writeFileSync');

      createSwaggerIndex();

      expect( readFileSyncMock.calledOnce ).to.equal(true);
    });

    it('should use the default index template file', () => {
      const readFileSyncMock = mock.expects('readFileSync').returns('');
      mock.expects('writeFileSync');

      createSwaggerIndex();

      const firstCallArgs = readFileSyncMock.getCall(0).args;
      expect( firstCallArgs[0] ).to.equal(INDEX_TEMPLATE_DEFAULT_PATH);
    });
  });

  describe('when saving file', () => {
    it('should save only once', () => {
      mock.expects('readFileSync').returns('');
      const writeFileSyncMock = mock.expects('writeFileSync');

      createSwaggerIndex();

      expect( writeFileSyncMock.calledOnce ).to.equal(true);
    });

    it('should save the default index file', () => {
      mock.expects('readFileSync').returns('');
      const writeFileSyncMock = mock.expects('writeFileSync');

      createSwaggerIndex();

      const firstCallArgs = writeFileSyncMock.getCall(0).args;
      expect( firstCallArgs[0] ).to.equal(INDEX_DEFAULT_PATH);
    });

    it('should return the saved content', () => {
      const testContent = 'test content';
      mock.expects('readFileSync').returns(testContent);
      const writeFileSyncMock = mock.expects('writeFileSync');

      const response = createSwaggerIndex();
      expect( response ).to.equal(testContent);

      const firstCallArgs = writeFileSyncMock.getCall(0).args;
      expect( firstCallArgs[1] ).to.equal(testContent);
    });
  });

  it('should replace the spec placeholder', () => {
    const testContent = `test test ${SPEC_TEMPLATE_PLACEHOLDER} test test`;

    mock.expects('readFileSync').returns(testContent);
    const writeFileSyncMock = mock.expects('writeFileSync');

    createSwaggerIndex();

    const firstCallArgs = writeFileSyncMock.getCall(0).args;
    expect( firstCallArgs[1] ).not.to.includes(SPEC_TEMPLATE_PLACEHOLDER);
  });
});
