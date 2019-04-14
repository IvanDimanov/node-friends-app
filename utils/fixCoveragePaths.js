const fs = require('fs');
const argv = require('yargs').argv;

const DEFAULT_FILE_PATH = './dist/coverage/index.html';
const DEFAULT_URL_PREFIX = '/_/test-coverage/';

/**
 * Overwrites all relative links of the sent file with relative links.
 *
 * @param {string} filePath The file path location that will be altered, defaults to `DEFAULT_FILE_PATH` from the same JS module.
 * @param {string} urlPrefix The path what will be added to all related links, defaults to `DEFAULT_URL_PREFIX` from the JS module
 *
 * @return {string} the HTML content that was saved in the file.
 */
function fixCoveragePaths(filePath = DEFAULT_FILE_PATH, urlPrefix = DEFAULT_URL_PREFIX) {
  let html = fs.readFileSync(filePath, 'utf-8');

  html = html.replace(new RegExp('<link rel="stylesheet" href="', 'g'), `<link rel="stylesheet" href="${urlPrefix}`);
  html = html.replace(new RegExp('/"><a href="', 'g'), `/"><a href="${urlPrefix}`);
  html = html.replace(new RegExp('<script src="', 'g'), `<script src="${urlPrefix}`);

  fs.writeFileSync(filePath, html);

  return html;
}

/* Check if this file is called for starting the app or called as additional module to already started app */
if (require.main === module) {
  fixCoveragePaths(argv.filePath, argv.urlPrefix);
} else {
  module.exports = {
    DEFAULT_FILE_PATH,
    DEFAULT_URL_PREFIX,
    fixCoveragePaths,
  };
}
