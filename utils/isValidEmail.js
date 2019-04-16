
// eslint-disable-next-line max-len because email reg ex is just long :)
const REG_EX_EMAIL = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

/**
 * 
 * @param {*} data 
 */
function isValidEmail(email = '') {
  return REG_EX_EMAIL.test(email);
}

module.exports = {
  REG_EX_EMAIL,
  isValidEmail,
};
