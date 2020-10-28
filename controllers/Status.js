'use strict';

const StatusService = require('../services/StatusService');

/**
 * Gets the status of the service
 *
 * @param {ClientRequest} req - The http request object
 * @param {IncomingMessage} res - The http response object
 * @param {Function} next - The callback used to pass control to the next action/middleware
 */
module.exports.getSystemStatus = function getSystemStatus(req, res, next) {
  let statusService = new StatusService();
  statusService.getSystemStatus(req, res, next);
};

