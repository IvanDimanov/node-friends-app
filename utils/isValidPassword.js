/**
 * Use some basic rules to determine password validity/strength
 *
 * @category utils
 *
 * @param {String} [password=''] The input will be check against password rules
 * @return {Boolean} Is the in input a valid {string} password
 */
function isValidPassword(password = '') {
  return typeof password === 'string' && password.length > 7;
}

module.exports = {
  isValidPassword,
};
