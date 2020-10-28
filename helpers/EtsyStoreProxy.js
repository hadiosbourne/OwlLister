'use strict';
const config = require('config');
const request = require('request');
const etsyConfig = config.get('etsy_config')
const NodeCache = require( "node-cache" );
const myCache = new NodeCache();

module.exports = {

  /**
   * Proxy method to request product listing from etsy
   *
   * @param {string} url - The url to be used
   * @param {object} callback - The callback object
   *
   * @author Hadi Shayesteh <hadishayesteh@gmail.com>
   * @since  29 July 2019
   *
   * @return void
   */
  getEtsyListing(url,  callback) {
    request.get(url, (error, response) => {
      if (error) {
        let errorObj = {
          code: 500,
          message: error
        }
        return callback(errorObj);
      }
      myCache.set(url, JSON.parse(response.body)['results'], etsyConfig['url_ttl'], (err) => {
        if(err){
          return callback(err);
        }
        return callback(null, JSON.parse(response.body)['results']);
      });
    });
  }
}