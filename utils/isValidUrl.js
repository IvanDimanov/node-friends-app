/* Credit goes to: https://stackoverflow.com/a/5717133 */
const REG_EX_URL = new RegExp('^(https?:\\/\\/)?'+ // protocol
'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
'((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
'(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
'(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator

/**
 * Checks if the input is valid {string} url address
 *
 * @category utils
 *
 * @param {String} [url=''] The input will be checked against url rules
 * @return {Boolean} Is the in input a valid {string} url address
 */
function isValidUrl(url = '') {
  return REG_EX_URL.test(url);
}

module.exports = {
  REG_EX_URL,
  isValidUrl,
};
