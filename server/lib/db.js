const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  console.log('[DB] Local file database mock initialized successfully');
};

module.exports = connectDB;
