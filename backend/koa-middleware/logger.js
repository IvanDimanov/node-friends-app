const logger = require('koa-logger');
const jsonSafeStringify = require('../../utils/jsonSafeStringify');

/**
 * 
 */
function customLogger(ctx, next) {
  let method = '';
  let url = '';

  /**
   * 
   * @param {*} prefix 
   */
  function log(prefix = 'INFO') {
    return (message = '', data = {}) => {
      return process.stdout.write(
          `${new Date().toISOString()} ${prefix} - ${method} ${url}` +
          ` - ${message} ${jsonSafeStringify(data)}\n`
      );
    };
  }

  ctx.logger = {
    log: log(),
    debug: log('DEBUG'),
    info: log('INFO'),
    warn: log('WARN'),
    warning: log('WARNING'),
    danger: log('DANGER'),
    error: log('ERROR'),
  };

  return logger((str, [format, _method, _url]) => {
    method = _method;
    url = _url;

    process.stdout.write(`${new Date().toISOString()}${str}\n`);
  })(ctx, next);
}

module.exports = customLogger;
