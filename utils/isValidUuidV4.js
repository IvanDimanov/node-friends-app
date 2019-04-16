
const REG_EX_UUID_V4 = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;

/**
 * 
 * @param {*} data 
 */
function isValidUuidV4(id = '') {
  return REG_EX_UUID_V4.test(id);
}

module.exports = {
  REG_EX_UUID_V4,
  isValidUuidV4,
};
