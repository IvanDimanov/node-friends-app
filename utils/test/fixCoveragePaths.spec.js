const fs = require('fs');
const sinon = require('sinon');

const {fixCoveragePaths, DEFAULT_FILE_PATH, DEFAULT_URL_PREFIX} = require('../fixCoveragePaths');

describe('fixCoveragePaths()', () => {
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

      fixCoveragePaths();

      expect( readFileSyncMock.calledOnce ).to.equal(true);
    });

    it('should use the default coverage file, if no 1st argument is been sent', () => {
      const readFileSyncMock = mock.expects('readFileSync').returns('');
      mock.expects('writeFileSync');

      fixCoveragePaths();

      const firstCallArgs = readFileSyncMock.getCall(0).args;
      expect( firstCallArgs[0] ).to.equal(DEFAULT_FILE_PATH);
    });

    it('should use the 1st argument as loading coverage file', () => {
      const testFilePath = 'test/path/index.html';
      const readFileSyncMock = mock.expects('readFileSync').returns('');
      mock.expects('writeFileSync');

      fixCoveragePaths(testFilePath);

      const firstCallArgs = readFileSyncMock.getCall(0).args;
      expect( firstCallArgs[0] ).to.equal(testFilePath);
    });
  });

  describe('when saving file', () => {
    it('should save only once', () => {
      mock.expects('readFileSync').returns('');
      const writeFileSyncMock = mock.expects('writeFileSync');

      fixCoveragePaths();

      expect( writeFileSyncMock.calledOnce ).to.equal(true);
    });

    it('should save the default coverage file, if no 1st argument is been sent', () => {
      mock.expects('readFileSync').returns('');
      const writeFileSyncMock = mock.expects('writeFileSync');

      fixCoveragePaths();

      const firstCallArgs = writeFileSyncMock.getCall(0).args;
      expect( firstCallArgs[0] ).to.equal(DEFAULT_FILE_PATH);
    });

    it('should use the 1st argument as saving coverage file', () => {
      const testFilePath = 'test/path/index.html';
      mock.expects('readFileSync').returns('');
      const writeFileSyncMock = mock.expects('writeFileSync');

      fixCoveragePaths(testFilePath);

      const firstCallArgs = writeFileSyncMock.getCall(0).args;
      expect( firstCallArgs[0] ).to.equal(testFilePath);
    });

    it('should return the saved content', () => {
      const testContent = 'test content';
      mock.expects('readFileSync').returns(testContent);
      const writeFileSyncMock = mock.expects('writeFileSync');

      const response = fixCoveragePaths();
      expect( response ).to.equal(testContent);

      const firstCallArgs = writeFileSyncMock.getCall(0).args;
      expect( firstCallArgs[1] ).to.equal(testContent);
    });
  });

  describe('when editing the loaded content', () => {
    it('should use the default URL prefix', () => {
      const testContent = '<link rel="stylesheet" href="test.css"></link>';
      const testReplacedContent = `<link rel="stylesheet" href="${DEFAULT_URL_PREFIX}test.css"></link>`;

      mock.expects('readFileSync').returns(testContent);
      const writeFileSyncMock = mock.expects('writeFileSync');

      fixCoveragePaths();

      const firstCallArgs = writeFileSyncMock.getCall(0).args;
      expect( firstCallArgs[1] ).to.equal(testReplacedContent);
    });

    it('should use the 2nd argument as URL prefix', () => {
      const testUrlPrefix = 'test/prefix';
      const testContent = '<link rel="stylesheet" href="test.css"></link>';
      const testReplacedContent = `<link rel="stylesheet" href="${testUrlPrefix}test.css"></link>`;

      mock.expects('readFileSync').returns(testContent);
      const writeFileSyncMock = mock.expects('writeFileSync');

      fixCoveragePaths('', testUrlPrefix);

      const firstCallArgs = writeFileSyncMock.getCall(0).args;
      expect( firstCallArgs[1] ).to.equal(testReplacedContent);
    });
  });
});
