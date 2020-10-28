'use strict';
const {List} = require('../models');
const CurrencyLayerHelper = require('../helpers/CurrencyLayerHelper');
const _ = require('lodash');
const async = require('async');

/**
 * Create an instance of the list Service
 */
class ListService {

  constructor() {}

  /**
   * Creates a list record, prevents duplicate records where a list with the same type and title exists
   *
   * @param {object} req - The request arguments passed in from the controller
   * @param {IncomingMessage} res - The http response object
   * @param {function} next - The callback used to pass control to the next action/middleware
   *
   * @return void
   */
  postList(req, res, next) {
    let payload = req.swagger.params.list.value;
    async.series({
      findOneListRecord: (cb)=>{
        _findOneListRecord({'title': payload['title'], 'type': payload['type']}, (err, result)=>{
          if(err) {
            return cb(err);
          }
          if(!_.isEmpty(result)) {
            let duplicationError = {
              code: 400,
              message: 'There is already a list with the same type and title on record'
            };
            return cb(duplicationError);
          }
          return cb(null, result);
        })
      },
      saveListRecord: (cb) => {
        _saveListRecord(payload, (err, result)=>{
          if(err) {
            return cb(err);
          }
          return cb(null, JSON.stringify(result));
        })
      }
    }, (err, results) => {
      if (err) {
        res.status(err.code).json(err.message);
        return next();
      }
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(results['saveListRecord']);
    });
  }

  /**
   * retrieves a list
   *
   * @param {object} req - The request arguments passed in from the controller
   * @param {IncomingMessage} res - The http response object
   * @param {function} next - The callback used to pass control to the next action/middleware
   *
   * @return void
   */
  retrieveList(req, res, next) {
    let currency = req.swagger.params.currency.value;
    let limit = req.swagger.params.items_per_page.value;
    let page = req.swagger.params.page.value;
    let sortParam = req.swagger.params.sort_parameter.value;
    let sortOrder = req.swagger.params.sort_order.value;
    async.autoInject({
      findList: (cb)=>{
        _findList(sortParam, sortOrder, page, limit, (err, result)=>{
          if(err) {
            return cb(err);
          }
          return cb(null, result);
        })
      },
      updateCurrency: (findList, cb) => {
        _currencyConverter(findList, currency, (err, result) => {
          if(err) {
            return cb(err);
          }
          return cb(null, result);
        })
      }
    }, (err, results) => {
      if(err) {
        res.status(err.code).json(err.message);
        return next();
      }
      res.setHeader('Content-Type', 'application/json');

      if(_.isEmpty(results['findList'])) {
        res.statusCode = 204;
        res.end(JSON.stringify([]));
      } else {
        res.statusCode = 200;
        res.end(JSON.stringify(results['updateCurrency']));
      }
    });
  }

