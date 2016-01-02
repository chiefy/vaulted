'use strict';
/**
 * @module hooks
 * @desc Provides a generic pre/post hook implementation.
 *
 */

/**
 * Hooks constructor
 *
 * @constructor
 */
function Hooks() {
  this._pres = {};
  this._posts = {};
}

/**
 * Execute all the registered pre hooks
 *
 * @param {string} name - the name of the function that is being hooked.
 * @param {Object} context - a context object like `this`.
 * @param {Array} args - a list of arguments to pass to the hook.
 */
Hooks.prototype.execPre = function(name, context, args) {
  args = args || [];
  var pres = this._pres[name] || [];
  var numPres = pres.length;

  for (var i = 0; i < numPres; ++i) {
    pres[i].apply(context, args);
  }
};

/**
 * Execute all the registered post hooks
 *
 * @param {string} name - the name of the function that is being hooked.
 * @param {Object} context - a context object like `this`.
 * @param {Array} args - a list of arguments to pass to the hook.
 */
Hooks.prototype.execPost = function(name, context, args) {
  args = args || [];
  var posts = this._posts[name] || [];
  var numPosts = posts.length;

  for (var i = 0; i < numPosts; ++i) {
    posts[i].apply(context, args);
  }
};

/**
 * Register a function to execute before the named function.
 *
 * @param {string} name - the name of the function that is being hooked.
 * @param {function} fn - a function to execute before the named function.
 * @return {Hooks} instance of Hooks
 */
Hooks.prototype.pre = function(name, fn) {
  (this._pres[name] = this._pres[name] || []).push(fn);
  return this;
};

/**
 * Register a function to execute after the named function.
 *
 * @param {string} name - the name of the function that is being hooked.
 * @param {function} fn - a function to execute after the named function.
 * @return {Hooks} instance of Hooks
 */
Hooks.prototype.post = function(name, fn) {
  (this._posts[name] = this._posts[name] || []).push(fn);
  return this;
};

module.exports = Hooks;
