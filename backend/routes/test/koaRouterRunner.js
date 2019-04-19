/**
 * Calls all middlewares from the `stack` in sequence by sending the `ctx` and `next` middleware.
 *
 * @category testUtils
 *
 * @param {Array} stack List of koa middlewares to be called one after the other
 * @param {Object} ctx Koa context
 *
 * @return {Function} This function will start the middleware chain
 */
function koaRouterRunner(stack, ctx) {
  /**
   * Binds next link into the middleware chain
   *
   * @category testUtils
   *
   * @param {Number} index Which will be the next middleware to be called in the Stack
   * @return {Function} Next middleware to be called
   */
  function wrapper(index) {
    return () => stack[index](ctx, wrapper(index + 1));
  }

  return stack[0](ctx, wrapper(1));
}

module.exports = koaRouterRunner;