  /**
   * gets an existing list
   *
   * @param {object} req - The request arguments passed in from the controller
   * @param {IncomingMessage} res - The http response object
   * @param {function} next - The callback used to pass control to the next action/middleware
   *
   * @return void
   */
  getList(req, res, next) {
    let listId = req.swagger.params.list_id.value;
    _findOneListRecord({'_id': listId}, (err, result) => {
      if(err) {
        return next(err);
      }
      if(_.isEmpty(result)) {
        const defaultList = new List({
          id: listId,
          name: 'default list'
        });
        _saveListRecord(defaultList , (err, savedRecord)=>{
          if(err) {
            return next(err);
          }
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(savedRecord));
        });
      } else {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(result));
      }
    });
  }

  /**
   * updates an existing list
   *
   * @param {object} req - The request arguments passed in from the controller
   * @param {IncomingMessage} res - The http response object
   * @param {function} next - The callback used to pass control to the next action/middleware
   *
   * @return void
   */
  putList(req, res, next) {
    let payload = req.swagger.params.list.value;
    let listId = req.swagger.params.list_id.value;
    async.autoInject({
      findOneListRecord: (cb) => {
        _findOneListRecord({'_id': listId}, (err, result) => {
          if(err) {
            return cb(err);
          }
          if(_.isEmpty(result)) {
            let resourceNotFound = {
              code: 404,
              message: 'There was no record found matching the given list id'
            };
            return cb(resourceNotFound);
          }
          _.forEach(payload, (value, key) => {
            result[key] = value;
          });
          return cb(null, result)
        });
      },
      saveListRecord: (findOneListRecord, cb) => {
        _saveListRecord(findOneListRecord , (err, result)=>{
          if(err) {
            return cb(err);
          }
          return cb(null, result)
        });
      }
    }, (err, results) => {
      if (err) {
        res.status(err.code).json(err.message);
        return next();
      }

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(results['saveListRecord']));
    });
  }

  /**
   * removes a list record
   *
   * @param {object} req - The request arguments passed in from the controller
   * @param {IncomingMessage} res - The http response object
   * @param {function} next - The callback used to pass control to the next action/middleware
   *
   * @return void
   */
  deleteList(req, res, next) {
    let listId = req.swagger.params.list_id.value;
    async.autoInject({
      findOneListRecord: (cb) => {
        _findOneListRecord({'_id': listId}, (err, result) => {
          if(err) {
            return cb(err);
          }
          if(_.isEmpty(result)) {
            let resourceNotFound = {
              code: 404,
              message: 'There was no record found matching the given list id'
            };
            return cb(resourceNotFound);
          }
          return cb(null, result)
        });
      },
      deleteListRecord: (findOneListRecord, cb) => {
        _deleteListRecord(findOneListRecord._id , (err, result)=>{
          if(err) {
            return cb(err);
          }
          return cb(null, result);
        });
      }
    }, (err, results) => {
      if (err) {
        res.status(err.code).json(err.message);
        return next();
      }

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(results['deleteListRecord']));
    });
  }
}

module.exports = ListService;

/**
 * Get the list record from database
 *
 * @param {object} query - The query to match
 * @param {function} callback - The callback
 *
 * @private
 *
 * @return void
 */
function _findOneListRecord(query, callback) {
  List.findOne(query, (err, res)=>{
    if(err) {
      let error = {
        code: 500,
        message: 'There was an error while finding the list record'
      }
      return callback(error);
    }
    return callback(null, res);
  })
}

/**
 * saves a list record
 *
 * @param {object} list - The list object to save
 * @param {function} callback - The callback
 *
 * @private
 *
 * @return void
 */
function _deleteListRecord(listId, callback) {
  List.remove({'_id': listId}, (err, res)=>{
    if(err) {
      let error = {
        code: 500,
        message: 'There was an error while saving the list record' + err
      }
      return callback(error);
    }
    return callback(null, {'Success': true});
  });  
}

/**
 * saves a list record
 *
 * @param {object} list - The list object to save
 * @param {function} callback - The callback
 *
 * @private
 *
 * @return void
 */
function _saveListRecord(list, callback) {
  let listRecord = new List(list)
  listRecord.save((err, res)=>{
    if(err) {
      let error = {
        code: 500,
        message: 'There was an error while saving the list record' + err
      }
      return callback(error);
    }
    return callback(null, res);
  });  
}

/**
 * Gets the list of lists
 *
 * @param {object} query - The query to match
 * @param {object} offset - The offset value
 * @param {object} limit - The limit
 * @param {function} callback - The callback
 *
 * @private
 *
 * @return void
 */
function _findList(sortParam, sortOrder, offset, limit, callback) {
  let aggregationArray = [    
    {'$skip': offset},
    {'$limit': limit},
    {'$sort': {[sortParam]: sortOrder}}
  ];

  CSSRuleList.aggregate(aggregationArray).exec(function(err, results) {
    if (err) {
      let runtimeError = {
        code: 500,
        message: 'An error occurred while retrieving List records ' + err
      };
      return callback(runtimeError);
    }
    return callback(null, results);
  });
  
}

/**
 * converts the currency into the user passed in value
 *
 * @param {array} list - The array of list
 * @param {string} currency - The currency value
 * @param {function} callback - The callback
 *
 * @private
 *
 * @return void
 */
function _currencyConverter(list, currency, callback) {
  CurrencyLayerHelper.getCurrencies((err, res)=>{
    if(err) {
      return callback(err);
    }
    let finalResult = [];
    list.filter((entry) => {
      entry['price'] = entry['price'] * res[currency];
      finalResult.push(entry);
    })
    return callback(null, finalResult)
  });
}