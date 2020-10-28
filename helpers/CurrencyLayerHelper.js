'use strict';
const {getConversionQuote} = require('./CurrencyLayerProxy')
const NodeCache = require( "node-cache" );
const myCache = new NodeCache();

module.exports = {

  /**
   * Method to get the currency exchange rate, the current subscription only exchanges based on USD, for paid subscription we can use &source=CAD to base the rates on CAD
   *
   * @param {object} callback - The callback object
   *
   * @author Hadi Shayesteh <hadishayesteh@gmail.com>
   * @since  29 July 2019
   *
   * @return void
   */
  getCurrencies(callback) {
    myCache.get('currency_quotes', (err, value)=>{
      if(err) {
        return callback(err);
      } else if(value == undefined) {
        getConversionQuote(callback);
      } else {
        return callback(null, value);
      }
    });
  }
}