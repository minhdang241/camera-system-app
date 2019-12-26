const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create video schema
let videoSchema = new Schema({
    link: String
});

module.exports = mongoose.model('Video', videoSchema);