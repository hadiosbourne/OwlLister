'use strict';

const ListService = require('../services/ListService');
/**
 * creates a list record
 *
 * @param {ClientRequest} req - The http request object
 * @param {IncomingMessage} res - The http response object
 * @param {function} next - The callback used to pass control to the next action/middleware
 */
module.exports.postList = function postList(req, res, next) {
  let listService = new ListService();
  listService.postList(req, res, next);
};

/**
 * returns list
 *
 * @param {ClientRequest} req - The http request object
 * @param {IncomingMessage} res - The http response object
 * @param {function} next - The callback used to pass control to the next action/middleware
 */
module.exports.retrieveList = function retrieveList(req, res, next) {
  let listService = new ListService();
  listService.retrieveList(req, res, next);
};

/**
 * upserts a list record
 *
 * @param {ClientRequest} req - The http request object
 * @param {IncomingMessage} res - The http response object
 * @param {function} next - The callback used to pass control to the next action/middleware
 */
module.exports.putList = function putList(req, res, next) {
  let listService = new ListService();
  listService.putList(req, res, next);
};

/**
 * gets a specific list record
 *
 * @param {ClientRequest} req - The http request object
 * @param {IncomingMessage} res - The http response object
 * @param {function} next - The callback used to pass control to the next action/middleware
 */
module.exports.getList = function getList(req, res, next) {
  let listService = new ListService();
  listService.getList(req, res, next);
};

/**
 * deletes a list record
 *
 * @param {ClientRequest} req - The http request object
 * @param {IncomingMessage} res - The http response object
 * @param {function} next - The callback used to pass control to the next action/middleware
 */
module.exports.deleteList = function deleteList(req, res, next) {
  let listService = new ListService();
  listService.deleteList(req, res, next);
};