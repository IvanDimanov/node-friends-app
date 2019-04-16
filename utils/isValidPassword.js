/**
 * 
 * @param {*} data 
 */
function isValidPassword(password = '') {
  return String(password).length > 7;
}

module.exports = {
  isValidPassword,
};
