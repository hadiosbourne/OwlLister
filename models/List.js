'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ListSchema = new Schema(
  {
    listName: {
      type: String,
      required: true
    },
    description: {
      type: String
    }
  },
  {    
    timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'},
    collection: 'List'
  }
);

module.exports = mongoose.model('List', ListSchema);
