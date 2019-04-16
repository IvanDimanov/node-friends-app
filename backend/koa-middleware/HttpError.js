const uuid = require('uuid/v4');

/**
 * 
 */
class HttpError extends Error {
  /**
   * 
   * @param {*} message 
   * @param {*} data 
   */
  constructor(status, code, message, data) {
    super(message);

    this.id = uuid();
    this.status = status;
    this.code = code;
    this.data = data;
  }
}

module.exports = HttpError;
