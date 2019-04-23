
const REG_EX_UUID_V4 = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3,4}-[89AB][0-9A-F]{3,4}-[0-9A-F]{12}$/i;

/**
 * Use some basic rules to determine if input is valid {string} UUID v4
 *
 * @category utils
 *
 * @param {String} [id=''] The input will be check against UUID v4 rules
 * @return {Boolean} Is the in input a valid {string} UUID v4
 */
function isValidUuidV4(id = '') {
  return REG_EX_UUID_V4.test(id);
}

module.exports = {
  REG_EX_UUID_V4,
  isValidUuidV4,
};
