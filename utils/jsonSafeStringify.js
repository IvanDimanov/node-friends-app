/**
 * 
 * @param {*} data 
 */
function jsonSafeStringify(data = {}) {
  try {
    return JSON.stringify(data);
  } catch (error) {
    return '';
  }
}

module.exports = jsonSafeStringify;
