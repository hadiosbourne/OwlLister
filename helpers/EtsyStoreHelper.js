'use strict';
const config = require('config');
const etsyConfig = config.get('etsy_config')
const NodeCache = require( "node-cache" );
const myCache = new NodeCache();
const {getEtsyListing} = require('./EtsyStoreProxy');

module.exports = {

  /**
   * Method to use proxy and check the cache for existing record
   *
   * @param {object} callback - The callback object
   *
   * @author Hadi Shayesteh <hadishayesteh@gmail.com>
   * @since  29 July 2019
   *
   * @return void
   */
  getListing(limit, offset, callback) {
    let url = etsyConfig['url'] + '/listings/active?limit=' + limit + '&offset=' + offset + '&api_key=' + etsyConfig['api_key']
    myCache.get(url, (err, value)=>{
      if(err) {
        return callback(err);
      } else if(value == undefined) {
        getEtsyListing(url, callback);
      } else {
        return callback(null, value);
      }
    });
  }
}