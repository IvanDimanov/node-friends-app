// eslint-disable-next-line max-len, no-useless-escape, because email reg ex is just long :)
const REG_EX_EMAIL = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

/**
 * Checks if the input is valid {string} email address
 *
 * @category utils
 *
 * @param {String} [email=''] The input will be checked against email rules
 * @return {Boolean} Is the in input a valid {string} email address
 */
function isValidEmail(email = '') {
  return REG_EX_EMAIL.test(email);
}

module.exports = {
  REG_EX_EMAIL,
  isValidEmail,
};
