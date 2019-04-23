const uuid = require('uuid/v4');

/**
 * @swagger
 * definition:
 *   UserInputError:
 *     description:
 *       HTTP status code 400.
 *       User sent invalid data like URI id.
 *
 *     properties:
 *       errorId:
 *         type: string
 *         format: uuid
 *
 *       errorCode:
 *         type: string
 *         example: INVALID_INPUT_EMAIL
 *
 *       errorMessage:
 *         type: string
 *         example: test@test. is invalid email
 */

/**
 * Extends over the global `Error`.
 * This class is used to create errors that have more code related info for easy tracking and
 * have Human readable error reason for direct use in FrontEnd.
 *
 * @category BackEndUtils
 */
class HttpError extends Error {
  /**
   * @param {String} status HTTP status code, example `400`, `401`, `500`
   * @param {String} code Internal error code, example `NOT_IN_GROUP`, `NO_PERMISSION`
   * @param {String} message Human readable reason for the error.
   * @param {any} data Any additional info that needs to be logged
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
