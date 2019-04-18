/**
 * We'll try to convert a JSON into string or return '' empy string but never throw
 *
 * @category utils
 *
 * @param {String} [data={}] Input that we'll try to convert to string
 * @return {String} Either a successful result of `JSON.stringify()` or empty string ''
 */
function jsonSafeStringify(data = {}) {
  try {
    return JSON.stringify(data);
  } catch (error) {
    return '';
  }
}

module.exports = jsonSafeStringify;
